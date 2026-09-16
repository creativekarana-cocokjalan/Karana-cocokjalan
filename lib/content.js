import { createClient } from "@/lib/supabase/server";

// Fallback values used whenever Supabase isn't reachable/configured yet (e.g.
// local dev before you've set env vars, or a `sections` row missing after a
// manual delete). Keeps the public site from ever rendering blank or crashing
// — it just quietly shows this placeholder content instead. Mirrors the seed
// data in supabase/schema.sql.
export const DEFAULT_SECTIONS = {
  site: {
    logo_text: "KARANA",
    tagline: "Production by cocokjalan",
    nav_cta_label: "START A PROJECT",
    footer_copyright_name: "KARANA",
  },
  hero: {
    by_line: "PRODUCTION BY COCOKJALAN",
    headline_line1: "WE MAKE STORIES",
    headline_line2: "WORTH WATCHING.",
    frame_top_left: "KARANA — REEL 001",
    frame_top_right: "EST. INDONESIA",
    frame_bottom_left: "DIR. COCOKJALAN",
    bg_image_url: "https://picsum.photos/seed/karana-hero/1920/1080",
    bg_video_url: "",
  },
  intro: {
    line1: "IDEAS START SMALL.",
    line2: "THEY DON'T HAVE TO STAY THAT WAY.",
    bg_image_url: "https://picsum.photos/seed/karana-intro/1600/1200",
  },
  about: {
    row1: "WE DON'T JUST",
    row2: "PRODUCE.",
    row3: "WE BUILD",
    row4: "WORLDS.",
    body_copy:
      "KARANA is a production house based in Indonesia, telling stories for brands, artists and filmmakers who want more than footage — they want a world worth stepping into. Every frame is built with intention.",
    bg_image_url: "https://picsum.photos/seed/karana-about/1800/1200",
  },
  moment: {
    line1: "MAKE SOMETHING",
    line2: "WORTH REMEMBERING.",
    bg_image_url: "https://picsum.photos/seed/karana-moment/1920/1080",
    video_url: "",
  },
  contact: {
    headline_line1: "HAVE A STORY",
    headline_line2: "IN MIND?",
    sub: "LET'S MAKE SOMETHING WORTH WATCHING.",
    bg_image_url: "https://picsum.photos/seed/karana-contact/1800/1200",
    email: "hello@karana.studio",
    whatsapp_number: "6281234567890",
    whatsapp_message: "Hi KARANA, I have a story I'd like to make with you.",
    instagram_url: "https://instagram.com/karana.studio",
    tiktok_url: "https://tiktok.com/@karana.studio",
    youtube_url: "https://youtube.com/@karana.studio",
  },
};

export const SECTION_IDS = Object.keys(DEFAULT_SECTIONS);

const DEMO_WORK = [
  { id: "d1", slug: "midnight-tide", title: "MIDNIGHT TIDE", client: "Sub Rosa Records", category: "MUSIC VIDEO", year: "2025", description: "A neon-lit chase through the coast at 2AM, cut to the rhythm of a single unreleased track.", image_url: "https://picsum.photos/seed/karana-midnight-tide/1600/1000", video_url: "" },
  { id: "d2", slug: "ashes-and-gold", title: "ASHES & GOLD", client: "Kertas Studio", category: "BRANDED CONTENT", year: "2025", description: "A short film built around a family paper mill, three generations, and the smell of ink.", image_url: "https://picsum.photos/seed/karana-ashes-gold/1600/1000", video_url: "" },
  { id: "d3", slug: "garden-state", title: "GARDEN STATE", client: "Orion Athletics", category: "CAMPAIGN", year: "2024", description: "A multi-city campaign following amateur runners chasing a finish line that keeps moving.", image_url: "https://picsum.photos/seed/karana-garden-state/1600/1000", video_url: "" },
  { id: "d4", slug: "night-market", title: "NIGHT MARKET", client: "Meridian Coffee Co.", category: "COMMERCIAL", year: "2024", description: "One continuous take through a market at dusk, ending at the last cup poured before close.", image_url: "https://picsum.photos/seed/karana-night-market/1600/1000", video_url: "" },
];

const DEMO_GALLERY = [
  { id: "d5", slug: "kala", title: "KALA", client: "Independent", category: "SHORT FILM", year: "2025", description: "A portrait of time told without a single line of dialogue.", image_url: "https://picsum.photos/seed/karana-kala/900/1300", video_url: "", gallery_shape: "portrait" },
  { id: "d6", slug: "sunda-gold", title: "SUNDA GOLD", client: "Terra Goods", category: "DOCUMENTARY", year: "2024", description: "Following the last artisan gold-thread weavers of West Java.", image_url: "https://picsum.photos/seed/karana-sunda-gold/1600/900", video_url: "", gallery_shape: "landscape" },
  { id: "d7", slug: "ruay", title: "RUAY", client: "Sekar Beauty", category: "DIGITAL CONTENT", year: "2024", description: "A vertical-first series built for a generation that scrolls before it watches.", image_url: "https://picsum.photos/seed/karana-ruay/900/900", video_url: "", gallery_shape: "square" },
  { id: "d8", slug: "angin-timur", title: "ANGIN TIMUR", client: "Halcyon", category: "MUSIC VIDEO", year: "2023", description: "Shot across three islands in five days, chasing the same wind.", image_url: "https://picsum.photos/seed/karana-angin-timur/1100/1600", video_url: "", gallery_shape: "full" },
  { id: "d9", slug: "salt-line", title: "SALT LINE", client: "Palm & Pine", category: "CAMPAIGN", year: "2023", description: "A coastal campaign about the line between land, salt, and sea.", image_url: "https://picsum.photos/seed/karana-salt-line/1600/900", video_url: "", gallery_shape: "landscape" },
];

const DEMO_SERVICES = ["COMMERCIALS", "BRANDED CONTENT", "CAMPAIGNS", "MUSIC VIDEOS", "DIGITAL CONTENT", "CREATIVE PRODUCTION"].map(
  (name, i) => ({ id: `s${i}`, name, image_url: `https://picsum.photos/seed/karana-service-${i}/1200/800` })
);

const DEMO_LOCATIONS = [
  ["BALI", "Full crew · studio + coastal locations"],
  ["JAKARTA", "Studio base · commercial & broadcast"],
  ["YOGYAKARTA", "Heritage sets · cultural production"],
  ["LOMBOK", "Remote crew logistics · drone permits"],
  ["FLORES", "Off-grid production support"],
  ["KOMODO", "Marine unit · liveaboard crew"],
].map(([name, info_text], i) => ({
  id: `l${i}`,
  name,
  info_text,
  bg_image_url: `https://picsum.photos/seed/karana-loc-${name.toLowerCase()}/1600/1000`,
}));

const DEMO_CLIENTS = [
  "NORTHFIELD", "ORION ATHLETICS", "SALT & STONE", "MERIDIAN COFFEE CO.", "HALCYON", "KAYU STUDIOS",
  "VELOUR", "ANJANI GROUP", "PALM & PINE", "SEKAR BEAUTY", "TERRA GOODS", "LUMEN",
].map((name, i) => ({ id: `c${i}`, name }));

/** Every singleton section, merged over defaults so missing fields / a down DB never break rendering. */
export async function getSections() {
  const merged = structuredClone(DEFAULT_SECTIONS);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("sections").select("id, data");
    if (!error && data) {
      for (const row of data) {
        if (merged[row.id]) merged[row.id] = { ...merged[row.id], ...(row.data || {}) };
      }
    }
  } catch {
    // Supabase not configured yet (e.g. local dev before env vars are set) —
    // fall through and render the placeholder content below instead of crashing.
  }
  return merged;
}

async function safeQuery(build, fallback) {
  try {
    const supabase = await createClient();
    const { data, error } = await build(supabase);
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

/** Published projects for the "Selected Work" stacked section. */
export async function getWorkProjects() {
  return safeQuery(
    (supabase) =>
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .in("placement", ["work", "both"])
        .order("sort_order", { ascending: true }),
    DEMO_WORK
  );
}

/** Published projects for the horizontal gallery. */
export async function getGalleryProjects() {
  return safeQuery(
    (supabase) =>
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .in("placement", ["gallery", "both"])
        .order("sort_order", { ascending: true }),
    DEMO_GALLERY
  );
}

export async function getServices() {
  return safeQuery(
    (supabase) =>
      supabase.from("services").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    DEMO_SERVICES
  );
}

export async function getLocations() {
  return safeQuery(
    (supabase) =>
      supabase.from("locations").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    DEMO_LOCATIONS
  );
}

export async function getClients() {
  return safeQuery(
    (supabase) =>
      supabase.from("clients").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    DEMO_CLIENTS
  );
}

/** Fetches everything the public homepage needs, in parallel. */
export async function getHomeContent() {
  const [sections, work, gallery, services, locations, clients] = await Promise.all([
    getSections(),
    getWorkProjects(),
    getGalleryProjects(),
    getServices(),
    getLocations(),
    getClients(),
  ]);
  return { sections, work, gallery, services, locations, clients };
}
