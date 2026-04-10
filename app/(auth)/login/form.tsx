// app/(auth)/login/form.tsx
'use client';

import { useState } from 'react';
import { Shield, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Role = 'admin' | 'teacher' | 'student';

const roles: { role: Role; label: string; icon: React.ReactNode; description: string }[] = [
  { role: 'admin', label: 'Admin', icon: <Shield className="h-10 w-10" />, description: 'Manage users, courses & settings' },
  { role: 'teacher', label: 'Teacher', icon: <Users className="h-10 w-10" />, description: 'Create & review assignments' },
  { role: 'student', label: 'Student', icon: <GraduationCap className="h-10 w-10" />, description: 'Submit work & track grades' },
];

interface LoginFormProps {
  onLogin: (role: Role) => void;
  isLoading?: boolean;
}

export function LoginForm({ onLogin, isLoading }: LoginFormProps) {
  const [selected, setSelected] = useState<Role>('student');

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AssignBridge
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">Choose your role to continue</p>
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-2xl">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {roles.map(({ role, label, icon, description }) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                selected === role
                  ? 'border-primary bg-primary/15 text-primary shadow-xl scale-105 ring-2 ring-primary/20'
                  : 'border-border bg-white/5 text-muted-foreground hover:border-primary/40 hover:bg-white/10'
              }`}
              title={description}
            >
              {icon}
              <span className="text-sm font-bold">{label}</span>
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => onLogin(selected)}
          disabled={isLoading}
          className="w-full py-6 text-lg font-bold rounded-xl"
        >
          {isLoading ? 'Continuing...' : `Continue as ${roles.find((r) => r.role === selected)?.label}`}
        </Button>
      </div>
    </div>
  );
}
