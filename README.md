# KARANA — Production by cocokjalan

A cinematic, motion-driven site for KARANA, built with Next.js and backed by
Supabase so every piece of text, image and video — plus projects, services,
locations and clients — can be edited from a private `/admin` panel, with no
code changes needed for day-to-day content updates.

- **Public site**: `app/page.js` + `components/MotionInit.jsx` — the design,
  layout, and all scroll/motion behaviour. Content is fetched from Supabase
  at request time (`lib/content.js`).
- **Admin panel**: everything under `/admin` — sign in, edit the six content
  sections (Hero, Intro, About, Moment, Contact, Site/Global), and manage
  Projects, Services, Locations and Clients (add/edit/delete + publish
  toggle), plus a Media Library for uploads.
- **What the admin can't change**: layout, animation, colors, fonts and
  overall design stay in code (`app/globals.css`, `components/MotionInit.jsx`).
  That's intentional — it keeps the cinematic look consistent and protects it
  from being broken by a content edit.

This guide walks through the three things you need to do once: set up
Supabase, push this project to GitHub, and deploy it on Vercel. After that,
all day-to-day updates happen through `/admin` — you won't need to touch
code or redeploy for content changes.

---

## 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com), sign in, and click **New project**.
   Pick any name/region/password (the database password isn't needed for
   anything below — Supabase generates the API keys separately).
2. Once the project finishes provisioning, open **SQL Editor** in the left
   sidebar → **New query**.
3. Open `supabase/schema.sql` from this project, copy the whole file, paste
   it into the SQL Editor, and click **Run**.
   - This creates all 5 tables (`sections`, `projects`, `services`,
     `locations`, `clients`), turns on Row Level Security with the right
     public-read / authenticated-write policies, creates a public `media`
     storage bucket for uploads, and seeds everything with the same
     placeholder content you saw during development.
   - It's safe to re-run — it uses `if not exists` / `on conflict do nothing`
     throughout.
4. Create your admin login: **Authentication** → **Users** → **Add user** →
   **Create new user**. Enter the email and password you want to sign in
   with at `/admin`, and make sure **Auto Confirm User** is checked (or
   confirm it manually afterwards) so it doesn't wait on a confirmation
   email. This is the only admin account you need — there's no public
   sign-up form.
5. Collect your three API keys from **Project Settings** → **API**:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal") → this is `SUPABASE_SERVICE_ROLE_KEY`

   The service role key bypasses Row Level Security — it's only ever used
   on the server (`lib/supabase/admin.js`, guarded by the `server-only`
   package) for admin uploads/media management. **Never** put it behind
   `NEXT_PUBLIC_`, never expose it to the browser, and never commit it.

## 2. Run it locally (optional, but a good sanity check)

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the
live site with the seeded placeholder content. Sign in at
[http://localhost:3000/admin](http://localhost:3000/admin) with the user
you created in step 1.4.

`.env.local` is already covered by `.gitignore` — it will not be committed.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(If this folder is already a git repo, just commit and push as usual.)

## 4. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
   you just pushed.
2. Before deploying, open **Environment Variables** and add the same three
   values from step 1.5:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Click **Deploy**. Vercel will build and give you a live URL.
4. Visit `https://your-site.vercel.app/admin` and sign in with the admin
   user from step 1.4.

That's it — Supabase is your database and storage, GitHub holds the code,
and Vercel serves the site. Any future code changes just need `git push`;
Vercel redeploys automatically. Content changes need neither — they go
live immediately from `/admin`.

---

## Using the admin panel

Sign in at `/admin`.

- **Content** (sidebar) — Site/Global, Hero, Intro, About, Moment, Contact.
  Each is a form for that section's text and media. Contact also has your
  email, WhatsApp number + pre-filled message, and Instagram/TikTok/YouTube
  links.
- **Collections** — Projects, Services, Locations, Clients. Each has a list
  view (with a Published/Draft badge), **+ Add new**, **Edit**, and
  **Delete**. Projects also control:
  - **Where it appears** — Selected Work only, Gallery only, or both.
  - **Gallery card shape** — portrait / landscape / square / full — this is
    what gives the horizontal gallery its mixed-card-shape layout.
  - **Sort order** — lower numbers show first.
  - **Published** — uncheck to hide an item from the live site without
    deleting it.
- **Media library** — every file you've uploaded, with its public URL and a
  delete button. You can also upload directly from any image/video field
  in a content form (drag-and-drop isn't wired up — click **Upload**,
  choose a file). Every image/video field also has a "paste a URL" option
  if you'd rather link to an already-hosted file.

Changes save immediately and go live on the public site right away — no
rebuild or redeploy needed.

### Swapping in real KARANA footage

The seeded content uses placeholder stock photography (picsum.photos) so
the site has something to show out of the box. Replace it whenever real
photos/video are ready: open each section or project in `/admin` and
upload the real file in place of the placeholder — nothing else needs to
change.

---

## Project structure (for future code changes)

```
app/
  page.js                     Public homepage — all markup, fetches content from Supabase
  globals.css                 All design, layout, and animation CSS
  admin/                      Admin panel (protected by proxy.js)
    login/page.js
    (dashboard)/              Sidebar shell + all authenticated admin pages
      page.js                 Dashboard home
      section/[id]/page.js    Section editor (hero/intro/about/moment/contact/site)
      collection/[table]/     Collection list + new/edit item forms
      media/page.js           Media library
  actions/                    Server Actions (auth, sections, collections, media)
components/
  MotionInit.jsx              All GSAP + Lenis scroll/motion behaviour for the public site
  admin/                      Admin UI components (forms, media upload, etc.)
lib/
  content.js                  Data-fetching for the public site (resilient to a down/unset DB)
  adminSchema.js               Field config that drives the admin forms — edit this to add/
                               remove a field from a section or collection
  supabase/                   Supabase client helpers (browser, server, admin/service-role)
supabase/
  schema.sql                  Full DB schema, RLS policies, storage bucket, seed data
proxy.js                      Auth protection for everything under /admin (Next.js 16's
                               replacement for middleware.js — same idea, new name)
```

To add a new editable field to an existing section or collection, add one
entry to the relevant array in `lib/adminSchema.js` and add the matching
column (for a collection) or just start reading the new key (for a JSONB
section) in `app/page.js` / `lib/content.js`. Everything else — the form
field, saving, validation — is generated from that config.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- [Supabase](https://supabase.com) (Postgres + Auth + Storage)
- [GSAP](https://gsap.com) + [ScrollTrigger](https://gsap.com/scrolltrigger/) for scroll-driven animation
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Deployed on [Vercel](https://vercel.com)
