// src/app/(authenticated)/layout.tsx
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  headers();
  console.log('Checking session in AuthLayout');
  const session = await getServerSession();
  console.log('Session result:', session);

  if (!session) {
    console.log('No session, redirecting to login');
    redirect('/login');
  }

  console.log('Session valid, rendering children');
  return <>{children}</>;
}