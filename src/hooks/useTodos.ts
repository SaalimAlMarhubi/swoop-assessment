import { useState, useEffect } from 'react';
import { Todo } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const useTodos = () => {
  // State management for todos data
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (text: string, categoryId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          done: false,
          categoryId: categoryId || '', // Use provided categoryId or empty string
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding todo:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, done: !todo.done }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error toggling todo:', err);
      throw err;
    }
  };

  // Update todo category
  const updateTodoCategory = async (id: string, categoryId: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, categoryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo category');
      }

      const updatedTodo = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating todo category:', err);
      throw err;
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    updateTodoCategory,
    deleteTodo,
    refetch: fetchTodos,
  };
};
