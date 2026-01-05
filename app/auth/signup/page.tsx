'use client';

import { supabase } from '@/lib/supabase/client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const validate = () => {
    if (!form.username || form.username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!form.email.includes('@')) {
      return 'Please enter a valid email';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user?.id,
        username: form.username,
      });

      if (profileError) throw profileError;

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        placeholder="Username"
        className="input"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Email"
        className="input"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        className="input"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        disabled={loading}
        className="btn-primary w-full"
        onClick={handleSignup}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
      <button
        className="btn-primary w-full"
        onClick={() => {
          router.push('/auth/login');
        }}
      >
        Login
      </button>
    </div>
  );
};

export default SignUp;
