'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Button } from './ui/button';
import { authService } from '@/services/authService';
import { todoService } from '@/services/todoService';
import { Todo } from '@/types/todo';

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    todoService
      .getTodos()
      .then((data) => {
        if (active) {
          startTransition(() => {
            setTodos(data);
            setLoading(false);
          });
        }
      })
      .catch((err) => {
        if (active) {
          startTransition(() => {
            setError(
              err instanceof Error ? err.message : 'Gagal memuat daftar tugas.'
            );
            setLoading(false);
          });
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleAddTodo = async (title: string) => {
    try {
      setError('');
      const newTodo = await todoService.createTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menambahkan tugas.';
      setError(message);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const newCompleted = !target.completed;
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      await todoService.updateTodo(id, { completed: newCompleted });
    } catch (err) {
      // Rollback on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
      );
      const message =
        err instanceof Error ? err.message : 'Gagal memperbarui status tugas.';
      setError(message);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const previousTodos = [...todos];
    // Optimistic delete
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      setTodos(previousTodos);
      const message =
        err instanceof Error ? err.message : 'Gagal menghapus tugas.';
      setError(message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <span className="text-sm font-medium text-dark-70">
          Selamat datang! 👋
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-xs"
        >
          Logout
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <TodoForm onAddTodo={handleAddTodo} />

      {loading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse">
          Memuat daftar tugas...
        </div>
      ) : (
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      )}
    </div>
  );
}
