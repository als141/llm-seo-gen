import { useSession } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase/client';

export function useSupabase() {
  const { session } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSupabase = async () => {
      setLoading(true);
      try {
        const token = session ? await session.getToken() : null;
        const client = createSupabaseClient(token);
        setSupabase(client);
      } catch (error) {
        console.error('Supabase初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSupabase();
  }, [session]);

  return { supabase, loading };
}
