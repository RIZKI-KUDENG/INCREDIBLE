'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/'); // redirect ke halaman login
      } else {
        setLoading(false); // user terautentikasi
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="p-4 text-center">Memuat...</div>;
  }

  return <>{children}</>;
}
