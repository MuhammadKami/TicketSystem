'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LifeBuoy, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 p-6 dark:bg-gray-950">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LifeBuoy size={22} strokeWidth={1.5} />
        </span>
        <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">TriageAI</span>
      </Link>

      <GlassCard glow className="w-full max-w-[420px] animate-scale-in p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h1>
        <p className="mb-6 mt-1.5 text-sm text-gray-600 dark:text-gray-400">Sign in to your support command center.</p>

        <form className="flex flex-col gap-4" onSubmit={submit}>
          <Field label="Email">
            <Input icon={Mail} type="email" placeholder="you@company.com" defaultValue="agent@triageai.app" />
          </Field>
          <Field label="Password">
            <Input icon={Lock} type="password" placeholder="••••••••" defaultValue="demo1234" />
          </Field>
          <Button variant="primary" type="submit" icon={LogIn} className="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-gray-400 dark:text-gray-500">
          Demo mode — auth is stubbed. Just click <strong className="text-gray-600 dark:text-gray-300">Sign in</strong> to enter the dashboard.
        </p>
      </GlassCard>

      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        Skip to dashboard
        <ArrowRight size={15} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
