'use client';
import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "@/types/todo";

type TodoListProps = {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
};

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
        <p>Belum ada tugas. Yay!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Tugas Anda</h2>
      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

