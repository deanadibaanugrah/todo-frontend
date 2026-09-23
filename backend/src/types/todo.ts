export interface CreateTodoRequest {
  task: string;
}

export interface UpdateTodoRequest {
  task: string;
  is_completed: boolean;
}

export interface TodoResponse {
  id: number;
  task: string;
  completed: boolean;
}

export interface TodoRow {
  id: number;
  task: string;
  is_completed: number | boolean;
}
