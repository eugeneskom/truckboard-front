// src/lib/auth.ts
import { cookies } from 'next/headers';

export async function getServerSession() {
  const cookieStore = cookies();
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
      return data.authenticated ? data.user : null;
    }
  } catch (error) {
    console.error('Server session check error:', error);
  }

  return null;
}