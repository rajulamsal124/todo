// src/App.jsx
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import TodoFilter from './components/TodoFilter/TodoFilter';
import useTodos from './hooks/useTodos';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    filter,
    setFilter
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="todo-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Todo List</h1>
        <TodoForm addTodo={addTodo} />
        <TodoFilter filter={filter} setFilter={setFilter} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </div>
    </div>
  );
}

export default App;