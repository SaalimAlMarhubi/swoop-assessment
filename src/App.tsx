import { useState } from 'react';

import { Box, Grid, Text, TextField, Button } from '@radix-ui/themes';
import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';
import { TodoItem, CategoryCard } from './components';
import { validateTodoText, validateCategoryName } from './utils/validation';

function App() {
  const [todoText, setTodoText] = useState<string>('');
  const [categoryText, setCategoryText] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{
    todo?: string;
    category?: string;
  }>({});

  // Custom hooks
  const {
    todos,
    addTodo,
    toggleTodo,
    updateTodoCategory,
    deleteTodo,
    isLoading: todosLoading,
    error: todosError,
  } = useTodos();
  const { categories, addCategory, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const handleAddTodo = async () => {
    // Clear previous validation errors
    setValidationErrors((prev) => ({ ...prev, todo: undefined }));

    // Validate input
    const validation = validateTodoText(todoText);
    if (!validation.isValid) {
      setValidationErrors((prev) => ({ ...prev, todo: validation.error }));
      return;
    }

    try {
      // Use the first available category or empty string if none exist
      const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
      await addTodo(todoText.trim(), defaultCategoryId);
      setTodoText('');
    } catch (error) {
      console.error('Failed to add todo:', error);
      // Error is already handled in the hook, but we can add additional UI feedback here
    }
  };

  const handleAddCategory = async () => {
    // Clear previous validation errors
    setValidationErrors((prev) => ({ ...prev, category: undefined }));

    // Get existing category names for duplicate checking
    const existingCategoryNames = categories.map((cat) => cat.name);

    // Validate input
    const validation = validateCategoryName(categoryText, existingCategoryNames);
    if (!validation.isValid) {
      setValidationErrors((prev) => ({ ...prev, category: validation.error }));
      return;
    }

    try {
      await addCategory(categoryText.trim());
      setCategoryText('');
    } catch (error) {
      console.error('Failed to add category:', error);
      // Error is already handled in the hook, but we can add additional UI feedback here
    }
  };

  const onCreateTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleTodoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTodoText(value);

    // Clear validation error when user starts typing
    if (validationErrors.todo) {
      setValidationErrors((prev) => ({ ...prev, todo: undefined }));
    }
  };

  const handleCategoryTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryText(value);

    // Clear validation error when user starts typing
    if (validationErrors.category) {
      setValidationErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const onCreateNewCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const onTodoCategoryChange = async (value: string, todoId: string) => {
    await updateTodoCategory(todoId, value);
  };

  return (
    <>
      <Grid columns="2" gap="3" width="auto">
        <Box width="auto">
          <h2>Categories</h2>
          <Box style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <TextField.Root style={{ flex: 1 }}>
              <TextField.Input
                placeholder="Create a new category"
                value={categoryText}
                size="3"
                maxLength={50}
                onChange={handleCategoryTextChange}
                onKeyDown={onCreateNewCategoryKeyDown}
                disabled={categoriesLoading}
              />
            </TextField.Root>
            <Button onClick={handleAddCategory} disabled={categoriesLoading || !categoryText.trim()} size="3">
              Add
            </Button>
          </Box>
          {(categoriesError || validationErrors.category) && (
            <Text color="red" size="2" style={{ marginTop: '8px' }}>
              Error: {validationErrors.category || categoriesError}
            </Text>
          )}
          {categoriesLoading ? (
            <Text size="2" style={{ marginTop: '8px' }}>
              Loading categories...
            </Text>
          ) : (
            categories?.map((category) => <CategoryCard key={category.id} category={category} />)
          )}
        </Box>
        <Box width="auto">
          <h2>Todo List</h2>
          <Box style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <TextField.Root style={{ flex: 1 }}>
              <TextField.Input
                placeholder="Type your todo here"
                value={todoText}
                size="3"
                maxLength={200}
                onChange={handleTodoTextChange}
                onKeyDown={onCreateTodoKeyDown}
                disabled={todosLoading}
              />
            </TextField.Root>
            <Button onClick={handleAddTodo} disabled={todosLoading || !todoText.trim()} size="3">
              Add
            </Button>
          </Box>
          {(todosError || validationErrors.todo) && (
            <Text color="red" size="2" style={{ marginTop: '8px' }}>
              Error: {validationErrors.todo || todosError}
            </Text>
          )}
          {todosLoading ? (
            <Text size="2" style={{ marginTop: '8px' }}>
              Loading todos...
            </Text>
          ) : (
            // Sort todos: incomplete first, then completed
            todos
              .sort((a, b) => {
                // If both have same completion status, maintain original order
                if (a.done === b.done) return 0;
                // Incomplete todos come first (false < true)
                return a.done ? 1 : -1;
              })
              .map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  categories={categories}
                  onToggle={toggleTodo}
                  onCategoryChange={onTodoCategoryChange}
                  onDelete={deleteTodo}
                />
              ))
          )}
        </Box>
      </Grid>
    </>
  );
}

export default App;
