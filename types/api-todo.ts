export type DummyJSONTodo = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type DummyJSONResponse = {
  todos: DummyJSONTodo[];
  total: number;
  skip: number;
  limit: number;
};
