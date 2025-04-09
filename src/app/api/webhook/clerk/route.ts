import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Clerk webhook secretを取得
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRETが設定されていません');
    return new Response('Webhook secret not set', { status: 500 });
  }

  // リクエストの検証
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Svixヘッダーがありません', { status: 400 });
  }

  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // webhookの検証
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt: WebhookEvent;
  
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhookの検証に失敗しました', err);
    return new Response('Webhookの検証に失敗しました', { status: 400 });
  }

  const eventType = evt.type;

  // Supabaseクライアントを作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // イベントタイプに基づいて処理
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    
    // プライマリーメールアドレスを取得
    const emailObject = Array.isArray(email_addresses) && email_addresses.length > 0
      ? email_addresses[0]
      : null;
    
    const email = emailObject ? emailObject.email_address : null;
    const fullName = [first_name, last_name].filter(Boolean).join(' ');
    
    // profilesテーブルに保存するデータ
    const userData = {
      user_id: id,
      email,
      full_name: fullName || null,
      avatar_url: image_url || null,
      updated_at: new Date().toISOString(),
    };

    if (eventType === 'user.created') {
      // ユーザーが新規作成された場合
      const { error } = await supabase
        .from('profiles')
        .insert([{ ...userData, created_at: new Date().toISOString() }]);

      if (error) {
        console.error('プロファイル作成エラー:', error);
        return new Response('プロファイル作成エラー', { status: 500 });
      }
    } else {
      // ユーザー情報が更新された場合
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('user_id', id);

      if (error) {
        console.error('プロファイル更新エラー:', error);
        return new Response('プロファイル更新エラー', { status: 500 });
      }
    }
  } else if (eventType === 'user.deleted') {
    // ユーザーが削除された場合
    const { id } = evt.data;
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', id);

    if (error) {
      console.error('プロファイル削除エラー:', error);
      return new Response('プロファイル削除エラー', { status: 500 });
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
