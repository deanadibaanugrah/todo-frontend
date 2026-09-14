import { apiClient } from './api';
import { DummyJSONResponse, DummyJSONTodo } from '@/types/api-todo';

export const todoService = {
  getTodos: (limit: number = 30, skip: number = 0) => 
    apiClient<DummyJSONResponse>(`/todos?limit=${limit}&skip=${skip}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    }),
    
  addTodo: (todo: Partial<DummyJSONTodo>) => 
    apiClient<DummyJSONTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify(todo),
    }),
};
