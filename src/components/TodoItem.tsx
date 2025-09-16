import { useState } from 'react';
import { Box, Button, Card, Checkbox, Dialog, Flex, Select, Strong, Text } from '@radix-ui/themes';
import { Todo, Category } from '../types';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => void;
  onCategoryChange: (todoId: string, categoryId: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, categories, onToggle, onCategoryChange, onDelete }: TodoItemProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setDeleteConfirmOpen(false);
  };

  const getCategoryColor = () => {
    return categories.find((category) => category.id === todo.categoryId)?.color || '#f0f0f0';
  };

  return (
    <>
      <Card
        my="2"
        key={todo.id}
        style={{
          backgroundColor: getCategoryColor(),
        }}
      >
        <Flex gap="3" align="center" justify="between">
          <Flex gap="3" align="center">
            <Checkbox size="3" checked={todo.done} onCheckedChange={() => onToggle(todo.id)} />
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
              onValueChange={(value) => onCategoryChange(todo.id, value)}
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
};
