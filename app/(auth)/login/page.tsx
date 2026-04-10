'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './form';

export default function LoginPage() {
  const { demoLogin, isLoading } = useAuth();

  const handleLogin = async (role: Parameters<typeof demoLogin>[0]) => {
    await demoLogin(role);
  };

  return <LoginForm onLogin={handleLogin} isLoading={isLoading} />;
}
