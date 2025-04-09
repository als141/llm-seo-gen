'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/use-supabase';

interface Price {
  id: string;
  product_id: string;
  active: boolean;
  description: string;
  unit_amount: number;
  currency: string;
  type: string;
  interval: string;
  interval_count: number;
  trial_period_days: number | null;
  product: {
    name: string;
    description: string | null;
  };
}

export default function PricingPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, loading: supabaseLoading } = useSupabase();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchPrices = async () => {
      if (!supabase || supabaseLoading) return;

      try {
        setIsLoading(true);
        
        // 価格情報を取得（アクティブなもののみ）
        const { data, error } = await supabase
          .from('prices')
          .select(`
            *,
            product:product_id (
              name,
              description
            )
          `)
          .eq('active', true)
          .order('unit_amount', { ascending: true });

        if (error) {
          throw error;
        }

        setPrices(data as Price[]);
      } catch (error) {
        console.error('価格情報取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, [supabase, supabaseLoading]);

  const handleSubscribe = async (priceId: string) => {
    if (!isLoaded || !isSignedIn) {
      // 未ログインの場合はログインページにリダイレクト
      return router.push('/auth/sign-in?redirect_url=/pricing');
    }

    try {
      // サーバーにチェックアウトセッション作成をリクエスト
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        // Stripe Checkoutページにリダイレクト
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('チェックアウトエラー:', error);
    }
  };

  if (isLoading || supabaseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          料金プラン
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          あなたのニーズに合わせたシンプルな料金体系
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
        {prices.length > 0 ? (
          prices.map((price) => (
            <div 
              key={price.id} 
              className="rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                <div>
                  <h3 
                    className="text-xl font-semibold text-gray-900"
                  >
                    {price.product.name}
                  </h3>
                  {price.description && (
                    <p className="mt-2 text-gray-500">{price.description}</p>
                  )}
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: price.currency,
                        minimumFractionDigits: 0,
                      }).format(price.unit_amount / 100)}
                    </span>
                    {price.interval && (
                      <span className="text-base font-medium text-gray-500">
                        /{price.interval}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                {price.product.description && (
                  <ul className="mt-4 space-y-4">
                    {price.product.description.split('、').map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg 
                            className="h-6 w-6 text-green-500" 
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
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 rounded-md shadow">
                  <button
                    type="button"
                    onClick={() => handleSubscribe(price.id)}
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isSignedIn ? '今すぐ登録' : 'サインインして登録'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <p className="text-lg text-gray-600">
              現在、利用可能なプランがありません。後ほどお試しください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
