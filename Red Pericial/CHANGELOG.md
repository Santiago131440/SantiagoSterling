# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [1.1.0] — 2026-09-25

### Cambiado
- Identidad reorientada al logotipo corporativo: **un faro que proyecta luz**.
- Nuevo titular y tagline: "Luz sobre los hechos." (antes "El derecho, demostrado.").
- Hero: el dial de precisión se sustituye por un faro lineal sobre un horizonte. Un haz de luz animado nace en su lámpara, barre la escena, sigue suavemente al cursor en escritorio e ilumina los nodos de la red que toca.
- Marca del navbar, favicon, `logo.svg`, icono táctil e imagen Open Graph rediseñados con el faro (versión provisional).
- Copy de identidad, principios, propuesta de valor ("Una red. Un solo rumbo."), Nosotros y 404 alineado con la metáfora del faro.

### Añadido
- Tokens `--rgb-beam` y `--beam-alpha` para el haz de luz en ambos temas.
- Haz de luz de fondo en la escena oscura (con oscilación), en las cabeceras de páginas internas y en las bandas de conversión.
- Destello de luz al pasar el cursor por los botones primarios y brillo en la barra de progreso.
- Faro en el footer e ilustración editorial `horizonte.svg`.
- Parallax del faro al hacer scroll.

### Eliminado
- Dial/lente del hero e ilustración `editorial/red.svg`.

## [1.0.0] — 2026-09-25

### Añadido
- Arquitectura, dirección de arte y storytelling documentados en `docs/DISENO.md`.
- Sistema de diseño centralizado en `css/variables.css` con tema claro y oscuro.
- Página de inicio narrativa: Hero (red + lente), Identidad, Problema, Propuesta de valor, Servicios (scroll horizontal fijado), Experiencia, Equipo, Metodología (sticky), Confianza, Actualidad, FAQ y Contacto.
- Páginas internas: Nosotros, Servicios, Áreas de práctica, Equipo, Metodología, Experiencia, Actualidad, Artículo, FAQ y Contacto.
- Páginas legales provisionales: privacidad, tratamiento de datos y términos.
- Contenido centralizado en `data/content.js`, con placeholders claramente marcados.
- Componentes reutilizables en `js/components.js`.
- Formulario con validación accesible, honeypot y servicio de envío desacoplado.
- CTA de WhatsApp configurable desde `js/config.js`.
- SEO técnico: metadatos, Open Graph, Twitter Cards, sitemap, robots y JSON-LD condicionado a datos reales.
- Tipografía Inter Variable auto-alojada; cero dependencias externas.
- Imágenes editoriales SVG provisionales, logotipo provisional, favicon, icono táctil e imagen Open Graph.

### Pendiente del cliente
- Logotipo oficial del faro (SVG) y colores corporativos, fotografías, textos institucionales, servicios confirmados, equipo, cifras, casos, testimonios, datos de contacto, número de WhatsApp, dominio y documentos legales.
