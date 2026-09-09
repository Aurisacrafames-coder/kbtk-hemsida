-- Gruppinformation för anmälan "Börja spela" på hemsidan.
-- Redigeras i check-in under Admin → Gruppinformation /signup-groups-admin.

create table if not exists public.site_signup_groups (
  name text primary key,
  description text not null default '',
  info text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_signup_groups (name, description, sort_order)
values
  (
    'Nybörjare 7-10 år',
    'Pingisskola för yngre barn. Lek, grundteknik och en rolig introduktion till bordtennis.',
    10
  ),
  (
    'Nybörjare 11-14 år',
    'För dig som är ny eller nästan ny i tonåren. Fokus på grundteknik och spel i lagom gruppstorlek.',
    20
  ),
  (
    'Parasport 360',
    'Träning för dig med funktionsvariation. Klubben hjälper dig till rätt grupp och upplägg efter provträning.',
    30
  ),
  (
    'Motionärer',
    'Vuxna, motionärer och pensionärer som vill spela regelbundet.',
    40
  ),
  (
    'Föräldramedlemskap',
    'Tilläggsmedlemskap för föräldrar till barn i klubben — 350 kr/säsong utöver barnets avgift, utan egen träningstid.',
    50
  ),
  (
    'Övriga spelare',
    'Om du redan spelat mer eller ska placeras i seriegrupp (t.ex. C–A). Klubben hjälper dig efter provträning.',
    60
  )
on conflict (name) do nothing;

alter table public.site_signup_groups enable row level security;

create policy "Public can read signup group info"
  on public.site_signup_groups
  for select
  using (true);
