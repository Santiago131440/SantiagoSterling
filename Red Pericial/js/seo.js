/* ==========================================================================
   SEO — Datos estructurados (JSON-LD)
   Solo publica campos con datos reales (no vacíos ni entre corchetes).
   Tipos preparados: LegalService, Organization, Person, Article, FAQPage,
   BreadcrumbList.
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});

  const real = (v) => v && !/^\s*\[/.test(String(v));
  const clean = (obj) => {
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      if (v == null || v === "" || (typeof v === "string" && !real(v)) || (Array.isArray(v) && !v.length)) delete obj[k];
      else if (typeof v === "object" && !Array.isArray(v)) {
        clean(v);
        if (Object.keys(v).length <= 1 && v["@type"]) delete obj[k];
      }
    });
    return obj;
  };

  const inject = (data) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  };

  const abs = (path) => {
    const base = window.RP_CONTENT.site.url.replace(/\/$/, "");
    return `${base}/${String(path).replace(/^\.?\//, "")}`;
  };

  const organization = () => {
    const s = window.RP_CONTENT.site;
    return clean({
      "@context": "https://schema.org",
      "@type": ["LegalService", "Organization"],
      "@id": abs("#organization"),
      name: s.name,
      url: s.url,
      logo: abs(s.logo),
      description: s.description,
      email: s.email,
      telephone: s.phoneHref,
      address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: s.city },
      sameAs: s.social.map((x) => x.url).filter(real),
    });
  };

  const breadcrumb = () => {
    const page = document.body.dataset.page;
    if (!page || page === "inicio") return null;
    const title = document.body.dataset.title || document.title.split("—")[0].trim();
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: abs("") },
        { "@type": "ListItem", position: 2, name: title, item: abs(location.pathname.split("/").slice(-2).join("/")) },
      ],
    };
  };

  const people = () =>
    window.RP_CONTENT.team
      .filter((m) => m.ready)
      .map((m) =>
        clean({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: m.role,
          worksFor: { "@id": abs("#organization") },
          sameAs: [m.linkedin].filter(real),
        })
      );

  const faq = () => {
    const items = window.RP_CONTENT.faq.filter((f) => f.ready);
    if (!items.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    };
  };

  const article = (a) =>
    a && !a.example
      ? clean({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          datePublished: a.date,
          articleSection: a.category,
          image: abs(a.image.src),
          publisher: { "@id": abs("#organization") },
        })
      : null;

  const init = () => {
    if (!window.RP_CONFIG.seo.emitStructuredData) return;
    const page = document.body.dataset.page;
    inject(organization());
    const bc = breadcrumb();
    if (bc) inject(bc);
    if (page === "equipo") people().forEach(inject);
    if (page === "faq") { const f = faq(); if (f) inject(f); }
    if (page === "articulo" && RP.currentArticle) {
      const a = RP.currentArticle;
      document.title = `${a.title} — Red Pericial`;
      const md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", a.excerpt);
      const j = article(a);
      if (j) inject(j);
    }
  };

  RP.seo = { init };
})();
