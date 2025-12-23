# Android Kotlin Development 2025

**Updated**: 2025-11-23 | **Stack**: Kotlin, Jetpack Compose, MVVM, Coroutines

---

## Jetpack Compose UI

```kotlin
// Simple Composable
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}

---

// List with LazyColumn
@Composable
fun TodoList(todos: List<Todo>, onToggle: (Todo) -> Unit) {
    LazyColumn {
        items(todos) { todo ->
            TodoItem(todo = todo, onToggle = onToggle)
        }
    }
}

@Composable
fun TodoItem(todo: Todo, onToggle: (Todo) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle(todo) }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (todo.completed) 
                Icons.Default.CheckCircle 
            else 
                Icons.Default.Circle,
            contentDescription = null,
            tint = if (todo.completed) Color.Green else Color.Gray
        )
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Text(
            text = todo.text,
            style = if (todo.completed) 
                MaterialTheme.typography.bodyLarge.copy(
                    textDecoration = TextDecoration.LineThrough
                ) 
            else 
                MaterialTheme.typography.bodyLarge
        )
    }
}

---

// MVVM Architecture
data class Todo(
    val id: String = UUID.randomUUID().toString(),
    val text: String,
    val completed: Boolean = false
)

class TodoViewModel : ViewModel() {
    private val _todos = MutableStateFlow<List<Todo>>(emptyList())
    val todos: StateFlow<List<Todo>> = _todos.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    fun loadTodos() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val result = repository.getTodos()
                _todos.value = result
            } catch (e: Exception) {
                // Handle error
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun addTodo(text: String) {
        val newTodo = Todo(text = text)
        _todos.value = _todos.value + newTodo
    }
    
    fun toggleTodo(todo: Todo) {
        _todos.value = _todos.value.map {
            if (it.id == todo.id) it.copy(completed = !it.completed) else it
        }
    }
}

@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) {
    val todos by viewModel.todos.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadTodos()
    }
    
    if (isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else {
        TodoList(todos = todos, onToggle = viewModel::toggleTodo)
    }
}
```

---

## Networking (Retrofit + Coroutines)

```kotlin
// API Interface
interface TodoApi {
    @GET("todos")
    suspend fun getTodos(): List<Todo>
    
    @POST("todos")
    suspend fun createTodo(@Body todo: Todo): Todo
    
    @PUT("todos/{id}")
    suspend fun updateTodo(@Path("id") id: String, @Body todo: Todo): Todo
    
    @DELETE("todos/{id}")
    suspend fun deleteTodo(@Path("id") id: String)
}

// Retrofit Setup
object RetrofitClient {
    private const val BASE_URL = "https://api.example.com/"
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
            chain.proceed(request)
        }
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    
    val api: TodoApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(TodoApi::class.java)
    }
}

// Repository
class TodoRepository {
    private val api = RetrofitClient.api
    
    suspend fun getTodos(): Result<List<Todo>> {
        return try {
            val todos = api.getTodos()
            Result.success(todos)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun createTodo(text: String): Result<Todo> {
        return try {
            val todo = Todo(text = text)
            val created = api.createTodo(todo)
            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// Usage in ViewModel
class TodoViewModel(private val repository: TodoRepository) : ViewModel() {
    fun loadTodos() {
        viewModelScope.launch {
            _isLoading.value = true
            repository.getTodos()
                .onSuccess { todos ->
                    _todos.value = todos
                }
                .onFailure { error ->
                    _error.value = error.message
                }
            _isLoading.value = false
        }
    }
}
```

---

## Room Database

```kotlin
// Entity
@Entity(tableName = "todos")
data class TodoEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val text: String,
    val completed: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

// DAO
@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY createdAt DESC")
    fun getAllTodos(): Flow<List<TodoEntity>>
    
    @Query("SELECT * FROM todos WHERE id = :id")
    suspend fun getTodoById(id: String): TodoEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTodo(todo: TodoEntity)
    
    @Update
    suspend fun updateTodo(todo: TodoEntity)
    
    @Delete
    suspend fun deleteTodo(todo: TodoEntity)
    
    @Query("DELETE FROM todos WHERE completed = 1")
    suspend fun deleteCompletedTodos()
}

// Database
@Database(entities = [TodoEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}

// Repository
class TodoRepository(private val dao: TodoDao) {
    val todos: Flow<List<TodoEntity>> = dao.getAllTodos()
    
    suspend fun addTodo(text: String) {
        val todo = TodoEntity(text = text)
        dao.insertTodo(todo)
    }
    
    suspend fun toggleTodo(todo: TodoEntity) {
        dao.updateTodo(todo.copy(completed = !todo.completed))
    }
}
```

---

## Navigation

```kotlin
// Navigation Graph
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onNavigateToDetail = { id ->
                    navController.navigate("detail/$id")
                }
            )
        }
        
        composable(
            route = "detail/{todoId}",
            arguments = listOf(navArgument("todoId") { type = NavType.StringType })
        ) { backStackEntry ->
            val todoId = backStackEntry.arguments?.getString("todoId")
            DetailScreen(
                todoId = todoId,
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable("settings") {
            SettingsScreen()
        }
    }
}

// Bottom Navigation
@Composable
fun MainScreen() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text("Home") },
                    selected = false,
                    onClick = { navController.navigate("home") }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                    label = { Text("Settings") },
                    selected = false,
                    onClick = { navController.navigate("settings") }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("home") { HomeScreen() }
            composable("settings") { SettingsScreen() }
        }
    }
}
```

---

## Dependency Injection (Hilt)

```kotlin
// Application
@HiltAndroidApp
class MyApplication : Application()

// Module
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return AppDatabase.getDatabase(context)
    }
    
    @Provides
    fun provideTodoDao(database: AppDatabase): TodoDao {
        return database.todoDao()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideTodoApi(retrofit: Retrofit): TodoApi {
        return retrofit.create(TodoApi::class.java)
    }
}

// ViewModel with Injection
@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repository: TodoRepository
) : ViewModel() {
    // ViewModel code
}

// Activity
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAppTheme {
                AppNavigation()
            }
        }
    }
}
```

---

## Testing

```kotlin
// Unit Test
class TodoViewModelTest {
    private lateinit var viewModel: TodoViewModel
    private lateinit var repository: TodoRepository
    
    @Before
    fun setup() {
        repository = mockk()
        viewModel = TodoViewModel(repository)
    }
    
    @Test
    fun `addTodo adds todo to list`() = runTest {
        // When
        viewModel.addTodo("Test task")
        
        // Then
        val todos = viewModel.todos.value
        assertEquals(1, todos.size)
        assertEquals("Test task", todos[0].text)
    }
    
    @Test
    fun `loadTodos fetches from repository`() = runTest {
        // Given
        val mockTodos = listOf(
            Todo(text = "Task 1"),
            Todo(text = "Task 2")
        )
        coEvery { repository.getTodos() } returns Result.success(mockTodos)
        
        // When
        viewModel.loadTodos()
        
        // Then
        advanceUntilIdle()
        assertEquals(mockTodos, viewModel.todos.value)
        coVerify { repository.getTodos() }
    }
}

---

// UI Test (Compose)
@RunWith(AndroidJUnit4::class)
class TodoScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun todoList_displaysItems() {
        val todos = listOf(
            Todo(text = "Task 1", completed = false),
            Todo(text = "Task 2", completed = true)
        )
        
        composeTestRule.setContent {
            TodoList(todos = todos, onToggle = {})
        }
        
        // Assert
        composeTestRule.onNodeWithText("Task 1").assertExists()
        composeTestRule.onNodeWithText("Task 2").assertExists()
    }
    
    @Test
    fun clickingTodo_callsOnToggle() {
        var clicked = false
        val todo = Todo(text = "Test", completed = false)
        
        composeTestRule.setContent {
            TodoItem(todo = todo, onToggle = { clicked = true })
        }
        
        composeTestRule.onNodeWithText("Test").performClick()
        
        assertTrue(clicked)
    }
}
```

---

## Google Play Submission

```markdown
PREPARATION:

BUILD:
1. Update version in build.gradle:
   versionCode 1  // Increment each release
   versionName "1.0.0"

2. Generate signed APK/Bundle:
   Build → Generate Signed Bundle/APK
   Create keystore (save securely!)
   Release build type

PLAY CONSOLE:
1. Create app listing
2. App Name, Short Description (80 chars), Full Description
3. Screenshots (Phone, Tablet required)
   - Phone: 16:9 ratio
   - Tablet: Optional
   - Feature Graphic: 1024×500px

4. App Icon: 512×512px (high-res)

5. Content Rating (IARC questionnaire)

6. Pricing & Distribution
   - Free or Paid
   - Countries
   - Target Audience (age)

7. Privacy Policy URL (if app collects data)

RELEASE TRACKS:
- Internal Testing: Small group
- Closed Testing: Specific testers
- Open Testing: Public beta
- Production: Live on Play Store

REVIEW:
- Typically 1-3 days
- Faster than App Store (automated + manual)
- Address issues if rejected

---

PLAY STORE OPTIMIZATION (ASO):

TITLE:
- 50 characters
- Include main keyword
- "Task Manager: To-Do List App"

SHORT DESCRIPTION:
- 80 characters
- Hook users
- "Simple, powerful task management"

FULL DESCRIPTION:
- 4000 characters
- Features, benefits
- Keywords (naturally)
- Formatting (bold, bullet points)

SCREENSHOTS:
- First 2-3 most important (shown first)
- Use mockups (Device Art Generator)
- Add text overlays

RATINGS:
- Prompt after positive experience
- In-app review API (Google Play Rating)
- Respond to reviews
```

---

## Key Takeaways

1. **Jetpack Compose** - Modern UI toolkit (declarative)
2. **Kotlin Coroutines** - Async programming (simpler than RxJava)
3. **MVVM + Hilt** - Clean architecture, dependency injection
4. **Room** - Local database (type-safe SQL)
5. **Testing** - Unit + UI tests (prevent regressions)

---

## References

- Android Developers Documentation
- Kotlin Documentation
- "Jetpack Compose by Tutorials" - raywenderlich

**Related**: `jetpack-compose-advanced.md`, `kotlin-coroutines.md`, `android-testing.md`
