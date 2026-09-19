-- Déesse store database schema
-- Run this in Supabase: Dashboard > SQL Editor > New query, paste, Run.
-- All application reads/writes go through the Vercel API (service role),
-- so the anon key is only used for optional public reads.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null default 'Skincare',
  price numeric not null default 0,
  compare_at_price numeric,
  image text not null default '',
  images jsonb not null default '[]'::jsonb,
  tagline text not null default '',
  description text not null default '',
  rating numeric not null default 0,
  reviews integer not null default 0,
  shades jsonb,
  tags jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  sku text,
  status text not null default 'Active',
  featured boolean not null default false,
  link_preview_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products are publicly readable"
  on public.products for select
  using (true);

-- ---------------------------------------------------------------------------
-- Categories (storefront uses lowercase names)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  name text primary key,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories are publicly readable"
  on public.categories for select
  using (true);

-- ---------------------------------------------------------------------------
-- Settings (single global row)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key text primary key default 'global',
  link_preview_title text not null default 'déesse | Luxury Beauty, Skincare & Fragrance',
  link_preview_description text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings are publicly readable"
  on public.settings for select
  using (true);

-- ---------------------------------------------------------------------------
-- Orders (mirrors StoreOrder; id is the human order number like #DS-1234)
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key,
  customer text not null,
  email text not null,
  items integer not null default 0,
  total numeric not null default 0,
  status text not null default 'Paid',
  date text not null,
  channel text not null default 'Storefront',
  line_items jsonb not null default '[]'::jsonb,
  shipping_address text not null default '',
  payment_id text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- ---------------------------------------------------------------------------
-- Subscribers (newsletter)
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text not null default 'newsletter',
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed the settings row so catalog reads always have a value
-- ---------------------------------------------------------------------------
insert into public.settings (key, link_preview_title, link_preview_description)
values (
  'global',
  'déesse | Luxury Beauty, Skincare & Fragrance',
  'déesse is a luxury beauty maison offering high-end cosmetics, radiant skincare, and rare fragrances. Experience cinematic elegance, refined formulas, and indulgent rituals crafted for modern icons.'
)
on conflict (key) do nothing;