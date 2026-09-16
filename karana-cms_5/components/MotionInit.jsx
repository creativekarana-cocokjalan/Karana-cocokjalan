"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * All imperative motion for the public site: Lenis smooth scroll, GSAP
 * ScrollTrigger scroll-scrubbed animations, custom cursor, the preloader,
 * pinned sections, the horizontal gallery, the click-to-expand project
 * overlay, video lazy-load/play-pause. Renders nothing itself — it just
 * wires up behavior against the markup the server already rendered.
 *
 * This is a close port of the original static site's main.js. The one real
 * difference: project data for the click-to-expand overlay now comes from
 * data-* attributes on each [data-project] element (title/client/category/
 * year/desc) instead of a hardcoded lookup table, since that content is
 * database-driven now.
 */
export default function MotionInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const IS_TOUCH = matchMedia("(hover: none), (pointer: coarse)").matches;
    const REDUCE_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (IS_TOUCH) document.body.classList.add("touch-device");

    const cleanupFns = [];
    const onCleanup = (fn) => cleanupFns.push(fn);

    // ---- 00. Utilities -----------------------------------------------------
    function splitChars(el) {
      const text = el.textContent;
      el.textContent = "";
      const spans = [];
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = ch === " " ? " " : ch;
        el.appendChild(span);
        spans.push(span);
      });
      return spans;
    }
    document.querySelectorAll('[data-split="chars"]').forEach(splitChars);

    // ---- 01. Smooth scroll (Lenis) -----------------------------------------
    let lenis = null;
    let lenisRafHandler = null;

    async function setupLenis() {
      if (REDUCE_MOTION) return;
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRafHandler = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisRafHandler);
      gsap.ticker.lagSmoothing(0);
    }
    const lenisReady = setupLenis();

    window.__karanaScrollTo = (target) => {
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.3 });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    };

    function handleAnchorClick(e) {
      const a = e.currentTarget;
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        window.__karanaScrollTo(id);
        document.getElementById("navMobile")?.classList.remove("is-open");
      }
    }
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));
    onCleanup(() => anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick)));

    // ---- 18. Custom cursor --------------------------------------------------
    const cursor = document.getElementById("cursor");
    const cursorLabel = document.getElementById("cursorLabel");

    if (!IS_TOUCH && cursor) {
      const qx = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
      const qy = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

      const onMouseMove = (e) => {
        qx(e.clientX);
        qy(e.clientY);
      };
      const onMouseLeaveWindow = () => cursor.classList.add("is-hidden");
      const onMouseEnterWindow = () => cursor.classList.remove("is-hidden");
      const onPointerOver = (e) => {
        const target = e.target.closest("[data-cursor]");
        if (target) {
          cursorLabel.textContent = target.getAttribute("data-cursor");
          cursor.classList.add("is-active");
          cursor.classList.toggle("is-drag", target.getAttribute("data-cursor") === "DRAG →");
        }
      };
      const onPointerOut = (e) => {
        const leavingTarget = e.target.closest("[data-cursor]");
        const enteringTarget =
          e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest("[data-cursor]") : null;
        if (leavingTarget && !enteringTarget) {
          cursor.classList.remove("is-active", "is-drag");
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeaveWindow);
      window.addEventListener("mouseenter", onMouseEnterWindow);
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);

      onCleanup(() => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeaveWindow);
        window.removeEventListener("mouseenter", onMouseEnterWindow);
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("pointerout", onPointerOut);
      });
    }

    // ---- 19. Preloader --------------------------------------------------------
    const preloader = document.getElementById("preloader");
    const fill = document.getElementById("preloaderFill");
    const pct = document.getElementById("preloaderPct");
    const heroMarkChars = document.querySelectorAll("#heroMark .char");
    const preloaderChars = document.querySelectorAll("#preloaderKarana .char");

    document.documentElement.classList.add("no-scroll");

    const counter = { v: 0 };
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    let introTl = null;
    let cancelled = false;

    (async () => {
      await lenisReady;
      if (lenis) lenis.stop();
      if (cancelled) return;

      introTl = gsap.timeline();
      introTl
        .to(preloaderChars, { y: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger: 0.045 })
        .to(".preloader__sub, .preloader__bar, .preloader__pct", { opacity: 1, duration: 0.6 }, "-=0.3")
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: "power1.inOut",
            onUpdate: () => {
              const val = Math.round(counter.v);
              if (fill) fill.style.width = val + "%";
              if (pct) pct.textContent = String(val).padStart(2, "0");
            },
          },
          "-=0.2"
        );

      Promise.all([fontsReady, new Promise((res) => introTl.eventCallback("onComplete", res))]).then(() => {
        if (!cancelled) startHero();
      });
    })();

    function startHero() {
      const exitTl = gsap.timeline({
        onComplete: () => {
          if (preloader) preloader.style.display = "none";
          document.documentElement.classList.remove("no-scroll");
          if (lenis) lenis.start();
          ScrollTrigger.refresh();
        },
      });
      exitTl
        .to(".preloader__sub, .preloader__bar, .preloader__pct", { opacity: 0, duration: 0.4 })
        .to(preloader, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=0.1")
        .add(heroEnter, "-=0.75");
    }

    function heroEnter() {
      const heroVideo = document.getElementById("heroVideo");
      const tl = gsap.timeline();
      tl.to(".hero__media", { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
        .to(heroMarkChars, { y: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.04 }, 0.15)
        .to(".hero__by", { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.55)
        .to(".hero__line span", { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 }, 0.5)
        .to(".hero__scroll-cue", { opacity: 1, duration: 0.8 }, "-=0.3")
        .to(".hero__frame-lines .fl", { opacity: 1, duration: 0.8, stagger: 0.08 }, "-=0.9")
        .to(".nav", { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.9");

      if (heroVideo) heroVideo.play().catch(() => {});
    }

    onCleanup(() => {
      cancelled = true;
    });

    // ---- 02/16. Generic parallax layers [data-speed] ---------------------
    document.querySelectorAll("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.3;
      const section = el.closest("section");
      gsap.fromTo(
        el,
        { yPercent: -10 * speed * 4 },
        {
          yPercent: 10 * speed * 4,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    });

    // ---- 02. Hero scroll-scrub ---------------------------------------------
    gsap.to(".hero__media img, .hero__media video, .hero__media .hero__img", {
      scale: 1.22,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to("#heroMark", {
      yPercent: -60,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to("#heroHeadline", {
      yPercent: -110,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to(".hero__content", {
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to("#scrollCue", {
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "15% top", scrub: 0.6 },
    });

    // ---- 04. Intro statement ------------------------------------------------
    const introWords = gsap.utils.toArray("#introStatement .word");
    gsap.to(introWords, {
      opacity: 1,
      y: 0,
      ease: "none",
      stagger: 0.5,
      scrollTrigger: { trigger: "#intro", start: "top top", end: "bottom bottom", scrub: 1 },
    });

    // ---- 05. Selected Work ---------------------------------------------------
    gsap.utils.toArray(".project").forEach((project) => {
      const media = project.querySelectorAll(".project__img, .project__video");
      const title = project.querySelector(".project__title");
      const meta = project.querySelector(".project__meta");

      gsap.to(media, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: project, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      if (title) gsap.set(title, { overflow: "hidden" });

      gsap.timeline({
        scrollTrigger: {
          trigger: project,
          start: "top 65%",
          end: "top 15%",
          toggleActions: "play none none reverse",
        },
      })
        .from(title, { yPercent: 115, duration: 1, ease: "power4.out" })
        .from(meta, { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" }, "-=0.5");
    });

    // ---- 06. Horizontal gallery ----------------------------------------------
    const galleryTrack = document.getElementById("galleryTrack");
    if (galleryTrack) {
      const getScrollDistance = () => galleryTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.06;
      gsap.to(galleryTrack, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: { trigger: "#gallery", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      if (!IS_TOUCH) galleryTrack.setAttribute("data-cursor", "DRAG →");
    }

    // ---- 08. Project reveal — shared element expand transition -------------
    const overlay = document.getElementById("projectOverlay");
    const overlayMedia = overlay.querySelector(".project-overlay__media");
    const overlayImg = document.getElementById("overlayImg");
    const overlayScrim = overlay.querySelector(".project-overlay__scrim");
    const overlayClose = document.getElementById("overlayClose");
    const overlayContent = overlay.querySelector(".project-overlay__content");

    let overlayOpen = false;

    function openProject(dataset, sourceEl) {
      if (overlayOpen) return;
      overlayOpen = true;

      const rect = sourceEl.getBoundingClientRect();
      overlayImg.src = sourceEl.tagName === "IMG" ? sourceEl.currentSrc || sourceEl.src : "";
      document.getElementById("overlayCategory").textContent = dataset.category || "";
      document.getElementById("overlayTitle").textContent = dataset.title || "";
      document.getElementById("overlayClient").textContent = dataset.client || "—";
      document.getElementById("overlayYear").textContent = dataset.year || "—";
      document.getElementById("overlayDesc").textContent = dataset.desc || "";

      gsap.set(overlayMedia, { position: "fixed", top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      gsap.set(overlay, { visibility: "visible" });
      overlay.classList.add("is-open");
      document.documentElement.classList.add("no-scroll");
      if (lenis) lenis.stop();

      gsap
        .timeline()
        .to(overlayMedia, { top: 0, left: 0, width: "100vw", height: "100vh", duration: 0.95, ease: "power4.inOut" })
        .to(overlayScrim, { opacity: 1, duration: 0.6 }, "-=0.5")
        .to(overlayClose, { opacity: 1, duration: 0.5 }, "-=0.4")
        .to(overlayContent, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");
    }

    function closeProject() {
      if (!overlayOpen) return;
      overlayOpen = false;
      gsap
        .timeline({
          onComplete: () => {
            overlay.classList.remove("is-open");
            gsap.set(overlay, { visibility: "hidden" });
            document.documentElement.classList.remove("no-scroll");
            if (lenis) lenis.start();
          },
        })
        .to([overlayContent, overlayClose], { opacity: 0, duration: 0.3 })
        .to(overlayScrim, { opacity: 0, duration: 0.4 }, "-=0.2")
        .to(overlayMedia, { scale: 0.92, opacity: 0, duration: 0.5, ease: "power3.in" }, "-=0.3");
    }

    const projectEls = document.querySelectorAll("[data-project]");
    const onProjectClick = (el) => (e) => {
      e.preventDefault();
      const img = el.querySelector("img") || el;
      openProject(el.dataset, img);
    };
    const projectClickHandlers = [];
    projectEls.forEach((el) => {
      const handler = onProjectClick(el);
      projectClickHandlers.push([el, handler]);
      el.addEventListener("click", handler);
    });
    overlayClose.addEventListener("click", closeProject);
    const onKeydown = (e) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", onKeydown);

    onCleanup(() => {
      projectClickHandlers.forEach(([el, handler]) => el.removeEventListener("click", handler));
      overlayClose.removeEventListener("click", closeProject);
      window.removeEventListener("keydown", onKeydown);
    });

    // ---- 10. About — moving typography --------------------------------------
    gsap.utils.toArray("#about .about__row[data-speed-x]").forEach((row) => {
      const speed = parseFloat(row.dataset.speedX) || 1;
      gsap.fromTo(
        row,
        { xPercent: -8 * speed },
        { xPercent: 8 * speed, ease: "none", scrollTrigger: { trigger: "#about", start: "top top", end: "bottom bottom", scrub: 1 } }
      );
    });
    gsap.fromTo(
      ".about__copy",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about__copy", start: "top 80%" },
      }
    );

    // ---- 11. Services — interactive list with cursor-follow preview --------
    const servicesList = document.getElementById("servicesList");
    const servicesBg = document.getElementById("servicesBg");
    const servicesPreview = document.getElementById("servicesPreview");
    const servicesPreviewImg = document.getElementById("servicesPreviewImg");
    const serviceHandlers = [];

    if (servicesList) {
      const rows = gsap.utils.toArray(".service-row");
      const previewX = gsap.quickTo(servicesPreview, "x", { duration: 0.5, ease: "power3" });
      const previewY = gsap.quickTo(servicesPreview, "y", { duration: 0.5, ease: "power3" });

      rows.forEach((row) => {
        const onEnter = () => {
          servicesList.classList.add("has-hover");
          const bg = row.dataset.bg;
          servicesBg.style.backgroundImage = `url('${bg}')`;
          servicesBg.classList.add("is-visible");
          servicesPreviewImg.src = bg;
          gsap.to(servicesPreview, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
        };
        const onLeave = () => {
          servicesList.classList.remove("has-hover");
          gsap.to(servicesPreview, { opacity: 0, scale: 0.85, duration: 0.3 });
        };
        const onTapTouch = (e) => {
          if (!IS_TOUCH) return;
          e.preventDefault();
          servicesBg.style.backgroundImage = `url('${row.dataset.bg}')`;
          servicesBg.classList.add("is-visible");
        };
        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        row.addEventListener("click", onTapTouch);
        serviceHandlers.push([row, "mouseenter", onEnter], [row, "mouseleave", onLeave], [row, "click", onTapTouch]);
      });

      const onListMouseMove = (e) => {
        previewX(e.clientX);
        previewY(e.clientY);
      };
      servicesList.addEventListener("mousemove", onListMouseMove);
      serviceHandlers.push([servicesList, "mousemove", onListMouseMove]);
    }
    onCleanup(() => serviceHandlers.forEach(([el, type, handler]) => el.removeEventListener(type, handler)));

    // ---- 12. Fullscreen video moment ----------------------------------------
    gsap.to(".moment__media img, .moment__media video, .moment__media .moment__img", {
      scale: 1.2,
      ease: "none",
      scrollTrigger: { trigger: ".moment", start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
    gsap.fromTo(
      ".moment__line--1",
      { xPercent: -14, opacity: 0 },
      { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".moment", start: "top 90%", end: "center center", scrub: 0.6 } }
    );
    gsap.fromTo(
      ".moment__line--2",
      { xPercent: 14, opacity: 0 },
      { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".moment", start: "top 70%", end: "bottom center", scrub: 0.6 } }
    );

    // ---- 13. Locations — credit-roll marquee --------------------------------
    const marquee = document.getElementById("locationsMarquee");
    const locationsBg = document.getElementById("locationsBg");
    const locationsInfo = document.getElementById("locationsInfo");
    const locHandlers = [];
    let marqueeTween = null;

    if (marquee) {
      marquee.innerHTML += marquee.innerHTML; // duplicate for seamless loop

      if (!REDUCE_MOTION) {
        marqueeTween = gsap.to(marquee, { xPercent: -50, duration: 34, ease: "none", repeat: -1 });
      }

      const activateLoc = (loc) => {
        marquee.querySelectorAll(".loc").forEach((l) => l.classList.remove("is-active"));
        loc.classList.add("is-active");
        locationsBg.style.backgroundImage = `url('${loc.dataset.bg}')`;
        gsap.to(locationsBg, { opacity: 0.4, duration: 0.5 });
        locationsInfo.textContent = loc.dataset.info || "";
      };

      marquee.querySelectorAll(".loc").forEach((loc) => {
        const onEnter = () => {
          if (marqueeTween) marqueeTween.pause();
          activateLoc(loc);
        };
        const onLeave = () => {
          if (marqueeTween) marqueeTween.play();
        };
        const onTap = (e) => {
          if (!IS_TOUCH) return;
          e.preventDefault();
          if (marqueeTween) marqueeTween.pause();
          activateLoc(loc);
        };
        loc.addEventListener("mouseenter", onEnter);
        loc.addEventListener("mouseleave", onLeave);
        loc.addEventListener("click", onTap);
        locHandlers.push([loc, "mouseenter", onEnter], [loc, "mouseleave", onLeave], [loc, "click", onTap]);
      });
    }
    onCleanup(() => {
      locHandlers.forEach(([el, type, handler]) => el.removeEventListener(type, handler));
      if (marqueeTween) marqueeTween.kill();
    });

    // ---- 14. Clients — sequential reveal ------------------------------------
    gsap.to("#clientsList .client", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: { trigger: "#clients", start: "top 80%" },
    });

    // ---- 15. Contact — cinematic ending --------------------------------------
    gsap.set(".contact__headline .line span", { yPercent: 105, display: "inline-block" });
    gsap
      .timeline({ scrollTrigger: { trigger: ".contact__pin", start: "top 60%" } })
      .to(".contact__headline .line span", { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 })
      .from(".contact__sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
      .from(".contact__cta-row", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
      .from(".contact__details", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5");

    gsap.to(".contact__headline", {
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: ".contact", start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    gsap.fromTo(
      ".contact__footer-mark, .contact__footer-sub, .contact__footer-meta",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact__footer", start: "top 85%" },
      }
    );

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Nav burger (mobile) -------------------------------------------------
    const navBurger = document.getElementById("navBurger");
    const navMobile = document.getElementById("navMobile");
    const onBurgerClick = () => {
      navMobile.classList.toggle("is-open");
      navBurger.classList.toggle("is-open");
    };
    if (navBurger) {
      navBurger.addEventListener("click", onBurgerClick);
      onCleanup(() => navBurger.removeEventListener("click", onBurgerClick));
    }

    // ---- Video: lazy load + play/pause on viewport --------------------------
    const lazyVideos = document.querySelectorAll("video[data-src]");
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            if (!v.src && v.dataset.src) {
              v.src = v.dataset.src;
              v.addEventListener("loadeddata", () => v.classList.add("is-ready"));
              v.addEventListener("error", () => v.remove());
            }
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "10% 0px 10% 0px", threshold: 0.15 }
    );
    lazyVideos.forEach((v) => videoObserver.observe(v));
    onCleanup(() => videoObserver.disconnect());

    document.querySelectorAll(".hero__video").forEach((v) => {
      v.addEventListener("loadeddata", () => v.classList.add("is-ready"));
      v.addEventListener("error", () => v.remove());
    });

    // ---- Resize handling -------------------------------------------------------
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    window.addEventListener("resize", onResize);
    onCleanup(() => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    });

    // ---- Full teardown (React StrictMode double-invoke safe) ----------------
    return () => {
      cleanupFns.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();
      if (lenisRafHandler) gsap.ticker.remove(lenisRafHandler);
      if (lenis) lenis.destroy();
      document.documentElement.classList.remove("no-scroll");
      delete window.__karanaScrollTo;
    };
  }, []);

  return null;
}
