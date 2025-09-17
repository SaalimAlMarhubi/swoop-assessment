import { useState, useCallback, useMemo, memo } from 'react';
import { Box, Button, Card, Checkbox, Dialog, Flex, Select, Strong, Text } from '@radix-ui/themes';
import { Todo, Category } from '../types';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => Promise<void>;
  onCategoryChange: (todoId: string, categoryId: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoItem = memo(({ todo, categories, onToggle, onCategoryChange, onDelete }: TodoItemProps) => {
  // State for delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Handle delete button click - open confirmation dialog
  const handleDeleteClick = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  // Handle confirmed deletion
  const handleDeleteConfirm = useCallback(async () => {
    try {
      await onDelete(todo.id);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      // Error is handled by the parent component
    }
  }, [onDelete, todo.id]);

  // Memoise category colour lookup for performance
  const getCategoryColor = useMemo(() => {
    return categories.find((category) => category.id === todo.categoryId)?.color || '#f0f0f0';
  }, [categories, todo.categoryId]);

  return (
    <>
      <Card
        my="2"
        key={todo.id}
        style={{
          backgroundColor: getCategoryColor,
        }}
      >
        <Flex gap="3" align="center" justify="between">
          <Flex gap="3" align="center">
            <Checkbox
              size="3"
              checked={todo.done}
              onCheckedChange={async () => {
                try {
                  await onToggle(todo.id);
                } catch (error) {
                  console.error('Failed to toggle todo:', error);
                }
              }}
            />
            <Box>
              <Text
                as="span"
                size="3"
                style={{
                  color: todo.done ? '#666' : 'black',
                  textDecoration: todo.done ? 'line-through' : 'none',
                  opacity: todo.done ? 0.7 : 1,
                }}
              >
                <Strong> {todo.text}</Strong>
              </Text>
            </Box>
            <Select.Root
              value={todo.categoryId?.toString()}
              onValueChange={async (value) => {
                try {
                  await onCategoryChange(todo.id, value);
                } catch (error) {
                  console.error('Failed to update todo category:', error);
                }
              }}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  {categories.map((category) => (
                    <Select.Item key={category.id} value={category.id.toString()}>
                      {category.name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
          <Button size="2" variant="solid" color="red" onClick={handleDeleteClick}>
            🗑️
          </Button>
        </Flex>
      </Card>

      <Dialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Delete Todo</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete "{todo.text}"? This action cannot be undone.
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="solid" color="red" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
});
