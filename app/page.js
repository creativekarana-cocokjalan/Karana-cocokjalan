import { Fragment } from "react";
import Link from "next/link";
import { getHomeContent } from "@/lib/content";
import MotionInit from "@/components/MotionInit";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { sections, work, gallery, services, locations, clients } = await getHomeContent();
  const { site, hero, intro, about, moment, contact } = sections;

  const workTotal = String(work.length).padStart(2, "0");
  const waHref = contact.whatsapp_number
    ? `https://wa.me/${contact.whatsapp_number.replace(/[^\d]/g, "")}${
        contact.whatsapp_message ? `?text=${encodeURIComponent(contact.whatsapp_message)}` : ""
      }`
    : null;

  return (
    <>
      <div className="grain" aria-hidden="true" />

      <div className="cursor" id="cursor" aria-hidden="true">
        <div className="cursor__dot" />
        <div className="cursor__label" id="cursorLabel" />
      </div>

      <div className="preloader" id="preloader">
        <div className="preloader__inner">
          <div className="preloader__mark">
            <span className="preloader__karana" id="preloaderKarana" data-split="chars">
              {site.logo_text}
            </span>
          </div>
          <div className="preloader__sub">{site.tagline.toUpperCase()}</div>
          <div className="preloader__bar">
            <div className="preloader__bar-fill" id="preloaderFill" />
          </div>
          <div className="preloader__pct" id="preloaderPct">
            00
          </div>
        </div>
      </div>

      <header className="nav" id="nav">
        <a href="#hero" className="nav__logo" data-cursor="OPEN →">
          {site.logo_text}
        </a>
        <nav className="nav__links">
          <a href="#work" data-cursor="OPEN →">
            WORK
          </a>
          <a href="#about" data-cursor="OPEN →">
            STUDIO
          </a>
          <a href="#services" data-cursor="OPEN →">
            SERVICES
          </a>
          <a href="#contact" className="nav__cta" data-cursor="OPEN →">
            {site.nav_cta_label}
          </a>
          <Link href="/admin" className="nav__admin" aria-label="Admin login" data-cursor="OPEN →">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1 4 4v6c0 5.05 3.4 9.77 8 11 4.6-1.23 8-5.95 8-11V4l-8-3Zm0 10.99h7c-.53 3.6-3 6.83-7 8.5V12H5V5.3l7-2.62v9.31Z"
              />
            </svg>
          </Link>
        </nav>
        <button className="nav__burger" id="navBurger" aria-label="Menu">
          <span />
          <span />
        </button>
      </header>

      <div className="nav-mobile" id="navMobile">
        <a href="#work">WORK</a>
        <a href="#about">STUDIO</a>
        <a href="#services">SERVICES</a>
        <a href="#locations">LOCATIONS</a>
        <a href="#contact">CONTACT</a>
        <Link href="/admin" className="nav-mobile__admin">
          ADMIN
        </Link>
      </div>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero__media" data-speed="0.35">
            {hero.bg_video_url ? (
              <video
                className="hero__video"
                id="heroVideo"
                muted
                loop
                playsInline
                preload="auto"
                poster={hero.bg_image_url || undefined}
              >
                <source src={hero.bg_video_url} type="video/mp4" />
              </video>
            ) : null}
            <div
              className="hero__img"
              id="heroImgFallback"
              style={{ backgroundImage: hero.bg_image_url ? `url('${hero.bg_image_url}')` : undefined }}
            />
            <div className="hero__scrim" />
            <div className="hero__vignette" />
          </div>

          <div className="hero__content">
            <div className="hero__top">
              <div className="hero__mark" id="heroMark" aria-label={site.logo_text}>
                <span className="letters" data-split="chars">
                  {site.logo_text}
                </span>
              </div>
              <div className="hero__by">{hero.by_line}</div>
            </div>

            <div className="hero__headline" id="heroHeadline">
              <div className="hero__line">
                <span>{hero.headline_line1}</span>
              </div>
              <div className="hero__line hero__line--accent">
                <span>
                  <em>{hero.headline_line2}</em>
                </span>
              </div>
            </div>
          </div>

          <div className="hero__scroll-cue" id="scrollCue">
            <span>SCROLL TO EXPLORE</span>
            <span className="hero__scroll-arrow">↓</span>
          </div>

          <div className="hero__frame-lines" aria-hidden="true">
            <span className="fl fl--tl">{hero.frame_top_left}</span>
            <span className="fl fl--tr">{hero.frame_top_right}</span>
            <span className="fl fl--bl">{hero.frame_bottom_left}</span>
            <span className="fl fl--br">00:00:00:01</span>
          </div>
        </section>

        {/* INTRO STATEMENT */}
        <section className="intro" id="intro">
          <div
            className="intro__bg"
            data-speed="0.2"
            style={{ backgroundImage: intro.bg_image_url ? `url('${intro.bg_image_url}')` : undefined }}
          />
          <div className="intro__scrim" />
          <div className="intro__pin">
            <p className="intro__statement" id="introStatement">
              {intro.line1.split(" ").map((w, i) => (
                <span className="word" key={`l1-${i}`}>
                  {w}{" "}
                </span>
              ))}
              <br />
              {intro.line2.split(" ").map((w, i, arr) => (
                <span className={`word${i >= arr.length - 3 ? " word--em" : " word--muted"}`} key={`l2-${i}`}>
                  {w}{" "}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="work" id="work">
          <div className="work__header">
            <div className="work__header-text">
              <span className="eyebrow">( SELECTED WORK )</span>
              <h2 className="section-title">
                STORIES
                <br />
                WE'VE TOLD.
              </h2>
            </div>
            <a href="#gallery" className="work__see-all" data-cursor="OPEN →">
              <span>SEE ALL WORK</span>
              <span className="arrow">→</span>
            </a>
          </div>

          <div className="work__stack" id="workStack">
            {work.map((p, i) => (
              <article className="project" data-index={String(i + 1).padStart(2, "0")} key={p.id}>
                <div className="project__pin">
                  <div className="project__number" data-total={workTotal}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="project__media"
                    data-project
                    data-title={p.title}
                    data-client={p.client || ""}
                    data-category={p.category || ""}
                    data-year={p.year || ""}
                    data-desc={p.description || ""}
                  >
                    <img className="project__img" src={p.image_url} alt={`${p.title} — still frame`} data-cursor="VIEW" />
                    {p.video_url ? (
                      <video className="project__video" muted loop playsInline preload="none" data-src={p.video_url} />
                    ) : null}
                  </div>
                  <div className="project__info">
                    <h3 className="project__title">{p.title}</h3>
                    <div className="project__meta">
                      {p.client ? <span>{p.client}</span> : null}
                      {p.category ? <span>{p.category}</span> : null}
                      {p.year ? <span>{p.year}</span> : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HORIZONTAL GALLERY */}
        <section className="gallery" id="gallery">
          <div className="gallery__pin">
            <div className="gallery__intro">
              <span className="eyebrow">( MORE WORK )</span>
              <h2 className="section-title gallery__title">
                THE REEL
                <br />
                CONTINUES →
              </h2>
            </div>

            <div className="gallery__track" id="galleryTrack">
              {gallery.map((p, i) => (
                <div
                  className={`g-card g-card--${p.gallery_shape || "landscape"}`}
                  data-project
                  data-title={p.title}
                  data-client={p.client || ""}
                  data-category={p.category || ""}
                  data-year={p.year || ""}
                  data-desc={p.description || ""}
                  key={p.id}
                >
                  <img src={p.image_url} alt={p.title} data-cursor="VIEW" />
                  <div className="g-card__label">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <h4>{p.title}</h4>
                    <p>{p.category}</p>
                  </div>
                </div>
              ))}

              <div className="g-card g-card--end">
                <a href="#contact" className="g-card__end-cta" data-cursor="OPEN →">
                  <span>SEE ALL WORK</span>
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="about__pin-wrap">
            <div
              className="about__bg"
              data-speed="0.25"
              style={{ backgroundImage: about.bg_image_url ? `url('${about.bg_image_url}')` : undefined }}
            />
            <div className="about__scrim" />
            <div className="about__pin">
              <p className="about__statement">
                <span className="about__row about__row--left" data-speed-x="-1">
                  {about.row1}
                </span>
                <span className="about__row about__row--right" data-speed-x="1">
                  {about.row2}
                </span>
                <span className="about__row about__row--left about__row--em" data-speed-x="-0.6">
                  {about.row3}
                </span>
                <span className="about__row about__row--right about__row--em" data-speed-x="0.6">
                  {about.row4}
                </span>
              </p>
            </div>
          </div>

          <div className="about__copy">
            <span className="eyebrow">( THE STUDIO )</span>
            <p>{about.body_copy}</p>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services">
          <div className="services__bg" id="servicesBg" style={{ backgroundImage: services[0] ? `url('${services[0].image_url}')` : undefined }} />
          <div className="services__scrim" />

          <div className="services__header">
            <span className="eyebrow">( CAPABILITIES )</span>
            <h2 className="section-title">WHAT WE DO.</h2>
          </div>

          <div className="services__list" id="servicesList">
            {services.map((s, i) => (
              <div className="service-row" data-bg={s.image_url} key={s.id}>
                <span className="service-row__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="service-row__name">{s.name}</span>
                <span className="service-row__arrow">→</span>
              </div>
            ))}
          </div>

          <div className="services__preview" id="servicesPreview" aria-hidden="true">
            <img id="servicesPreviewImg" src={services[0]?.image_url} alt="" />
          </div>
        </section>

        {/* FULLSCREEN VIDEO MOMENT */}
        <section className="moment" id="moment">
          <div className="moment__media" data-speed="0.3">
            {moment.video_url ? (
              <video
                className="moment__video"
                muted
                loop
                playsInline
                preload="none"
                poster={moment.bg_image_url || undefined}
                data-src={moment.video_url}
              />
            ) : null}
            <div className="moment__img" style={{ backgroundImage: moment.bg_image_url ? `url('${moment.bg_image_url}')` : undefined }} />
            <div className="moment__scrim" />
          </div>
          <div className="moment__text">
            <p className="moment__line moment__line--1">{moment.line1}</p>
            <p className="moment__line moment__line--2">{moment.line2}</p>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="locations" id="locations">
          <div
            className="locations__bg"
            id="locationsBg"
            style={{ backgroundImage: locations[0] ? `url('${locations[0].bg_image_url}')` : undefined }}
          />
          <div className="locations__scrim" />

          <div className="locations__header">
            <span className="eyebrow">( PRODUCTION CAPABILITIES )</span>
            <h2 className="section-title">
              WHEREVER THE
              <br />
              STORY TAKES US.
            </h2>
          </div>

          <div className="locations__marquee-wrap">
            <div className="locations__marquee" id="locationsMarquee">
              {locations.map((loc) => (
                <Fragment key={loc.id}>
                  <span className="loc" data-bg={loc.bg_image_url} data-info={loc.info_text || ""}>
                    {loc.name}
                  </span>
                  <span className="loc-dot">/</span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="locations__info" id="locationsInfo">
            {locations[0]?.info_text || ""}
          </div>
        </section>

        {/* CLIENTS */}
        <section className="clients" id="clients">
          <span className="eyebrow">( TRUSTED BY )</span>
          <div className="clients__list" id="clientsList">
            {clients.map((c) => (
              <span className="client" key={c.id}>
                {c.name}
              </span>
            ))}
          </div>
        </section>

        {/* CONTACT / ENDING */}
        <section className="contact" id="contact">
          <div className="contact__pin-wrap">
            <div
              className="contact__bg"
              data-speed="0.2"
              style={{ backgroundImage: contact.bg_image_url ? `url('${contact.bg_image_url}')` : undefined }}
            />
            <div className="contact__scrim" />

            <div className="contact__pin">
              <h2 className="contact__headline">
                <span className="line">
                  <span>{contact.headline_line1}</span>
                </span>
                <span className="line">
                  <span>{contact.headline_line2}</span>
                </span>
              </h2>

              <p className="contact__sub">{contact.sub}</p>

              <div className="contact__cta-row">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="contact__cta" data-cursor="OPEN →">
                    <span>EMAIL US</span>
                    <span className="arrow">→</span>
                  </a>
                ) : null}
                {waHref ? (
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="contact__cta contact__cta--wa" data-cursor="OPEN →">
                    <span>WHATSAPP</span>
                    <span className="arrow">→</span>
                  </a>
                ) : null}
              </div>

              <div className="contact__details">
                {contact.email ? (
                  <div>
                    <span className="label">EMAIL</span>
                    <a href={`mailto:${contact.email}`}>{contact.email.toUpperCase()}</a>
                  </div>
                ) : null}
                {waHref ? (
                  <div>
                    <span className="label">WHATSAPP</span>
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      {contact.whatsapp_number}
                    </a>
                  </div>
                ) : null}
                {(contact.instagram_url || contact.tiktok_url || contact.youtube_url) ? (
                  <div>
                    <span className="label">SOCIAL</span>
                    {contact.instagram_url ? (
                      <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN →">
                        INSTAGRAM
                      </a>
                    ) : null}
                    {contact.tiktok_url ? (
                      <a href={contact.tiktok_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN →">
                        TIKTOK
                      </a>
                    ) : null}
                    {contact.youtube_url ? (
                      <a href={contact.youtube_url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN →">
                        YOUTUBE
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <footer className="contact__footer">
            <div className="contact__footer-mark">{site.logo_text}</div>
            <div className="contact__footer-sub">{site.tagline}</div>
            <div className="contact__footer-meta">
              <span>
                © <span id="year" /> {site.footer_copyright_name}
              </span>
              <span>INDONESIA</span>
            </div>
          </footer>
        </section>
      </main>

      <div className="project-overlay" id="projectOverlay">
        <div className="project-overlay__media">
          <img id="overlayImg" alt="" />
        </div>
        <div className="project-overlay__scrim" />
        <button className="project-overlay__close" id="overlayClose" aria-label="Close" data-cursor="CLOSE">
          <span />
          <span />
        </button>
        <div className="project-overlay__content">
          <span className="eyebrow" id="overlayCategory">
            CATEGORY
          </span>
          <h2 id="overlayTitle">PROJECT TITLE</h2>
          <div className="project-overlay__meta">
            <div>
              <span className="label">CLIENT</span>
              <span id="overlayClient">—</span>
            </div>
            <div>
              <span className="label">YEAR</span>
              <span id="overlayYear">—</span>
            </div>
            <div>
              <span className="label">ROLE</span>
              <span>Direction · Production · Post</span>
            </div>
          </div>
          <p id="overlayDesc">
            A short cinematic story crafted frame by frame, built to make an audience feel something
            before they know why.
          </p>
        </div>
      </div>

      <MotionInit />
    </>
  );
}
