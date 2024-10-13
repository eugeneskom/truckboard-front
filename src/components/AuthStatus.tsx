// src/components/AuthStatus.tsx
import { AuthStatusServer } from './AuthStatusServer';
import { AuthStatusClient } from './AuthStatusClient';

export async function AuthStatus() {
  const initialStatus = await AuthStatusServer();

  return <AuthStatusClient initialStatus={initialStatus} />;
}