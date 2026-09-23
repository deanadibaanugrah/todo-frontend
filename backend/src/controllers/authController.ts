import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import type { RegisterRequest, LoginRequest, JwtUserPayload } from '../types/auth';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: RegisterRequest = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(username, email, hashedPassword);
    sendSuccess(res, 'Registrasi berhasil!', undefined, 201);
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      sendError(res, 'Username atau Email sudah terdaftar!', 409);
      return;
    }
    sendError(res, 'Error server.', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginRequest = req.body;
  try {
    const user = await UserModel.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      sendError(res, 'Username atau password salah!', 401);
      return;
    }

    const payload: JwtUserPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '2h' });
    sendSuccess(res, 'Login berhasil!', { token });
  } catch (error) {
    sendError(res, 'Error server.', 500);
  }
};
