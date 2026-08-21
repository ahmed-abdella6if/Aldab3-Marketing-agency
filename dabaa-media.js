
  
  /* =========================================================
   DABAA MEDIA PRODUCTION — page logic
   Sections: CONFIG, DATA, WHATSAPP, MODAL, HERO PARALLAX, INIT
   ========================================================= */

/* ---------- CONFIG ----------
   Central place to paste real values later. Nothing else in
   this file should hardcode a phone number or video URL. */
const SITE_CONFIG = {
  // Reuses the same WhatsApp number already used across the site.
  whatsappNumber: "201500733464",
};

// Paste the public (or signed) Supabase Storage URLs here once the
// four videos are uploaded to the `media-production` bucket.
// Example public URL shape:
// https://<project-ref>.supabase.co/storage/v1/object/public/media-production/real-estate.mp4
const MEDIA_VIDEOS = {
   realEstate: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/realstate.mp4",
  cars: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/cars_final.mp4",
  homeFurniture: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/Home-Furniture_final.mp4",
  fashion: "SUPABASE_VIDEO_URL",
};

// Thumbnail = an actual frame extracted from each video (see
// /scripts/extract-thumbnails in the project root for the ffmpeg
// commands). Upload the resulting jpgs next to the videos and paste
// their public URLs here. Leave a value as "" to keep the gradient
// placeholder for that card until a thumbnail is ready.
const MEDIA_THUMBNAILS = {
  realEstate: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/reeealstate.jpeg",
  cars: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/cars.jpeg ",
  homeFurniture: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/Home-Furniture.jpeg",
  fashion: "https://vwmqdrwepagntkdfrpuv.supabase.co/storage/v1/object/public/media-production/fashoin.jpeg",
};

/* ---------- DATA ----------
   Single source of truth the UI maps over — no per-category
   markup duplication anywhere in the HTML or JS. */
const categories = [
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Cinematic walkthroughs and photography that sell the space.",
    videoUrl: MEDIA_VIDEOS.realEstate,
    thumbnailUrl: MEDIA_THUMBNAILS.realEstate,
    icon: "icon-real-estate",
  },
  {
    id: "cars",
    title: "Cars",
    description: "Showroom-grade automotive films with real motion and light.",
    videoUrl: MEDIA_VIDEOS.cars,
    thumbnailUrl: MEDIA_THUMBNAILS.cars,
    icon: "icon-cars",
  },
  {
    id: "home-furniture",
    title: "Home & Furniture",
    description: "Product-led visuals that make every piece feel considered.",
    videoUrl: MEDIA_VIDEOS.homeFurniture,
    thumbnailUrl: MEDIA_THUMBNAILS.homeFurniture,
    icon: "icon-home-furniture",
  },
  {
    id: "fashion",
    title: "Fashion",
    description: "Editorial-style fashion film built for scroll-stopping feeds.",
    videoUrl: MEDIA_VIDEOS.fashion,
    thumbnailUrl: MEDIA_THUMBNAILS.fashion,
    icon: "icon-fashion",
  },
];

const ICONS = {
  "icon-real-estate": '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  "icon-cars": '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V11l2.4-5.2A2 2 0 018.2 4.6h7.6a2 2 0 011.8 1.2L20 11v5"/><path d="M4 16h16v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/></svg>',
  "icon-home-furniture": '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="16" height="7" rx="1.5"/><path d="M6 12V9a2 2 0 012-2h8a2 2 0 012 2v3"/><path d="M4 19v1.5M20 19v1.5"/></svg>',
  "icon-fashion": '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l3 2 3-2 4 3-2.5 3L15 9v11H9V9l-1.5 1L5 7l4-3z"/></svg>',
};

/* ---------- WHATSAPP ----------
   Reusable function shared by every card's modal instance. */
function openWhatsApp(categoryTitle) {
  const message = `Hello, I'm interested in your ${categoryTitle} media production services.`;
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

/* ---------- RENDER CARDS ---------- */
function renderCategoryGrid() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;

  grid.innerHTML = categories
    .map((cat) => {
      const hasThumb = Boolean(cat.thumbnailUrl);
      const mediaClass = hasThumb
        ? "category-card__media"
        : "category-card__media category-card__media--placeholder";
      const mediaStyle = hasThumb ? ` style="background-image:url('${cat.thumbnailUrl}')"` : "";
      // Icon only makes sense over the gradient placeholder — hide it once a real frame is set.
      const iconMarkup = hasThumb ? "" : `<div class="category-card__icon">${ICONS[cat.icon] || ""}</div>`;

      return `
    <article class="category-card" data-id="${cat.id}" tabindex="0" role="button"
      aria-label="Play ${cat.title} showreel">
      <div class="${mediaClass}"${mediaStyle}></div>
      ${iconMarkup}
      <div class="category-card__overlay"></div>
      <div class="category-card__content">
        <div class="category-card__play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <h3>${cat.title}</h3>
        <p>${cat.description}</p>
      </div>
    </article>
  `;
    })
    .join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.id);
      }
    });
  });
}

/* ---------- VIDEO MODAL ---------- */
const modal = {
  el: null,
  videoEl: null,
  whatsappEl: null,
  activeCategory: null,

  init() {
    this.el = document.getElementById("videoModal");
    this.videoEl = document.getElementById("videoModalPlayer");
    this.whatsappEl = document.getElementById("videoModalWhatsapp");
    this.closeEl = document.getElementById("videoModalClose");

    this.closeEl.addEventListener("click", () => this.close());
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.el.classList.contains("is-open")) this.close();
    });
  },

  open(category) {
    this.activeCategory = category;

    // Shows the real extracted frame instantly, before the 60MB video buffers.
    if (category.thumbnailUrl) {
      this.videoEl.setAttribute("poster", category.thumbnailUrl);
    } else {
      this.videoEl.removeAttribute("poster");
    }

    // Lazy-load: the <source> is only attached now, never on page load.
    this.videoEl.querySelectorAll("source").forEach((s) => s.remove());
    const source = document.createElement("source");
    source.src = category.videoUrl;
    source.type = "video/mp4";
    this.videoEl.appendChild(source);
    this.videoEl.load();
    this.videoEl.play().catch(() => {
      /* autoplay can be blocked on some mobile browsers — user can tap play */
    });

    this.whatsappEl.onclick = () => openWhatsApp(category.title);

    this.el.classList.add("is-open");
    document.body.classList.add("modal-lock");
  },

  close() {
    this.videoEl.pause();
    this.videoEl.removeAttribute("src");
    this.videoEl.querySelectorAll("source").forEach((s) => s.remove());
    this.videoEl.load(); // fully releases the buffered video from memory

    this.el.classList.remove("is-open");
    document.body.classList.remove("modal-lock");
    this.activeCategory = null;
  },
};

function openModal(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return;
  modal.open(category);
}

/* ---------- HERO CAMERA PARALLAX ---------- */
function initCameraParallax() {
  const stage = document.getElementById("cameraStage");
  if (!stage) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Only enable pointer parallax on devices with a fine pointer (desktop).
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let raf = null;
  window.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      stage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = null;
    });
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryGrid();
  modal.init();
  initCameraParallax();
});