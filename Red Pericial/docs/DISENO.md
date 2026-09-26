# Red Pericial — Arquitectura, dirección de arte y UX

Documento de decisiones previas al desarrollo (pasos 1 a 3 del brief).
Todo dato marcado como `[POR DEFINIR]` o `[DATOS DEL CLIENTE]` debe ser validado por Red Pericial.

---

## PASO 1 — Arquitectura

### Sitemap

```text
/                              Inicio (experiencia narrativa completa)
├── /pages/nosotros.html       Identidad, propósito, principios
├── /pages/servicios.html      Índice interactivo de servicios
├── /pages/areas.html          Áreas de práctica (11)
├── /pages/equipo.html         Equipo jurídico y pericial (editorial)
├── /pages/metodologia.html    Método en 5 fases (sticky storytelling)
├── /pages/experiencia.html    Indicadores + estructura de casos
├── /pages/blog.html           Actualidad jurídica (filtro por categoría)
│   └── /pages/articulo.html?id=…   Plantilla única de artículo
├── /pages/faq.html            Preguntas frecuentes (<details>)
├── /pages/contacto.html       Formulario + canales directos
└── /legal/
    ├── privacidad.html
    ├── tratamiento-datos.html
    └── terminos.html
```

### Arquitectura de información

| Nivel | Contenido | Objetivo |
|---|---|---|
| Inicio | Resumen narrativo de todo el sitio | Primera impresión + conversión |
| Institucional | Nosotros, Metodología, Equipo | Confianza y autoridad |
| Oferta | Servicios, Áreas | Claridad sobre qué resuelven |
| Prueba | Experiencia, Testimonios | Evidencia (pendiente de datos reales) |
| Contenido | Actualidad, FAQ | SEO y educación del cliente |
| Conversión | Contacto, WhatsApp, CTA persistente | Captación |

### Flujo de navegación

```text
Entrada (Google / redes / directo)
   │
   ├─► Inicio ──► Servicios ──► Detalle de servicio ──► Contacto
   │      │
   │      ├─► Equipo ──► Perfil ──► Contacto
   │      └─► Scroll narrativo ──► Contacto (final de página)
   │
   ├─► Artículo (SEO) ──► Área relacionada ──► Contacto
   └─► FAQ ──► Contacto
```

El CTA "Solicitar consulta" está siempre visible en el navbar; cada página interna cierra con una banda de conversión.

### Estructura de carpetas (ajustes respecto al brief)

Se respeta la estructura propuesta con cuatro adiciones justificadas:

- `js/config.js` — configuración centralizada (WhatsApp, animaciones, endpoint del formulario). Separa "cómo se comporta" de "qué dice" (`data/content.js`).
- `js/components.js` — renderizado de componentes reutilizables (Navbar, Footer, ServiceCard, LawyerCard…). Equivale 1:1 a futuros componentes React.
- `js/seo.js` — genera JSON-LD (Schema.org) solo con datos reales del cliente.
- `pages/areas.html`, `pages/metodologia.html`, `pages/articulo.html`, `legal/terminos.html` — el sitemap del brief las exige.
- `docs/` — este documento.

---

## PASO 2 — Dirección de arte

### Concepto

**"El faro."** El logotipo corporativo de Red Pericial es un faro que proyecta luz, y todo el sistema visual gira alrededor de él. Un faro no decide el rumbo: lo hace visible. Esa es la promesa de una firma jurídica y pericial: iluminar los hechos para decidir con claridad.

| Elemento del faro | Traducción en el sitio |
|---|---|
| El faro | Marca en el navbar, ilustración lineal en el hero y en el footer |
| El haz de luz | Canvas del hero: un cono que barre la escena y sigue al cursor |
| Lo que la luz revela | La red de nodos (los profesionales) se enciende en azul al pasar el haz |
| El horizonte | Línea fina que asienta el faro y ordena el hero |
| La noche / la niebla | Escena oscura del "Problema", atravesada por un haz que oscila |
| Destellos | Barrido de luz en los botones primarios; brillo en la barra de progreso |
| Iluminar el texto | La declaración de identidad se "enciende" palabra a palabra con el scroll |

Nada de balanzas, mazos ni columnas. El haz siempre se dibuja como luz fría (azul muy claro), nunca como un color adicional: la paleta sigue siendo sobria.

> **Marca provisional:** la marca del faro incluida en `assets/logo/` es una versión de trabajo original. Cuando el cliente entregue el logotipo oficial (SVG), reemplácela y ajuste `--color-accent` y `--rgb-beam` a sus colores corporativos.

### Paleta

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--color-background` | `#FBFBFD` | `#0A0A0C` | Fondo |
| `--color-surface` | `#F2F2F5` | `#131316` | Bandas secundarias |
| `--color-text` | `#0B0B0F` | `#F5F5F7` | Titulares y texto |
| `--color-muted` | `#5D5E66` | `#A1A1AA` | Texto secundario (≥ 4.5:1) |
| `--color-accent` | `#1D4ED8` | `#7C9BFF` | Azul jurídico-tecnológico, uso mínimo |
| `--rgb-beam` / `--beam-alpha` | azul, 7 % | azul claro, 8,5 % | Haz de luz del faro |
| `--color-inverse-bg` | `#0B0B0F` | `#141418` | Escena "Problema" |

Regla: el azul aparece solo en CTA primario, estados activos, la lámpara del faro, lo que el haz ilumina y el indicador de progreso.

### Tipografía

Inter Variable (auto-alojada, 48 KB, subconjunto latino con acentos y ñ) → SF Pro → system-ui.
Titulares 600, tracking negativo (-0.035em), interlineado 1.02–1.1. Texto 400, interlineado 1.65. Eyebrows en mayúsculas 11–12 px con tracking +0.14em.

Escala fluida con `clamp()`: display 44→120 px, h2 32→64 px, lead 18→22 px.

### Espaciado

Base 4 px. Tokens `--spacing-2xs` a `--spacing-3xl`. Secciones con `--section-space: clamp(5rem, 3rem + 8vw, 10rem)`. Gutter fluido `clamp(20px, … , 64px)`.

### Imágenes

- Tono editorial grafito + luz azul fría; sin marcos, sin bordes, sin sombras.
- En móvil, las imágenes marcadas como full-bleed tocan ambos bordes del viewport.
- Mientras no existan fotografías reales, se usan composiciones SVG abstractas (líneas, contornos, retículas) claramente identificadas como provisionales en el `alt` y en `data/content.js`.

### Botones

- Primario: píldora azul, texto blanco, 44 px mínimo de área táctil.
- Secundario: píldora con fondo sutil (sin borde duro).
- Enlace: texto + flecha que se desplaza 4 px en hover.

### "Cards"

Evitadas deliberadamente. Servicios, áreas y equipo se presentan como **índices editoriales** (número + titular grande + separador de 1 px), no como tarjetas.

### Navbar

Transparente sobre el hero → vidrio (blur 20 px + saturación) al hacer scroll → se oculta al bajar y reaparece al subir. En móvil: menú a pantalla completa con enlaces numerados en cascada, bloqueo de scroll y cierre automático.

### Footer

Gran frase de cierre + CTA, cuatro columnas de navegación, enlaces legales y año dinámico.

### Animaciones

Solo `transform` y `opacity`. Curva `cubic-bezier(.16,1,.3,1)`. Duraciones 180 ms (micro), 420 ms (UI), 900 ms (escenas). Con `prefers-reduced-motion` todo se muestra estático.

### Dark Mode

Tokens redefinidos, no inversión de colores. Detección inicial por `prefers-color-scheme`, persistencia en `localStorage`, script de 6 líneas en `<head>` para evitar parpadeo.

---

## PASO 3 — UX y storytelling

```text
HERO           "Luz sobre los hechos."          → el faro y su haz sobre la red
   ↓
IDENTIDAD      "Como un faro…": texto que se ilumina palabra a palabra
   ↓
PROBLEMA       La noche: escena oscura atravesada por un haz de luz
   ↓
PROPUESTA      "Una red. Un solo rumbo." — cuatro principios
   ↓
SERVICIOS      Scroll horizontal fijado (desktop) / lista full-bleed (móvil)
   ↓
EXPERIENCIA    Cifras grandes con contador (marcadas como demostración)
   ↓
EQUIPO         Índice editorial + retrato grande que cambia al pasar el cursor
   ↓
METODOLOGÍA    Contador fijo 01→05 mientras avanzan las fases
   ↓
CONFIANZA      Compromisos + testimonios (pendientes de aprobación)
   ↓
CONTENIDO      Actualidad jurídica + FAQ
   ↓
CONTACTO       Formulario validado + WhatsApp + canales
```

### Alternativas de copy para el Hero

1. **"Luz sobre los hechos."** — Seleccionada (v1.1). Une el faro (luz) con el oficio pericial (los hechos). Es el tagline de la marca.
2. "El derecho, demostrado." — Titular de la v1.0; se conserva como alternativa para campañas.
3. "Rumbo claro en cada caso." — Más cercana al cliente, menos ligada a la prueba.

Subtítulo: *"Abogados y peritos que iluminan cada caso con criterio jurídico y prueba técnica, para que usted decida con rumbo claro."*

### Decisión sobre librerías

No se usan librerías externas. Cada efecto pedido tiene una implementación nativa ligera:

| Librería sugerida | Alternativa nativa implementada |
|---|---|
| GSAP / ScrollTrigger | `IntersectionObserver` + `requestAnimationFrame` + `position: sticky` |
| Lenis (smooth scroll) | `scroll-behavior: smooth` nativo (Lenis altera el scroll y perjudica accesibilidad) |
| Swiper | `scroll-snap` CSS |
| Lucide Icons | SVG inline propios (6 iconos) |

Resultado: 0 dependencias, ~0 KB de terceros. Si en el futuro se requiere coreografía compleja, GSAP es el candidato natural (ver README).
