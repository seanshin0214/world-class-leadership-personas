# Mobile App Development 2025

**Updated**: 2025-11-24 | **Focus**: iOS (Swift/SwiftUI), Android (Kotlin/Jetpack Compose), Cross-Platform (React Native/Flutter)

---

## iOS Development (Swift & SwiftUI)

```swift
// SWIFTUI BASICS (Declarative UI)

import SwiftUI

struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

---

// STATE MANAGEMENT

// @State (Local, single view)
@State private var isOn = false

// @Binding (Pass state to child)
struct ToggleView: View {
    @Binding var isOn: Bool
    
    var body: some View {
        Toggle("Switch", isOn: $isOn)
    }
}

// Usage
struct ParentView: View {
    @State private var isOn = false
    
    var body: some View {
        ToggleView(isOn: $isOn)
        Text(isOn ? "ON" : "OFF")
    }
}

// @ObservableObject (Shared, multiple views)
class ViewModel: ObservableObject {
    @Published var items: [String] = []
    
    func addItem(_ item: String) {
        items.append(item)
    }
}

struct ListView: View {
    @StateObject private var viewModel = ViewModel()
    
    var body: some View {
        List(viewModel.items, id: \.self) { item in
            Text(item)
        }
        Button("Add Item") {
            viewModel.addItem("New Item")
        }
    }
}

---

// NAVIGATION

// NavigationStack (iOS 16+)
struct NavigationExample: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink("Profile", destination: ProfileView())
                NavigationLink("Settings", destination: SettingsView())
            }
            .navigationTitle("Home")
        }
    }
}

// Sheet (Modal presentation)
struct SheetExample: View {
    @State private var showSheet = false
    
    var body: some View {
        Button("Open Sheet") {
            showSheet = true
        }
        .sheet(isPresented: $showSheet) {
            DetailView()
        }
    }
}

---

// NETWORKING (URLSession + Async/Await)

struct User: Codable {
    let id: Int
    let name: String
    let email: String
}

class APIService {
    func fetchUsers() async throws -> [User] {
        let url = URL(string: "https://jsonplaceholder.typicode.com/users")!
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let users = try JSONDecoder().decode([User].self, from: data)
        return users
    }
}

// In View
struct UsersView: View {
    @State private var users: [User] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        List(users, id: \.id) { user in
            VStack(alignment: .leading) {
                Text(user.name).font(.headline)
                Text(user.email).font(.subheadline)
            }
        }
        .overlay {
            if isLoading {
                ProgressView()
            }
        }
        .task {
            await loadUsers()
        }
        .alert("Error", isPresented: .constant(errorMessage != nil)) {
            Button("OK") { errorMessage = nil }
        } message: {
            Text(errorMessage ?? "")
        }
    }
    
    func loadUsers() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            users = try await APIService().fetchUsers()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

---

// LOCAL STORAGE (UserDefaults)

// Save
UserDefaults.standard.set("John", forKey: "username")
UserDefaults.standard.set(true, forKey: "isLoggedIn")

// Retrieve
let username = UserDefaults.standard.string(forKey: "username")
let isLoggedIn = UserDefaults.standard.bool(forKey: "isLoggedIn")

// @AppStorage (SwiftUI, reactive)
struct SettingsView: View {
    @AppStorage("isDarkMode") private var isDarkMode = false
    
    var body: some View {
        Toggle("Dark Mode", isOn: $isDarkMode)
    }
}

---

// CORE DATA (Local database)

// Define model
@Model
class Task {
    var id: UUID
    var title: String
    var isCompleted: Bool
    var createdAt: Date
    
    init(title: String) {
        self.id = UUID()
        self.title = title
        self.isCompleted = false
        self.createdAt = Date()
    }
}

// In App
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Task.self)
    }
}

// In View
struct TaskListView: View {
    @Environment(\.modelContext) private var context
    @Query private var tasks: [Task]
    
    var body: some View {
        List {
            ForEach(tasks) { task in
                HStack {
                    Text(task.title)
                    Spacer()
                    if task.isCompleted {
                        Image(systemName: "checkmark")
                    }
                }
                .onTapGesture {
                    task.isCompleted.toggle()
                    try? context.save()
                }
            }
            .onDelete(perform: delete)
        }
        .toolbar {
            Button("Add") {
                let newTask = Task(title: "New Task")
                context.insert(newTask)
                try? context.save()
            }
        }
    }
    
    func delete(at offsets: IndexSet) {
        for index in offsets {
            context.delete(tasks[index])
        }
        try? context.save()
    }
}

---

// PERMISSIONS (Camera, Location, Notifications)

// Info.plist (Add usage descriptions)
// NSCameraUsageDescription: "We need camera access to take photos"
// NSLocationWhenInUseUsageDescription: "We need your location to show nearby places"

// Request permission
import AVFoundation
import CoreLocation

class PermissionsManager {
    func requestCameraPermission() {
        AVCaptureDevice.requestAccess(for: .video) { granted in
            if granted {
                print("Camera access granted")
            } else {
                print("Camera access denied")
            }
        }
    }
    
    func requestLocationPermission() {
        let manager = CLLocationManager()
        manager.requestWhenInUseAuthorization()
    }
}
```

---

## Android Development (Kotlin & Jetpack Compose)

```kotlin
// JETPACK COMPOSE BASICS

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
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

// STATE MANAGEMENT (ViewModel)

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class TaskViewModel : ViewModel() {
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks: StateFlow<List<Task>> = _tasks
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    fun addTask(title: String) {
        viewModelScope.launch {
            _isLoading.value = true
            // Simulate API call
            delay(1000)
            val newTask = Task(id = UUID.randomUUID(), title = title)
            _tasks.value = _tasks.value + newTask
            _isLoading.value = false
        }
    }
    
    fun deleteTask(task: Task) {
        _tasks.value = _tasks.value - task
    }
}

// In Composable
@Composable
fun TaskListScreen(viewModel: TaskViewModel = viewModel()) {
    val tasks by viewModel.tasks.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    
    LazyColumn {
        items(tasks) { task ->
            TaskItem(
                task = task,
                onDelete = { viewModel.deleteTask(task) }
            )
        }
    }
    
    if (isLoading) {
        CircularProgressIndicator()
    }
}

---

// NAVIGATION (Jetpack Navigation Compose)

import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(onNavigateToProfile = {
                navController.navigate("profile")
            })
        }
        
        composable("profile") {
            ProfileScreen(onBack = {
                navController.popBackStack()
            })
        }
        
        // With arguments
        composable("details/{itemId}") { backStackEntry ->
            val itemId = backStackEntry.arguments?.getString("itemId")
            DetailsScreen(itemId = itemId)
        }
    }
}

// Navigate with arguments
navController.navigate("details/123")

---

// NETWORKING (Retrofit + Coroutines)

// API interface
interface ApiService {
    @GET("users")
    suspend fun getUsers(): List<User>
    
    @POST("users")
    suspend fun createUser(@Body user: User): User
    
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: Int): User
}

// Retrofit setup
val retrofit = Retrofit.Builder()
    .baseUrl("https://jsonplaceholder.typicode.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val apiService = retrofit.create(ApiService::class.java)

// In ViewModel
class UserViewModel : ViewModel() {
    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    init {
        loadUsers()
    }
    
    fun loadUsers() {
        viewModelScope.launch {
            try {
                _users.value = apiService.getUsers()
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}

---

// LOCAL STORAGE (SharedPreferences)

// Save
val sharedPrefs = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)
sharedPrefs.edit().apply {
    putString("username", "John")
    putBoolean("isLoggedIn", true)
    apply()
}

// Retrieve
val username = sharedPrefs.getString("username", "")
val isLoggedIn = sharedPrefs.getBoolean("isLoggedIn", false)

---

// ROOM DATABASE (Local database)

// Define entity
@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val isCompleted: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

// DAO (Data Access Object)
@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks")
    fun getAllTasks(): Flow<List<Task>>
    
    @Insert
    suspend fun insertTask(task: Task)
    
    @Update
    suspend fun updateTask(task: Task)
    
    @Delete
    suspend fun deleteTask(task: Task)
}

// Database
@Database(entities = [Task::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}

// Build database
val db = Room.databaseBuilder(
    context,
    AppDatabase::class.java,
    "app-database"
).build()

// Use in ViewModel
class TaskViewModel(private val dao: TaskDao) : ViewModel() {
    val tasks = dao.getAllTasks()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())
    
    fun addTask(title: String) {
        viewModelScope.launch {
            dao.insertTask(Task(title = title))
        }
    }
}

---

// PERMISSIONS (Runtime permissions)

// In AndroidManifest.xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

// In Composable
val cameraPermissionState = rememberPermissionState(
    android.Manifest.permission.CAMERA
)

Button(onClick = {
    cameraPermissionState.launchPermissionRequest()
}) {
    Text("Request Camera Permission")
}

if (cameraPermissionState.status.isGranted) {
    Text("Camera permission granted")
} else {
    Text("Camera permission denied")
}
```

---

## Cross-Platform (React Native)

```javascript
// REACT NATIVE BASICS

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

---

// NAVIGATION (React Navigation)

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile', { userId: 123 })}
      />
    </View>
  );
}

function ProfileScreen({ route }) {
  const { userId } = route.params;
  return <Text>User ID: {userId}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

---

// NETWORKING (Fetch API)

import { useState, useEffect } from 'react';

function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
}

---

// LOCAL STORAGE (AsyncStorage)

import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
const saveData = async () => {
  try {
    await AsyncStorage.setItem('username', 'John');
    await AsyncStorage.setItem('isLoggedIn', 'true');
  } catch (error) {
    console.error('Error saving data', error);
  }
};

// Retrieve
const loadData = async () => {
  try {
    const username = await AsyncStorage.getItem('username');
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    console.log(username, isLoggedIn === 'true');
  } catch (error) {
    console.error('Error loading data', error);
  }
};

---

// NATIVE MODULES (Access device features)

// Camera (react-native-camera or expo-camera)
import { Camera } from 'expo-camera';

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (!hasPermission) return <Text>Camera permission denied</Text>;
  
  return <Camera style={{ flex: 1 }} />;
}

// Location (expo-location)
import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Location permission denied');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
}
```

---

## Mobile App Best Practices

```markdown
PERFORMANCE:

OPTIMIZE LIST RENDERING:
- iOS: Use LazyVStack/LazyHStack (only render visible items)
- Android: Use LazyColumn/LazyRow
- React Native: Use FlatList (not ScrollView with map)

IMAGE OPTIMIZATION:
- Compress images (tinypng.com, ImageOptim)
- Use correct resolution (1x, 2x, 3x for different screen densities)
- Lazy load (load as needed, not all upfront)
- Cache (avoid re-downloading)

MINIMIZE APP SIZE:
- Remove unused resources (images, fonts)
- Use vector graphics (SVG, iOS SF Symbols, Android Vector Drawables)
- Enable code shrinking (ProGuard/R8 for Android)

---

USER EXPERIENCE:

LOADING STATES:
- Show spinner/skeleton screen (not blank screen)
- Provide feedback (button disabled during action)
- Error handling (retry button, clear error message)

OFFLINE SUPPORT:
- Cache data (display last loaded data if offline)
- Queue actions (sync when back online)
- Indicate offline status (banner, icon)

ACCESSIBILITY:
- iOS: VoiceOver support (labels, hints)
- Android: TalkBack support (contentDescription)
- React Native: accessibilityLabel, accessibilityHint
- Font scaling (respect user's font size preference)
- Color contrast (WCAG AA compliance, 4.5:1)

---

SECURITY:

API KEYS:
- Don't hardcode (use environment variables)
- iOS: Store in Keychain
- Android: Store in EncryptedSharedPreferences
- React Native: Use react-native-dotenv + secure storage

AUTHENTICATION:
- Use OAuth 2.0 (not roll your own)
- Store tokens securely (Keychain, EncryptedSharedPreferences)
- Implement token refresh (refresh token before expiry)
- Biometric authentication (Face ID, Touch ID, fingerprint)

HTTPS ONLY:
- All API calls use HTTPS (not HTTP)
- Certificate pinning (advanced, prevent MITM attacks)

---

TESTING:

UNIT TESTS:
- iOS: XCTest
- Android: JUnit
- React Native: Jest

UI TESTS:
- iOS: XCUITest
- Android: Espresso
- React Native: Detox

MANUAL TESTING:
- Test on real devices (not just simulators)
- Different screen sizes (iPhone SE, iPhone 14 Pro Max, various Android)
- Different OS versions (iOS 15-17, Android 10-14)
- Edge cases (slow network, low storage, airplane mode)

---

DEPLOYMENT:

APP STORE (iOS):
- Developer account ($99/year)
- App Store Connect (upload, metadata, screenshots)
- Review (1-3 days, Apple guidelines strict)
- Version updates (increment version number, submit for review)

GOOGLE PLAY (Android):
- Developer account ($25 one-time)
- Google Play Console (upload APK/AAB, metadata, screenshots)
- Review (few hours, less strict than Apple)
- Staged rollout (release to 10%, 50%, 100% gradually)

CI/CD:
- Fastlane (automate builds, screenshots, uploads)
- GitHub Actions, Bitrise, CircleCI (continuous integration)
- Beta testing (TestFlight for iOS, Google Play Internal Testing for Android)
```

---

## Key Takeaways

1. **Native vs Cross-platform** - Native (better performance, access to latest features), cross-platform (faster development, code sharing)
2. **State management** - Critical for reactive UI (SwiftUI @State/@Observable, Compose State/ViewModel, React useState/Context)
3. **Async operations** - Networking, database (Swift async/await, Kotlin coroutines, JS Promises)
4. **Performance matters** - Mobile devices limited (optimize images, lists, minimize unnecessary re-renders)
5. **Test on real devices** - Simulators miss edge cases (performance, gestures, sensors)

---

## References

- "SwiftUI for Absolute Beginners" - Jayant Varma
- "Android Programming with Kotlin for Beginners" - John Horton
- React Native documentation

**Related**: `swiftui-architecture-patterns.md`, `jetpack-compose-state-management.md`, `react-native-performance-optimization.md`
