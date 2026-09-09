import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/LoginForm';
import { AdminSignupGroupsPanel } from '@/components/AdminSignupGroupsPanel';
import { canEditSiteContent } from '@/lib/site-editor-auth';
import { listSiteSignupGroups } from '@/lib/site-signup-groups';

export const metadata = {
  title: 'Gruppinformation · redigera · Kungälvs BTK Check-in',
};

export default async function SignupGroupsAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 items-center bg-lund-bg px-4 py-6 safe-px safe-pb">
        <div className="kbtk-card w-full">
          <p className="text-sm font-medium text-lund-primary">Kungälvs Bordtennisklubb</p>
          <h1 className="mt-1 text-2xl font-bold text-lund-ink">Gruppinformation · Kungälvs BTK</h1>
          <p className="mt-3 text-sm text-lund-muted">
            Logga in med e-postadressen på din medlemsprofil för att redigera grupptexterna på
            klubbens hemsida.
          </p>
          <LoginForm next="/signup-groups-admin" />
          <Link href="/" className="mt-5 inline-flex text-sm text-lund-primary hover:underline">
            Till startsidan
          </Link>
        </div>
      </main>
    );
  }

  const allowed = await canEditSiteContent(supabase);
  if (!allowed) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 items-center bg-lund-bg px-4 py-6 safe-px safe-pb">
        <div className="kbtk-card w-full">
          <h1 className="text-2xl font-bold text-lund-ink">Ingen behörighet</h1>
          <p className="mt-3 text-sm text-lund-muted">
            Du saknar behörighet att redigera gruppinformation på hemsidan. Be en administratör
            kryssa i &quot;Nyhetsredaktör&quot; på din medlemsprofil.
          </p>
          <Link href="/" className="mt-5 inline-flex text-sm text-lund-primary hover:underline">
            Till startsidan
          </Link>
        </div>
      </main>
    );
  }

  const groups = await listSiteSignupGroups(supabase);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 bg-lund-bg px-4 py-6 safe-px safe-pb sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-lund-primary">Kungälvs Bordtennisklubb</p>
        <h1 className="mt-1 text-2xl font-bold text-lund-ink">Gruppinformation · Kungälvs BTK</h1>
        <p className="mt-2 text-sm text-lund-muted">
          Texterna visas på hemsidans formulär <strong>Börja spela</strong>.
        </p>
      </div>
      <AdminSignupGroupsPanel groups={groups} />
      <Link href="/admin" className="mt-8 inline-flex text-sm text-lund-primary hover:underline">
        Till admin
      </Link>
    </main>
  );
}
