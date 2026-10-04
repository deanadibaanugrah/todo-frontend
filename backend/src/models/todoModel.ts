import pool from '../config/db.js';
import type { TodoRow } from '../types/todo';

export const TodoModel = {
  getByUserId: async (userId: number, limit: number = 10, offset: number = 0): Promise<TodoRow[]> => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE user_id = ? LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows as TodoRow[];
  },

  countByUserId: async (userId: number): Promise<number> => {
    const [rows]: any = await pool.query(
      'SELECT COUNT(*) as total FROM todos WHERE user_id = ?',
      [userId]
    );
    return rows[0]?.total ?? 0;
  },

  // Ambil satu todo berdasarkan id dan userId
  getById: async (id: number, userId: number): Promise<TodoRow | undefined> => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0]; // Kembalikan 1 data, atau undefined jika tidak ditemukan
  },

  create: async (userId: number, task: string): Promise<number> => {
    const [result]: any = await pool.query(
      'INSERT INTO todos (user_id, task) VALUES (?, ?)',
      [userId, task]
    );
    return result.insertId;
  },

  // Update task atau status is_completed
  update: async (id: number, task: string | undefined, isCompleted: boolean | undefined, userId: number): Promise<number> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (task !== undefined) {
      fields.push('task = ?');
      values.push(task);
    }

    if (isCompleted !== undefined) {
      fields.push('is_completed = ?');
      values.push(isCompleted);
    }

    if (fields.length === 0) return 0;

    values.push(id, userId);

    const [result]: any = await pool.query(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return result.affectedRows;
  },

  // Hapus todo berdasarkan id dan userId
  delete: async (id: number, userId: number): Promise<number> => {
    const [result]: any = await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  }
};
