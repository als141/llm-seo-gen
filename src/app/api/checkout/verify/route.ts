import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    // セッションIDをURLパラメータから取得
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'セッションIDが必要です' },
        { status: 400 }
      );
    }

    // 現在のユーザーを取得
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'セッションが見つかりません' },
        { status: 404 }
      );
    }

    // セッションのメタデータからユーザーIDを確認
    if (session.metadata?.userId !== user.id) {
      return NextResponse.json(
        { error: 'このセッションにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    // サブスクリプションIDがあれば取得
    const subscriptionId = session.subscription as string;
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'サブスクリプションが見つかりません' },
        { status: 404 }
      );
    }

    // Supabaseクライアントを初期化
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // サブスクリプション情報を確認
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subscriptionError) {
      console.error('サブスクリプション情報取得エラー:', subscriptionError);
      return NextResponse.json(
        { error: 'サブスクリプション情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 検証成功
    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('チェックアウトセッション検証エラー:', error);
    return NextResponse.json(
      { error: error.message || 'チェックアウトセッションの検証に失敗しました' },
      { status: 500 }
    );
  }
}
