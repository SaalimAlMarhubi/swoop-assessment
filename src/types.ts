export interface Todo {
  id: string;
  text: string;
  done: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface TodoState extends LoadingState {
  todos: Todo[];
}

export interface CategoryState extends LoadingState {
  categories: Category[];
}
