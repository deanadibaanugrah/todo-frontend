import { apiClient } from './api';
import { Todo } from '@/types/todo';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export interface BackendTodoItem {
  id: number;
  task?: string;
  title?: string;
  is_completed?: number | boolean;
  completed?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface UpdateTodoPayload {
  task?: string;
  title?: string;
  is_completed?: boolean;
  completed?: boolean;
}

const mapTodo = (item: BackendTodoItem): Todo => {
  return {
    id: item.id,
    title: item.task || item.title || '',
    completed: Boolean(item.completed ?? item.is_completed),
    createdAt:
      item.createdAt ||
      (item.created_at
        ? new Date(item.created_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]),
  };
};

export const todoService = {
  getTodos: async (page: number = 1, perPage: number = 100): Promise<Todo[]> => {
    const res = await apiClient<ApiResponse<BackendTodoItem[]>>(`/todos?page=${page}&perPage=${perPage}`);
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(mapTodo);
  },

  getTodoById: async (id: number | string): Promise<Todo> => {
    const res = await apiClient<ApiResponse<BackendTodoItem>>(`/todos/${id}`);
    return mapTodo(res.data);
  },

  createTodo: async (taskOrPayload: string | { task?: string; todo?: string; title?: string; [key: string]: unknown }): Promise<Todo> => {
    const task =
      typeof taskOrPayload === 'string'
        ? taskOrPayload
        : taskOrPayload.task || taskOrPayload.todo || taskOrPayload.title || '';
    const res = await apiClient<ApiResponse<BackendTodoItem>>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
    return mapTodo(res.data);
  },

  addTodo: async (taskOrPayload: string | { task?: string; todo?: string; title?: string; [key: string]: unknown }): Promise<Todo> => {
    return todoService.createTodo(taskOrPayload);
  },

  updateTodo: async (
    id: number | string,
    data: UpdateTodoPayload
  ): Promise<Todo> => {
    const payload: { task?: string; is_completed?: boolean } = {};
    if (data.task !== undefined) payload.task = data.task;
    else if (data.title !== undefined) payload.task = data.title;

    if (data.is_completed !== undefined) payload.is_completed = data.is_completed;
    else if (data.completed !== undefined) payload.is_completed = data.completed;

    const res = await apiClient<ApiResponse<BackendTodoItem>>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapTodo(res.data);
  },

  deleteTodo: async (id: number | string): Promise<void> => {
    await apiClient<ApiResponse<void>>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
