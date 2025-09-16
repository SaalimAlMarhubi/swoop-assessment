import { useEffect, useState } from 'react';

import { generatePastelColor } from './utils/pastelColor';
import { Box, Button, Card, Checkbox, Dialog, Flex, Grid, Select, Strong, Text, TextField } from '@radix-ui/themes';
import { Todo, Category } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [todoText, setTodoText] = useState<string>('');
  const [categoryText, setCategoryText] = useState<string>('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const addTodo = async () => {
    const response = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: Date.now().toString(), text: todoText, done: false }),
    });
    const todo = await response.json();
    setTodos([...todos, todo]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((todo: Todo) => todo.id === id);

    if (todo) {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, done: !todo.done }),
      });
      const updatedTodo = await response.json();
      const updatedTodos = todos.map((todo: Todo) => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }
        return todo;
      });
      setTodos(updatedTodos);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
        setTodos(updatedTodos);
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const addCategory = async () => {
    const response = await fetch('http://localhost:3001/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Date.now().toString(),
        name: categoryText,
        color: generatePastelColor(),
      }),
    });
    const category = await response.json();
    setCategories([...categories, category]);
  };

  const onCreateTodoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const onCreateNewCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addCategory();
    }
  };

  const onTodoCategoryChange = async (value: string, todoId: string) => {
    const todo = todos.find((todo: Todo) => todo.id === todoId);

    if (todo) {
      const response = await fetch(`http://localhost:3001/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, categoryId: value }),
      });
      const updatedTodo = await response.json();
      const updatedTodos = todos.map((todo: Todo) => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }
        return todo;
      });
      setTodos(updatedTodos);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/todos');
      const data = await response.json();

      setTodos(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/categories');
      const data = await response.json();

      setCategories(data);
    };
    fetchData();
  }, []);

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
          {categories?.map((category: Category) => {
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

          {todos.map((todo: Todo) => {
            return (
              <Card
                my="2"
                key={todo.id}
                style={{
                  backgroundColor: categories.find((category: Category) => category.id === todo.categoryId)?.color,
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
                          {categories.map((category: Category) => {
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
