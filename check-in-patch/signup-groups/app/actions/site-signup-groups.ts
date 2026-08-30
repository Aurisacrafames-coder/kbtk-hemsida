'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireSiteEditor } from '@/lib/site-editor-auth';
import { updateSiteSignupGroup } from '@/lib/site-signup-groups';

export type SiteSignupGroupActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

const idleState: SiteSignupGroupActionState = { status: 'idle', message: '' };

export async function updateSiteSignupGroupAction(
  _prev: SiteSignupGroupActionState,
  formData: FormData,
): Promise<SiteSignupGroupActionState> {
  try {
    const supabase = await createClient();
    await requireSiteEditor(supabase);

    const name = String(formData.get('name') ?? '').trim();
    const description = String(formData.get('description') ?? '');
    const info = String(formData.get('info') ?? '');

    if (!name) {
      return { status: 'error', message: 'Gruppnamn saknas.' };
    }

    await updateSiteSignupGroup(supabase, name, { description, info });

    revalidatePath('/signup-groups-admin');
    revalidatePath('/admin');
    revalidatePath('/api/public/signup-groups');

    return { status: 'success', message: `Sparade information för ${name}.` };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Kunde inte spara gruppinformation.',
    };
  }
}

export async function getInitialSiteSignupGroupActionState() {
  return idleState;
}
