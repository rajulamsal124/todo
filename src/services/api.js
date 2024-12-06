import { cacheService } from './cache';

const API_BASE_URL = 'http://localhost:5001/api';
const TODOS_CACHE_KEY = 'todos';

// Function to check online status
const isOnline = () => navigator.onLine;

// Function to store offline operations
const storeOfflineOperation = (operation) => {
  const offlineOps = JSON.parse(localStorage.getItem('offlineOperations') || '[]');
  offlineOps.push(operation);
  localStorage.setItem('offlineOperations', JSON.stringify(offlineOps));
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Function to sync offline operations
const syncOfflineOperations = async () => {
  if (!isOnline()) return;

  const offlineOps = JSON.parse(localStorage.getItem('offlineOperations') || '[]');
  if (offlineOps.length === 0) return;

  for (const operation of offlineOps) {
    try {
      switch (operation.type) {
        case 'create':
          await todoApi.createTodo(operation.data);
          break;
        case 'update':
          await todoApi.updateTodo(operation.id, operation.data);
          break;
        case 'delete':
          await todoApi.deleteTodo(operation.id);
          break;
      }
    } catch (error) {
      console.error('Error syncing offline operation:', error);
    }
  }

  localStorage.setItem('offlineOperations', '[]');
  cacheService.invalidate(TODOS_CACHE_KEY);
};

export const todoApi = {
  // Get all todos
  getAllTodos: async () => {
    try {
      // Check cache first
      const cachedTodos = cacheService.get(TODOS_CACHE_KEY);
      if (cachedTodos) return cachedTodos;

      // If offline, return cached data or localStorage
      if (!isOnline()) {
        return JSON.parse(localStorage.getItem('todos') || '[]');
      }

      const response = await fetch(`${API_BASE_URL}/todos`);
      const data = await handleResponse(response);
      
      cacheService.set(TODOS_CACHE_KEY, data);
      localStorage.setItem('todos', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Create a new todo with optimistic update
  createTodo: async (todoData) => {
    try {
      // Optimistic update
      const optimisticTodo = {
        _id: Date.now().toString(),
        ...todoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!isOnline()) {
        storeOfflineOperation({ type: 'create', data: todoData });
        return optimisticTodo;
      }

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const data = await handleResponse(response);
      cacheService.invalidate(TODOS_CACHE_KEY);
      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo with optimistic update
  updateTodo: async (id, todoData) => {
    try {
      // Optimistic update
      if (!isOnline()) {
        storeOfflineOperation({ type: 'update', id, data: todoData });
        return { _id: id, ...todoData };
      }

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const data = await handleResponse(response);
      cacheService.invalidate(TODOS_CACHE_KEY);
      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo with optimistic update
  deleteTodo: async (id) => {
    try {
      if (!isOnline()) {
        storeOfflineOperation({ type: 'delete', id });
        return { success: true };
      }

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      const data = await handleResponse(response);
      cacheService.invalidate(TODOS_CACHE_KEY);
      return data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Sync offline operations
  syncOfflineOperations,
};
