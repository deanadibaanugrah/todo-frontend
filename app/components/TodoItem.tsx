'use client';
import React from "react";
import Link from "next/link";
import { Todo } from "@/types/todo";
import { Button } from '@/app/components/ui/button';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={`p-4 rounded-md border flex items-center justify-between gap-3 transition-colors ${
        todo.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded text-primary-70 focus:ring-primary-70 cursor-pointer accent-primary-70"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-base font-medium truncate cursor-pointer transition-all ${
            todo.completed ? 'line-through text-gray-80' : 'text-dark-70'
          }`}
        >
          {todo.title}
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/task/${todo.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline shrink-0"
        >
          Detail
        </Link>
        {onDelete && (
          <Button
            type="button"
            onClick={() => onDelete(todo.id)}
            title="Hapus tugas"
            variant="destructive"
            size="xs"
            className="text-xs font-medium"
          >
            Hapus
          </Button>
        )}
      </div>
    </li>
  );
}

