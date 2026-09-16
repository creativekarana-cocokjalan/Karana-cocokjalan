// Field-schema config that drives the generic admin Section editor and
// Collection manager. Adding/renaming a field here changes the admin form —
// it does not touch layout, styling or animation on the public site.

export const SECTIONS = {
  site: {
    label: "Site / Global",
    description: "Logo text, tagline and other site-wide labels.",
    fields: [
      { key: "logo_text", label: "Logo text", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "nav_cta_label", label: "Nav CTA label (\"Start a project\" button)", type: "text" },
      { key: "footer_copyright_name", label: "Footer copyright name", type: "text" },
    ],
  },
  nav: {
    label: "Navigation menu",
    description: "Menu labels in the top nav bar and the mobile menu.",
    fields: [
      { key: "work_label", label: "\"Work\" link", type: "text" },
      { key: "studio_label", label: "\"Studio\" link", type: "text" },
      { key: "services_label", label: "\"Services\" link", type: "text" },
      { key: "locations_label", label: "\"Locations\" link (mobile menu only)", type: "text" },
      { key: "contact_label", label: "\"Contact\" link (mobile menu only)", type: "text" },
    ],
  },
  hero: {
    label: "Hero",
    description: "The opening full-screen section.",
    fields: [
      { key: "by_line", label: "By-line", type: "text" },
      { key: "headline_line1", label: "Headline — line 1", type: "text" },
      { key: "headline_line2", label: "Headline — line 2 (accent)", type: "text" },
      { key: "frame_top_left", label: "Frame label — top left", type: "text" },
      { key: "frame_top_right", label: "Frame label — top right", type: "text" },
      { key: "frame_bottom_left", label: "Frame label — bottom left", type: "text" },
      { key: "frame_bottom_right", label: "Frame label — bottom right", type: "text" },
      { key: "scroll_cue_text", label: "Scroll cue text", type: "text" },
      { key: "bg_image_url", label: "Background image", type: "image" },
      { key: "bg_video_url", label: "Background video (optional — overrides image when set)", type: "video" },
    ],
  },
  intro: {
    label: "Intro statement",
    description: "The line-by-line statement right after the hero.",
    fields: [
      { key: "line1", label: "Line 1", type: "text" },
      { key: "line2", label: "Line 2", type: "text" },
      { key: "bg_image_url", label: "Background image", type: "image" },
    ],
  },
  work: {
    label: "Work — section header",
    description: "The heading above the Selected Work stack, plus its \"see all\" link.",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "title_line1", label: "Title — line 1", type: "text" },
      { key: "title_line2", label: "Title — line 2", type: "text" },
      { key: "see_all_label", label: "\"See all work\" link text (jumps to Gallery)", type: "text" },
      { key: "overlay_role_text", label: "Project overlay — \"Role\" value shown for every project", type: "text" },
    ],
  },
  gallery: {
    label: "Gallery — section header",
    description: "The heading above the horizontal gallery, plus its closing card.",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "title_line1", label: "Title — line 1", type: "text" },
      { key: "title_line2", label: "Title — line 2", type: "text" },
      { key: "end_card_label", label: "Closing card link text (jumps to Contact)", type: "text" },
    ],
  },
  about: {
    label: "About",
    description: "The moving-typography statement.",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "row1", label: "Row 1", type: "text" },
      { key: "row2", label: "Row 2", type: "text" },
      { key: "row3", label: "Row 3 (accent)", type: "text" },
      { key: "row4", label: "Row 4 (accent)", type: "text" },
      { key: "body_copy", label: "Body copy", type: "textarea" },
      { key: "bg_image_url", label: "Background image", type: "image" },
    ],
  },
  servicesSection: {
    label: "Services — section header",
    description: "The heading above the Services list (edit the list itself under Collections → Services).",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  moment: {
    label: "Moment",
    description: "The fullscreen video / statement section.",
    fields: [
      { key: "line1", label: "Line 1", type: "text" },
      { key: "line2", label: "Line 2 (accent)", type: "text" },
      { key: "bg_image_url", label: "Background image (fallback)", type: "image" },
      { key: "video_url", label: "Video (optional — overrides image when set)", type: "video" },
    ],
  },
  locationsSection: {
    label: "Locations — section header",
    description: "The heading above the Locations marquee (edit the list itself under Collections → Locations).",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "title_line1", label: "Title — line 1", type: "text" },
      { key: "title_line2", label: "Title — line 2", type: "text" },
    ],
  },
  clientsSection: {
    label: "Clients — section header",
    description: "The heading above the client list (edit the list itself under Collections → Clients).",
    fields: [{ key: "eyebrow", label: "Eyebrow label", type: "text" }],
  },
  contact: {
    label: "Contact",
    description: "The closing section, including contact methods and socials.",
    fields: [
      { key: "headline_line1", label: "Headline — line 1", type: "text" },
      { key: "headline_line2", label: "Headline — line 2", type: "text" },
      { key: "sub", label: "Subheading", type: "text" },
      { key: "bg_image_url", label: "Background image", type: "image" },
      { key: "email", label: "Email address", type: "text" },
      { key: "email_cta_label", label: "Email button text", type: "text" },
      { key: "whatsapp_number", label: "WhatsApp number (country code + number, digits only, e.g. 6281234567890)", type: "text" },
      { key: "whatsapp_message", label: "WhatsApp pre-filled message", type: "textarea" },
      { key: "whatsapp_cta_label", label: "WhatsApp button text", type: "text" },
      { key: "instagram_url", label: "Instagram URL", type: "text" },
      { key: "instagram_label", label: "Instagram link text", type: "text" },
      { key: "tiktok_url", label: "TikTok URL", type: "text" },
      { key: "tiktok_label", label: "TikTok link text", type: "text" },
      { key: "youtube_url", label: "YouTube URL", type: "text" },
      { key: "youtube_label", label: "YouTube link text", type: "text" },
    ],
  },
};

export const SECTION_ORDER = [
  "site",
  "nav",
  "hero",
  "intro",
  "work",
  "gallery",
  "about",
  "servicesSection",
  "moment",
  "locationsSection",
  "clientsSection",
  "contact",
];

export const COLLECTIONS = {
  projects: {
    label: "Projects",
    table: "projects",
    description: "Powers both the Selected Work stack and the Gallery.",
    itemLabel: (row) => row.title || "Untitled project",
    listFields: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "year", label: "Year" },
      { key: "placement", label: "Placement" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (unique, url-safe, e.g. midnight-tide)", type: "text", required: true },
      { key: "client", label: "Client", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Cover image", type: "image" },
      { key: "video_url", label: "Video (optional)", type: "video" },
      {
        key: "placement",
        label: "Where it appears",
        type: "select",
        default: "both",
        options: [
          { value: "both", label: "Selected Work + Gallery" },
          { value: "work", label: "Selected Work only" },
          { value: "gallery", label: "Gallery only" },
        ],
      },
      {
        key: "gallery_shape",
        label: "Gallery card shape",
        type: "select",
        default: "landscape",
        options: [
          { value: "landscape", label: "Landscape" },
          { value: "portrait", label: "Portrait" },
          { value: "square", label: "Square" },
          { value: "full", label: "Full / tall" },
        ],
      },
      { key: "sort_order", label: "Sort order (lower shows first)", type: "number", default: 0 },
      { key: "is_published", label: "Published", type: "checkbox", default: true },
    ],
  },
  services: {
    label: "Services",
    table: "services",
    description: "The interactive capabilities list.",
    itemLabel: (row) => row.name || "Untitled service",
    listFields: [{ key: "name", label: "Name" }],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "image_url", label: "Cursor-follow preview image", type: "image" },
      { key: "sort_order", label: "Sort order (lower shows first)", type: "number", default: 0 },
      { key: "is_published", label: "Published", type: "checkbox", default: true },
    ],
  },
  locations: {
    label: "Locations",
    table: "locations",
    description: "The production-capabilities marquee.",
    itemLabel: (row) => row.name || "Untitled location",
    listFields: [
      { key: "name", label: "Name" },
      { key: "info_text", label: "Info" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "info_text", label: "Info text", type: "text" },
      { key: "bg_image_url", label: "Background image", type: "image" },
      { key: "sort_order", label: "Sort order (lower shows first)", type: "number", default: 0 },
      { key: "is_published", label: "Published", type: "checkbox", default: true },
    ],
  },
  clients: {
    label: "Clients",
    table: "clients",
    description: "The \"Trusted by\" client list.",
    itemLabel: (row) => row.name || "Untitled client",
    listFields: [{ key: "name", label: "Name" }],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "sort_order", label: "Sort order (lower shows first)", type: "number", default: 0 },
      { key: "is_published", label: "Published", type: "checkbox", default: true },
    ],
  },
};

export const COLLECTION_ORDER = ["projects", "services", "locations", "clients"];
