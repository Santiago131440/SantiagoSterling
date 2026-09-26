/* ==========================================================================
   Red Pericial — Componentes
   --------------------------------------------------------------------------
   Cada componente es una función pura (datos → HTML). Esto permite migrarlos
   casi literalmente a componentes React/JSX en el futuro.

   Uso en HTML:  <div data-component="team" data-limit="4"></div>
   ========================================================================== */

(function () {
  "use strict";

  const RP = (window.RP = window.RP || {});
  const C = () => window.RP_CONTENT;
  const CFG = () => window.RP_CONFIG;

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */
  const esc = (v) =>
    String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  /** Prefijo de ruta relativo a la raíz (definido en <html data-root="../">) */
  const root = () => document.documentElement.dataset.root || "./";

  /** Resuelve una ruta del proyecto (sin barra inicial) respecto a la página actual */
  const url = (path) => {
    if (!path) return "";
    if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
    return root() + path;
  };

  /** ¿Es un valor de relleno? (vacío o entre corchetes) */
  const isPlaceholder = (v) => !v || /^\s*\[/.test(String(v));

  const badge = (text = "Por confirmar") =>
    CFG().showPlaceholderBadges ? `<span class="tag-pending">${esc(text)}</span>` : "";

  const formatDate = (iso) => {
    const [y, m, d] = String(iso).split("-").map(Number);
    if (!y) return esc(iso);
    return new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(y, (m || 1) - 1, d || 1)
    );
  };

  const icons = {
    arrow:
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
    external:
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 13l6-6M8 7h5v5"/></svg>',
    sun:
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
    moon:
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5l1.3-3.9A8 8 0 1 1 8.6 19z"/><path d="M9 10.5h6M9 13.5h4"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.7"/></svg>',
    lens:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 7.5v7M7.5 11h7"/></svg>',
    network:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M11 6.8L6 16.2M13 6.8l5 9.4M7 18h10"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/></svg>',
  };

  /** Marca provisional: faro proyectando luz (reemplazable por el logotipo oficial) */
  const logoMark = (cls = "brand__mark") =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="mark-beam" d="M12 7.2 1.5 4 1.5 10.4Z"/><path class="mark-beam" d="M12 7.2 22.5 4 22.5 10.4Z"/><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M10 5.2 12 3l2 2.2"/><path d="M10.2 5.2h3.6v4h-3.6z" class="mark-lantern"/><path d="M9.1 9.2h5.8"/><path d="M10.3 9.2 9.2 20.5M13.7 9.2l1.1 11.3"/><path d="M6.8 20.5h10.4"/><path d="M9.9 13.3h4.2M9.5 17h5" stroke-opacity=".45"/></g><circle class="mark-lamp" cx="12" cy="7.2" r="1.25"/></svg>`;

  /** Ilustración lineal del faro (hero, footer). La lámpara lleva data-lamp:
      el canvas del hero proyecta el haz desde ese punto. */
  const lighthouseArt = (cls = "") => `
<svg class="lighthouse ${cls}" viewBox="0 0 200 520" aria-hidden="true" focusable="false">
  <circle class="lh-halo" cx="100" cy="92" r="34"/>
  <g class="lh-lines" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M100 18v14"/>
    <path d="M76 66 100 32l24 34"/>
    <path d="M78 66h44"/>
    <path d="M82 66v52M118 66v52M94 66v52M106 66v52" stroke-opacity=".55"/>
    <path d="M66 118h68M70 118v10h60v-10"/>
    <path d="M72 124h56" stroke-opacity=".5"/>
    <path d="M84 128 60 474M116 128l24 346"/>
    <path d="M40 474h120v16H40z"/>
    <path d="M92 474v-34a8 8 0 0 1 16 0v34"/>
    <path d="M97 190h6v14h-6zM96 300h8v16h-8z" stroke-opacity=".6"/>
  </g>
  <path class="lh-band" d="M79 230h42l3 40H76zM72 340h56l3 44H69z"/>
  <circle class="lh-lamp" data-lamp cx="100" cy="92" r="7"/>
</svg>`;

  /**
   * Imagen responsive. Acepta { src, alt, avif?, webp?, srcset?, sizes?, width?, height? }.
   * Cuando existan fotografías reales, añada versiones avif/webp y se
   * generará <picture> automáticamente.
   */
  const img = (image, opts = {}) => {
    if (!image) return "";
    const { eager = false, sizes = image.sizes || "100vw", cls = "", w = 1600, h = 1200, decorative = false } = opts;
    const alt = decorative ? "" : image.alt || "";
    const loading = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    const tag = `<img class="${cls}" src="${esc(url(image.src))}" ${
      image.srcset ? `srcset="${esc(image.srcset)}" sizes="${esc(sizes)}"` : ""
    } alt="${esc(alt)}" width="${image.width || w}" height="${image.height || h}" ${loading} decoding="async">`;
    if (!image.avif && !image.webp) return tag;
    return `<picture>${image.avif ? `<source type="image/avif" srcset="${esc(url(image.avif))}">` : ""}${
      image.webp ? `<source type="image/webp" srcset="${esc(url(image.webp))}">` : ""
    }${tag}</picture>`;
  };

  const whatsappHref = () => {
    const n = String(CFG().whatsappNumber || "").replace(/\D/g, "");
    if (!n) return "";
    return `https://wa.me/${n}?text=${encodeURIComponent(CFG().whatsappMessage || "")}`;
  };

  const currentPage = () => document.body.dataset.page || "";
  const contactHref = () => (currentPage() === "inicio" ? "#contacto" : url("pages/contacto.html"));

  /* ------------------------------------------------------------------ */
  /* Navbar                                                              */
  /* ------------------------------------------------------------------ */
  const Header = () => {
    const page = currentPage();
    const links = C().nav
      .map(
        (l) =>
          `<li><a href="${esc(url(l.href))}"${l.id === page ? ' aria-current="page"' : ""}>${esc(l.label)}</a></li>`
      )
      .join("");
    const mobileLinks = [...C().nav, ...C().navSecondary]
      .map(
        (l, i) =>
          `<li style="--i:${i}"><a href="${esc(url(l.href))}"${l.id === page ? ' aria-current="page"' : ""}><small>${String(
            i + 1
          ).padStart(2, "0")}</small>${esc(l.label)}</a></li>`
      )
      .join("");

    return `
<a class="skip-link" href="#main">Saltar al contenido</a>
<div class="scroll-progress" aria-hidden="true"><span data-progress></span></div>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${esc(url("index.html"))}" aria-label="${esc(C().site.name)} — Inicio">
      ${logoMark()}<span class="brand__name">${esc(C().site.name)}</span>
    </a>
    <nav class="site-nav" aria-label="Principal"><ul>${links}</ul></nav>
    <div class="site-header__actions">
      <button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Cambiar tema">${icons.sun}${icons.moon}</button>
      <a class="btn btn--primary btn--sm site-header__cta" href="${esc(contactHref())}">Solicitar consulta</a>
      <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true" inert>
  <nav aria-label="Menú móvil"><ul class="mobile-menu__list">${mobileLinks}</ul></nav>
  <div class="mobile-menu__footer">
    <a class="btn btn--primary btn--lg" href="${esc(contactHref())}">Solicitar consulta</a>
    <p class="mobile-menu__meta">${esc(C().site.email)}</p>
  </div>
</div>`;
  };

  /* ------------------------------------------------------------------ */
  /* Footer                                                              */
  /* ------------------------------------------------------------------ */
  const Footer = () => {
    const s = C().site;
    const list = (items) =>
      items.map((i) => `<li><a href="${esc(url(i.href))}">${esc(i.label)}</a></li>`).join("");
    const services = C().services.slice(0, 5).map((sv) => ({ label: sv.title, href: `pages/servicios.html#${sv.id}` }));
    const areas = C().areas.slice(0, 5).map((a) => ({ label: a.title, href: `pages/areas.html#${a.id}` }));
    const social = s.social
      .map((so) =>
        so.url
          ? `<li><a href="${esc(so.url)}" target="_blank" rel="noopener noreferrer">${esc(so.label)}</a></li>`
          : `<li><span class="is-placeholder">${esc(so.label)} · pendiente</span></li>`
      )
      .join("");
    const year = new Date().getFullYear();

    return `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="site-footer__lead">
      ${lighthouseArt("site-footer__beacon")}
      <p class="site-footer__claim">${esc(s.tagline)}</p>
      <a class="btn btn--primary btn--lg" href="${esc(contactHref())}">Solicitar consulta ${icons.arrow.replace("<svg", '<svg class="btn__icon btn__icon--arrow"')}</a>
    </div>
    <div class="site-footer__grid">
      <div><h2>Navegación</h2><ul>${list([...C().nav.slice(1), ...C().navSecondary])}</ul></div>
      <div><h2>Servicios</h2><ul>${list(services)}</ul></div>
      <div><h2>Áreas jurídicas</h2><ul>${list(areas)}</ul></div>
      <div>
        <h2>Contacto</h2>
        <ul>
          <li><span class="is-placeholder">${esc(s.email)}</span></li>
          <li><span class="is-placeholder">${esc(s.phone)}</span></li>
          <li><span class="is-placeholder">${esc(s.address)}</span></li>
        </ul>
        <h2 style="margin-top:var(--spacing-lg)">Redes sociales</h2>
        <ul>${social}</ul>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p>© ${year} ${esc(s.name)}. Todos los derechos reservados.</p>
      <nav class="site-footer__legal" aria-label="Legal">${C()
        .legal.map((l) => `<a href="${esc(url(l.href))}">${esc(l.label)}</a>`)
        .join("")}</nav>
    </div>
  </div>
</footer>`;
  };

  /* ------------------------------------------------------------------ */
  /* ServiceCard (panel horizontal en Inicio)                            */
  /* ------------------------------------------------------------------ */
  const ServicePanel = (s) => `
<li class="service-panel" id="panel-${esc(s.id)}">
  <div class="media service-panel__media">${img(s.image, { sizes: "(min-width:1024px) 34vw, (min-width:768px) 62vw, 100vw" })}</div>
  <p class="service-panel__num"><span>${esc(s.number)}</span>${s.confirmed ? "" : badge()}</p>
  <h3>${esc(s.title)}</h3>
  <p class="service-panel__summary">${esc(s.summary)}</p>
  <p class="service-panel__benefit">${esc(s.benefit)}</p>
  <a class="link-arrow" href="${esc(url("pages/servicios.html#" + s.id))}">Explorar servicio<span class="visually-hidden">: ${esc(s.title)}</span> ${icons.arrow}</a>
</li>`;

  const ServicesPanels = (el) => {
    const limit = Number(el.dataset.limit) || 99;
    return C()
      .services.filter((s) => s.featured)
      .slice(0, limit)
      .map(ServicePanel)
      .join("");
  };

  /* ------------------------------------------------------------------ */
  /* ServiceIndex (página Servicios, expandible)                         */
  /* ------------------------------------------------------------------ */
  const ServiceIndex = () =>
    `<ul class="service-index" role="list">${C()
      .services.map(
        (s) => `
  <li class="service-index__item" id="${esc(s.id)}" data-collapsible>
    <h2 class="visually-hidden">${esc(s.title)}</h2>
    <button class="service-index__toggle" type="button" aria-expanded="false" aria-controls="panel-body-${esc(s.id)}">
      <span class="service-index__num">${esc(s.number)}</span>
      <span class="service-index__title">${esc(s.title)}</span>
      <span class="plus-icon" aria-hidden="true"></span>
    </button>
    <div class="collapse" id="panel-body-${esc(s.id)}">
      <div class="collapse__inner">
        <div class="service-index__panel">
          <div class="media">${img(s.image, { sizes: "(min-width:768px) 50vw, 100vw" })}</div>
          <div class="service-index__body">
            ${s.confirmed ? "" : `<p>${badge("Servicio por confirmar")}</p>`}
            <p class="lead">${esc(s.summary)}</p>
            <dl>
              <div><dt>Descripción</dt><dd>${esc(s.description)}</dd></div>
              <div><dt>Beneficio</dt><dd>${esc(s.benefit)}</dd></div>
            </dl>
            <p><a class="btn btn--primary" href="${esc(url("pages/contacto.html"))}?tipo=${encodeURIComponent(
          s.title
        )}">Consultar sobre ${esc(s.title.toLowerCase())} ${icons.arrow.replace(
          "<svg",
          '<svg class="btn__icon btn__icon--arrow"'
        )}</a></p>
          </div>
        </div>
      </div>
    </div>
  </li>`
      )
      .join("")}</ul>`;

  /* ------------------------------------------------------------------ */
  /* Áreas de práctica                                                   */
  /* ------------------------------------------------------------------ */
  const Areas = () =>
    `<ul class="area-list" role="list">${C()
      .areas.map(
        (a, i) => `
  <li class="area" id="${esc(a.id)}" data-reveal style="--reveal-delay:${(i % 3) * 60}ms">
    <div class="area__head"><span class="area__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(a.title)}</h3>${
          a.confirmed ? "" : badge()
        }</div>
    <p>${esc(a.summary)}</p>
  </li>`
      )
      .join("")}</ul>`;

  /* ------------------------------------------------------------------ */
  /* LawyerCard (equipo editorial)                                       */
  /* ------------------------------------------------------------------ */
  const Team = (el) => {
    const limit = Number(el.dataset.limit) || 99;
    const team = C().team.slice(0, limit);
    const stage = team
      .map((m, i) =>
        img(m.photo, { cls: i === 0 ? "is-active" : "", w: 1200, h: 1500, sizes: "40vw", decorative: true })
      )
      .join("");
    const items = team
      .map(
        (m, i) => `
  <li class="member${i === 0 ? " is-active" : ""}" data-member="${i}" data-collapsible>
    <div class="media member__media">${img(m.photo, { w: 1200, h: 1500, sizes: "100vw" })}</div>
    <button class="member__toggle" type="button" aria-expanded="false" aria-controls="member-${esc(m.id)}">
      <span class="member__num">${String(i + 1).padStart(2, "0")}</span>
      <span><span class="member__name">${esc(m.name)}</span><span class="member__role">${esc(m.role)} · ${esc(
          m.specialty
        )}</span></span>
      <span class="plus-icon" aria-hidden="true"></span>
    </button>
    <div class="collapse" id="member-${esc(m.id)}">
      <div class="collapse__inner">
        <div class="member__details">
          <dl>
            <div><dt>Especialidad</dt><dd>${esc(m.specialty)}</dd></div>
            <div><dt>Formación</dt><dd>${esc(m.education)}</dd></div>
            <div><dt>Experiencia</dt><dd>${esc(m.experience)}</dd></div>
            <div><dt>Áreas de práctica</dt><dd>${m.areas.map(esc).join(", ")}</dd></div>
          </dl>
          <p class="member__bio">${esc(m.bio)}</p>
          <p class="member__links">${
            m.linkedin
              ? `<a class="link-arrow" href="${esc(m.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ${icons.external}</a>`
              : `<span class="tag-pending">LinkedIn pendiente</span>`
          }</p>
        </div>
      </div>
    </div>
  </li>`
      )
      .join("");
    return `
<div class="team" data-team>
  <div class="media team__stage" aria-hidden="true">${stage}<span class="team__stage-caption" data-team-caption>${esc(
      team[0] ? team[0].name : ""
    )}</span></div>
  <ol class="team__list" role="list">${items}</ol>
</div>`;
  };

  /* ------------------------------------------------------------------ */
  /* Indicadores                                                         */
  /* ------------------------------------------------------------------ */
  const Stats = () => {
    const stats = C().stats;
    const anyDemo = stats.some((s) => s.demo);
    return `
<dl class="stats__grid">${stats
      .map(
        (s, i) => `
  <div class="stat" data-reveal style="--reveal-delay:${i * 90}ms">
    <dt>${esc(s.label)}</dt>
    <dd><span class="unit">${esc(s.prefix)}</span><span data-count="${Number(s.value)}">${Number(s.value)}</span>${esc(
          s.suffix
        )}</dd>
  </div>`
      )
      .join("")}
</dl>
${anyDemo ? `<p class="stats__note">${badge("Datos de demostración")} Cifras ilustrativas pendientes de validación por Red Pericial.</p>` : ""}`;
  };

  /* ------------------------------------------------------------------ */
  /* Metodología                                                         */
  /* ------------------------------------------------------------------ */
  const Methodology = () => {
    const steps = C().methodology;
    const total = String(steps.length).padStart(2, "0");
    return `
<div class="method" data-method>
  <div class="method__stage" aria-hidden="true">
    <p class="method__count"><span data-method-current>01</span><small>/ ${total}</small></p>
    <p class="method__stage-title" data-method-title>${esc(steps[0].title)}</p>
    <div class="method__bar"><span data-method-bar></span></div>
  </div>
  <ol class="method__steps" role="list">${steps
    .map(
      (s, i) => `
    <li class="method__step${i === 0 ? " is-active" : ""}" data-step="${i}">
      <span class="method__num">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        ${s.points && s.points.length ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      </div>
    </li>`
    )
    .join("")}
  </ol>
</div>`;
  };

  /* ------------------------------------------------------------------ */
  /* Compromisos y Testimonios                                           */
  /* ------------------------------------------------------------------ */
  const Commitments = () =>
    `<ul class="commitments" role="list">${C()
      .commitments.map((c, i) => `<li data-reveal style="--reveal-delay:${i * 70}ms">${esc(c.title)}<span>${esc(c.note)}</span></li>`)
      .join("")}</ul>`;

  const Testimonial = (t) => `
<figure class="testimonial" data-reveal>
  <blockquote><p>${esc(t.quote)}</p></blockquote>
  <figcaption>${esc(t.author)} · ${esc(t.role)} ${t.ready ? "" : badge("Pendiente de aprobación")}</figcaption>
</figure>`;

  const Testimonials = () => `<div class="testimonials">${C().testimonials.map(Testimonial).join("")}</div>`;

  /* ------------------------------------------------------------------ */
  /* BlogCard                                                            */
  /* ------------------------------------------------------------------ */
  const Post = (a) => {
    const href = url(`pages/articulo.html?id=${encodeURIComponent(a.id)}`);
    return `
<li class="post" data-category="${esc(a.category)}" data-reveal>
  <div class="media post__media">${img(a.image, { w: 1600, h: 1000, sizes: "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw", decorative: true })}</div>
  <p class="post__meta"><span>${esc(a.category)}</span><span class="dot" aria-hidden="true"></span><time datetime="${esc(
      a.date
    )}">${formatDate(a.date)}</time><span class="dot" aria-hidden="true"></span><span>${esc(a.readTime)} min</span>${
      a.example ? badge("Ejemplo") : ""
    }</p>
  <h3><a href="${esc(href)}">${esc(a.title)}</a></h3>
  <p class="post__excerpt">${esc(a.excerpt)}</p>
  <a class="link-arrow" href="${esc(href)}" tabindex="-1" aria-hidden="true">Leer artículo ${icons.arrow}</a>
</li>`;
  };

  const Posts = (el) => {
    const limit = Number(el.dataset.limit) || 99;
    const articles = [...C().articles].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
    let filters = "";
    if (el.dataset.filters !== undefined) {
      const cats = [...new Set(articles.map((a) => a.category))];
      filters = `<div class="filters" role="group" aria-label="Filtrar por categoría">
        <button class="btn btn--ghost btn--sm" type="button" data-filter="*" aria-pressed="true">Todas</button>
        ${cats
          .map((c) => `<button class="btn btn--ghost btn--sm" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}</button>`)
          .join("")}
      </div>`;
    }
    return `${filters}<ul class="posts" role="list" data-posts>${articles.map(Post).join("")}</ul>`;
  };

  /* ------------------------------------------------------------------ */
  /* Artículo (detalle)                                                  */
  /* ------------------------------------------------------------------ */
  const Article = () => {
    const id = new URLSearchParams(location.search).get("id");
    const a = C().articles.find((x) => x.id === id) || C().articles[0];
    if (!a) return `<div class="container section"><p>Artículo no encontrado.</p></div>`;
    RP.currentArticle = a;
    const body = a.body
      .map((p) => (p.startsWith("## ") ? `<h2>${esc(p.slice(3))}</h2>` : `<p>${esc(p)}</p>`))
      .join("");
    return `
<article>
  <header class="container container--narrow article-header">
    <nav class="breadcrumb" aria-label="Ruta de navegación"><ol>
      <li><a href="${esc(url("index.html"))}">Inicio</a></li>
      <li><a href="${esc(url("pages/blog.html"))}">Actualidad</a></li>
      <li aria-current="page">${esc(a.category)}</li>
    </ol></nav>
    <h1>${esc(a.title)}</h1>
    <p class="post__meta"><span>${esc(a.category)}</span><span class="dot" aria-hidden="true"></span><time datetime="${esc(
      a.date
    )}">${formatDate(a.date)}</time><span class="dot" aria-hidden="true"></span><span>${esc(a.readTime)} min de lectura</span>${
      a.example ? badge("Artículo de ejemplo") : ""
    }</p>
  </header>
  <div class="container">
    <div class="media article-media">${img(a.image, { eager: true, w: 1600, h: 1000 })}</div>
  </div>
  <div class="container container--narrow article-body"><div class="prose">${body}</div>
    <p style="margin-top:var(--spacing-xl)"><a class="link-arrow" href="${esc(url("pages/blog.html"))}">Volver a Actualidad ${icons.arrow}</a></p>
  </div>
</article>`;
  };

  /* ------------------------------------------------------------------ */
  /* FAQItem                                                             */
  /* ------------------------------------------------------------------ */
  const FAQ = (el) => {
    const limit = Number(el.dataset.limit) || 99;
    return `<div class="faq">${C()
      .faq.slice(0, limit)
      .map(
        (f) => `
  <details class="faq__item">
    <summary><span>${esc(f.q)}</span><span class="plus-icon" aria-hidden="true"></span></summary>
    <div class="faq__answer"><p>${esc(f.a)}</p></div>
  </details>`
      )
      .join("")}</div>`;
  };

  /* ------------------------------------------------------------------ */
  /* Casos                                                               */
  /* ------------------------------------------------------------------ */
  const Cases = () =>
    `<ul class="cases" role="list">${C()
      .cases.map(
        (c, i) => `
  <li class="case" data-reveal>
    <div class="case__head"><span class="area__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(c.title)}</h3>${badge(
          "Pendiente"
        )}</div>
    <dl>
      <div><dt>Sector</dt><dd>${esc(c.sector)}</dd></div>
      <div><dt>Desafío</dt><dd>${esc(c.challenge)}</dd></div>
      <div><dt>Enfoque</dt><dd>${esc(c.approach)}</dd></div>
      <div><dt>Resultado</dt><dd>${esc(c.result)}</dd></div>
    </dl>
  </li>`
      )
      .join("")}</ul>`;

  /* ------------------------------------------------------------------ */
  /* WhatsApp CTA                                                        */
  /* ------------------------------------------------------------------ */
  const WhatsApp = () => {
    const href = whatsappHref();
    const inner = `<span class="whatsapp__icon">${icons.chat}</span>
      <span><span class="whatsapp__title">Escríbanos por WhatsApp</span><span class="whatsapp__text">${
        href ? "Respuesta en horario de atención" : "Número pendiente de configuración"
      }</span></span>${icons.arrow}`;
    return href
      ? `<a class="whatsapp" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${inner}<span class="visually-hidden"> (se abre en una nueva pestaña)</span></a>`
      : `<a class="whatsapp" role="link" aria-disabled="true" tabindex="-1">${inner}</a>`;
  };

  /* ------------------------------------------------------------------ */
  /* Canales de contacto                                                 */
  /* ------------------------------------------------------------------ */
  const ContactChannels = () => {
    const s = C().site;
    const val = (v, href) =>
      isPlaceholder(v) || !href ? `<span class="is-placeholder">${esc(v)}</span>` : `<a href="${esc(href)}">${esc(v)}</a>`;
    return `
${WhatsApp()}
<dl class="channels">
  <div class="channel"><dt>Correo</dt><dd>${val(s.email, "mailto:" + s.email)}</dd></div>
  <div class="channel"><dt>Teléfono</dt><dd>${val(s.phone, s.phoneHref ? "tel:" + s.phoneHref : "")}</dd></div>
  <div class="channel"><dt>Ubicación</dt><dd>${val(s.address, s.mapsUrl)}<br><span class="is-placeholder">${esc(s.city)}</span></dd></div>
  <div class="channel"><dt>Horario</dt><dd><span class="is-placeholder">${esc(s.hours)}</span></dd></div>
</dl>`;
  };

  /* ------------------------------------------------------------------ */
  /* ContactForm                                                         */
  /* ------------------------------------------------------------------ */
  const ContactForm = () => {
    const preset = new URLSearchParams(location.search).get("tipo") || "";
    const options = C()
      .inquiryTypes.map((t) => `<option${t === preset ? " selected" : ""}>${esc(t)}</option>`)
      .join("");
    return `
<form class="form" data-form="contact" novalidate aria-describedby="form-legal">
  <div class="form__row">
    <div class="field">
      <label for="f-name">Nombre completo</label>
      <input id="f-name" name="name" type="text" autocomplete="name" required minlength="2" aria-describedby="f-name-error">
      <p class="field__error" id="f-name-error" aria-live="polite"></p>
    </div>
    <div class="field">
      <label for="f-email">Correo electrónico</label>
      <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-error">
      <p class="field__error" id="f-email-error" aria-live="polite"></p>
    </div>
  </div>
  <div class="form__row">
    <div class="field">
      <label for="f-phone">Teléfono</label>
      <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="f-phone-error">
      <p class="field__error" id="f-phone-error" aria-live="polite"></p>
    </div>
    <div class="field">
      <label for="f-company">Empresa <span class="opt">(opcional)</span></label>
      <input id="f-company" name="company" type="text" autocomplete="organization">
    </div>
  </div>
  <div class="field">
    <label for="f-type">Tipo de consulta</label>
    <select id="f-type" name="type" required aria-describedby="f-type-error">
      <option value=""${preset ? "" : " selected"} disabled>Seleccione una opción</option>
      ${options}
    </select>
    <p class="field__error" id="f-type-error" aria-live="polite"></p>
  </div>
  <div class="field">
    <label for="f-message">Mensaje</label>
    <textarea id="f-message" name="message" rows="5" required minlength="20" maxlength="2000" aria-describedby="f-message-hint f-message-error" placeholder="Cuéntenos brevemente su caso. No incluya información sensible en este primer contacto."></textarea>
    <p class="field__hint" id="f-message-hint"><span>Mínimo 20 caracteres.</span><span data-counter>0 / 2000</span></p>
    <p class="field__error" id="f-message-error" aria-live="polite"></p>
  </div>
  <div class="hp" aria-hidden="true"><label for="f-website">No completar</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
  <div class="field">
    <label class="check" for="f-privacy">
      <input id="f-privacy" name="privacy" type="checkbox" required aria-describedby="f-privacy-error">
      <span>He leído y acepto la <a href="${esc(url("legal/privacidad.html"))}">política de privacidad</a> y autorizo el <a href="${esc(
      url("legal/tratamiento-datos.html")
    )}">tratamiento de mis datos personales</a>.</span>
    </label>
    <p class="field__error" id="f-privacy-error" aria-live="polite"></p>
  </div>
  <p class="form__legal" id="form-legal">Sus datos serán tratados por ${esc(
    C().site.name
  )} únicamente para responder a su solicitud, conforme a la política de tratamiento de datos. [TEXTO LEGAL POR DEFINIR]</p>
  <div class="form__actions">
    <button class="btn btn--primary btn--lg" type="submit"><span class="spinner" aria-hidden="true"></span><span data-label>Enviar solicitud</span></button>
  </div>
  <div class="form__status" role="status" aria-live="polite" data-form-status></div>
</form>`;
  };

  /* ------------------------------------------------------------------ */
  /* Registro y montaje                                                  */
  /* ------------------------------------------------------------------ */
  const registry = {
    header: Header,
    footer: Footer,
    "services-panels": ServicesPanels,
    "service-index": ServiceIndex,
    areas: Areas,
    team: Team,
    stats: Stats,
    methodology: Methodology,
    commitments: Commitments,
    testimonials: Testimonials,
    posts: Posts,
    article: Article,
    faq: FAQ,
    cases: Cases,
    whatsapp: WhatsApp,
    "contact-channels": ContactChannels,
    "contact-form": ContactForm,
  };

  /** Renderiza todos los [data-component]. header/footer reemplazan su contenedor. */
  const mount = (scope = document) => {
    scope.querySelectorAll("[data-component]").forEach((el) => {
      const name = el.dataset.component;
      const render = registry[name];
      if (!render) return console.warn(`[RP] Componente desconocido: ${name}`);
      const html = render(el);
      if (name === "header" || name === "footer") el.outerHTML = html;
      else el.innerHTML = html;
    });
  };

  RP.utils = { esc, url, root, isPlaceholder, badge, formatDate, icons, img, whatsappHref, logoMark, lighthouseArt };
  RP.components = { registry, mount };
})();
