import { memo } from 'react';
import { Box, Card, Flex, Strong, Text } from '@radix-ui/themes';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = memo(({ category }: CategoryCardProps) => {
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
});
