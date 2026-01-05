import LogoutButton from '@/components/LogoutButton';
import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createSupabaseServer();
  const { data } = await (await supabase).auth.getUser();

  if (!data.user) redirect('/auth/login');

  return (
    <div className="p-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome {data.user?.email}</h1>
      <LogoutButton />
    </div>
  );
}
