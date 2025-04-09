import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // リクエストボディからpriceIdを取得
    const { priceId } = await req.json();

    // 現在のユーザーを取得
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '認証されていません' },
        { status: 401 }
      );
    }

    // Supabaseクライアントを初期化
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ユーザーのStripe顧客IDを取得
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let stripeCustomerId: string;

    if (customerError || !customer?.stripe_customer_id) {
      // 顧客が存在しない場合は新規作成
      const stripeCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim() || undefined,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = stripeCustomer.id;

      // Supabaseに顧客情報を保存
      await supabase.from('customers').insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
      });
    } else {
      stripeCustomerId = customer.stripe_customer_id;
    }

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('チェックアウトセッション作成エラー:', error);
    return NextResponse.json(
      { error: error.message || 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    );
  }
}
