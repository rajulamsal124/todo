// src/components/TodoForm/TodoForm.jsx
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo({
      text: text.trim(),
      priority
    });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 bg-gray-100 rounded-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="todo-button">
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default TodoForm;