import { todoService } from '@/services/todoService';
import { DummyJSONTodo } from '@/types/api-todo';
import { Todo } from '@/types/todo';

export function formatTodo(apiTodo: DummyJSONTodo): Todo {
  return {
    id: apiTodo.id,
    title: apiTodo.todo,
    description: `Tugas dari DummyJSON user ${apiTodo.userId}`,
    completed: apiTodo.completed,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

export async function getTasks(): Promise<Todo[]> {
  try {
    const data = await todoService.getTodos();
    return data.todos.map(formatTodo);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return [];
  }
}

export async function getTaskById(id: string): Promise<Todo | null> {
  try {
    const data = await todoService.getTodos();
    const todo = data.todos.find(t => t.id === Number(id));
    return todo ? formatTodo(todo) : null;
  } catch (error) {
    console.error('Failed to fetch task by id:', error);
    return null;
  }
}

export async function getTaskStats() {
  const tasks = await getTasks();
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };
}
