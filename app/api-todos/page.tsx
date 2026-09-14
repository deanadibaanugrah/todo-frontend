import React from 'react';
import ApiTodoList from './components/ApiTodoList';

async function fetchTodosFromInternalAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/todos`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal fetch data');
    const response = await res.json();
    return response.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ApiTodoPage() {
  const initialTodos = await fetchTodosFromInternalAPI();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Todo List (Fetch API)</h1>
          <p className="text-sm text-gray-500 mt-2">Data diambil dari DummyJSON via Route Handler</p>
        </header>

        <ApiTodoList initialTodos={initialTodos} />
      </div>
    </main>
  );
}
