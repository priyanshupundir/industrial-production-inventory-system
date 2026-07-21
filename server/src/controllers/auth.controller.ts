import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_industrial_2026';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshkey_industrial_2026';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    // Log login audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        metadata: JSON.stringify({ ip: req.ip, userAgent: req.get('user-agent') })
      }
    });

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department ? user.department.name : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
        department: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    jwt.verify(token, REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Refresh token verification failed' });
  }
};
