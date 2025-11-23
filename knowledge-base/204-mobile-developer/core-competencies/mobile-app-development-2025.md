# Mobile App Development 2025

**Updated**: 2025-11-23 | **Stack**: React Native, Swift, Kotlin, Flutter

---

## React Native (Cross-Platform)

```typescript
// App.tsx - Modern React Native with TypeScript

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// API client
const api = {
  getTodos: async () => {
    const response = await fetch('https://api.example.com/todos');
    return response.json();
  },
  createTodo: async (text: string) => {
    const response = await fetch('https://api.example.com/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return response.json();
  },
};

// Todo List Component
function TodoList() {
  const [inputText, setInputText] = React.useState('');
  
  // Fetch todos
  const { data: todos, isLoading, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: api.getTodos,
  });
  
  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: api.createTodo,
    onSuccess: () => {
      refetch(); // Refresh list
      setInputText(''); // Clear input
    },
  });
  
  const handleSubmit = () => {
    if (inputText.trim()) {
      createMutation.mutate(inputText);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todo List</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a task..."
          placeholderTextColor="#999"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit}
          disabled={createMutation.isPending}
        >
          <Text style={styles.addButtonText}>
            {createMutation.isPending ? '...' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 44,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  todoItem: {
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

// App wrapper with QueryClient
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}
```

---

## Navigation (React Navigation v6)

```typescript
// npm install @react-navigation/native @react-navigation/native-stack

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Type-safe navigation
type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string; title: string };
  Profile: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Screens
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate('Details', {
            itemId: '123',
            title: 'Item Title',
          })
        }
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { itemId, title } = route.params;
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Details for {title}</Text>
      <Text>Item ID: {itemId}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

// Bottom tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main app
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## State Management (Zustand)

```typescript
// store.ts - Lightweight alternative to Redux

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now().toString(),
              text,
              completed: false,
            },
          ],
        })),
      
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
        })),
      
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Usage in component
function TodoList() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodoStore();
  
  return (
    <View>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo.id)}
          onRemove={() => removeTodo(todo.id)}
        />
      ))}
    </View>
  );
}
```

---

## Native Modules & APIs

```typescript
// Camera (expo-camera)
import { Camera, CameraType } from 'expo-camera';

function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = React.useState(CameraType.back);
  
  if (!permission?.granted) {
    return (
      <View>
        <Text>We need camera permission</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }
  
  return (
    <Camera style={{ flex: 1 }} type={type}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Button
          title="Flip Camera"
          onPress={() =>
            setType(
              type === CameraType.back ? CameraType.front : CameraType.back
            )
          }
        />
      </View>
    </Camera>
  );
}

---

// Location
import * as Location from 'expo-location';

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Permission denied');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
}

---

// Push Notifications (expo-notifications)
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

---

// Async Storage (persistent data)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('@user_id', '123');

// Read
const userId = await AsyncStorage.getItem('@user_id');

// Remove
await AsyncStorage.removeItem('@user_id');

// Clear all
await AsyncStorage.clear();
```

---

## Performance Optimization

```typescript
// 1. Memoization (avoid re-renders)
const MemoizedComponent = React.memo(TodoItem);

// 2. useCallback (stable function reference)
const handlePress = React.useCallback(() => {
  console.log('Pressed');
}, []); // Empty deps = function never changes

// 3. useMemo (expensive calculations)
const sortedTodos = React.useMemo(() => {
  return todos.sort((a, b) => a.text.localeCompare(b.text));
}, [todos]);

// 4. FlatList optimization
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance props:
  initialNumToRender={10} // Render first 10 items
  maxToRenderPerBatch={10} // Batch rendering
  windowSize={5} // Viewport multiplier
  removeClippedSubviews={true} // Unmount off-screen items (Android)
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })} // Skip measurement (if fixed height)
/>

// 5. Image optimization
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
  // Cache:
  cache="force-cache"
/>

// 6. Heavy computations (Web Workers)
import { Worker } from 'react-native-workers';

const worker = new Worker('./worker.js');
worker.postMessage({ data: largeDataset });
worker.onmessage = (event) => {
  console.log(event.data); // Processed result
};
```

---

## Testing

```typescript
// Jest + React Native Testing Library

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodoList from './TodoList';

describe('TodoList', () => {
  it('renders empty state', () => {
    const { getByText } = render(<TodoList />);
    expect(getByText('No todos yet!')).toBeTruthy();
  });
  
  it('adds todo on button press', async () => {
    const { getByPlaceholderText, getByText } = render(<TodoList />);
    
    const input = getByPlaceholderText('Add a task...');
    const addButton = getByText('Add');
    
    fireEvent.changeText(input, 'Buy milk');
    fireEvent.press(addButton);
    
    await waitFor(() => {
      expect(getByText('Buy milk')).toBeTruthy();
    });
  });
  
  it('toggles todo completion', async () => {
    const { getByText } = render(<TodoList />);
    
    const todo = getByText('Buy milk');
    fireEvent.press(todo);
    
    await waitFor(() => {
      expect(todo.props.style).toContain({ textDecorationLine: 'line-through' });
    });
  });
});

// E2E Testing (Detox)
describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  it('should show todo list', async () => {
    await expect(element(by.text('Todo List'))).toBeVisible();
  });
  
  it('should add todo', async () => {
    await element(by.id('todo-input')).typeText('Buy milk');
    await element(by.id('add-button')).tap();
    await expect(element(by.text('Buy milk'))).toBeVisible();
  });
});
```

---

## Deployment

```markdown
iOS (App Store):

1. XCODE SETUP:
   - Open ios/YourApp.xcworkspace
   - Select signing team
   - Set bundle ID (com.yourcompany.yourapp)
   - Set version & build number

2. BUILD:
   - Product → Archive
   - Validate App
   - Distribute App → App Store Connect

3. APP STORE CONNECT:
   - Create app listing
   - Screenshots (6.5", 5.5", iPad)
   - Description, keywords
   - Submit for review (1-2 days)

REQUIREMENTS:
- Apple Developer Account ($99/year)
- Privacy policy URL
- Content rating

---

ANDROID (Google Play):

1. GENERATE KEYSTORE:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 \
     -keystore my-release-key.keystore \
     -alias my-key-alias \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. BUILD:
   ```bash
   cd android
   ./gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```

3. PLAY CONSOLE:
   - Create app
   - Upload AAB
   - Store listing (screenshots, description)
   - Content rating questionnaire
   - Submit (review ~1-3 days)

REQUIREMENTS:
- Google Play Console account ($25 one-time)
- Privacy policy
- Content rating

---

OTA UPDATES (Expo):

```bash
# Update without app store review (JS changes only)
eas update --branch production --message "Bug fix"
```

CODEPUSH (React Native):
```bash
appcenter codepush release-react -a Owner/App \
  -d Production --description "Bug fixes"
```
```

---

## Key Takeaways

1. **React Native** - Cross-platform (write once, run iOS+Android)
2. **Performance** - FlatList, memoization, image optimization
3. **Navigation** - React Navigation (stack, tabs, drawer)
4. **State** - Zustand/Redux for global, React Query for server
5. **Testing** - Jest (unit), Detox (E2E)

---

## References

- React Native Docs
- "React Native in Action" - Nader Dabit
- William Candillon YouTube (animations)

**Related**: `react-native-performance.md`, `ios-swift.md`, `android-kotlin.md`
