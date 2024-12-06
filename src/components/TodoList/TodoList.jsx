import React from 'react';
import TodoItem from '../TodoItem/TodoItem';
import { useTodos } from '../../hooks/useTodos';

const TodoList = () => {
  const { 
    todos, 
    loading, 
    error,
    toggleTodo, 
    updateTodo, 
    deleteTodo 
  } = useTodos();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={() => toggleTodo(todo._id)}
          onUpdate={(updates) => updateTodo(todo._id, updates)}
          onDelete={() => deleteTodo(todo._id)}
        />
      ))}
    </div>
  );
};

export default TodoList;
