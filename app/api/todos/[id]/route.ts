import { NextRequest, NextResponse } from 'next/server';
import { getTaskById } from '@/lib/tasks';
import { ApiResponse } from '../route';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const task = await getTaskById(id);

    if (!task) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof task>>(
      { data: task },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
