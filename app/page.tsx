import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createSupabaseServer();
  const { data } = await (await supabase).auth.getUser();

  if (!data.user) redirect('/auth/login');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {data.user?.email}</h1>
    </div>
  );
}
