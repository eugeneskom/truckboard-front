'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/check-auth`, { withCredentials: true });
        if (response.data.authenticated) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsLoading(false);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to your dashboard, {user?.username || 'User'}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}