# Mobile App Development 2025

**Updated**: 2025-11-23 | **Stack**: React Native, Flutter, Swift, Kotlin

---

## Framework Comparison

| | React Native | Flutter | Native (Swift/Kotlin) |
|---|---|---|---|
| **Performance** | ⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡ |
| **Development Speed** | ⚡⚡⚡ | ⚡⚡⚡ | ⚡ |
| **Code Sharing** | iOS + Android + Web | iOS + Android + Web | None |
| **Learning Curve** | Easy (JS) | Medium (Dart) | Hard (2 languages) |
| **Ecosystem** | Huge (npm) | Growing | Platform-specific |

**Recommendation**: React Native (web reuse), Flutter (performance), Native (complex apps)

---

## React Native Essentials

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// HomeScreen.tsx
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';

function HomeScreen({ navigation }) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

---

## Flutter Patterns

```dart
// main.dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Post> posts = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchPosts();
  }

  Future<void> fetchPosts() async {
    final response = await http.get(Uri.parse('https://api.example.com/posts'));
    setState(() {
      posts = (json.decode(response.body) as List)
          .map((item) => Post.fromJson(item))
          .toList();
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return CircularProgressIndicator();
    
    return ListView.builder(
      itemCount: posts.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(posts[index].title),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => DetailsScreen(post: posts[index])),
          ),
        );
      },
    );
  }
}
```

---

## Native iOS (SwiftUI)

```swift
struct ContentView: View {
    @State private var posts: [Post] = []
    @State private var isLoading = true

    var body: some View {
        NavigationView {
            List(posts) { post in
                NavigationLink(destination: DetailsView(post: post)) {
                    Text(post.title)
                }
            }
            .navigationTitle("Posts")
            .task {
                await fetchPosts()
            }
        }
    }

    func fetchPosts() async {
        guard let url = URL(string: "https://api.example.com/posts") else { return }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            posts = try JSONDecoder().decode([Post].self, from: data)
            isLoading = false
        } catch {
            print("Error: \(error)")
        }
    }
}
```

---

## Native Android (Jetpack Compose)

```kotlin
@Composable
fun HomeScreen(navController: NavController, viewModel: PostViewModel = viewModel()) {
    val posts by viewModel.posts.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    if (isLoading) {
        CircularProgressIndicator()
    } else {
        LazyColumn {
            items(posts) { post ->
                PostItem(post = post) {
                    navController.navigate("details/${post.id}")
                }
            }
        }
    }
}

@Composable
fun PostItem(post: Post, onClick: () -> Unit) {
    Card(modifier = Modifier.clickable { onClick() }) {
        Text(text = post.title)
    }
}
```

---

## State Management

**React Native**:
- Redux Toolkit, Zustand (global)
- React Query (server state)
- Context API (simple cases)

**Flutter**:
- Riverpod, Bloc (recommended)
- Provider (legacy)
- GetX (all-in-one)

**Native**:
- SwiftUI: @State, @StateObject, @EnvironmentObject
- Compose: ViewModel + StateFlow

---

## Performance

```typescript
// React Native - useMemo, useCallback
const expensiveValue = useMemo(() => computeExpensive(data), [data]);
const handlePress = useCallback(() => { /* ... */ }, []);

// FlatList optimization
<FlatList
  data={data}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

---

## Push Notifications

```typescript
// React Native (Firebase)
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
}

messaging().onMessage(async remoteMessage => {
  console.log('Notification:', remoteMessage);
});
```

---

## References

- React Native Documentation
- Flutter Cookbook
- Apple Human Interface Guidelines
- Material Design 3

**Related**: `ui-ux-mobile.md`, `app-deployment.md`
