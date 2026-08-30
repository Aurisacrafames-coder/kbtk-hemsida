# Gruppinformation — patch för kbtk-checkin

Hemsidan (`kbtk-hemsida`) hämtar grupptexter från:

```
GET /api/public/signup-groups
→ { "groups": [{ "name", "description", "info" }] }
```

Denna mapp innehåller filer som ska kopieras in i **kbtk-checkin** och deployas tillsammans med en Supabase-migration.

## 1. Supabase

Kör migrationen:

```
supabase/migrations/025_site_signup_groups.sql
```

(Eller klistra in SQL:en i Supabase SQL Editor.)

## 2. Kopiera filer

| Från (denna patch) | Till (kbtk-checkin) |
|---|---|
| `lib/site-signup-groups.ts` | `lib/site-signup-groups.ts` |
| `lib/site-editor-auth.ts` | `lib/site-editor-auth.ts` |
| `app/actions/site-signup-groups.ts` | `app/actions/site-signup-groups.ts` |
| `app/api/public/signup-groups/route.ts` | `app/api/public/signup-groups/route.ts` |
| `components/AdminSignupGroupsPanel.tsx` | `components/AdminSignupGroupsPanel.tsx` |
| `app/signup-groups-admin/page.tsx` | `app/signup-groups-admin/page.tsx` |

Uppdatera `app/actions/site-signup-groups.ts` så att den importerar `requireSiteEditor` från `@/lib/site-editor-auth` i stället för den lokala funktionen (se nedan).

## 3. Integrera i admin (fullständiga administratörer)

### `app/admin/page.tsx`

Ladda grupperna och skicka in i dashboard:

```tsx
import { listSiteSignupGroups } from '@/lib/site-signup-groups';

// I page-komponenten, efter övriga databasanrop:
const signupGroups = await listSiteSignupGroups(supabase);

// Skicka till AdminDashboard:
<AdminDashboard signupGroups={signupGroups} /* …övriga props */ />
```

### `components/AdminDashboard.tsx`

1. Importera panelen:

```tsx
import { AdminSignupGroupsPanel } from '@/components/AdminSignupGroupsPanel';
import type { SiteSignupGroupRow } from '@/lib/site-signup-groups';
```

2. Lägg till prop:

```tsx
signupGroups: SiteSignupGroupRow[];
```

3. Lägg till flik i tab-listan (efter `"aktuellt"`):

```tsx
{ id: 'signup-groups', label: 'Gruppinformation', badge: signupGroups.length },
```

4. Lägg till innehåll:

```tsx
{'signup-groups' === activeTab ? (
  <AdminSignupGroupsPanel groups={signupGroups} />
) : null}
```

## 4. Navigering (nyhetsredaktörer)

I samma fil som bygger nav-länkar (sök efter `/aktuellt-admin`), lägg till en länk för redaktörer:

```tsx
if (roles?.isNewsEditor && !roles.isAdmin) {
  links.push({ href: '/aktuellt-admin', label: 'Aktuellt' });
  links.push({ href: '/signup-groups-admin', label: 'Gruppinformation' });
}
```

## 5. Förenkla server action (valfritt)

Ersätt den privata `requireSiteEditor` i `app/actions/site-signup-groups.ts` med:

```tsx
import { requireSiteEditor } from '@/lib/site-editor-auth';

// I updateSiteSignupGroupAction:
const { supabase } = await requireSiteEditor(await createClient());
```

Ta bort den duplicerade lokala funktionen.

## 6. Deploy

1. Pusha till GitHub
2. Vercel deployar check-in automatiskt
3. Verifiera: `https://kbtk-checkin.vercel.app/api/public/signup-groups`
4. Redigera under **Admin → Gruppinformation** eller `/signup-groups-admin`

## Behörighet

Samma som **Aktuellt**: `is_admin` eller `is_news_editor` på medlemsprofilen.
