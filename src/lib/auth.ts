// src/lib/auth.ts
import { cookies } from 'next/headers';

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/auth/check-auth`, {
      headers: {
        Cookie: `token=${token.value}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.authenticated ? { user: data.user, role: data.user.role } : null;
    }
  } catch (error) {
    console.error('Server session check error:', error);
  }

  return null;
}