/* ==========================================================================
   Formulario de contacto
   - Validación accesible (aria-invalid, mensajes vinculados, foco al error)
   - Honeypot anti-spam
   - Envío desacoplado: RP.formService.send(payload) → API / email / CRM
   - No se almacena ningún dato en el navegador.
   ========================================================================== */

(function () {
  "use strict";
  const RP = (window.RP = window.RP || {});

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Ingrese su nombre completo."),
    email: (v) => (!v.trim() ? "Ingrese su correo electrónico." : EMAIL.test(v.trim()) ? "" : "Revise el formato del correo (ej. nombre@empresa.com)."),
    phone: (v) => {
      const digits = v.replace(/\D/g, "");
      if (!digits) return "Ingrese un número de teléfono.";
      if (!/^[+\d\s().-]+$/.test(v.trim()) || digits.length < 7 || digits.length > 15) return "Ingrese un teléfono válido (7 a 15 dígitos).";
      return "";
    },
    type: (v) => (v ? "" : "Seleccione el tipo de consulta."),
    message: (v) => (v.trim().length >= 20 ? "" : `Escriba al menos 20 caracteres (${v.trim().length}/20).`),
    privacy: (_, el) => (el.checked ? "" : "Debe aceptar la política de privacidad para continuar."),
  };

  /* ---- Servicio de envío (punto único de integración) ---- */
  RP.formService = {
    async send(payload) {
      const cfg = window.RP_CONFIG.forms;
      if (!cfg.endpoint) {
        // Modo demostración: simula latencia, no envía ni guarda datos.
        await new Promise((r) => setTimeout(r, 900));
        return { ok: true, demo: true };
      }
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), cfg.timeoutMs || 12000);
      try {
        const res = await fetch(cfg.endpoint, {
          method: cfg.method || "POST",
          headers: cfg.headers,
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        return { ok: res.ok, status: res.status };
      } finally {
        clearTimeout(t);
      }
    },
  };

  const validateField = (form, el, show = true) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const msg = rule(el.value || "", el);
    const errorEl = form.querySelector(`#${el.id}-error`);
    if (show) {
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (errorEl) errorEl.textContent = msg;
    }
    return !msg;
  };

  const setLoading = (btn, on) => {
    btn.classList.toggle("is-loading", on);
    btn.disabled = on;
    btn.setAttribute("aria-busy", String(on));
    const label = btn.querySelector("[data-label]");
    if (label) label.textContent = on ? "Enviando…" : "Enviar solicitud";
  };

  const initForm = (form) => {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('[type="submit"]');
    const fields = [...form.querySelectorAll("input[name], select[name], textarea[name]")].filter((f) => rules[f.name]);
    const message = form.querySelector('[name="message"]');
    const counter = form.querySelector("[data-counter]");

    // Validación diferida: al salir del campo; luego en vivo si ya tuvo error
    fields.forEach((el) => {
      el.addEventListener("blur", () => { if (el.value || el.type === "checkbox") validateField(form, el); });
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
        if (el.getAttribute("aria-invalid") === "true") validateField(form, el);
      });
    });

    if (message && counter) {
      const max = Number(message.getAttribute("maxlength")) || 2000;
      message.addEventListener("input", () => { counter.textContent = `${message.value.length} / ${max}`; });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("is-error");

      const invalid = fields.filter((el) => !validateField(form, el));
      if (invalid.length) {
        invalid[0].focus();
        status.classList.add("is-error");
        status.textContent = `Revise ${invalid.length === 1 ? "el campo marcado" : `los ${invalid.length} campos marcados`}.`;
        return;
      }

      // Honeypot: si un bot lo completó, fingir éxito sin enviar
      if (form.website && form.website.value) {
        form.reset();
        status.textContent = "Gracias. Hemos recibido su solicitud.";
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;
      const payload = {
        ...data,
        privacy: true,
        source: location.pathname,
        submittedAt: new Date().toISOString(),
      };

      setLoading(submit, true);
      try {
        const res = await RP.formService.send(payload);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        fields.forEach((el) => el.removeAttribute("aria-invalid"));
        if (counter) counter.textContent = `0 / ${message.getAttribute("maxlength") || 2000}`;
        status.textContent = res.demo
          ? "Formulario validado correctamente (modo demostración: aún no está conectado a un servicio de envío)."
          : "Gracias. Hemos recibido su solicitud y nos pondremos en contacto pronto.";
      } catch (err) {
        status.classList.add("is-error");
        status.textContent = "No pudimos enviar su solicitud. Inténtelo de nuevo o escríbanos por correo.";
      } finally {
        setLoading(submit, false);
        status.setAttribute("tabindex", "-1");
        if (status.textContent) status.focus({ preventScroll: false });
      }
    });
  };

  const init = () => document.querySelectorAll('form[data-form="contact"]').forEach(initForm);

  RP.forms = { init, rules };
})();
