'use client';
import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import TodoItem from '@/app/components/TodoItem';

type ApiTodoListProps = {
  initialTodos: Todo[];
};

export default function ApiTodoList({ initialTodos }: ApiTodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleToggleTodo = async (id: number) => {
    const previousTodos = [...todos];
    
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    try {
      const res = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !todos.find(t => t.id === id)?.completed,
        })
      });

      if (!res.ok) throw new Error('API Update Failed');
    } catch (error) {
      console.error(error);
      setTodos(previousTodos);
      alert('Gagal mengupdate tugas. Koneksi bermasalah.');
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (todos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
        <p>Belum ada tugas. Yay!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Tugas Anda (API)</h2>
      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
