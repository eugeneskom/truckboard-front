// src/components/AuthStatus.tsx
import { getServerSession } from '@/lib/auth';

export async function AuthStatusServer() {
  const user = await getServerSession();
  return { isAuthenticated: !!user, user };
}