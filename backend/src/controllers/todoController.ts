import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';
import type { CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodoRow } from '../types/todo';
import type { PaginationMeta } from '../types/common';
import { sendSuccess, sendSuccessPagination, sendError } from '../utils/response';

// Helper untuk mentransformasikan baris database ke TodoResponse (mengubah is_completed menjadi completed)
const formatTodo = (row: TodoRow): TodoResponse => ({
  id: row.id,
  task: row.task,
  completed: Boolean(row.is_completed)
});

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const perPage = Math.max(1, parseInt(req.query.perPage as string, 10) || 10);
  const offset = (page - 1) * perPage;

  try {
    const total = await TodoModel.countByUserId(userId);
    const rows = await TodoModel.getByUserId(userId, perPage, offset);
    const totalPages = Math.ceil(total / perPage) || 1;

    const pagination: PaginationMeta = {
      page,
      perPage,
      total,
      totalPages
    };

    const data: TodoResponse[] = rows.map(formatTodo);
    sendSuccessPagination(res, 'Berhasil mengambil data.', data, pagination);
  } catch (error) {
    sendError(res, 'Gagal mengambil data.');
  }
};

// GET /api/todos/:id - Ambil satu todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const todo = await TodoModel.getById(Number(id), userId);

    if (!todo) {
      sendError(res, 'Tugas tidak ditemukan!', 404);
      return;
    }

    sendSuccess(res, 'Berhasil mengambil data tugas.', formatTodo(todo));
  } catch (error) {
    sendError(res, 'Gagal mengambil data.');
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  const { task }: CreateTodoRequest = req.body;
  const userId = req.user.id;
  try {
    const newId = await TodoModel.create(userId, task);
    const newTodo: TodoResponse = {
      id: newId,
      task,
      completed: false
    };
    sendSuccess(res, 'Tugas berhasil ditambahkan!', newTodo, 201);
  } catch (error) {
    sendError(res, 'Gagal menambahkan tugas.');
  }
};

// PUT /api/todos/:id - Update todo (ubah task atau tanda selesai)
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { task, is_completed }: UpdateTodoRequest = req.body;
  const userId = req.user.id;
  try {
    const current = await TodoModel.getById(Number(id), userId);
    if (!current) {
      sendError(res, 'Tugas tidak ditemukan!', 404);
      return;
    }

    const updatedTask = task !== undefined ? task : current.task;
    const updatedCompleted = is_completed !== undefined ? is_completed : Boolean(current.is_completed);

    const affectedRows = await TodoModel.update(Number(id), updatedTask, updatedCompleted, userId);

    if (affectedRows === 0) {
      sendError(res, 'Tugas tidak ditemukan!', 404);
      return;
    }

    const updatedTodo: TodoResponse = {
      id: Number(id),
      task: updatedTask,
      completed: updatedCompleted
    };

    sendSuccess(res, 'Tugas berhasil diperbarui!', updatedTodo);
  } catch (error) {
    sendError(res, 'Gagal memperbarui tugas.');
  }
};

// DELETE /api/todos/:id - Hapus todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const affectedRows = await TodoModel.delete(Number(id), userId);

    if (affectedRows === 0) {
      sendError(res, 'Tugas tidak ditemukan!', 404);
      return;
    }

    sendSuccess(res, 'Tugas berhasil dihapus!');
  } catch (error) {
    sendError(res, 'Gagal menghapus tugas.');
  }
};
