# Red Pericial — Sitio web corporativo

Sitio corporativo de **Red Pericial**, un grupo de abogados y profesionales periciales. Está pensado como una experiencia narrativa premium: minimalista y precisa, con tema claro y oscuro, accesible y lista para migrar a React o Next.js.

> **Concepto visual: "el faro".** Todo el diseño gira alrededor del logotipo corporativo: un faro que proyecta luz. En el hero, su haz barre una red de nodos (los profesionales) y la ilumina. Tagline: *"Luz sobre los hechos."* Las decisiones completas están en [`docs/DISENO.md`](docs/DISENO.md).

---

## Objetivo

- Aumentar la visibilidad de Red Pericial en Internet (SEO técnico desde el día uno).
- Transmitir confianza y autoridad desde el primer contacto.
- Presentar con claridad los servicios, el equipo y el método de trabajo.
- Convertir visitas en consultas (formulario, WhatsApp y CTA persistente).

## Tecnologías

| Capa | Tecnología |
|---|---|
| Estructura | HTML5 semántico |
| Estilos | CSS3 con custom properties (sin preprocesador) |
| Lógica | JavaScript ES6+ (sin frameworks) |
| Tipografía | Inter Variable **auto-alojada** (`assets/fonts`, licencia OFL) |
| Dependencias externas | **Ninguna** |

### ¿Por qué no GSAP, Lenis, Swiper ni Lucide?

Cada efecto pedido se resolvió con APIs nativas. Así el sitio carga 0 KB de terceros y no depende de ninguna CDN.

| Librería | Uso típico | Alternativa implementada |
|---|---|---|
| GSAP + ScrollTrigger | Animaciones ligadas al scroll | `IntersectionObserver` + `requestAnimationFrame` + `position: sticky` (`js/scroll.js`) |
| Lenis | Scroll suave | `scroll-behavior: smooth` nativo. Lenis intercepta el scroll y empeora la accesibilidad. |
| Swiper | Carruseles | `scroll-snap` CSS (servicios en tablet) |
| Lucide | Iconos | 8 iconos SVG inline en `js/components.js` |

**Cuándo sí añadir GSAP:** si en el futuro se necesitan coreografías complejas (timelines encadenados o morphing de SVG). Se integraría con `npm i gsap` o con un `<script>` antes de `js/main.js`, reemplazando las funciones de `js/scroll.js`.

---

## Estructura

```text
red-pericial/
├── index.html                 Inicio: experiencia narrativa completa
├── 404.html
├── pages/                     Páginas internas
│   ├── nosotros.html  servicios.html  areas.html  equipo.html
│   ├── metodologia.html  experiencia.html  blog.html  articulo.html
│   └── faq.html  contacto.html
├── legal/                     privacidad · tratamiento-datos · terminos
├── css/
│   ├── reset.css              Reset moderno
│   ├── variables.css          ★ Sistema de diseño (tokens claro/oscuro)
│   ├── base.css               Tipografía, layout, full-bleed, accesibilidad
│   ├── components.css         Botones, navbar, formulario, footer…
│   ├── sections.css           Escenas: hero, identidad, problema, servicios…
│   ├── animations.css         Reveal, entrada del hero, reduced-motion
│   └── responsive.css         Breakpoints 768 / 1024 / 1440
├── js/
│   ├── config.js              ★ WhatsApp, animaciones, endpoint del formulario
│   ├── components.js          Componentes (datos → HTML)
│   ├── theme.js               Claro/oscuro + localStorage
│   ├── navigation.js          Menú móvil accesible, header dinámico
│   ├── scroll.js              Progreso, parallax, horizontal, sticky
│   ├── animations.js          Reveal, contadores, hero (canvas)
│   ├── interactions.js        Colapsables, equipo, filtros
│   ├── forms.js               Validación y servicio de envío
│   ├── seo.js                 JSON-LD (Schema.org)
│   └── main.js                Arranque
├── data/
│   └── content.js             ★ TODO el contenido editable
├── assets/
│   ├── fonts/  images/{services,team,blog,editorial}/  icons/  logo/
├── docs/DISENO.md             Arquitectura, dirección de arte, UX
├── sitemap.xml  robots.txt  site.webmanifest
├── README.md  CHANGELOG.md
```

**Cambios respecto a la estructura del brief** (justificados en `docs/DISENO.md`): se añadieron `js/config.js`, `js/components.js`, `js/interactions.js` y `js/seo.js`, y las páginas `areas`, `metodologia`, `articulo`, `terminos` y `404`. El objetivo es separar **contenido** (`data/`) de **comportamiento** (`config.js`) y de **presentación** (componentes), igual que en una app React.

---

## Instalación y ejecución local

No requiere instalación ni compilación. Solo hay que servir la carpeta:

```bash
# Opción 1 — Python
cd red-pericial
python3 -m http.server 8080
# http://localhost:8080

# Opción 2 — Node
npx serve .

# Opción 3 — VS Code
# Extensión "Live Server" → clic derecho en index.html → Open with Live Server
```

> También funciona abriendo `index.html` con doble clic, porque los scripts son clásicos (no módulos ES). Aun así, se recomienda un servidor local para probar rutas y el formulario.

### Dependencias

Ninguna en tiempo de ejecución. Para desarrollo, cualquier servidor estático.

---

## Guía de edición

### Cambiar colores, tipografía o espaciado

Todo está en **`css/variables.css`**:

```css
:root {
  --color-accent: #1d4ed8;        /* azul principal (tema claro) */
  --font-primary: "Inter Var", ...;
  --section-space: clamp(...);
}
:root[data-theme="dark"] {
  --color-accent: #7c9bff;        /* azul en tema oscuro */
}
```

> Si cambia un color, actualice también su canal RGB (`--rgb-accent`, `--rgb-text`). Lo usan el canvas del hero y algunas transparencias. El bloque `@media (prefers-color-scheme: dark)` del final es el respaldo sin JavaScript: mantenga sus valores iguales a los de `[data-theme="dark"]`.

### Cambiar textos

- **Contenido dinámico** (servicios, áreas, equipo, cifras, metodología, testimonios, artículos, FAQ, datos de contacto): **`data/content.js`**.
- **Textos narrativos de las escenas** (hero, identidad, problema, propuesta de valor): directamente en `index.html` y en cada página, porque son importantes para el SEO.

### Convención de placeholders

| Marca | Significado |
|---|---|
| `[POR DEFINIR]`, `[DATOS DEL CLIENTE]` | Texto pendiente |
| `confirmed: false` | Servicio o área no validado → muestra "Por confirmar" |
| `demo: true` | Cifra ilustrativa → muestra "Datos de demostración" |
| `ready: false` | No se publica en datos estructurados |

Al tener el contenido real, ponga `showPlaceholderBadges: false` en `js/config.js`.

Para encontrar todo lo pendiente:

```bash
grep -rn "\[POR DEFINIR\]\|\[DATOS\|POR DEFINIR\|redpericial.example" --include=*.{html,js} .
```

### Cambiar el logotipo (faro)

La marca incluida es **provisional** y fue dibujada para este proyecto. Para usar el logotipo oficial:

1. Reemplace `assets/logo/logo.svg`, `logo-mark.svg` (claro) y `logo-mark-dark.svg` (oscuro), además de `assets/icons/favicon.svg` y `apple-touch-icon.png`.
2. En `js/components.js`, `logoMark()` contiene la marca inline del navbar (inline para que herede el color del tema). Pegue ahí el SVG oficial y use `currentColor` para las líneas.
3. `lighthouseArt()` es la ilustración grande del hero y del footer. El haz del canvas nace del elemento con `data-lamp`: si redibuja el faro, conserve ese atributo en la lámpara.
4. Ajuste `--color-accent`, `--rgb-accent` y `--rgb-beam` en `css/variables.css` a los colores oficiales.

### Cambiar imágenes

Las imágenes actuales son **composiciones SVG provisionales**. Para reemplazarlas por fotografías reales:

1. Exporte cada foto en **AVIF + WebP + JPG** (por ejemplo, 1600 px de ancho).
2. Guárdelas en `assets/images/...`.
3. En `data/content.js` amplíe el objeto de imagen:

```js
image: {
  src:  "assets/images/services/civil.jpg",
  avif: "assets/images/services/civil.avif",
  webp: "assets/images/services/civil.webp",
  alt:  "Descripción real de la fotografía",
  width: 1600, height: 1200,
}
```

El componente genera `<picture>` con las fuentes modernas, `loading="lazy"` y dimensiones explícitas para evitar saltos de maquetación.

Las imágenes marcadas como *full-bleed* tocan ambos bordes en móvil. El margen negativo usa `--gutter`, de modo que no se desborda por la barra de scroll. Existe además `.full-bleed-vw` (100vw) para elementos que no estén dentro de un contenedor con gutter.

### Agregar un abogado

En `data/content.js` → `team`, copie un objeto:

```js
{
  id: "maria-perez",
  name: "María Pérez",
  role: "Socia",
  specialty: "Derecho comercial",
  education: "Abogada · Especialista en …",
  experience: "15 años",
  areas: ["Derecho comercial", "Contratos"],
  bio: "…",
  photo: { src: "assets/images/team/maria-perez.jpg", alt: "María Pérez, socia de Red Pericial" },
  linkedin: "https://www.linkedin.com/in/…",
  ready: true,       // publica también Schema.org/Person
}
```

Fotografía recomendada: vertical 4:5, mínimo 1200×1500 px, fondo neutro y luz suave.

### Agregar un servicio

`data/content.js` → `services`. Con `featured: true` aparece en el recorrido horizontal de Inicio. El `id` se usa como ancla (`servicios.html#<id>`) y abre el panel automáticamente.

### Agregar un artículo

`data/content.js` → `articles`. El `body` es un array de párrafos; las líneas que empiezan por `## ` se convierten en subtítulos. Se accede en `pages/articulo.html?id=<id>`. Ponga `example: false` para publicar su schema `Article`.

> Para un blog con volumen, conviene migrar a un CMS headless (ver "Migración").

### Cambiar el número de WhatsApp

`js/config.js`:

```js
whatsappNumber: "000000000000",   // formato internacional, solo dígitos, sin "+"
whatsappMessage: "Hola, quisiera solicitar una consulta con Red Pericial.",
```

Con el número vacío, el CTA aparece como "pendiente de configuración".

### Activar o desactivar animaciones

`js/config.js`:

```js
animations: true,                 // false = sitio completamente estático
effects: {
  heroNetwork: true,              // faro + haz de luz + red del hero
  horizontalServices: true,       // scroll horizontal fijado (desktop)
  parallax: true,
  wordReveal: true,
  hideHeaderOnScroll: true,
},
```

`prefers-reduced-motion: reduce` desactiva todo automáticamente, con independencia de esta configuración.

### Conectar el formulario

`js/config.js` → `forms.endpoint`. El formulario envía un `POST` JSON:

```json
{ "name": "", "email": "", "phone": "", "company": "", "type": "", "message": "",
  "privacy": true, "source": "/pages/contacto.html", "submittedAt": "ISO-8601" }
```

Opciones compatibles: una API propia (Node, FastAPI, .NET), Formspree, Basin, un webhook de n8n o Make, o el endpoint de un CRM. Si necesita otra forma de envío (por ejemplo, EmailJS), reemplace solo `RP.formService.send()` en `js/forms.js`.

Con el endpoint vacío, el formulario funciona en **modo demostración**: valida, pero no envía ni guarda nada. El sitio no almacena datos personales en el navegador.

---

## SEO

- `<title>`, `meta description`, `canonical`, Open Graph y Twitter Cards en cada página.
- Jerarquía de encabezados: un `h1` por página y `h2` por sección.
- `sitemap.xml`, `robots.txt` y `site.webmanifest`.
- JSON-LD generado por `js/seo.js`, **solo con datos reales**: `LegalService`/`Organization`, `BreadcrumbList`, `Person` (equipo con `ready: true`), `FAQPage` (preguntas con `ready: true`) y `Article` (artículos con `example: false`).
- **Dominio:** reemplace `https://redpericial.example` en todo el proyecto (HTML, `sitemap.xml`, `robots.txt` y `data/content.js`).

> Nota: el navbar, el footer y los listados se renderizan con JavaScript desde `data/content.js`. Google procesa JavaScript, pero para un SEO óptimo en producción se recomienda pre-renderizar (paso natural hacia Next.js; ver abajo). Los titulares y textos narrativos principales ya están en el HTML estático.

## Accesibilidad

HTML semántico, enlace "saltar al contenido", foco visible, navegación completa por teclado, menú con `aria-expanded` e `inert`, trampa de foco y cierre con Escape. FAQ con `<details>`. Formulario con `label`, `aria-invalid`, mensajes con `aria-live` y foco en el primer error. Contraste WCAG AA en ambos temas. Soporte de `prefers-reduced-motion` y `prefers-color-scheme`.

## Rendimiento

- 0 dependencias externas; fuente auto-alojada (48 KB) con `preload` y `font-display: swap`.
- Scripts con `defer`; imágenes con `loading="lazy"`, `decoding="async"` y dimensiones explícitas.
- Animaciones solo con `transform`/`opacity`, un único bucle `requestAnimationFrame`.
- El canvas del hero se pausa fuera de pantalla y en pestañas ocultas; DPR limitado a 2.
- **Producción:** minifique y concatene CSS y JS (por ejemplo `npx esbuild` o `lightningcss`) y sirva con compresión Brotli.

---

## Despliegue

Es un sitio estático; cualquiera de estas opciones funciona:

| Plataforma | Pasos |
|---|---|
| **Netlify** | Arrastrar la carpeta a app.netlify.com/drop, o conectar el repo (sin comando de build, carpeta `/`) |
| **Vercel** | `npx vercel` en la carpeta del proyecto |
| **GitHub Pages** | Subir al repo → Settings → Pages → rama `main`, carpeta `/` |
| **Cloudflare Pages** | Conectar el repo, sin build, salida `/` |
| **Hosting tradicional** | Subir por FTP al `public_html` |

Configure `404.html` como página de error y active HTTPS.

## Migración futura

```text
HTML/CSS/JS ──► React ──► Next.js ──► API ──► CMS / Base de datos
```

| Hoy | Mañana |
|---|---|
| `data/content.js` | JSON → API → CMS headless (Sanity, Strapi, Contentful) |
| `components.js` (`Header()`, `Team()`…) | `<Header/>`, `<Team/>` en JSX (misma estructura) |
| `css/variables.css` | Se conserva tal cual, o se pasa a `tailwind.config` |
| `js/scroll.js`, `animations.js` | Hooks `useScrollProgress`, `useReveal` |
| `RP.formService.send()` | Route Handler de Next.js o Server Action |
| `seo.js` | `generateMetadata()` y JSON-LD en el servidor |
