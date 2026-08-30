import type { SupabaseClient } from '@supabase/supabase-js';

export type SiteSignupGroupRow = {
  name: string;
  description: string;
  info: string;
  sort_order: number;
  updated_at: string;
};

export type PublicSignupGroup = {
  name: string;
  description: string;
  info: string;
};

export async function listSiteSignupGroups(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('site_signup_groups')
    .select('name, description, info, sort_order, updated_at')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SiteSignupGroupRow[];
}

export function toPublicSignupGroups(rows: SiteSignupGroupRow[]): PublicSignupGroup[] {
  return rows.map((row) => ({
    name: row.name,
    description: row.description,
    info: row.info,
  }));
}

export async function updateSiteSignupGroup(
  supabase: SupabaseClient,
  name: string,
  payload: Pick<SiteSignupGroupRow, 'description' | 'info'>,
) {
  const { error } = await supabase
    .from('site_signup_groups')
    .update({
      description: payload.description.trim(),
      info: payload.info.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('name', name);

  if (error) {
    throw new Error(error.message);
  }
}
