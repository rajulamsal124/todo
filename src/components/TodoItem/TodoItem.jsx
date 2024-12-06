
// src/components/TodoItem/TodoItem.jsx
import { useState } from 'react';
import { TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import classNames from 'classnames';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (!editText.trim()) return;
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={classNames('todo-item', { 'opacity-50': todo.completed })}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <div className="flex-1 ml-3">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
            className="w-full px-2 py-1 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        ) : (
          <>
            <p className={classNames('text-gray-800', { 'line-through': todo.completed })}>
              {todo.text}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(todo.createdAt), 'MMM d, yyyy')}
            </p>
          </>
        )}
      </div>
      <span className={classNames('px-2 py-1 rounded-full text-xs font-medium', priorityColors[todo.priority])}>
        {todo.priority}
      </span>
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <PencilIcon className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <TrashIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;