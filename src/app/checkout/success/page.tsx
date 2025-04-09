'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // ユーザーがログインしていない場合はホームページにリダイレクト
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    // セッションIDがない場合はエラー
    if (!sessionId) {
      setError('セッションIDが見つかりません。');
      setIsLoading(false);
      return;
    }

    // セッション情報を検証
    const verifySession = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'セッションの検証に失敗しました。');
        }

        // 検証成功
        setIsLoading(false);
      } catch (err: any) {
        console.error('セッション検証エラー:', err);
        setError(err.message || 'セッションの検証中にエラーが発生しました。');
        setIsLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      verifySession();
    }
  }, [sessionId, isLoaded, isSignedIn, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">処理中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-red-600 mb-4">エラーが発生しました</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link 
          href="/pricing"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
        >
          プランページに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
          <svg 
            className="h-10 w-10 text-green-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">ご購入ありがとうございます！</h1>
      
      <p className="text-gray-600 text-center mb-6">
        サブスクリプションの登録が完了しました。ダッシュボードから詳細をご確認いただけます。
      </p>
      
      <div className="flex flex-col space-y-4">
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ダッシュボードへ
        </Link>
        
        <Link 
          href="/"
          className="text-blue-600 text-center px-4 py-2 rounded-md hover:text-blue-800"
        >
          ホームページへ戻る
        </Link>
      </div>
    </div>
  );
}
