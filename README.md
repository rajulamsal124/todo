# Modern React Todo App

A feature-rich Todo application built with React + Vite, demonstrating modern React practices, hooks, and clean architecture.

## 🚀 Features

- ✨ Create, Read, Update, Delete (CRUD) operations for todos
- 🎨 Priority levels (Low, Medium, High)
- 🔍 Filter todos by status (All, Active, Completed)
- 💾 Persistent storage using localStorage
- 📱 Responsive design with Tailwind CSS
- ⚡ Modern React Hooks implementation
- 🎯 Clean and maintainable code structure

## 🛠️ Technologies

- React 18 with Vite
- TailwindCSS for styling
- Hero Icons for icons
- date-fns for date formatting
- classnames utility

## 📁 Project Structure

```
src/
├── components/        # UI Components
│   ├── TodoForm/     # New todo input
│   ├── TodoList/     # Todos container
│   ├── TodoItem/     # Individual todo
│   └── TodoFilter/   # Filter controls
├── hooks/            # Custom hooks
│   └── useTodos.js   # Todo logic
├── styles/           # CSS styles
└── App.jsx          # Main component
```

## ⚙️ Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## 🎯 Core Features Explained

### Todo Management

```javascript
// Adding a new todo
const addTodo = (text, priority = 'medium') => {
  setTodos(prev => [{
    id: Date.now(),
    text,
    completed: false,
    priority,
    createdAt: new Date()
  }, ...prev]);
};

// Toggling todo status
const toggleTodo = (id) => {
  setTodos(prev =>
    prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    )
  );
};
```

### Data Persistence

```javascript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);

// Load from localStorage
const [todos, setTodos] = useState(() => {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
});
```

### Filtering System

```javascript
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true; // 'all' filter
});
```

## 🎨 Styling

We use a combination of Tailwind CSS and custom CSS:

```css
/* Custom CSS Variables */
:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
}

/* Component Styles */
.todo-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background-color: var(--gray-100);
  border-radius: 0.5rem;
  transition: background-color 150ms;
}
```

## 🔄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Best Practices

1. **Component Organization**
   - Single responsibility principle
   - Modular components
   - Props for communication

2. **State Management**
   - Custom hooks for logic
   - Local state for UI
   - Persistent storage

3. **Performance**
   - Efficient rerenders
   - Optimized filtering
   - Proper dependency arrays

## 🚀 Future Improvements

- [ ] Backend integration
- [ ] User authentication
- [ ] Categories/Tags
- [ ] Due dates
- [ ] Search functionality
- [ ] Drag and drop
- [ ] Dark mode
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
