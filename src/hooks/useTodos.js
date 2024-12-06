import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { todoApi } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing...');
      todoApi.syncOfflineOperations().then(() => {
        fetchTodos();
        toast.success('Synced successfully!');
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Changes will be synced when back online.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (err) {
      console.error('Error in fetchTodos:', err);
      setError(err.message || 'Failed to fetch todos');
      toast.error(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(todoData);
      // Immediately update the UI with the new todo
      setTodos(prevTodos => [...prevTodos, newTodo]);
      toast.success('Todo added successfully!');
      return newTodo;
    } catch (err) {
      console.error('Error in addTodo:', err);
      setError(err.message || 'Failed to add todo');
      toast.error(err.message || 'Failed to add todo');
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, todoData);
      // Immediately update the UI with the updated todo
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo._id === id ? { ...todo, ...updatedTodo } : todo
        )
      );
      toast.success('Todo updated successfully!');
      return updatedTodo;
    } catch (err) {
      console.error('Error in updateTodo:', err);
      setError(err.message || 'Failed to update todo');
      toast.error(err.message || 'Failed to update todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError(null);
      const todoToUpdate = todos.find(todo => todo._id === id);
      const updatedTodo = await updateTodo(id, {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      });
      toast.success('Todo updated successfully!');
    } catch (err) {
      console.error('Error in toggleTodo:', err);
      setError(err.message || 'Failed to update todo');
      toast.error(err.message || 'Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      // Immediately update the UI by removing the todo
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully!');
    } catch (err) {
      console.error('Error in deleteTodo:', err);
      setError(err.message || 'Failed to delete todo');
      toast.error(err.message || 'Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return {
    todos: filteredTodos,
    loading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    filter,
    setFilter,
    isOnline
  };
};