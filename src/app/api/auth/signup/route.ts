// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
}
const effectiveSecret = JWT_SECRET || 'your-super-secure-jwt-secret-key';

const globalForPg = global as unknown as { authPgPool?: Pool };
const pool =
  globalForPg.authPgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.authPgPool = pool;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = body.email ?? body.identifier;
    const { name, password, role } = body;

    if (!name || !rawEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password parameters are strictly required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(rawEmail).trim().toLowerCase();
    const cleanName = String(name).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format provided.' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [cleanEmail]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    const allowedRoles = ['student', 'coordinator', 'admin'];
    const assignedRole = allowedRoles.includes(role) ? role : 'admin';

    let hashedPassword: string;
    try {
      hashedPassword = await argon2.hash(String(password));
    } catch (hashErr) {
      console.error('Argon2 hashing error during signup:', hashErr);
      return NextResponse.json(
        { success: false, message: 'Internal security processing error.' },
        { status: 500 }
      );
    }

    const userId = crypto.randomUUID();
    const insertResult = await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, name, email, role`,
      [userId, cleanName, cleanEmail, hashedPassword, assignedRole]
    );

    const newUser = insertResult.rows[0];

    const tokenPayload = {
      userId: newUser.id,
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(tokenPayload, effectiveSecret, { expiresIn: '7d' });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // Store JWT in HttpOnly cookie so XSS scripts cannot read it
    response.cookies.set('examvia_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Signup route server error:', error?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}