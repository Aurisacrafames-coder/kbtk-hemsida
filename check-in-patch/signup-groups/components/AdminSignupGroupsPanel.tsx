'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateSiteSignupGroupAction,
  type SiteSignupGroupActionState,
} from '@/app/actions/site-signup-groups';
import type { SiteSignupGroupRow } from '@/lib/site-signup-groups';

const idleState: SiteSignupGroupActionState = { status: 'idle', message: '' };

function SignupGroupEditor({ group }: { group: SiteSignupGroupRow }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateSiteSignupGroupAction, idleState);

  useEffect(() => {
    if (state.status === 'success') {
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <article className="rounded-xl border border-lund-border bg-lund-surface p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-medium text-lund-ink">{group.name}</h4>
          {group.updated_at ? (
            <p className="text-sm text-lund-muted">
              Senast uppdaterad{' '}
              {new Date(group.updated_at).toLocaleString('sv-SE', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          ) : null}
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="name" value={group.name} />

        <div>
          <label htmlFor={`${group.name}_description`} className="mb-1 block text-sm font-medium">
            Beskrivning
          </label>
          <textarea
            id={`${group.name}_description`}
            name="description"
            required
            rows={3}
            defaultValue={group.description}
            className="w-full kbtk-input"
          />
          <p className="mt-1 text-xs text-lund-muted">
            Kort text som visas när någon väljer gruppen i formuläret &quot;Börja spela&quot;.
          </p>
        </div>

        <div>
          <label htmlFor={`${group.name}_info`} className="mb-1 block text-sm font-medium">
            Kompletterande information (valfritt)
          </label>
          <textarea
            id={`${group.name}_info`}
            name="info"
            rows={4}
            defaultValue={group.info}
            placeholder="T.ex. träningsdagar, åldersgräns eller vad som händer efter provträning."
            className="w-full kbtk-input"
          />
          <p className="mt-1 text-xs text-lund-muted">
            Visas under beskrivningen på hemsidan när gruppen är vald.
          </p>
        </div>

        {state.status === 'error' ? (
          <p className="text-sm text-red-700">{state.message}</p>
        ) : null}
        {state.status === 'success' ? (
          <p className="text-sm text-green-700">{state.message}</p>
        ) : null}

        <button type="submit" disabled={pending} className="kbtk-btn-primary">
          {pending ? 'Sparar…' : 'Spara ändringar'}
        </button>
      </form>
    </article>
  );
}

export function AdminSignupGroupsPanel({ groups }: { groups: SiteSignupGroupRow[] }) {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-lund-ink">Gruppinformation på hemsidan</h2>
        <p className="max-w-2xl text-sm text-lund-muted">
          Här redigerar styrelsen texterna som visas när någon väljer gruppkategori i formuläret{' '}
          <strong>Börja spela</strong> på klubbens hemsida. Gruppnamnen är låsta — ändra bara
          beskrivning och kompletterande text.
        </p>
      </section>

      <section className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-sm text-lund-muted">
            Inga grupper hittades. Kör migrationen <code>025_site_signup_groups.sql</code> i Supabase.
          </p>
        ) : (
          groups.map((group) => <SignupGroupEditor key={group.name} group={group} />)
        )}
      </section>
    </div>
  );
}
