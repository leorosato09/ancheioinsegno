// src/app/api/user/route.js
import { getToken } from 'next-auth/jwt';
import db from 'lib/db';

export async function GET(request) {
  const token = await getToken({ req: request });

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await db.query('SELECT email, role, created_at FROM users WHERE email = $1', [token.email]);

  if (!result.rows.length) {
    return new Response('Not Found', { status: 404 });
  }

  const userData = result.rows[0];
  userData.created_at = userData.created_at.toISOString();

  return new Response(JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });
}