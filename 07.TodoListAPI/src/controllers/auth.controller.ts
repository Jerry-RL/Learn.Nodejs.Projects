import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../services/user.service';
import { signToken } from '../utils/jwt';
import { registerUserSchema, loginUserSchema } from '../schemas/user.schema';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = await createUser({ name, email, password });
    const token = signToken({ userId: newUser.id });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', details: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user.id });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', details: error });
  }
}; 