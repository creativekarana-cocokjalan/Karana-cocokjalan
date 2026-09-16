-- ============================================================================
-- KARANA CMS — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor
-- → New query → paste this whole file → Run). Safe to re-run: uses
-- "if not exists" / "on conflict do nothing" everywhere it matters.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. SECTIONS  — singleton content blocks (hero, intro, about, moment,
--    contact, site/nav). One row per section id, flexible JSONB payload so
--    new fields can be added later without a migration.
-- ----------------------------------------------------------------------------
create table if not exists sections (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. PROJECTS — used by BOTH the "Selected Work" stacked section and the
--    horizontal gallery. `placement` controls where it shows up.
-- ----------------------------------------------------------------------------
create table if not exists projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  client         text,
  category       text,
  year           text,
  description    text,
  image_url      text,
  video_url      text,
  placement      text not null default 'both'
                 check (placement in ('work', 'gallery', 'both')),
  gallery_shape  text not null default 'landscape'
                 check (gallery_shape in ('portrait', 'landscape', 'square', 'full')),
  sort_order     int not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 3. SERVICES — "What we do" interactive list rows.
-- ----------------------------------------------------------------------------
create table if not exists services (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  image_url    text,
  sort_order   int not null default 0,
  is_published boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 4. LOCATIONS — "Wherever the story takes us" marquee.
-- ----------------------------------------------------------------------------
create table if not exists locations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  bg_image_url text,
  info_text    text,
  sort_order   int not null default 0,
  is_published boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 5. CLIENTS — "Trusted by" list.
-- ----------------------------------------------------------------------------
create table if not exists clients (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  sort_order   int not null default 0,
  is_published boolean not null default true
);

-- ----------------------------------------------------------------------------
-- Row Level Security
--   - Anyone (anon + authenticated) can READ published content — this is
--     what the public site uses.
--   - Only a logged-in admin (authenticated) can write. There is no public
--     sign-up flow in this project, so "authenticated" effectively means
--     "the one admin account you create by hand" — see the README.
-- ----------------------------------------------------------------------------
alter table sections  enable row level security;
alter table projects  enable row level security;
alter table services  enable row level security;
alter table locations enable row level security;
alter table clients   enable row level security;

drop policy if exists "public read sections" on sections;
create policy "public read sections" on sections
  for select to anon, authenticated using (true);

drop policy if exists "admin write sections" on sections;
create policy "admin write sections" on sections
  for all to authenticated using (true) with check (true);

drop policy if exists "public read published projects" on projects;
create policy "public read published projects" on projects
  for select to anon, authenticated using (is_published = true);

drop policy if exists "admin full access projects" on projects;
create policy "admin full access projects" on projects
  for all to authenticated using (true) with check (true);

drop policy if exists "public read published services" on services;
create policy "public read published services" on services
  for select to anon, authenticated using (is_published = true);

drop policy if exists "admin full access services" on services;
create policy "admin full access services" on services
  for all to authenticated using (true) with check (true);

drop policy if exists "public read published locations" on locations;
create policy "public read published locations" on locations
  for select to anon, authenticated using (is_published = true);

drop policy if exists "admin full access locations" on locations;
create policy "admin full access locations" on locations
  for all to authenticated using (true) with check (true);

drop policy if exists "public read published clients" on clients;
create policy "public read published clients" on clients
  for select to anon, authenticated using (is_published = true);

drop policy if exists "admin full access clients" on clients;
create policy "admin full access clients" on clients
  for all to authenticated using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage — a public "media" bucket for every uploaded image/video.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ----------------------------------------------------------------------------
-- Seed data — everything below is the same placeholder content the static
-- version shipped with. Edit it here, or (much easier) just log into
-- /admin after deploying and edit it there. Every image/video URL is a
-- placeholder from picsum.photos — swap these before launch.
-- ----------------------------------------------------------------------------

insert into sections (id, data) values
('site', '{
  "logo_text": "KARANA",
  "tagline": "Production by cocokjalan",
  "nav_cta_label": "START A PROJECT",
  "footer_copyright_name": "KARANA"
}'::jsonb),
('nav', '{
  "work_label": "WORK",
  "studio_label": "STUDIO",
  "services_label": "SERVICES",
  "locations_label": "LOCATIONS",
  "contact_label": "CONTACT"
}'::jsonb),
('hero', '{
  "by_line": "PRODUCTION BY COCOKJALAN",
  "headline_line1": "WE MAKE STORIES",
  "headline_line2": "WORTH WATCHING.",
  "frame_top_left": "KARANA — REEL 001",
  "frame_top_right": "EST. INDONESIA",
  "frame_bottom_left": "DIR. COCOKJALAN",
  "frame_bottom_right": "00:00:00:01",
  "scroll_cue_text": "SCROLL TO EXPLORE",
  "bg_image_url": "https://picsum.photos/seed/karana-hero/1920/1080",
  "bg_video_url": ""
}'::jsonb),
('intro', '{
  "line1": "IDEAS START SMALL.",
  "line2": "THEY DON''T HAVE TO STAY THAT WAY.",
  "bg_image_url": "https://picsum.photos/seed/karana-intro/1600/1200"
}'::jsonb),
('work', '{
  "eyebrow": "( SELECTED WORK )",
  "title_line1": "STORIES",
  "title_line2": "WE''VE TOLD.",
  "see_all_label": "SEE ALL WORK",
  "overlay_role_text": "Direction · Production · Post"
}'::jsonb),
('gallery', '{
  "eyebrow": "( MORE WORK )",
  "title_line1": "THE REEL",
  "title_line2": "CONTINUES →",
  "end_card_label": "SEE ALL WORK"
}'::jsonb),
('about', '{
  "eyebrow": "( THE STUDIO )",
  "row1": "WE DON''T JUST",
  "row2": "PRODUCE.",
  "row3": "WE BUILD",
  "row4": "WORLDS.",
  "body_copy": "KARANA is a production house based in Indonesia, telling stories for brands, artists and filmmakers who want more than footage — they want a world worth stepping into. Every frame is built with intention.",
  "bg_image_url": "https://picsum.photos/seed/karana-about/1800/1200"
}'::jsonb),
('servicesSection', '{
  "eyebrow": "( CAPABILITIES )",
  "title": "WHAT WE DO."
}'::jsonb),
('moment', '{
  "line1": "MAKE SOMETHING",
  "line2": "WORTH REMEMBERING.",
  "bg_image_url": "https://picsum.photos/seed/karana-moment/1920/1080",
  "video_url": ""
}'::jsonb),
('locationsSection', '{
  "eyebrow": "( PRODUCTION CAPABILITIES )",
  "title_line1": "WHEREVER THE",
  "title_line2": "STORY TAKES US."
}'::jsonb),
('clientsSection', '{
  "eyebrow": "( TRUSTED BY )"
}'::jsonb),
('contact', '{
  "headline_line1": "HAVE A STORY",
  "headline_line2": "IN MIND?",
  "sub": "LET''S MAKE SOMETHING WORTH WATCHING.",
  "bg_image_url": "https://picsum.photos/seed/karana-contact/1800/1200",
  "email": "hello@karana.studio",
  "email_cta_label": "EMAIL US",
  "whatsapp_number": "6281234567890",
  "whatsapp_message": "Hi KARANA, I have a story I''d like to make with you.",
  "whatsapp_cta_label": "WHATSAPP",
  "instagram_url": "https://instagram.com/karana.studio",
  "instagram_label": "INSTAGRAM",
  "tiktok_url": "https://tiktok.com/@karana.studio",
  "tiktok_label": "TIKTOK",
  "youtube_url": "https://youtube.com/@karana.studio",
  "youtube_label": "YOUTUBE"
}'::jsonb)
on conflict (id) do nothing;

insert into projects (slug, title, client, category, year, description, image_url, video_url, placement, gallery_shape, sort_order, is_published) values
('midnight-tide', 'MIDNIGHT TIDE', 'Sub Rosa Records', 'MUSIC VIDEO', '2025', 'A neon-lit chase through the coast at 2AM, cut to the rhythm of a single unreleased track.', 'https://picsum.photos/seed/karana-midnight-tide/1600/1000', '', 'work', 'landscape', 1, true),
('ashes-and-gold', 'ASHES & GOLD', 'Kertas Studio', 'BRANDED CONTENT', '2025', 'A short film built around a family paper mill, three generations, and the smell of ink.', 'https://picsum.photos/seed/karana-ashes-gold/1600/1000', '', 'work', 'landscape', 2, true),
('garden-state', 'GARDEN STATE', 'Orion Athletics', 'CAMPAIGN', '2024', 'A multi-city campaign following amateur runners chasing a finish line that keeps moving.', 'https://picsum.photos/seed/karana-garden-state/1600/1000', '', 'work', 'landscape', 3, true),
('night-market', 'NIGHT MARKET', 'Meridian Coffee Co.', 'COMMERCIAL', '2024', 'One continuous take through a market at dusk, ending at the last cup poured before close.', 'https://picsum.photos/seed/karana-night-market/1600/1000', '', 'work', 'landscape', 4, true),
('kala', 'KALA', 'Independent', 'SHORT FILM', '2025', 'A portrait of time told without a single line of dialogue.', 'https://picsum.photos/seed/karana-kala/900/1300', '', 'gallery', 'portrait', 5, true),
('sunda-gold', 'SUNDA GOLD', 'Terra Goods', 'DOCUMENTARY', '2024', 'Following the last artisan gold-thread weavers of West Java.', 'https://picsum.photos/seed/karana-sunda-gold/1600/900', '', 'gallery', 'landscape', 6, true),
('ruay', 'RUAY', 'Sekar Beauty', 'DIGITAL CONTENT', '2024', 'A vertical-first series built for a generation that scrolls before it watches.', 'https://picsum.photos/seed/karana-ruay/900/900', '', 'gallery', 'square', 7, true),
('angin-timur', 'ANGIN TIMUR', 'Halcyon', 'MUSIC VIDEO', '2023', 'Shot across three islands in five days, chasing the same wind.', 'https://picsum.photos/seed/karana-angin-timur/1100/1600', '', 'gallery', 'full', 8, true),
('salt-line', 'SALT LINE', 'Palm & Pine', 'CAMPAIGN', '2023', 'A coastal campaign about the line between land, salt, and sea.', 'https://picsum.photos/seed/karana-salt-line/1600/900', '', 'gallery', 'landscape', 9, true)
on conflict (slug) do nothing;

insert into services (name, image_url, sort_order, is_published) values
('COMMERCIALS', 'https://picsum.photos/seed/karana-service-commercials/1200/800', 1, true),
('BRANDED CONTENT', 'https://picsum.photos/seed/karana-service-branded/1200/800', 2, true),
('CAMPAIGNS', 'https://picsum.photos/seed/karana-service-campaigns/1200/800', 3, true),
('MUSIC VIDEOS', 'https://picsum.photos/seed/karana-service-musicvideos/1200/800', 4, true),
('DIGITAL CONTENT', 'https://picsum.photos/seed/karana-service-digital/1200/800', 5, true),
('CREATIVE PRODUCTION', 'https://picsum.photos/seed/karana-service-creative/1200/800', 6, true)
on conflict (name) do nothing;

insert into locations (name, bg_image_url, info_text, sort_order, is_published) values
('BALI', 'https://picsum.photos/seed/karana-loc-bali/1600/1000', 'Full crew · studio + coastal locations', 1, true),
('JAKARTA', 'https://picsum.photos/seed/karana-loc-jakarta/1600/1000', 'Studio base · commercial & broadcast', 2, true),
('YOGYAKARTA', 'https://picsum.photos/seed/karana-loc-yogyakarta/1600/1000', 'Heritage sets · cultural production', 3, true),
('LOMBOK', 'https://picsum.photos/seed/karana-loc-lombok/1600/1000', 'Remote crew logistics · drone permits', 4, true),
('FLORES', 'https://picsum.photos/seed/karana-loc-flores/1600/1000', 'Off-grid production support', 5, true),
('KOMODO', 'https://picsum.photos/seed/karana-loc-komodo/1600/1000', 'Marine unit · liveaboard crew', 6, true)
on conflict (name) do nothing;

insert into clients (name, sort_order, is_published) values
('NORTHFIELD', 1, true),
('ORION ATHLETICS', 2, true),
('SALT & STONE', 3, true),
('MERIDIAN COFFEE CO.', 4, true),
('HALCYON', 5, true),
('KAYU STUDIOS', 6, true),
('VELOUR', 7, true),
('ANJANI GROUP', 8, true),
('PALM & PINE', 9, true),
('SEKAR BEAUTY', 10, true),
('TERRA GOODS', 11, true),
('LUMEN', 12, true)
on conflict (name) do nothing;
