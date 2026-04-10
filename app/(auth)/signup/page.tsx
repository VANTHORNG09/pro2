'use client';

import { useAuth } from '@/hooks/useAuth';
import { SignupForm } from './form';

export default function SignupPage() {
  const { signup, isLoading } = useAuth();

  const handleSignup = async (data: Parameters<typeof signup>[0]) => {
    await signup(data);
  };

  return <SignupForm onSubmit={handleSignup} isLoading={isLoading} />;
}
