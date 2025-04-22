// app/page.tsx (redirect ke /login)

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
