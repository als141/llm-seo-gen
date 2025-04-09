import { stripe } from '@/lib/stripe/client';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set');
    }
    
    // Stripeイベントを検証
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhookエラー: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Supabaseクライアントを初期化
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // イベントタイプによって処理を分岐
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event, supabase);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeletion(event, supabase);
        break;
        
      case 'product.created':
      case 'product.updated':
        await handleProductChange(event, supabase);
        break;
        
      case 'price.created':
      case 'price.updated':
        await handlePriceChange(event, supabase);
        break;
        
      default:
        console.log(`未処理のイベント: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Webhookの処理中にエラーが発生しました:', error);
    return new Response('Webhookの処理中にエラーが発生しました', { status: 500 });
  }
}

// サブスクリプション変更処理
async function handleSubscriptionChange(event: any, supabase: any) {
  const subscription = event.data.object;
  
  // Stripeカスタマーからユーザーを取得
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (customerError || !customerData) {
    console.error('顧客情報取得エラー:', customerError);
    throw new Error('顧客情報が見つかりません');
  }

  const userId = customerData.user_id;

  // サブスクリプション情報を更新または作成
  const subscriptionData = {
    user_id: userId,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    created_at: new Date(subscription.created * 1000).toISOString(),
    ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    stripe_subscription_id: subscription.id,
  };

  // 既存のサブスクリプションを確認
  const { data: existingSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
    console.error('サブスクリプション取得エラー:', fetchError);
    throw new Error('サブスクリプション情報の取得に失敗しました');
  }

  if (existingSubscription) {
    // 既存のサブスクリプションを更新
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', existingSubscription.id);

    if (updateError) {
      console.error('サブスクリプション更新エラー:', updateError);
      throw new Error('サブスクリプションの更新に失敗しました');
    }
  } else {
    // 新しいサブスクリプションを作成
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert([subscriptionData]);

    if (insertError) {
      console.error('サブスクリプション作成エラー:', insertError);
      throw new Error('サブスクリプションの作成に失敗しました');
    }
  }
}

// サブスクリプション削除処理
async function handleSubscriptionDeletion(event: any, supabase: any) {
  const subscription = event.data.object;
  
  // サブスクリプション情報を更新
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      ended_at: new Date(subscription.ended_at * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('サブスクリプション削除エラー:', error);
    throw new Error('サブスクリプションの削除に失敗しました');
  }
}

// 製品情報変更処理
async function handleProductChange(event: any, supabase: any) {
  const product = event.data.object;
  
  // プロダクト情報をフォーマット
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description || null,
    image: product.images?.[0] || null,
    metadata: product.metadata,
  };

  // 製品情報の確認と更新
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('id', product.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('製品情報取得エラー:', error);
    throw new Error('製品情報の取得に失敗しました');
  }

  // 挿入または更新
  if (data) {
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', product.id);

    if (updateError) {
      console.error('製品情報更新エラー:', updateError);
      throw new Error('製品情報の更新に失敗しました');
    }
  } else {
    const { error: insertError } = await supabase
      .from('products')
      .insert([productData]);

    if (insertError) {
      console.error('製品情報作成エラー:', insertError);
      throw new Error('製品情報の作成に失敗しました');
    }
  }
}

// 価格情報変更処理
async function handlePriceChange(event: any, supabase: any) {
  const price = event.data.object;
  
  // 価格情報をフォーマット
  const priceData = {
    id: price.id,
    product_id: price.product,
    active: price.active,
    description: price.nickname || null,
    unit_amount: price.unit_amount || 0,
    currency: price.currency,
    type: price.type,
    interval: price.recurring?.interval || null,
    interval_count: price.recurring?.interval_count || null,
    trial_period_days: price.recurring?.trial_period_days || null,
    metadata: price.metadata,
  };

  // 価格情報の確認と更新
  const { data, error } = await supabase
    .from('prices')
    .select('id')
    .eq('id', price.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('価格情報取得エラー:', error);
    throw new Error('価格情報の取得に失敗しました');
  }

  // 挿入または更新
  if (data) {
    const { error: updateError } = await supabase
      .from('prices')
      .update(priceData)
      .eq('id', price.id);

    if (updateError) {
      console.error('価格情報更新エラー:', updateError);
      throw new Error('価格情報の更新に失敗しました');
    }
  } else {
    const { error: insertError } = await supabase
      .from('prices')
      .insert([priceData]);

    if (insertError) {
      console.error('価格情報作成エラー:', insertError);
      throw new Error('価格情報の作成に失敗しました');
    }
  }
}
