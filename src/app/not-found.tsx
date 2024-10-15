'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Loading from '@/components/loading/loading';

export default function NotFound(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a specific route, e.g., '/home'
    router.replace('/'); // Change '/home' to your desired route
  }, [router]);
  return <Loading />;
}
