// src/app/(authenticated)/layout.tsx
import { getServerSession } from '@/lib/auth';
import { checkRoleAccess } from '@/lib/roleAccess';
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
    return redirect('/login');
  }

  const pathname = headers().get('x-invoke-path') || '';
  const hasAccess = checkRoleAccess(session.role, pathname);

  if (!hasAccess) {
    console.log('User does not have access to this route');
    return redirect('/unauthorized'); // need to reate this page to handle unauthorized access
  }

  console.log('Session valid and user has access, rendering children');
  return <>{children}</>;
}