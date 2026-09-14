'use client';
import React, { useEffect, useState } from 'react';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import { Button } from '@/app/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Todo } from '@/types/todo';

type TodoCachedAppProps = {
  initialTodos: Todo[];
};

export default function TodoCachedApp({ initialTodos }: TodoCachedAppProps) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('TODO_LIST_CACHE', initialTodos);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: "",
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleReset = () => {
    setTodos(initialTodos);
  };

  if (!isMounted) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Cached in LocalStorage
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Data
        </Button>
      </div>

      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
