'use client';
import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Todo } from '@/types/todo';

type TodoStateOnlyAppProps = {
  initialTodos: Todo[];
};

export default function TodoStateOnlyApp({ initialTodos }: TodoStateOnlyAppProps) {
  const [todos, setTodos] = useState(initialTodos);

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

  return (
    <>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
