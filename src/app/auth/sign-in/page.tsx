import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'サインイン',
  description: 'アカウントにサインインする',
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            または{' '}
            <a href="/auth/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録
            </a>
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}

