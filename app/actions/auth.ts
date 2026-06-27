'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function checkUserExists(email: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Error checking user:', error);
      return { success: false, error: 'Database check failed' };
    }

    return { success: true, exists: !!data };
  } catch (err: any) {
    console.error('Unexpected error checking user:', err);
    return { success: false, error: err.message || 'Verification failed' };
  }
}
