/* ==========================================================================
   Interacciones de componentes
   - Colapsables (servicios, equipo) con aria-expanded
   - Equipo: el retrato del escenario cambia con hover/foco (desktop)
   - Filtro de artículos por categoría
   - Apertura automática por #ancla (ej. servicios.html#peritajes)
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});

  const setExpanded = (item, open) => {
    const btn = item.querySelector("[aria-expanded]");
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(open));
    item.classList.toggle("is-expanded", open);
  };

  const initCollapsibles = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-collapsible] > button[aria-expanded], [data-collapsible] button[aria-controls]");
      if (!btn) return;
      const item = btn.closest("[data-collapsible]");
      setExpanded(item, btn.getAttribute("aria-expanded") !== "true");
    });

    const openFromHash = () => {
      if (!location.hash) return;
      let target;
      try { target = document.querySelector(decodeURIComponent(location.hash)); } catch (e) { return; }
      if (target && target.matches("[data-collapsible]")) {
        setExpanded(target, true);
        setTimeout(() => target.scrollIntoView({ behavior: "auto", block: "start" }), 50);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  };

  const initTeam = () => {
    document.querySelectorAll("[data-team]").forEach((team) => {
      const stageImgs = team.querySelectorAll(".team__stage img");
      const caption = team.querySelector("[data-team-caption]");
      const members = team.querySelectorAll("[data-member]");
      const activate = (i) => {
        members.forEach((m, k) => m.classList.toggle("is-active", k === i));
        stageImgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
        if (caption) caption.textContent = members[i].querySelector(".member__name").textContent;
      };
      members.forEach((m, i) => {
        m.addEventListener("pointerenter", () => activate(i));
        m.addEventListener("focusin", () => activate(i));
      });
    });
  };

  const initFilters = () => {
    document.querySelectorAll(".filters").forEach((group) => {
      const list = group.parentElement.querySelector("[data-posts]");
      if (!list) return;
      group.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (!btn) return;
        const f = btn.dataset.filter;
        group.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        list.querySelectorAll(".post").forEach((p) => {
          p.hidden = f !== "*" && p.dataset.category !== f;
          p.classList.add("is-visible");
        });
      });
    });
  };

  const init = () => {
    initCollapsibles();
    initTeam();
    initFilters();
  };

  RP.interactions = { init };
})();
