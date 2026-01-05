'use client';

import { supabase } from '@/lib/supabase/client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const validate = () => {
    if (!email.includes('@')) {
      return 'Enter a valid email';
    }
    if (password.trim().length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return alert(error.message);

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={loading}
        className="btn-primary w-full"
        onClick={handleLogin}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button
        className="btn-primary w-full"
        onClick={() => {
          router.push('/auth/signup');
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Login;
