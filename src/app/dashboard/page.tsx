'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSupabase } from '@/hooks/use-supabase';
import Link from 'next/link';

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  price: {
    id: string;
    product: {
      name: string;
    };
    unit_amount: number;
    currency: string;
    interval: string;
  };
}

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, loading: supabaseLoading } = useSupabase();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!isLoaded || !isSignedIn || !supabase || supabaseLoading) return;

      try {
        setIsLoading(true);
        
        // サブスクリプション情報を取得
        const { data, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            price:price_id (
              *,
              product:product_id (
                *
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          console.error('サブスクリプション取得エラー:', error);
        } else {
          setSubscription(data as Subscription);
        }
      } catch (error) {
        console.error('サブスクリプション取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [isLoaded, isSignedIn, supabase, supabaseLoading, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading || supabaseLoading || !isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">ログインが必要です</h1>
        <p className="text-gray-700 mb-6 text-center">
          ダッシュボードにアクセスするにはログインしてください。
        </p>
        <div className="flex justify-center">
          <Link 
            href="/auth/sign-in"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-2 text-lg text-gray-600">アカウント情報と現在のサブスクリプション状況</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">アカウント情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">メールアドレス</p>
            <p className="font-medium">{user.emailAddresses[0].emailAddress}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">名前</p>
            <p className="font-medium">
              {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">サブスクリプション</h2>
        
        {subscription ? (
          <div>
            <div className="mb-6 p-4 border border-green-200 rounded-md bg-green-50">
              <div className="flex items-center">
                <svg 
                  className="h-5 w-5 text-green-500 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="font-medium text-green-800">アクティブなサブスクリプション</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">プラン</p>
                <p className="font-medium">{subscription.price?.product?.name || 'プラン情報なし'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ステータス</p>
                <p className="font-medium capitalize">{subscription.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">料金</p>
                <p className="font-medium">
                  {subscription.price ? (
                    <>
                      {new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: subscription.price.currency,
                        minimumFractionDigits: 0,
                      }).format(subscription.price.unit_amount / 100)}
                      /{subscription.price.interval}
                    </>
                  ) : (
                    '料金情報なし'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">次回請求日</p>
                <p className="font-medium">
                  {subscription.current_period_end ? 
                    formatDate(subscription.current_period_end) : 
                    '情報なし'
                  }
                </p>
              </div>
            </div>
            
            <div className="mt-8 space-x-4">
              <Link 
                href="/api/portal" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                サブスクリプション管理
              </Link>
              <Link 
                href="/support" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                サポートに問い合わせ
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              アクティブなサブスクリプションがありません
            </h3>
            <p className="mt-1 text-gray-500">
              サービスの全機能を利用するにはサブスクリプションに登録してください。
            </p>
            <div className="mt-6">
              <Link 
                href="/pricing" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                プランを見る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
