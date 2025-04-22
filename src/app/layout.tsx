'use client';

import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isLoginPage = pathname === '/login'; // <- Deteksi halaman login

  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        {!isLoginPage && (
          <>
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex justify-between items-center">
              <div className="text-xl font-bold">Kasir App</div>
              <div className="md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-600 dark:text-white focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {menuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <div className="hidden md:flex gap-6 items-center">
                <Link href="/transaksi" className="hover:text-blue-500">
                  Transaksi
                </Link>
                <Link href="/dashboard" className="hover:text-blue-500">
                  Dashboard
                </Link>
                <Link href="/produk" className="hover:text-blue-500">
                  Produk
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-2 space-y-2 shadow-md">
                <Link href="/transaksi" className="block hover:text-blue-500" onClick={() => setMenuOpen(false)}>
                  Transaksi
                </Link>
                <Link href="/dashboard" className="block hover:text-blue-500" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/produk" className="block hover:text-blue-500" onClick={() => setMenuOpen(false)}>
                  Produk
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
