import type { SupabaseClient } from '@supabase/supabase-js';

export async function requireSiteEditor(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    throw new Error('Du måste vara inloggad.');
  }

  const { data: person, error: personError } = await supabase
    .from('persons')
    .select('is_admin, is_news_editor')
    .eq('email', user.email)
    .maybeSingle();

  if (personError) {
    throw new Error(personError.message);
  }

  if (!person?.is_admin && !person?.is_news_editor) {
    throw new Error('Du saknar behörighet att redigera hemsidans innehåll.');
  }

  return { supabase, user, person };
}

export async function canEditSiteContent(supabase: SupabaseClient): Promise<boolean> {
  try {
    await requireSiteEditor(supabase);
    return true;
  } catch {
    return false;
  }
}
