import { getServerSession } from '@/lib/auth';

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <div>
      <h1>Welcome to your dashboard, {session?.user.username || 'User'}!</h1>
      <p>Email: {session?.user.email}</p>
    </div>
  );
}