'use client';

import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

interface AuthStatusClientProps {
  initialStatus: {
    isAuthenticated: boolean;
    user: User | null;
  };
}

export function AuthStatusClient({ initialStatus }: AuthStatusClientProps) {
  console.log('initialStatus', initialStatus);
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAuthenticated = user !== null;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Logged in as: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  );
}