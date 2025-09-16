import { useState } from 'react';

import { Box, Grid, TextField } from '@radix-ui/themes';
import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';
import { TodoItem, CategoryCard } from './components';

function App() {
  const [todoText, setTodoText] = useState<string>('');
  const [categoryText, setCategoryText] = useState<string>('');

  // Custom hooks
  const { todos, addTodo, toggleTodo, updateTodoCategory, deleteTodo } = useTodos();
  const { categories, addCategory } = useCategories();

  const handleAddTodo = async () => {
    if (todoText.trim()) {
      // Use the first available category or empty string if none exist
      const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
      await addTodo(todoText, defaultCategoryId);
      setTodoText('');
    }
  };

  const handleAddCategory = async () => {
    if (categoryText.trim()) {
      await addCategory(categoryText);
      setCategoryText('');
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
            />
          </TextField.Root>
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
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
            />
          </TextField.Root>

          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              categories={categories}
              onToggle={toggleTodo}
              onCategoryChange={onTodoCategoryChange}
              onDelete={deleteTodo}
            />
          ))}
        </Box>
      </Grid>
    </>
  );
}

export default App;
