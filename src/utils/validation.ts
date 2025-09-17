// Input validation

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const VALIDATION_RULES = {
  MAX_TODO_LENGTH: 200,
  MAX_CATEGORY_LENGTH: 50,
  MIN_TODO_LENGTH: 1,
  MIN_CATEGORY_LENGTH: 1,
} as const;

export const validateTodoText = (text: string): ValidationResult => {
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Todo text cannot be empty',
    };
  }

  if (trimmed.length < VALIDATION_RULES.MIN_TODO_LENGTH) {
    return {
      isValid: false,
      error: 'Todo text is too short',
    };
  }

  if (trimmed.length > VALIDATION_RULES.MAX_TODO_LENGTH) {
    return {
      isValid: false,
      error: `Todo text must be less than ${VALIDATION_RULES.MAX_TODO_LENGTH} characters`,
    };
  }

  return {
    isValid: true,
  };
};

export const validateCategoryName = (name: string, existingCategories: string[] = []): ValidationResult => {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Category name cannot be empty',
    };
  }

  if (trimmed.length < VALIDATION_RULES.MIN_CATEGORY_LENGTH) {
    return {
      isValid: false,
      error: 'Category name is too short',
    };
  }

  if (trimmed.length > VALIDATION_RULES.MAX_CATEGORY_LENGTH) {
    return {
      isValid: false,
      error: `Category name must be less than ${VALIDATION_RULES.MAX_CATEGORY_LENGTH} characters`,
    };
  }

  // Check for duplicates (case-insensitive)
  if (existingCategories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
    return {
      isValid: false,
      error: 'Category name already exists',
    };
  }

  return {
    isValid: true,
  };
};
