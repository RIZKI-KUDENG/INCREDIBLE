'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Sidebar() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userRole = docSnap.data()?.role;
      setRole(userRole);
    };
    fetchRole();
  }, []);

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-6">Incredible Moment</h1>
      <nav className="flex flex-col space-y-3">
        <Link href="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link>
        <Link href="/transaksi" className="hover:text-teal-400 transition-colors">Transaksi</Link>
        {role === 'admin' && (
          <Link href="/produk" className="hover:text-teal-400 transition-colors">Produk</Link>
        )}
        <Link href="/pelanggan" className="hover:text-teal-400 transition-colors">Pelanggan</Link>
        {role === 'admin' && (
          <Link href="/laporan" className="hover:text-teal-400 transition-colors">Laporan</Link>
        )}
      </nav>
    </aside>
  );
}
