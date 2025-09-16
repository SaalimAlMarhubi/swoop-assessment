import { useState } from 'react';

import { Box, Grid, Text, TextField } from '@radix-ui/themes';
import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';
import { TodoItem, CategoryCard } from './components';

function App() {
  const [todoText, setTodoText] = useState<string>('');
  const [categoryText, setCategoryText] = useState<string>('');

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
    if (todoText.trim()) {
      try {
        // Use the first available category or empty string if none exist
        const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
        await addTodo(todoText, defaultCategoryId);
        setTodoText('');
      } catch (error) {
        console.error('Failed to add todo:', error);
        // Error is already handled in the hook, but we can add additional UI feedback here
      }
    }
  };

  const handleAddCategory = async () => {
    if (categoryText.trim()) {
      try {
        await addCategory(categoryText);
        setCategoryText('');
      } catch (error) {
        console.error('Failed to add category:', error);
        // Error is already handled in the hook, but we can add additional UI feedback here
      }
    }
  };

  const onCreateTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
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
          <TextField.Root>
            <TextField.Input
              placeholder="Create a new category"
              value={categoryText}
              size="3"
              onChange={(e) => setCategoryText(e.target.value)}
              onKeyDown={onCreateNewCategoryKeyDown}
              disabled={categoriesLoading}
            />
          </TextField.Root>
          {categoriesError && (
            <Text color="red" size="2" style={{ marginTop: '8px' }}>
              Error: {categoriesError}
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
          <TextField.Root>
            <TextField.Input
              placeholder="Type your todo here"
              value={todoText}
              size="3"
              onChange={(e) => setTodoText(e.target.value)}
              onKeyDown={onCreateTodoKeyDown}
              disabled={todosLoading}
            />
          </TextField.Root>
          {todosError && (
            <Text color="red" size="2" style={{ marginTop: '8px' }}>
              Error: {todosError}
            </Text>
          )}
          {todosLoading ? (
            <Text size="2" style={{ marginTop: '8px' }}>
              Loading todos...
            </Text>
          ) : (
            todos.map((todo) => (
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
