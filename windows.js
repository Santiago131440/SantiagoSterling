let activeWindows = {};
let zCounter = 50;
let draggingWindow = null;
let dragOffset = { x: 0, y: 0 };
let resizingWindow = null;
let resizingMode = "";
let resizeStart = { x: 0, y: 0, w: 0, h: 0, left: 0, top: 0 };
let draggingIcon = null;
let draggingIconOffset = { x: 0, y: 0 };
let iconDragMoved = false;
let contextTarget = null;
let recycleBin = [];

/* ============================================================
   APP DEFINITIONS
============================================================ */
const apps = {
    explorer: {
        title: "Finder",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-0QeQPgJUNilwfLLC5l1AnfScdu7OC2.png&w=1000&q=75",
        width: 760, height: 500, type: "system"
    },
    aplicaciones: {
        title: "App Store",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-soM5VkrS231RkzTJKdb30Wco5dj6aJ.png&w=500&q=75",
        width: 880, height: 600, type: "system"
    },
    browser: {
        title: "Safari",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75",
        width: 960, height: 640,
        content: `<div style="width:100%;height:100%;display:flex;flex-direction:column;background:#f5f5f7;">
  <div style="height:42px;background:rgba(246,246,246,0.95);border-bottom:1px solid rgba(0,0,0,0.08);
    display:flex;align-items:center;padding:0 14px;gap:8px;">
    <button onclick="document.getElementById('browserFrame').src=document.getElementById('browserFrame').src"
      style="background:rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.1);color:#333;
      width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;">↺</button>
    <div style="flex:1;background:rgba(0,0,0,0.07);border:1px solid rgba(0,0,0,0.1);
      border-radius:20px;height:28px;display:flex;align-items:center;padding:0 12px;gap:6px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input id="browserInput" placeholder="Buscar o escribir una URL"
        onkeydown="if(event.key==='Enter'){searchGoogle()}"
        style="flex:1;background:transparent;border:none;font-size:12px;color:#333;outline:none;">
    </div>
  </div>
  <iframe id="browserFrame" src="https://www.google.com/webhp?igu=1" style="flex:1;border:none;"></iframe>
</div>`
    },
    notes: {
        title: "Notas",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-zGyBqZLV8MGRs1NxccwHoHjQc5XtsK.png&w=1000&q=75",
        width: 560, height: 440, type: "notes", content: ""
    },
    player: {
        title: "Sterling Music",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-j9GfZpCuZEAQwYOTxDIVxReq5y0OHg.png&w=500&q=75",
        width: 800, height: 580,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Music.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    mix: {
        title: "Sterling Music Studio",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-B2EekBDz0A46XdvgtBjgEAw79EH0Dk.png&w=500&q=75",
        width: 800, height: 580,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/mix.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    paint: {
        title: "Sterl-ink",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DPM2VMQ9vdZ4HcXLRwCFZ7FK5Fn7Bx.png&w=1000&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/ExperienciaLaboral.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    buscaminas: {
        title: "Sterling World",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-e3kGOJ1Nx9Q68omg5PbnlZh8hFAJkX.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Super Mario.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    excel: {
        title: "Sterling Math FX",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DHtLao0TXcz7zsJ6bxv2DltThCLwQ8.png&w=1000&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Sterling math fx.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    word: {
        title: "Sterling Letter",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BjimxRD0gb4rZBjr9jbO9LYXmOZJao.png&w=1000&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Sterling Letter.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    powerpoint: {
        title: "Sterling Presentation",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-L8T5N6DbL9jezTcIoss4pIKNG256jy.png&w=1000&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Sterling Presentation.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    airspace: {
        title: "Captain Sterling",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-yjBpDcYD9IjVGoIg4LnKkMKL1RBris.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Buscaminas.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
   salarios: {
        title: "Salarios Mundiales",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CsdmL6Mu7Mz9dPjZYw1Xq22mkGhekV.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Salarios.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
   examen: {
        title: "Examen de Software",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fLBUuECujebAYq2Ctir0tmm4ljvF0b.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/registro.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
   suma: {
        title: "Suma de compras",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-HCwnlHIkzR4wXtkTVAySMqAWigIejw.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Dashboard3.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
   video: {
        title: "Editor de videos",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Eu2Ph2tWRZNcZUBi5acmRTEYlQhMhx.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/Dashboard1.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    "recycle-bin": {
        title: "Papelera",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-hojVo7IEsndSCKEMMylnYGeF4E0HrU.png&w=500&q=75",
        width: 640, height: 420
    }
};

/* ============================================================
   FILE SYSTEM
============================================================ */
const fileSystem = {
    root: {
        type: "folder", name: "Macintosh HD",
        contents: {
            Documentos: {
                type: "folder",
                contents: {
                    "ReadMe.txt": { type: "file", app: "notes", content: `¡Hola! Soy Santiago Sterling\nTecnólogo en análisis y desarrollo de software y tecnólogo en Producción Industrial\n\nSoy un tecnólogo en Gestión de Producción Industrial con más de 8 años de experiencia en plantas de manufactura, y también tecnólogo en Análisis y Desarrollo de Software (SENA).\n\nMi propósito es integrar la eficiencia industrial con la inteligencia tecnológica, aplicando desarrollo de software, automatización y análisis de datos para optimizar procesos y generar soluciones escalables.` },
                    "Notas.txt": { type: "file", app: "notes", content: "- Comprar pan\n- Revisar proyecto Quantix\n- Enviar report" },
                    "record.txt": { type: "file", app: "notes", content: "Recordatorio:\nNo olvidar hacer backup de todo." },
                    "proyect.txt": { type: "file", app: "notes", content: "# Proyecto IA\nEste es el archivo principal del proyecto." }
                }
            },
            Música: { type: "folder", contents: { "cancion.txt": { type: "file", app: "player" } } },
            Videos: { type: "folder", contents: { "demo.txt": { type: "file", app: "player" } } },
            Imágenes: { type: "folder", contents: { "foto.png": { type: "file", app: "notes", content: "Archivo de imagen" } } }
        }
    }
};

/* ============================================================
   LOCK SCREEN
============================================================ */
function updateLockClock() {
    const now = new Date();
    const timeEl = document.getElementById("lockTime");
    const dateEl = document.getElementById("lockDate");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    if (dateEl) dateEl.textContent = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}
updateLockClock();
setInterval(updateLockClock, 1000);

const lockScreen = document.getElementById("lockScreen");
lockScreen.addEventListener("click", () => {
    lockScreen.style.transition = "opacity 0.6s ease";
    lockScreen.style.opacity = "0";
    setTimeout(() => {
        lockScreen.style.display = "none";
        showToast("Santiago Sterling", "Bienvenido, este es mi repositorio, donde encontraras mis proyectos completos.");
    }, 600);
});

/* ============================================================
   BROWSER HELPERS
============================================================ */
function searchGoogle() {
    const q = document.getElementById("browserInput")?.value;
    if (q) document.getElementById("browserFrame").src = "https://www.google.com/search?igu=1&q=" + encodeURIComponent(q);
}

/* ============================================================
   WINDOW CREATION
============================================================ */
function openApp(appName, extra = null) {
    if (activeWindows[appName]) {
        const w = activeWindows[appName].win;
        if (w.style.display === "none") restoreWindow(w);
        else focusWindow(w);
        return;
    }

    const app = apps[appName];
    if (!app) return;

    const win = document.createElement("div");
    win.className = "window";
    win.dataset.app = appName;

    const vw = window.innerWidth, vh = window.innerHeight - 80;
    const w = app.width || 640, h = app.height || 480;
    const left = Math.max(0, Math.min(vw - w, 100 + Math.random() * 100));
    const top  = Math.max(28, Math.min(vh - h, 50 + Math.random() * 60));
    win.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;z-index:${++zCounter}`;

    win.innerHTML = `
        <div class="window-header">
          <div class="mac-buttons">
            <div class="mac-btn close" title="Cerrar"><span class="btn-symbol">✕</span></div>
            <div class="mac-btn min" title="Minimizar"><span class="btn-symbol">−</span></div>
            <div class="mac-btn max" title="Maximizar"><span class="btn-symbol">+</span></div>
          </div>
          <div class="window-title">
            <img src="${app.icon}" alt="">
            <span>${app.title}</span>
          </div>
        </div>
        <div class="window-content"><div class="app-area" style="width:100%;height:100%;"></div></div>
    `;

    document.getElementById("windowsContainer").appendChild(win);
    const area = win.querySelector(".app-area");

    if (appName === "explorer") {
        loadFinder(win, fileSystem.root);
    } else if (appName === "aplicaciones") {
        loadStore(win);
    } else if (appName === "recycle-bin") {
        loadRecycleBin(win);
    } else if (app.type === "notes" || appName.startsWith("notes_")) {
        area.innerHTML = `
          <div class="notepad-container">
            <div class="notepad-toolbar">
              <button class="notepad-format-btn" title="Negrita"><b>B</b></button>
              <button class="notepad-format-btn" title="Cursiva"><i>I</i></button>
              <button class="notepad-format-btn" title="Subrayado"><u>U</u></button>
            </div>
            <textarea class="notepad-textarea" spellcheck="false" placeholder="Comienza a escribir…">${extra || app.content || ''}</textarea>
            <div class="notepad-status">
              <span>Autoguardado</span>
              <span>UTF-8</span>
            </div>
          </div>
        `;
    } else {
        area.innerHTML = app.content || "";
    }

    activeWindows[appName] = { win };
    updateDockItem(appName, true);
    makeDraggable(win);
    makeResizable(win);
    focusWindow(win);
    updateMenubarApp(appName);

    win.querySelector(".mac-btn.close").onclick = (e) => { e.stopPropagation(); closeWindow(win); };
    win.querySelector(".mac-btn.min").onclick = (e) => { e.stopPropagation(); minimizeWindow(win); };
    win.querySelector(".mac-btn.max").onclick = (e) => { e.stopPropagation(); toggleMaximize(win); };
    win.querySelector(".window-header").ondblclick = () => toggleMaximize(win);
}

function openTextFile(content) {
    const id = "notes_" + Date.now();
    apps[id] = { title: "Texto", icon: apps.notes.icon, width: 560, height: 400, type: "notes", content };
    openApp(id);
}

/* ============================================================
   DOCK ACTIVE DOTS
============================================================ */
function updateDockItem(appName, open) {
    document.querySelectorAll(`#dock .dock-item[data-app="${appName}"]`).forEach(item => {
        if (open) item.classList.add("active");
        else item.classList.remove("active");
    });
}

/* ============================================================
   MENUBAR APP NAME
============================================================ */
function updateMenubarApp(appName) {
    const el = document.getElementById("menubarAppName");
    if (el && apps[appName]) el.textContent = apps[appName].title;
}

/* ============================================================
   WINDOW MANAGEMENT
============================================================ */
function focusWindow(win) {
    document.querySelectorAll(".window").forEach(w => w.classList.remove("focused"));
    win.style.zIndex = ++zCounter;
    win.classList.add("focused");
    updateMenubarApp(win.dataset.app);
}

function closeWindow(win) {
    const app = win.dataset.app;
    win.style.transition = "opacity 0.18s, transform 0.18s";
    win.style.opacity = "0";
    win.style.transform = "scale(0.92)";
    setTimeout(() => {
        win.remove();
        delete activeWindows[app];
        updateDockItem(app, false);
    }, 180);
}

function minimizeWindow(win) {
    win.classList.add("minimizing");
    setTimeout(() => {
        win.classList.remove("minimizing");
        win.style.display = "none";
        const app = win.dataset.app;
        updateDockItem(app, false);
    }, 400);
}

function restoreWindow(win) {
    win.style.display = "flex";
    win.style.opacity = "0";
    win.style.transform = "scale(0.9)";
    requestAnimationFrame(() => {
        win.style.transition = "opacity 0.2s, transform 0.2s";
        win.style.opacity = "1";
        win.style.transform = "scale(1)";
        setTimeout(() => { win.style.transition = ""; }, 220);
    });
    focusWindow(win);
    updateDockItem(win.dataset.app, true);
}

function toggleMaximize(win) {
    if (win.classList.contains("maximized")) {
        win.classList.remove("maximized");
        const prev = win._prevGeometry;
        if (prev) {
            win.style.left = prev.left; win.style.top = prev.top;
            win.style.width = prev.width; win.style.height = prev.height;
        }
    } else {
        win._prevGeometry = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
        win.classList.add("maximized");
        const mh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menubar-h')) || 28;
        win.style.left = "0"; win.style.top = mh + "px";
        win.style.width = window.innerWidth + "px";
        win.style.height = (window.innerHeight - mh) + "px";
    }
}

/* ============================================================
   DRAGGING
============================================================ */
function makeDraggable(win) {
    const header = win.querySelector(".window-header");
    header.addEventListener("mousedown", (e) => {
        if (e.target.closest(".mac-buttons")) return;
        if (win.classList.contains("maximized")) return;
        draggingWindow = win;
        dragOffset.x = e.clientX - win.offsetLeft;
        dragOffset.y = e.clientY - win.offsetTop;
        focusWindow(win);
        e.preventDefault();
    });
}

document.addEventListener("mousemove", (e) => {
    if (draggingWindow) {
        draggingWindow.style.left = (e.clientX - dragOffset.x) + "px";
        draggingWindow.style.top  = Math.max(28, e.clientY - dragOffset.y) + "px";
    }
    if (resizingWindow) {
        const dx = e.clientX - resizeStart.x, dy = e.clientY - resizeStart.y;
        if (resizingMode.includes("e")) resizingWindow.style.width  = Math.max(300, resizeStart.w + dx) + "px";
        if (resizingMode.includes("s")) resizingWindow.style.height = Math.max(200, resizeStart.h + dy) + "px";
        if (resizingMode.includes("w")) {
            const nw = Math.max(300, resizeStart.w - dx);
            resizingWindow.style.width = nw + "px";
            resizingWindow.style.left = (resizeStart.left + resizeStart.w - nw) + "px";
        }
        if (resizingMode.includes("n")) {
            const nh = Math.max(200, resizeStart.h - dy);
            resizingWindow.style.height = nh + "px";
            resizingWindow.style.top = (resizeStart.top + resizeStart.h - nh) + "px";
        }
    }
    if (draggingIcon) {
        const nx = e.pageX - draggingIconOffset.x, ny = e.pageY - draggingIconOffset.y;
        if (Math.abs(nx - parseInt(draggingIcon.style.left)) > 4 || Math.abs(ny - parseInt(draggingIcon.style.top)) > 4) iconDragMoved = true;
        draggingIcon.style.left = nx + "px";
        draggingIcon.style.top  = Math.min(ny, window.innerHeight - 120) + "px";
    }
});

document.addEventListener("mouseup", () => {
    draggingWindow = null;
    resizingWindow = null;
    if (draggingIcon) { draggingIcon.classList.remove("dragging"); draggingIcon = null; }
});

/* ============================================================
   RESIZE
============================================================ */
function makeResizable(win) {
    const EDGE = 6;
    win.addEventListener("mousemove", (e) => {
        if (win.classList.contains("maximized")) return;
        const r = win.getBoundingClientRect();
        let mode = "";
        if (e.clientX > r.right - EDGE) mode += "e";
        if (e.clientX < r.left + EDGE) mode += "w";
        if (e.clientY > r.bottom - EDGE) mode += "s";
        if (e.clientY < r.top + EDGE) mode += "n";
        win.dataset.resize = mode;
        const cursors = { e:"ew-resize", w:"ew-resize", s:"ns-resize", n:"ns-resize", es:"nwse-resize", wn:"nwse-resize", en:"nesw-resize", ws:"nesw-resize" };
        win.style.cursor = cursors[mode] || "default";
    });
    win.addEventListener("mousedown", (e) => {
        const mode = win.dataset.resize;
        if (!mode || e.target.closest(".window-header") || e.target.closest(".mac-btn")) return;
        resizingWindow = win;
        resizingMode = mode;
        resizeStart = { x: e.clientX, y: e.clientY, w: win.offsetWidth, h: win.offsetHeight, left: win.offsetLeft, top: win.offsetTop };
        e.preventDefault();
    });
}

/* ============================================================
   DESKTOP ICON DRAG
============================================================ */
document.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.addEventListener("mousedown", (e) => {
        draggingIcon = icon;
        draggingIconOffset.x = e.offsetX;
        draggingIconOffset.y = e.offsetY;
        iconDragMoved = false;
        icon.classList.add("dragging");
    });
    icon.addEventListener("click", () => {
        if (!iconDragMoved) openApp(icon.dataset.app);
    });
});

/* ============================================================
   DOCK CLICKS
============================================================ */
document.querySelectorAll("#dock .dock-item").forEach(item => {
    item.addEventListener("click", () => {
        const appName = item.dataset.app;
        if (!appName) return;
        if (activeWindows[appName]) {
            const w = activeWindows[appName].win;
            if (w.style.display === "none") restoreWindow(w);
            else if (w === getFocusedWindow()) minimizeWindow(w);
            else focusWindow(w);
        } else {
            openApp(appName);
        }
    });
});

function getFocusedWindow() {
    let top = null, topZ = 0;
    Object.values(activeWindows).forEach(({ win }) => {
        if (win.style.display !== "none") {
            const z = parseInt(win.style.zIndex || 0);
            if (z > topZ) { topZ = z; top = win; }
        }
    });
    return top;
}

/* ============================================================
   FOCUS ON CLICK INSIDE CONTAINER
============================================================ */
document.getElementById("windowsContainer").addEventListener("mousedown", (e) => {
    const win = e.target.closest(".window");
    if (win) focusWindow(win);
});

/* ============================================================
   CONTEXT MENU
============================================================ */
const ctxMenu = document.getElementById("contextMenu");

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextTarget = e.target.closest(".desktop-icon") || null;
    const menuW = 220, menuH = 220;
    const x = Math.min(e.pageX, window.innerWidth - menuW - 8);
    const y = Math.min(e.pageY, window.innerHeight - menuH - 8);
    ctxMenu.style.left = x + "px";
    ctxMenu.style.top  = y + "px";
    ctxMenu.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
    if (!ctxMenu.contains(e.target)) ctxMenu.classList.add("hidden");
});

document.getElementById("ctxOpen").onclick = () => {
    if (contextTarget) openApp(contextTarget.dataset.app);
    ctxMenu.classList.add("hidden");
};
document.getElementById("ctxNewFolder").onclick = () => {
    ctxMenu.classList.add("hidden");
    showToast("Finder", "Nueva carpeta creada en el escritorio.");
};
document.getElementById("ctxGetInfo").onclick = () => {
    if (contextTarget) {
        const app = apps[contextTarget.dataset.app];
        showToast(app?.title || "Info", "Aplicación del sistema · Santiago Sterling OS");
    }
    ctxMenu.classList.add("hidden");
};
document.getElementById("ctxRename").onclick = () => {
    if (!contextTarget) return;
    ctxMenu.classList.add("hidden");
    const span = contextTarget.querySelector("span");
    const old = span.textContent;
    const input = document.createElement("input");
    input.value = old;
    input.className = "rename-input";
    span.replaceWith(input);
    input.select();
    const done = () => { const ns = document.createElement("span"); ns.textContent = input.value || old; input.replaceWith(ns); };
    input.onblur = done;
    input.onkeydown = (e) => { if (e.key === "Enter") input.blur(); if (e.key === "Escape") { input.value = old; input.blur(); } };
};
document.getElementById("ctxDelete").onclick = () => {
    if (!contextTarget) return;
    const appName = contextTarget.dataset.app;
    recycleBin.push(appName);
    contextTarget.style.transition = "opacity 0.2s, transform 0.2s";
    contextTarget.style.opacity = "0";
    contextTarget.style.transform = "scale(0.8)";
    setTimeout(() => contextTarget.remove(), 200);
    ctxMenu.classList.add("hidden");
    showToast("Papelera", `"${apps[appName]?.title}" movido a Papelera`);
};
document.getElementById("ctxWallpaper").onclick = () => {
    ctxMenu.classList.add("hidden");
    openPanel("wallpaperPanel");
};

/* ============================================================
   PANELS SYSTEM
============================================================ */
const panelIds = ["appleMenu", "controlCenter", "calendarPanel", "wallpaperPanel", "notifCenter", "spotlight"];

function closeAllPanels(except = null) {
    panelIds.forEach(id => {
        if (id !== except) document.getElementById(id)?.classList.add("hidden");
    });
    document.getElementById("spotlightBackdrop")?.classList.add("hidden");
}

function openPanel(id) {
    const isHidden = document.getElementById(id)?.classList.contains("hidden");
    closeAllPanels(id);
    document.getElementById(id)?.classList.toggle("hidden", !isHidden);
}

document.addEventListener("click", (e) => {
    const isPanel = e.target.closest("#appleMenu,#controlCenter,#calendarPanel,#wallpaperPanel,#notifCenter,#spotlight,#appleBtn,#controlCenterBtn,#menubar-clock,#clockArea,#notifBtn,#spotlightMenuBtn");
    if (!isPanel) {
        closeAllPanels();
    }
});

/* Apple Menu */
document.getElementById("appleBtn").onclick = (e) => { e.stopPropagation(); openPanel("appleMenu"); };
document.getElementById("appleMenuWallpaper")?.addEventListener("click", () => { closeAllPanels(); openPanel("wallpaperPanel"); });
document.getElementById("appleMenuSpotlight")?.addEventListener("click", () => { closeAllPanels(); openPanel("spotlight"); document.getElementById("spotlightInput")?.focus(); });
document.getElementById("appleMenuMission")?.addEventListener("click", () => { closeAllPanels(); showMissionControl(); });

/* Control Center */
document.getElementById("controlCenterBtn").onclick = (e) => { e.stopPropagation(); openPanel("controlCenter"); };

/* Calendar / Clock */
const clockArea = document.getElementById("menubar-clock") || document.getElementById("clockArea");
if (clockArea) clockArea.onclick = (e) => { e.stopPropagation(); openPanel("calendarPanel"); };

/* Notifications */
document.getElementById("notifBtn").onclick = (e) => { e.stopPropagation(); openPanel("notifCenter"); };

/* Spotlight */
document.getElementById("spotlightMenuBtn").onclick = (e) => {
    e.stopPropagation();
    const hidden = document.getElementById("spotlight").classList.contains("hidden");
    closeAllPanels("spotlight");
    document.getElementById("spotlight").classList.toggle("hidden", !hidden);
    document.getElementById("spotlightBackdrop").classList.toggle("hidden", !hidden);
    if (!hidden) {} else { document.getElementById("spotlightInput")?.focus(); }
};

document.getElementById("spotlightBackdrop").onclick = () => {
    closeAllPanels();
};

/* Spotlight search */
const spotlightInput = document.getElementById("spotlightInput");
const spotlightResults = document.getElementById("spotlightResults");

spotlightInput?.addEventListener("input", () => {
    const q = spotlightInput.value.toLowerCase().trim();
    if (!q) { spotlightResults.classList.add("hidden"); return; }
    const matches = Object.entries(apps).filter(([, app]) => app.title.toLowerCase().includes(q));
    if (!matches.length) { spotlightResults.classList.add("hidden"); return; }
    spotlightResults.innerHTML = `<div class="spotlight-section-label">Aplicaciones</div>`;
    matches.forEach(([key, app]) => {
        const item = document.createElement("div");
        item.className = "spotlight-result-item";
        item.innerHTML = `<img src="${app.icon}" alt=""><div><div class="spotlight-result-name">${app.title}</div><div class="spotlight-result-sub">Aplicación</div></div>`;
        item.onclick = () => { openApp(key); closeAllPanels(); };
        spotlightResults.appendChild(item);
    });
    spotlightResults.classList.remove("hidden");
});

spotlightInput?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllPanels();
});

/* ============================================================
   CLOCK & CALENDAR
============================================================ */
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById("clock-time");
    const dateEl = document.getElementById("clock-date");
    const fullEl = document.getElementById("clockFull");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    if (dateEl) dateEl.textContent = now.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short" });
    if (fullEl) fullEl.textContent = now.toLocaleString("es-CO", { weekday:"long", year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

let calCurrentDate = new Date(), calSelectedDay = null;
const DAYS = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];

function renderCalendar() {
    const cal = document.getElementById("calendar");
    const monthYearEl = document.getElementById("monthYear");
    if (!cal) return;
    cal.innerHTML = "";
    const year = calCurrentDate.getFullYear(), month = calCurrentDate.getMonth();
    monthYearEl.textContent = calCurrentDate.toLocaleDateString("es-CO", { month:"long", year:"numeric" });
    DAYS.forEach(d => { const el = document.createElement("div"); el.className = "calendar-header"; el.textContent = d; cal.appendChild(el); });
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < firstDay; i++) cal.appendChild(Object.assign(document.createElement("div"), { className: "calendar-day calendar-muted" }));
    const total = new Date(year, month+1, 0).getDate();
    const today = new Date();
    for (let d = 1; d <= total; d++) {
        const el = document.createElement("div");
        el.className = "calendar-day";
        el.textContent = d;
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) el.classList.add("calendar-today");
        if (d === calSelectedDay) el.classList.add("calendar-selected");
        el.onclick = () => { document.querySelectorAll(".calendar-day").forEach(x => x.classList.remove("calendar-selected")); el.classList.add("calendar-selected"); calSelectedDay = d; };
        cal.appendChild(el);
    }
}

function changeMonth(dir) {
    calCurrentDate.setMonth(calCurrentDate.getMonth() + dir);
    renderCalendar();
}

renderCalendar();

/* ============================================================
   WALLPAPER
============================================================ */
document.getElementById("closeWallpaperPanel").onclick = () => document.getElementById("wallpaperPanel").classList.add("hidden");

document.getElementById("wallpaperInput").onchange = function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        document.body.style.backgroundImage = `url('${reader.result}')`;
        document.getElementById("lockScreen").style.backgroundImage = `url('${reader.result}')`;
    };
    reader.readAsDataURL(file);
};

document.querySelectorAll("#wallpaperList img").forEach(img => {
    img.onclick = () => {
        document.body.style.backgroundImage = `url('${img.src}')`;
        document.querySelectorAll("#wallpaperList img").forEach(i => i.classList.remove("active"));
        img.classList.add("active");
    };
});

/* ============================================================
   FINDER (macOS style)
============================================================ */
function loadFinder(win, folder) {
    const area = win.querySelector(".app-area");
    area.style.padding = "0";

    area.innerHTML = `
        <div class="finder-container">
          <div class="finder-sidebar">
            <div class="finder-sidebar-section">
              <div class="finder-sidebar-label">Favoritos</div>
              <div class="finder-sidebar-item active" id="findHome">
                <i class="fi fi-sr-devices"></i> Macintosh HD
              </div>
              <div class="finder-sidebar-item" id="findDocs">
                <i class="fi fi-sr-document-folder-gear"></i> Documentos
              </div>
              <div class="finder-sidebar-item" id="findMusica">
                <i class="fi fi-sr-folder-music"></i> Música
              </div>
              <div class="finder-sidebar-item" id="findImg">
                <i class="fi fi-sr-folder-image"></i> Imágenes
              </div>
            </div>
            <div class="finder-sidebar-section">
              <div class="finder-sidebar-label">Dispositivos</div>
              <div class="finder-sidebar-item">
                <i class="fi fi-sr-disc-drive"></i> Macintosh HD
              </div>
            </div>
          </div>
          <div class="finder-main">
            <div class="finder-toolbar">
              <div class="finder-nav-btn" id="findBack">‹</div>
              <div class="finder-nav-btn" id="findFwd">›</div>
              <div class="finder-path" id="finderPath"><span class="current">Macintosh HD</span></div>
              <input class="finder-search" placeholder="Buscar" id="finderSearch">
            </div>
            <div class="finder-grid" id="finderGrid"></div>
            <div class="finder-status" id="finderStatus">0 ítems</div>
          </div>
        </div>
    `;

    const loadFolder = (node, name) => {
        const grid = area.querySelector("#finderGrid");
        const status = area.querySelector("#finderStatus");
        const pathEl = area.querySelector("#finderPath");
        grid.innerHTML = "";
        if (pathEl) pathEl.innerHTML = `<span class="current">${name}</span>`;
        if (!node || !node.contents) return;
        const items = Object.entries(node.contents);
        items.forEach(([itemName, item]) => {
            const el = document.createElement("div");
            el.className = "finder-item";
            const icon = item.type === "folder"
                ? "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-En0WuV9h3Cjev3oISjtJqXetnfA18d.png&w=1000&q=75"
                : "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-a3SkroygtTE6lQGs0XbfDco9M3lV7H.png&w=1000&q=75";
            el.innerHTML = `<img src="${icon}" alt="${itemName}"><span>${itemName}</span>`;
            if (item.type === "folder") el.ondblclick = () => loadFolder(item, itemName);
            else el.ondblclick = () => openTextFile(item.content || "");
            grid.appendChild(el);
        });
        if (status) status.textContent = `${items.length} ítems`;
    };

    area.querySelector("#findHome").onclick = () => { area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active")); area.querySelector("#findHome").classList.add("active"); loadFolder(fileSystem.root, "Macintosh HD"); };
    area.querySelector("#findDocs").onclick = () => { area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active")); area.querySelector("#findDocs").classList.add("active"); loadFolder(fileSystem.root.contents["Documentos"], "Documentos"); };
    area.querySelector("#findMusica").onclick = () => { area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active")); area.querySelector("#findMusica").classList.add("active"); loadFolder(fileSystem.root.contents["Música"], "Música"); };
    area.querySelector("#findImg").onclick = () => { area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active")); area.querySelector("#findImg").classList.add("active"); loadFolder(fileSystem.root.contents["Imágenes"], "Imágenes"); };

    loadFolder(folder, "Macintosh HD");
}

/* ============================================================
   RECYCLE BIN (Papelera)
============================================================ */
function loadRecycleBin(win) {
    const area = win.querySelector(".app-area");
    if (recycleBin.length === 0) {
        area.style.display = "flex"; area.style.alignItems = "center"; area.style.justifyContent = "center"; area.style.flexDirection = "column"; area.style.gap = "12px";
        area.innerHTML = `<div style="font-size:72px;opacity:0.2">🗑️</div><p style="color:#999;font-size:14px;">La Papelera está vacía</p>`;
        return;
    }
    area.style.padding = "16px"; area.style.display = "flex"; area.style.flexWrap = "wrap"; area.style.gap = "8px"; area.style.alignContent = "flex-start";
    recycleBin.forEach(appName => {
        const app = apps[appName];
        if (!app) return;
        const el = document.createElement("div");
        el.className = "finder-item";
        el.innerHTML = `<img src="${app.icon}" style="width:52px;height:52px;object-fit:contain;"><span style="font-size:11px;">${app.title}</span>`;
        area.appendChild(el);
    });
}

/* ============================================================
   APP STORE
============================================================ */
function loadStore(win) {
    const area = win.querySelector(".app-area");
    area.style.padding = "0";
    area.style.overflow = "hidden";

    const storeApps = [
        { id:"player", name:"Sterling Music Player", desc:"Reproductor con ecualizador y visualizador de ondas.", cat:"entertainment", catLabel:"Entretenimiento", rating:4.8, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-j9GfZpCuZEAQwYOTxDIVxReq5y0OHg.png&w=500&q=75", featured:true },
        { id:"mix",    name:"Sterling Music Studio", desc:"Crea y mezcla tus propias pistas de audio.",           cat:"creative",      catLabel:"Creativas",      rating:4.7, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-B2EekBDz0A46XdvgtBjgEAw79EH0Dk.png&w=500&q=75" },
        { id:"paint",  name:"Sterl-ink Sketching",  desc:"Herramienta de dibujo con capas y pinceles.",          cat:"creative",      catLabel:"Creativas",      rating:4.6, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DPM2VMQ9vdZ4HcXLRwCFZ7FK5Fn7Bx.png&w=1000&q=75" },
        { id:"excel",  name:"Sterling Math FX",     desc:"Calculadora científica con gráficas 2D/3D.",            cat:"productivity",  catLabel:"Productividad",  rating:4.9, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DHtLao0TXcz7zsJ6bxv2DltThCLwQ8.png&w=1000&q=75" },
        { id:"word",   name:"Sterling Letter",      desc:"Procesador de texto con plantillas y PDF.",             cat:"productivity",  catLabel:"Productividad",  rating:4.7, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BjimxRD0gb4rZBjr9jbO9LYXmOZJao.png&w=1000&q=75" },
        { id:"powerpoint", name:"Sterling Presentation", desc:"Presentaciones con animaciones profesionales.", cat:"productivity", catLabel:"Productividad", rating:4.5, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-L8T5N6DbL9jezTcIoss4pIKNG256jy.png&w=1000&q=75" },
        { id:"notes",  name:"Notas",                desc:"Editor de texto con modo enfoque.",                    cat:"productivity",  catLabel:"Productividad",  rating:4.4, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-zGyBqZLV8MGRs1NxccwHoHjQc5XtsK.png&w=1000&q=75" },
        { id:"suma",  name:"Suma de cuentas",       desc:"Suma de precios por categorias.",                      cat:"productivity",  catLabel:"Productividad",  rating:4.4, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-HCwnlHIkzR4wXtkTVAySMqAWigIejw.png&w=500&q=75" },
        { id:"airspace", name:"Captain Sterling",   desc:"Simulación aérea con física realista.",                cat:"entertainment", catLabel:"Entretenimiento", rating:4.6, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-yjBpDcYD9IjVGoIg4LnKkMKL1RBris.png&w=500&q=75" },
        { id:"buscaminas", name:"Sterling World",   desc:"Aventura de plataformas clásica.",                     cat:"entertainment", catLabel:"Entretenimiento", rating:4.8, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-e3kGOJ1Nx9Q68omg5PbnlZh8hFAJkX.png&w=500&q=75" },
        { id:"video", name:"Editor de videos",   desc:"Crea tus propios de videos de forma fácil.",              cat:"creative",      catLabel:"Creativas",       rating:4.7, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Eu2Ph2tWRZNcZUBi5acmRTEYlQhMhx.png&w=500&q=75" },
        { id:"salarios", name:"Salarios Minimos Mundiales",   desc:"Conoce los salarios minimos de cada país.",  cat:"web",          catLabel:"web",              rating:4.9, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CsdmL6Mu7Mz9dPjZYw1Xq22mkGhekV.png&w=500&q=75" },
        { id:"examen", name:"Examen de software",   desc:"Evalua tu conocimiento en software.",                  cat:"web",          catLabel:"web",              rating:4.9, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fLBUuECujebAYq2Ctir0tmm4ljvF0b.png&w=500&q=75" },
        { id:"browser",  name:"Safari",             desc:"Navega la web con buscador integrado.",                cat:"web",           catLabel:"Web",             rating:4.5, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75" }
    ];

    const CATS = [
        { key:"productivity", label:"Productividad" },
        { key:"creative",     label:"Creativas" },
        { key:"entertainment",label:"Entretenimiento" },
        { key:"web",          label:"Web" }
    ];

    let currentTab = "all", currentSearch = "";

    area.innerHTML = `
        <div class="store-container">
          <div class="store-header">
            <div class="store-header-title">App Store</div>
            <input class="store-search" placeholder="🔍 Buscar apps…" id="storeSearch_${win.dataset.app}">
          </div>
          <div class="store-tabs" id="storeTabs_${win.dataset.app}">
            <div class="s-tab active" data-tab="all">Inicio</div>
            <div class="s-tab" data-tab="productivity">Productividad</div>
            <div class="s-tab" data-tab="creative">Creativas</div>
            <div class="s-tab" data-tab="entertainment">Entretenimiento</div>
            <div class="s-tab" data-tab="web">Web</div>
          </div>
          <div class="store-body" id="storeBody_${win.dataset.app}"></div>
        </div>
    `;

    const bodyEl   = area.querySelector(`#storeBody_${win.dataset.app}`);
    const tabsEl   = area.querySelector(`#storeTabs_${win.dataset.app}`);
    const searchEl = area.querySelector(`#storeSearch_${win.dataset.app}`);

    const stars = r => "★".repeat(Math.floor(r)) + (r % 1 >= 0.5 ? "½" : "");
    const isOpen = id => !!activeWindows[id];

    function render() {
        const q = currentSearch.toLowerCase();
        const list = storeApps.filter(a => (currentTab === "all" || a.cat === currentTab) && (!q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)));
        bodyEl.innerHTML = "";

        if (q) {
            if (!list.length) { bodyEl.innerHTML = `<div class="store-empty">No se encontraron apps.</div>`; return; }
            const listWrap = document.createElement("div"); listWrap.className = "store-list";
            list.forEach(app => {
                const open = isOpen(app.id), item = document.createElement("div");
                item.className = "s-list-item";
                item.innerHTML = `<img class="s-list-icon" src="${app.icon}"><div class="s-list-info"><div class="s-list-name">${app.name}</div><div class="s-list-desc">${app.desc}</div></div><button class="s-card-btn${open?' open-state':''}">${open?'Abrir':'Ver'}</button>`;
                item.querySelector("button").onclick = e => { e.stopPropagation(); openApp(app.id); };
                item.onclick = () => openApp(app.id);
                listWrap.appendChild(item);
            });
            bodyEl.appendChild(listWrap);
            return;
        }

        if (currentTab === "all") {
            const feat = storeApps.find(a => a.featured);
            if (feat) {
                const open = isOpen(feat.id);
                const banner = document.createElement("div"); banner.className = "store-featured";
                banner.innerHTML = `<img class="store-feat-img" src="${feat.icon}"><div class="store-feat-text"><div class="store-feat-badge">⭐ Destacado</div><h2>${feat.name}</h2><p>${feat.desc}</p></div><button class="store-get-btn${open?' open-state':''}">${open?'Abierto':'Ver'}</button>`;
                banner.querySelector(".store-get-btn").onclick = () => openApp(feat.id);
                bodyEl.appendChild(banner);
            }
        }

        const sections = currentTab === "all" ? CATS : [CATS.find(c => c.key === currentTab)].filter(Boolean);
        sections.forEach(({ key, label }) => {
            const group = list.filter(a => a.cat === key);
            if (!group.length) return;
            const lbl = document.createElement("div"); lbl.className = "store-section-lbl"; lbl.textContent = label; bodyEl.appendChild(lbl);
            const grid = document.createElement("div"); grid.className = "store-grid";
            group.forEach(app => {
                const open = isOpen(app.id), card = document.createElement("div");
                card.className = "s-card";
                card.innerHTML = `<img class="s-card-icon" src="${app.icon}"><div class="s-card-name">${app.name}</div><div class="s-card-cat">${app.catLabel}</div><div class="s-card-bottom"><span><span class="s-card-stars">${stars(app.rating)}</span><span class="s-card-rating">${app.rating}</span></span><button class="s-card-btn${open?' open-state':''}">${open?'Abrir':'Ver'}</button></div>`;
                card.querySelector(".s-card-btn").onclick = e => { e.stopPropagation(); openApp(app.id); };
                card.onclick = () => openApp(app.id);
                grid.appendChild(card);
            });
            bodyEl.appendChild(grid);
        });
    }

    tabsEl.querySelectorAll(".s-tab").forEach(tab => {
        tab.onclick = () => { tabsEl.querySelectorAll(".s-tab").forEach(t => t.classList.remove("active")); tab.classList.add("active"); currentTab = tab.dataset.tab; currentSearch = ""; searchEl.value = ""; render(); };
    });
    searchEl.oninput = () => { currentSearch = searchEl.value; render(); };
    render();
}

/* ============================================================
   MISSION CONTROL
============================================================ */
function showMissionControl() {
    const overlay = document.createElement("div");
    overlay.id = "missionControlOverlay";

    const openWins = Object.entries(activeWindows).filter(([, { win }]) => win.style.display !== "none");

    if (!openWins.length) {
        overlay.innerHTML = `<div class="mc-label">Mission Control</div><div style="color:rgba(255,255,255,0.5);font-size:14px;">No hay ventanas abiertas</div>`;
    } else {
        overlay.innerHTML = `<div class="mc-label">Mission Control</div><div class="mc-windows" id="mcWindows"></div>`;
        const mcWin = overlay.querySelector("#mcWindows");
        openWins.forEach(([appName, { win }]) => {
            const app = apps[appName];
            const thumb = document.createElement("div");
            thumb.className = "mc-thumb";
            thumb.innerHTML = `
                <div class="mc-thumb-bar">
                    <div class="mc-thumb-dots"><div class="mc-thumb-dot" style="background:#ff5f57"></div><div class="mc-thumb-dot" style="background:#ffbd2e"></div><div class="mc-thumb-dot" style="background:#28c840"></div></div>
                </div>
                <div class="mc-thumb-body"><img src="${app?.icon || ''}" alt=""></div>
                <div class="mc-thumb-name">${app?.title || appName}</div>
            `;
            thumb.onclick = () => { focusWindow(win); overlay.remove(); };
            mcWin.appendChild(thumb);
        });
    }

    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
function showToast(title, body) {
    const existing = document.querySelector(".mac-toast");
    if (existing) existing.remove();
    const app = Object.values(apps).find(a => a.title === title) || Object.values(apps)[0];
    const toast = document.createElement("div");
    toast.className = "mac-toast";
    toast.innerHTML = `
        <img class="toast-app-icon" src="${app?.icon || ''}" alt="">
        <div class="toast-content">
          <div class="toast-app-name">${title}</div>
          <div class="toast-body">${body}</div>
        </div>
        <div class="toast-close" onclick="this.closest('.mac-toast').remove()">✕</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transition = "opacity 0.3s, transform 0.3s";
            toast.style.opacity = "0"; toast.style.transform = "translateX(340px)";
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

/* ============================================================
   INITIAL ICON POSITIONS
============================================================ */
window.addEventListener("load", () => {
    const positions = {
        explorer:     { left: 24, top: 30 },
        browser:      { left: 24, top: 120 },
        aplicaciones: { left: 24, top: 220 },
        "recycle-bin":{ left: 24, top: 320 }
    };
    document.querySelectorAll(".desktop-icon").forEach(icon => {
        const p = positions[icon.dataset.app];
        if (p) { icon.style.left = p.left + "px"; icon.style.top = p.top + "px"; }
    });
    const firstWp = document.querySelector("#wallpaperList img");
    if (firstWp) firstWp.classList.add("active");

    // Set notif date label
    const notifLabel = document.getElementById("notifDateLabel");
    if (notifLabel) notifLabel.textContent = new Date().toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long" });
});

/* ============================================================
   KEYBOARD SHORTCUTS
============================================================ */
document.addEventListener("keydown", (e) => {
    // Cmd+Space = Spotlight
    if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        const hidden = document.getElementById("spotlight").classList.contains("hidden");
        closeAllPanels("spotlight");
        document.getElementById("spotlight").classList.toggle("hidden", !hidden);
        document.getElementById("spotlightBackdrop").classList.toggle("hidden", !hidden);
        if (!hidden) {} else { document.getElementById("spotlightInput")?.focus(); }
    }
    // Escape to close panels
    if (e.key === "Escape") closeAllPanels();
});
