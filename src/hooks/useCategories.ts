import { useState, useEffect } from 'react';
import { Category } from '../types';
import { generatePastelColor } from '../utils/pastelColor';

const API_BASE_URL = 'http://localhost:3001';

export const useCategories = () => {
  // State management for categories data
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new category
  const addCategory = async (name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          color: generatePastelColor(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding category:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    addCategory,
    refetch: fetchCategories,
  };
};
