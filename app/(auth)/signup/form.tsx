// app/(auth)/signup/form.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signupSchema, type SignupFormData } from './schema';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading?: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  const handleFormSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      setServerError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AssignBridge
        </h1>
        <p className="text-muted-foreground mt-2">Create your account to get started</p>
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-2xl">
        {serverError && (
          <Alert className="mb-6 bg-red-500/10 border-red-500 text-red-500">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <FormInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <FormInput
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">I am a</label>
            <div className="grid grid-cols-3 gap-3">
              {(['student', 'teacher', 'admin'] as const).map((role) => (
                <label
                  key={role}
                  className={`relative flex cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                    selectedRole === role
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input type="radio" value={role} className="sr-only" {...register('role')} />
                  <div className="w-full">
                    <Briefcase className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium capitalize">{role}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full glass-button bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-2 gap-4">
          <button className="glass-button px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /></svg>
            <span>Google</span>
          </button>
          <button className="glass-button px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" /></svg>
            <span>Facebook</span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
