# iOS Swift Development 2025

**Updated**: 2025-11-23 | **Stack**: Swift 5.9, SwiftUI, Combine, Xcode 15

---

## SwiftUI Basics

```swift
import SwiftUI

// Simple View
struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.largeTitle)
            
            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}

---

// List with Navigation
struct TodoListView: View {
    @State private var todos = ["Buy milk", "Walk dog", "Code"]
    @State private var newTodo = ""
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(todos, id: \.self) { todo in
                    Text(todo)
                }
                .onDelete { indexSet in
                    todos.remove(atOffsets: indexSet)
                }
            }
            .navigationTitle("Todos")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Add") {
                        if !newTodo.isEmpty {
                            todos.append(newTodo)
                            newTodo = ""
                        }
                    }
                }
            }
            .searchable(text: $newTodo, prompt: "Add new todo")
        }
    }
}

---

// MVVM Architecture
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []
    @Published var isLoading = false
    
    func fetchTodos() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            let url = URL(string: "https://api.example.com/todos")!
            let (data, _) = try await URLSession.shared.data(from: url)
            todos = try JSONDecoder().decode([Todo].self, from: data)
        } catch {
            print("Error: \(error)")
        }
    }
    
    func addTodo(_ text: String) {
        let todo = Todo(id: UUID(), text: text, completed: false)
        todos.append(todo)
    }
    
    func toggleTodo(_ todo: Todo) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].completed.toggle()
        }
    }
}

struct Todo: Identifiable, Codable {
    let id: UUID
    var text: String
    var completed: Bool
}

struct TodoView: View {
    @StateObject private var viewModel = TodoViewModel()
    
    var body: some View {
        List(viewModel.todos) { todo in
            HStack {
                Image(systemName: todo.completed ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(todo.completed ? .green : .gray)
                Text(todo.text)
                    .strikethrough(todo.completed)
            }
            .onTapGesture {
                viewModel.toggleTodo(todo)
            }
        }
        .task {
            await viewModel.fetchTodos()
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView()
            }
        }
    }
}
```

---

## Networking

```swift
// Modern async/await API calls
actor NetworkManager {
    static let shared = NetworkManager()
    
    private init() {}
    
    func fetch<T: Decodable>(_ url: URL) async throws -> T {
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    func post<T: Encodable, R: Decodable>(_ url: URL, body: T) async throws -> R {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(R.self, from: data)
    }
}

enum NetworkError: Error {
    case invalidURL
    case invalidResponse
    case decodingError
}

// Usage
Task {
    do {
        let todos: [Todo] = try await NetworkManager.shared.fetch(
            URL(string: "https://api.example.com/todos")!
        )
        print(todos)
    } catch {
        print("Error: \(error)")
    }
}

---

// Image loading with caching
@MainActor
class ImageLoader: ObservableObject {
    @Published var image: UIImage?
    
    private static let cache = NSCache<NSURL, UIImage>()
    
    func load(from url: URL) async {
        // Check cache
        if let cached = Self.cache.object(forKey: url as NSURL) {
            image = cached
            return
        }
        
        // Download
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            if let downloadedImage = UIImage(data: data) {
                Self.cache.setObject(downloadedImage, forKey: url as NSURL)
                image = downloadedImage
            }
        } catch {
            print("Failed to load image: \(error)")
        }
    }
}

struct AsyncImageView: View {
    let url: URL
    @StateObject private var loader = ImageLoader()
    
    var body: some View {
        Group {
            if let image = loader.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
            } else {
                ProgressView()
            }
        }
        .task {
            await loader.load(from: url)
        }
    }
}
```

---

## Data Persistence

```swift
// UserDefaults (Simple data)
extension UserDefaults {
    enum Keys {
        static let username = "username"
        static let isDarkMode = "isDarkMode"
    }
}

// Save
UserDefaults.standard.set("John", forKey: UserDefaults.Keys.username)
UserDefaults.standard.set(true, forKey: UserDefaults.Keys.isDarkMode)

// Read
let username = UserDefaults.standard.string(forKey: UserDefaults.Keys.username)
let isDarkMode = UserDefaults.standard.bool(forKey: UserDefaults.Keys.isDarkMode)

---

// SwiftData (iOS 17+, replaces CoreData)
import SwiftData

@Model
class Task {
    @Attribute(.unique) var id: UUID
    var title: String
    var completed: Bool
    var createdAt: Date
    
    init(title: String) {
        self.id = UUID()
        self.title = title
        self.completed = false
        self.createdAt = Date()
    }
}

@main
struct TodoApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Task.self)
    }
}

struct ContentView: View {
    @Environment(\.modelContext) private var context
    @Query private var tasks: [Task]
    
    var body: some View {
        List {
            ForEach(tasks) { task in
                HStack {
                    Text(task.title)
                    Spacer()
                    if task.completed {
                        Image(systemName: "checkmark")
                    }
                }
                .onTapGesture {
                    task.completed.toggle()
                }
            }
            .onDelete { indexSet in
                for index in indexSet {
                    context.delete(tasks[index])
                }
            }
        }
        .toolbar {
            Button("Add") {
                let task = Task(title: "New Task")
                context.insert(task)
            }
        }
    }
}

---

// Keychain (Secure storage for passwords, tokens)
import Security

class KeychainManager {
    static func save(key: String, data: Data) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary) // Delete old
        
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    static func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        return status == errSecSuccess ? result as? Data : nil
    }
}

// Usage
let token = "secret_token".data(using: .utf8)!
KeychainManager.save(key: "authToken", data: token)

if let data = KeychainManager.load(key: "authToken"),
   let token = String(data: data, encoding: .utf8) {
    print("Token: \(token)")
}
```

---

## Push Notifications

```swift
import UserNotifications

class NotificationManager {
    static let shared = NotificationManager()
    
    func requestAuthorization() async -> Bool {
        let center = UNUserNotificationCenter.current()
        
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            return granted
        } catch {
            print("Error: \(error)")
            return false
        }
    }
    
    func scheduleNotification(title: String, body: String, after seconds: TimeInterval) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: seconds, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
}

// Usage
Task {
    let granted = await NotificationManager.shared.requestAuthorization()
    if granted {
        NotificationManager.shared.scheduleNotification(
            title: "Reminder",
            body: "Time to take a break!",
            after: 60 // 1 minute
        )
    }
}

---

// AppDelegate for push notifications
class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        application.registerForRemoteNotifications()
        return true
    }
    
    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device Token: \(token)")
        // Send to your server
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async -> UNNotificationPresentationOptions {
        return [.banner, .sound]
    }
}

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

---

## Testing

```swift
import XCTest
@testable import MyApp

final class TodoViewModelTests: XCTestCase {
    var viewModel: TodoViewModel!
    
    override func setUp() {
        super.setUp()
        viewModel = TodoViewModel()
    }
    
    override func tearDown() {
        viewModel = nil
        super.tearDown()
    }
    
    func testAddTodo() {
        // Given
        let initialCount = viewModel.todos.count
        
        // When
        viewModel.addTodo("Test task")
        
        // Then
        XCTAssertEqual(viewModel.todos.count, initialCount + 1)
        XCTAssertEqual(viewModel.todos.last?.text, "Test task")
        XCTAssertFalse(viewModel.todos.last?.completed ?? true)
    }
    
    func testToggleTodo() {
        // Given
        viewModel.addTodo("Test task")
        let todo = viewModel.todos[0]
        let initialState = todo.completed
        
        // When
        viewModel.toggleTodo(todo)
        
        // Then
        XCTAssertEqual(viewModel.todos[0].completed, !initialState)
    }
    
    func testFetchTodos() async {
        // Given
        XCTAssertTrue(viewModel.todos.isEmpty)
        
        // When
        await viewModel.fetchTodos()
        
        // Then
        XCTAssertFalse(viewModel.todos.isEmpty)
    }
}

// Run tests: Cmd+U
```

---

## App Store Submission

```markdown
PREPARATION:

XCODE:
1. Set version & build number (1.0.0, build 1)
2. Select "Any iOS Device" scheme
3. Product → Archive
4. Organizer → Distribute App → App Store Connect

APP STORE CONNECT:
1. Create app listing
2. App Name, Subtitle, Description
3. Keywords (100 characters, comma-separated)
4. Screenshots (6.5", 5.5" required)
5. App Icon (1024×1024px)
6. Privacy Policy URL
7. Age Rating
8. Pricing ($0.99, $2.99, etc.)

REVIEW PROCESS:
- Submit for Review
- Apple reviews (1-3 days typically)
- Feedback if rejected (address issues, resubmit)
- Approved → Release (manual or automatic)

---

REQUIREMENTS:

TECHNICAL:
- No crashes (test thoroughly!)
- Works on all supported devices
- Complies with guidelines (no private APIs)

CONTENT:
- Accurate description
- Appropriate age rating
- No spam, scam, or misleading

LEGAL:
- Privacy policy (if collecting data)
- Terms of service
- GDPR, COPPA compliance

---

APP STORE OPTIMIZATION (ASO):

TITLE:
- Include main keyword
- "Task Manager - Todo List & Planner"

SUBTITLE:
- 30 characters
- Additional keywords
- "Organize your life, boost productivity"

KEYWORDS:
- 100 characters
- No spaces after commas
- "todo,task,planner,productivity,gtd"

ICON:
- Simple, recognizable
- No text (iOS adds app name)
- Test on home screen (looks good small?)

SCREENSHOTS:
- Show best features (first 3 most important)
- Use mockups (Device Frame Generator)
- Add text overlays (explain features)

RATINGS & REVIEWS:
- Prompt after positive experience (not at launch!)
- Respond to negative reviews (shows you care)
- SKStoreReviewController (max 3x/year)
```

---

## Key Takeaways

1. **SwiftUI** - Declarative, reactive, future of iOS dev
2. **async/await** - Modern concurrency (simpler than closures)
3. **MVVM** - Separate logic from UI
4. **Testing** - Write tests (save time debugging)
5. **App Store** - Polish, test, optimize listing

---

## References

- Swift Documentation
- Apple Human Interface Guidelines
- "SwiftUI by Example" - Paul Hudson
- WWDC Videos

**Related**: `swiftui-advanced.md`, `combine-reactive.md`, `app-store-optimization.md`
