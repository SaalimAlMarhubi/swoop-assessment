import { useState } from 'react';

import { Box, Button, Card, Checkbox, Dialog, Flex, Grid, Select, Strong, Text, TextField } from '@radix-ui/themes';
import { Todo } from './types';
import { useTodos } from './hooks/useTodos';
import { useCategories } from './hooks/useCategories';

function App() {
  const [todoText, setTodoText] = useState<string>('');
  const [categoryText, setCategoryText] = useState<string>('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

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
          {categories?.map((category) => {
            return (
              <Card
                my="2"
                key={category.id}
                style={{
                  backgroundColor: category.color,
                }}
              >
                <Flex gap="3" align="center">
                  <Box>
                    <Text
                      as="span"
                      size="3"
                      style={{
                        color: 'black',
                      }}
                    >
                      <Strong>{category.name}</Strong>
                    </Text>
                  </Box>
                </Flex>
              </Card>
            );
          })}
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

          {todos.map((todo) => {
            return (
              <Card
                my="2"
                key={todo.id}
                style={{
                  backgroundColor: categories.find((category) => category.id === todo.categoryId)?.color,
                }}
              >
                <Flex gap="3" align="center" justify="between">
                  <Flex gap="3" align="center">
                    <Checkbox
                      size="3"
                      checked={todo.done}
                      onCheckedChange={() => {
                        toggleTodo(todo.id);
                      }}
                    />
                    <Box>
                      <Text
                        as="span"
                        size="3"
                        style={{
                          color: 'black',
                        }}
                      >
                        <Strong> {todo.text}</Strong>
                      </Text>
                    </Box>
                    <Select.Root
                      value={todo.categoryId?.toString()}
                      onValueChange={(value) => onTodoCategoryChange(value, todo.id.toString())}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Group>
                          {categories.map((category) => {
                            return (
                              <Select.Item key={category.id} value={category.id.toString()}>
                                {category.name}
                              </Select.Item>
                            );
                          })}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                  <Button
                    size="2"
                    variant="solid"
                    color="red"
                    onClick={() => {
                      setTodoToDelete(todo);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    🗑️
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </Box>
      </Grid>

      <Dialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Delete Todo</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete "{todoToDelete?.text}"? This action cannot be undone.
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                variant="solid"
                color="red"
                onClick={() => {
                  if (todoToDelete) {
                    deleteTodo(todoToDelete.id);
                  }
                }}
              >
                Delete
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default App;
