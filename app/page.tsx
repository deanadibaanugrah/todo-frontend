import React from "react";
import TodoStateOnlyApp from "./components/TodoStateOnlyApp";
import { getTodos } from "@/lib/todos";

export default async function TodoPage() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas (Todo List)</h1>
        </header>

        <TodoStateOnlyApp initialTodos={todos} />
      </div>
    </main>
  );
}

