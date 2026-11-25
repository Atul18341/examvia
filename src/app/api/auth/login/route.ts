// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

// 🔒 SECURITY: Enforce strict environment check for JWT secret in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
}
const effectiveSecret = JWT_SECRET || 'your-super-secure-jwt-secret-key';

// Pre-computed dummy hash for constant-time comparison (prevents timing attacks / user enumeration)
const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$R01vcmVzdW1lcmlzdGFyZ29uMnBhc3N3b3Jk';

export async function POST(request: Request) {
  let dbClient;

  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'email and password parameters are strictly required.' },
        { status: 400 }
      );
    }

    const cleanemail = String(email).trim().toLowerCase();

    dbClient = await pool.connect();
    if (!dbClient) throw new Error('Failed to acquire database connection.');

    // 🔒 SECURITY: PostgreSQL-Native Rate Limiting for Login (Prevents Brute-Force Attacks)
    const windowSizeMs = 60 * 1000; // 60 seconds
    const maxLoginAttempts = 5; // Max 5 login attempts per minute per email
    const now = Date.now();
    const windowStartThreshold = now - windowSizeMs;

    const rateLimitQuery = `
      INSERT INTO api_rate_limits (identifier, request_count, window_start)
      VALUES ($1, 1, $2)
      ON CONFLICT (identifier) DO UPDATE
      SET 
        request_count = CASE 
          WHEN api_rate_limits.window_start < $3 THEN 1 
          ELSE api_rate_limits.request_count + 1 
        END,
        window_start = CASE 
          WHEN api_rate_limits.window_start < $3 THEN $2 
          ELSE api_rate_limits.window_start 
        END
      RETURNING request_count;
    `;

    const rateLimitResult = await dbClient.query(rateLimitQuery, [`login_${cleanemail}`, now, windowStartThreshold]);
    const currentCount = rateLimitResult.rows[0]?.request_count || 1;

    if (currentCount > maxLoginAttempts) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again after 1 minute.' },
        { status: 429 }
      );
    }

    // 1. Fetch the user profile securely via parameterized query against SQL injection
    const userQuery = `
      SELECT id, email, name, password, role 
      FROM users 
      WHERE LOWER(email) = $1 
      LIMIT 1;
    `;
    const userResult = await dbClient.query(userQuery, [cleanemail]);

    let isValidPassword = false;

    if (userResult.rows.length === 0) {
      // 🔒 SECURITY: Perform dummy verification to maintain constant execution time (mitigates timing attacks)
      await argon2.verify(DUMMY_HASH, password).catch(() => {});
      return NextResponse.json(
        { success: false, message: 'Clearance rejected. Invalid operational email or password.' },
        { status: 401 }
      );
    }

    const dbUser = userResult.rows[0];

    // 2. Cryptographic password verification pass using Argon2id
    try {
      isValidPassword = await argon2.verify(dbUser.password, password);
    } catch (err) {
      console.error('❌ Argon2 verification error:', err);
      isValidPassword = false;
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Clearance rejected. Invalid operational email or password.' },
        { status: 401 }
      );
    }

    // 3. Gather all event assignments associated with this operator via junction table
    let assignedEvents: number[] = [];
    let initialActiveEventId = 0;

    const linksQuery = `
      SELECT event_id 
      FROM manager_events 
      WHERE LOWER(manager_identifier) = LOWER($1)
      ORDER BY assigned_at DESC;
    `;
    const linksResult = await dbClient.query(linksQuery, [cleanemail]);
    assignedEvents = linksResult.rows.map(row => Number(row.event_id));
    
    if (assignedEvents.length > 0) {
      initialActiveEventId = assignedEvents[0];
    }

    // 4. Generate a cryptographically signed JSON Web Token (JWT)
    const tokenPayload = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
     
    };

    const sessionToken = jwt.sign(tokenPayload, effectiveSecret, { expiresIn: '12h' });

    // 5. Securely set HTTP-only cookie to safeguard against XSS token theft
    const cookieStore = await cookies();
    cookieStore.set('examvia_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 3 // 3 days
    });

    // 6. Return structured clearance package (Token removed from JSON body to enforce HTTP-only cookie security)
    return NextResponse.json({
      success: true,
      message: 'Secure terminal clearance handshake complete.',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        assignedEventId: initialActiveEventId || 0,
        allAssignedEvents: assignedEvents
      }
    });

  } catch (error: any) {
    console.error('❌ Authentication route server error:', error?.message);
    // Suppress sensitive internal error logs from reaching clients
    return NextResponse.json(
      { success: false, message: 'Internal gateway verification error.' },
      { status: 500 }
    );
  } finally {
    if (dbClient) dbClient.release();
  }
}