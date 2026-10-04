'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { todoService } from '@/services/todoService';
import { authService } from '@/services/authService';
import { Todo } from '@/types/todo';
import TaskNotFound from './components/TaskNotFound';
import TaskDetailCard from './components/TaskDetailCard';

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (!id) return;

    let active = true;

    todoService
      .getTodoById(id)
      .then((data) => {
        if (active) {
          startTransition(() => {
            if (!data) {
              setNotFound(true);
            } else {
              setTodo(data);
            }
            setLoading(false);
          });
        }
      })
      .catch(() => {
        if (active) {
          startTransition(() => {
            setNotFound(true);
            setLoading(false);
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Memuat detail tugas...</p>
      </main>
    );
  }

  if (notFound || !todo) {
    return <TaskNotFound id={id} />;
  }

  return <TaskDetailCard todo={todo} />;
}
