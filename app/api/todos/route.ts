import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/tasks';
import { todoService } from '@/services/todoService';
import { Todo } from '@/types/todo';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  meta?: {
    total: number;
    skip: number;
    limit: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = parseInt(searchParams.get('skip') || '0');

    const tasks = await getTasks();

    return NextResponse.json<ApiResponse<Todo[]>>({
      data: tasks,
      meta: { total: tasks.length, skip, limit }
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTodo = await todoService.addTodo({
      todo: body.title,
      completed: false,
      userId: 1
    });

    return NextResponse.json<ApiResponse<typeof newTodo>>(
      { data: newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
