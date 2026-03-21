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
        icon: "https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/icon-1773955846572.png?raw=true",
        width: 880, height: 600, type: "system"
    },
    browser: {
        title: "Navegador",
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
   sterlingia: {
        title: "Sterling IA",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-As6MTLYJ6ta7FZgR1G5U6ZUzqfCqvm.png&w=500&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/santiago-chat.html" style="width:100%;height:100%;border:none;"></iframe>`
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
        type: "folder", name: "Santiago Sterling",
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
    const modal = document.createElement("div");
    modal.className = "finder-modal";
    modal.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;";
    const backdrop = document.createElement("div");
    backdrop.className = "finder-modal-backdrop";
    modal.innerHTML = `
      <h3>Nueva carpeta en el escritorio</h3>
      <input type="text" id="deskFolderInput" value="Nueva carpeta" placeholder="Nombre de carpeta" autocomplete="off">
      <div class="finder-modal-btns">
        <button class="finder-modal-btn cancel" id="deskFolderCancel">Cancelar</button>
        <button class="finder-modal-btn ok" id="deskFolderOk">Crear</button>
      </div>
    `;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    const input = modal.querySelector("#deskFolderInput");
    input.focus(); input.select();
    const confirm = () => {
        const name = input.value.trim();
        backdrop.remove();
        if (!name) return;
        // Add to desktop
        const desktop = document.getElementById("desktop1");
        const existing = desktop.querySelectorAll(".desktop-icon");
        const positions = Array.from(existing).map(el => ({ left: parseInt(el.style.left), top: parseInt(el.style.top) }));
        let top = 30;
        positions.forEach(p => { if (Math.abs(p.left - 24) < 80) top = Math.max(top, p.top + 100); });
        const icon = document.createElement("div");
        icon.className = "desktop-icon";
        icon.dataset.app = "folder_" + Date.now();
        icon.style.cssText = `left:24px;top:${top}px;`;
        icon.innerHTML = `<img src="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-En0WuV9h3Cjev3oISjtJqXetnfA18d.png&w=1000&q=75"><span>${name}</span>`;
        icon.addEventListener("mousedown", (e) => {
            draggingIcon = icon;
            draggingIconOffset.x = e.offsetX;
            draggingIconOffset.y = e.offsetY;
            iconDragMoved = false;
            icon.classList.add("dragging");
        });
        icon.addEventListener("click", () => { if (!iconDragMoved) showToast("Finder", `Carpeta "${name}"`); });
        icon.addEventListener("contextmenu", (e) => { e.preventDefault(); contextTarget = icon; const menuW=220,menuH=220; ctxMenu.style.left=Math.min(e.pageX,window.innerWidth-menuW-8)+"px"; ctxMenu.style.top=Math.min(e.pageY,window.innerHeight-menuH-8)+"px"; ctxMenu.classList.remove("hidden"); });
        desktop.appendChild(icon);
        showToast("Finder", `Carpeta "${name}" creada en el escritorio`);
    };
    modal.querySelector("#deskFolderOk").onclick = confirm;
    modal.querySelector("#deskFolderCancel").onclick = () => backdrop.remove();
    input.onkeydown = (e) => { if (e.key === "Enter") confirm(); if (e.key === "Escape") backdrop.remove(); };
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
};
document.getElementById("ctxGetInfo").onclick = () => {
    if (contextTarget) {
        const app = apps[contextTarget.dataset.app];
        showToast(app?.title || "Info", "Aplicación del sistema · Repositorio Santiago Sterling, que funciona dentro del entorno, para simular una experiencia de un sistema operativo.");
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

    const appMatches = Object.entries(apps).filter(([, app]) => app.title.toLowerCase().includes(q));

    // Search files in the filesystem
    const fileMatches = [];
    function searchNode(node, path) {
        if (!node || !node.contents) return;
        Object.entries(node.contents).forEach(([name, item]) => {
            if (name.toLowerCase().includes(q) ||
                (item.content && item.content.toLowerCase().includes(q))) {
                fileMatches.push({ name, item, path });
            }
            if (item.type === "folder") searchNode(item, path + "/" + name);
        });
    }
    searchNode(fileSystem.root, "Santiago Sterling");

    if (!appMatches.length && !fileMatches.length) { spotlightResults.classList.add("hidden"); return; }

    spotlightResults.innerHTML = "";

    if (appMatches.length) {
        const lbl = document.createElement("div");
        lbl.className = "spotlight-section-label";
        lbl.textContent = "Aplicaciones";
        spotlightResults.appendChild(lbl);
        appMatches.forEach(([key, app]) => {
            const item = document.createElement("div");
            item.className = "spotlight-result-item";
            item.innerHTML = `<img src="${app.icon}" alt=""><div><div class="spotlight-result-name">${app.title}</div><div class="spotlight-result-sub">Aplicación</div></div>`;
            item.onclick = () => { openApp(key); closeAllPanels(); };
            spotlightResults.appendChild(item);
        });
    }

    if (fileMatches.length) {
        const lbl = document.createElement("div");
        lbl.className = "spotlight-section-label";
        lbl.textContent = "Archivos y Carpetas";
        spotlightResults.appendChild(lbl);
        fileMatches.slice(0, 6).forEach(({ name, item, path }) => {
            const el = document.createElement("div");
            el.className = "spotlight-result-item";
            const icon = item.type === "folder"
                ? "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-En0WuV9h3Cjev3oISjtJqXetnfA18d.png&w=1000&q=75"
                : "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-a3SkroygtTE6lQGs0XbfDco9M3lV7H.png&w=1000&q=75";
            el.innerHTML = `<img src="${icon}" alt=""><div><div class="spotlight-result-name">${name}</div><div class="spotlight-result-sub">${path}</div></div>`;
            el.onclick = () => {
                openApp("explorer");
                closeAllPanels();
            };
            spotlightResults.appendChild(el);
        });
    }

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

let calCurrentDate = new Date(), calSelectedDayIOS = null;
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
        if (d === calSelectedDayIOS) el.classList.add("calendar-selected");
        el.onclick = () => { document.querySelectorAll(".calendar-day").forEach(x => x.classList.remove("calendar-selected")); el.classList.add("calendar-selected"); calSelectedDayIOS = d; };
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
function loadFinder(win, startFolder) {
    const area = win.querySelector(".app-area");
    area.style.padding = "0";

    const FOLDER_ICON = "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-En0WuV9h3Cjev3oISjtJqXetnfA18d.png&w=1000&q=75";
    const FILE_ICON   = "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-a3SkroygtTE6lQGs0XbfDco9M3lV7H.png&w=1000&q=75";

    // Navigation history
    let history = [{ node: fileSystem.root, name: "Santiago Sterling", path: ["Santiago Sterling"] }];
    let historyIdx = 0;
    let viewMode = "grid"; // "grid" | "list"
    let selectedItem = null;
    let activeFolderCtxMenu = null;

    area.innerHTML = `
      <div class="finder-container">
        <div class="finder-sidebar">
          <div class="finder-sidebar-section">
            <div class="finder-sidebar-label">Favoritos</div>
            <div class="finder-sidebar-item active" data-nav="home"><i class="fi fi-sr-devices"></i> Santiago Sterling</div>
            <div class="finder-sidebar-item" data-nav="docs"><i class="fi fi-sr-document-folder-gear"></i> Documentos</div>
            <div class="finder-sidebar-item" data-nav="music"><i class="fi fi-sr-folder-music"></i> Música</div>
            <div class="finder-sidebar-item" data-nav="img"><i class="fi fi-sr-images"></i> Imágenes</div>
            <div class="finder-sidebar-item" data-nav="video"><i class="fi fi-sr-photo-video"></i> Videos</div>
          </div>
          <div class="finder-sidebar-section">
            <div class="finder-sidebar-label">Dispositivos</div>
            <div class="finder-sidebar-item"><i class="fi fi-sr-disc-drive"></i> Santiago Sterling</div>
            <div class="finder-sidebar-label" style="margin-top:6px;">Localizaciones</div>
            <div class="finder-sidebar-item"><i class="fi fi-sr-network-cloud"></i> Sterling Drive</div>
          </div>
          <div class="finder-sidebar-section">
            <div class="finder-sidebar-label">Etiquetas</div>
            <div class="finder-tag-row"><div class="finder-tag-dot" style="background:#ff3b30"></div> Rojo</div>
            <div class="finder-tag-row"><div class="finder-tag-dot" style="background:#ff9500"></div> Naranja</div>
            <div class="finder-tag-row"><div class="finder-tag-dot" style="background:#34c759"></div> Verde</div>
            <div class="finder-tag-row"><div class="finder-tag-dot" style="background:#0071e3"></div> Azul</div>
          </div>
        </div>
        <div class="finder-main">
          <div class="finder-toolbar">
            <div class="finder-nav-btn disabled" id="fnBack" title="Atrás">‹</div>
            <div class="finder-nav-btn disabled" id="fnFwd" title="Adelante">›</div>
            <div class="finder-breadcrumb" id="fnBreadcrumb"></div>
            <div class="finder-toolbar-actions">
              <button class="finder-action-btn" id="fnNewFolder" title="Nueva carpeta"><i class="fi fi-sr-folder-add"></i> Carpeta</button>
              <button class="finder-action-btn" id="fnNewFile" title="Nuevo archivo de texto"><i class="fi fi-sr-file-add"></i> Archivo</button>
              <div class="finder-view-toggle">
                <div class="finder-view-btn active" id="fnViewGrid" title="Íconos">⊞</div>
                <div class="finder-view-btn" id="fnViewList" title="Lista">☰</div>
              </div>
              <div class="finder-search-wrap">
                <span class="finder-search-icon">🔍</span>
                <input class="finder-search" placeholder="Buscar" id="fnSearch" autocomplete="off">
              </div>
            </div>
          </div>
          <div id="fnListHeader" class="finder-list-header" style="display:none;">
            <img style="width:22px;height:22px;opacity:0"> 
            <span class="finder-list-col-name">Nombre</span>
            <span class="finder-list-col-date finder-list-meta">Fecha modificación</span>
            <span class="finder-list-col-kind finder-list-meta">Tipo</span>
            <span class="finder-list-col-size finder-list-meta">Tamaño</span>
          </div>
          <div class="finder-grid" id="fnGrid"></div>
          <div class="finder-status" id="fnStatus">0 ítems</div>
        </div>
      </div>
    `;

    // ---- helpers ----
    const nav = () => history[historyIdx];
    const grid = () => area.querySelector("#fnGrid");
    const status = () => area.querySelector("#fnStatus");
    const breadcrumb = () => area.querySelector("#fnBreadcrumb");
    const listHeader = () => area.querySelector("#fnListHeader");

    function updateNav() {
        const back = area.querySelector("#fnBack");
        const fwd = area.querySelector("#fnFwd");
        back.classList.toggle("disabled", historyIdx === 0);
        fwd.classList.toggle("disabled", historyIdx === history.length - 1);
    }

    function renderBreadcrumb() {
        const path = nav().path;
        breadcrumb().innerHTML = path.map((seg, i) =>
            `<span class="bc-item${i === path.length - 1 ? " last" : ""}" data-idx="${i}">${seg}</span>` +
            (i < path.length - 1 ? `<span class="bc-sep">›</span>` : "")
        ).join("");
        breadcrumb().querySelectorAll(".bc-item:not(.last)").forEach(el => {
            el.onclick = () => {
                const idx = parseInt(el.dataset.idx);
                // navigate up to that path level
                let node = fileSystem.root;
                for (let k = 1; k <= idx; k++) {
                    const seg = path[k];
                    if (node.contents && node.contents[seg]) node = node.contents[seg];
                }
                navigate(node, path[idx], path.slice(0, idx + 1));
            };
        });
    }

    function navigate(node, name, path, pushHistory = true) {
        if (pushHistory) {
            history = history.slice(0, historyIdx + 1);
            history.push({ node, name, path: path || [...nav().path, name] });
            historyIdx = history.length - 1;
        }
        updateNav();
        renderBreadcrumb();
        render();
        // update sidebar
        const mapping = { "Santiago Sterling": "home", "Documentos": "docs", "Música": "music", "Imágenes": "img", "Videos": "video" };
        area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active"));
        const key = mapping[name];
        if (key) area.querySelector(`[data-nav="${key}"]`)?.classList.add("active");
    }

    function getFileSize(item) {
        if (item.type === "folder") {
            const count = Object.keys(item.contents || {}).length;
            return `${count} ítem${count !== 1 ? "s" : ""}`;
        }
        const content = item.content || "";
        const bytes = new Blob([content]).size;
        return bytes < 1024 ? `${bytes} B` : `${(bytes/1024).toFixed(1)} KB`;
    }

    function render(searchQuery = "") {
        const g = grid();
        g.innerHTML = "";
        const node = nav().node;
        if (!node || !node.contents) return;

        const allItems = Object.entries(node.contents);
        const filtered = searchQuery
            ? allItems.filter(([n]) => n.toLowerCase().includes(searchQuery.toLowerCase()))
            : allItems;

        // Sort: folders first, then files
        filtered.sort(([an, a], [bn, b]) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
            return an.localeCompare(bn, "es");
        });

        if (viewMode === "list") {
            g.classList.add("list-view");
            listHeader().style.display = "flex";
        } else {
            g.classList.remove("list-view");
            listHeader().style.display = "none";
        }

        if (filtered.length === 0) {
            g.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);font-size:13px;grid-column:1/-1;">
              ${searchQuery ? `Sin resultados para "<strong>${searchQuery}</strong>"` : "Esta carpeta está vacía"}
            </div>`;
        } else {
            filtered.forEach(([itemName, item]) => {
                const el = document.createElement("div");
                const icon = item.type === "folder" ? FOLDER_ICON : FILE_ICON;
                const tagColor = item.tag || "";

                if (viewMode === "list") {
                    el.className = "finder-item list-item";
                    el.innerHTML = `
                      <img src="${icon}" alt="${itemName}">
                      <span class="finder-list-col-name">${itemName}</span>
                      <span class="finder-list-col-date finder-list-meta">${item.modified || "Hoy"}</span>
                      <span class="finder-list-col-kind finder-list-meta">${item.type === "folder" ? "Carpeta" : "Texto"}</span>
                      <span class="finder-list-col-size finder-list-meta">${getFileSize(item)}</span>
                    `;
                } else {
                    el.className = "finder-item";
                    el.innerHTML = `
                      <img src="${icon}" alt="${itemName}">
                      <span>${itemName}</span>
                      ${tagColor ? `<div class="item-tag-dot" style="background:${tagColor}"></div>` : ""}
                    `;
                }

                // Click to select
                el.onclick = (e) => {
                    e.stopPropagation();
                    area.querySelectorAll(".finder-item").forEach(i => i.classList.remove("selected"));
                    el.classList.add("selected");
                    selectedItem = { name: itemName, item, el };
                };

                // Double-click to open
                el.ondblclick = () => {
                    if (item.type === "folder") {
                        navigate(item, itemName, [...nav().path, itemName]);
                    } else {
                        if (item.app && item.app !== "notes") {
                            openApp(item.app);
                        } else {
                            openFinderFileEditor(itemName, item, nav().node);
                        }
                    }
                };

                // Right-click context menu
                el.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    area.querySelectorAll(".finder-item").forEach(i => i.classList.remove("selected"));
                    el.classList.add("selected");
                    selectedItem = { name: itemName, item, el };
                    showFinderCtxMenu(e, itemName, item, nav().node);
                });

                g.appendChild(el);
            });
        }

        const total = filtered.length;
        status().textContent = searchQuery
            ? `${total} resultado${total !== 1 ? "s" : ""} de "${searchQuery}"`
            : `${total} ítem${total !== 1 ? "s" : ""}`;
    }

    // ---- Context menu inside Finder ----
    function showFinderCtxMenu(e, itemName, item, parentNode) {
        removeFinderCtxMenu();
        const menu = document.createElement("ul");
        menu.className = "finder-ctx-menu";
        const isFolder = item.type === "folder";
        menu.innerHTML = `
          <li id="fctx-open"><i class="fi fi-sr-${isFolder ? "folder-open" : "file"}"></i> ${isFolder ? "Abrir carpeta" : "Abrir"}</li>
          ${!isFolder ? `<li id="fctx-edit"><i class="fi fi-sr-edit"></i> Editar contenido</li>` : ""}
          ${!isFolder ? `<li id="fctx-ql"><i class="fi fi-sr-eye"></i> Vista rápida</li>` : ""}
          <li class="ctx-sep"></li>
          <li id="fctx-rename"><i class="fi fi-sr-text-box-edit"></i> Renombrar</li>
          <li id="fctx-dup"><i class="fi fi-sr-copy-alt"></i> Duplicar</li>
          <li class="ctx-sep"></li>
          <li id="fctx-tag-red"><i class="fi fi-sr-circle" style="color:#ff3b30"></i> Etiqueta Roja</li>
          <li id="fctx-tag-blue"><i class="fi fi-sr-circle" style="color:#0071e3"></i> Etiqueta Azul</li>
          <li id="fctx-tag-green"><i class="fi fi-sr-circle" style="color:#34c759"></i> Etiqueta Verde</li>
          <li id="fctx-tag-none"><i class="fi fi-sr-circle"></i> Sin etiqueta</li>
          <li class="ctx-sep"></li>
          <li id="fctx-info"><i class="fi fi-sr-info"></i> Obtener información</li>
          <li id="fctx-delete" style="color:#ff3b30;"><i class="fi fi-sr-trash-xmark" style="color:#ff3b30"></i> Mover a papelera</li>
        `;
        const menuW = 220, menuH = 320;
        const x = Math.min(e.pageX, window.innerWidth - menuW - 8);
        const y = Math.min(e.pageY, window.innerHeight - menuH - 8);
        menu.style.left = x + "px"; menu.style.top = y + "px";
        document.body.appendChild(menu);
        activeFolderCtxMenu = menu;

        menu.querySelector("#fctx-open")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            if (isFolder) navigate(item, itemName, [...nav().path, itemName]);
            else openFinderFileEditor(itemName, item, parentNode);
        });
        menu.querySelector("#fctx-edit")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            openFinderFileEditor(itemName, item, parentNode);
        });
        menu.querySelector("#fctx-ql")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            showQuickLook(itemName, item);
        });
        menu.querySelector("#fctx-rename")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            showFinderModal("Renombrar", itemName, (newName) => {
                if (!newName || newName === itemName) return;
                if (parentNode.contents[newName]) { showToast("Finder", `Ya existe "${newName}" en esta carpeta.`); return; }
                parentNode.contents[newName] = { ...parentNode.contents[itemName] };
                delete parentNode.contents[itemName];
                item.modified = "Ahora";
                render(area.querySelector("#fnSearch").value);
                showToast("Finder", `Renombrado a "${newName}"`);
            }, itemName);
        });
        menu.querySelector("#fctx-dup")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            let newName = itemName.replace(/(\.[^.]+)?$/, " copia$1");
            let counter = 2;
            while (parentNode.contents[newName]) {
                newName = itemName.replace(/(\.[^.]+)?$/, ` copia ${counter++}$1`);
            }
            parentNode.contents[newName] = JSON.parse(JSON.stringify(item));
            parentNode.contents[newName].modified = "Ahora";
            render(area.querySelector("#fnSearch").value);
            showToast("Finder", `Duplicado como "${newName}"`);
        });
        ["red","blue","green"].forEach(color => {
            const colorMap = { red: "#ff3b30", blue: "#0071e3", green: "#34c759" };
            menu.querySelector(`#fctx-tag-${color}`)?.addEventListener("click", () => {
                removeFinderCtxMenu();
                item.tag = colorMap[color];
                render(area.querySelector("#fnSearch").value);
            });
        });
        menu.querySelector("#fctx-tag-none")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            delete item.tag;
            render(area.querySelector("#fnSearch").value);
        });
        menu.querySelector("#fctx-info")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            const size = getFileSize(item);
            showToast("Finder", `"${itemName}" · ${isFolder ? "Carpeta" : "Archivo de texto"} · ${size}`);
        });
        menu.querySelector("#fctx-delete")?.addEventListener("click", () => {
            removeFinderCtxMenu();
            delete parentNode.contents[itemName];
            recycleBin.push(itemName);
            render(area.querySelector("#fnSearch").value);
            showToast("Papelera", `"${itemName}" movido a Papelera`);
        });

        setTimeout(() => document.addEventListener("click", removeFinderCtxMenu, { once: true }), 10);
    }

    function removeFinderCtxMenu() {
        if (activeFolderCtxMenu) { activeFolderCtxMenu.remove(); activeFolderCtxMenu = null; }
    }

    // ---- Grid right-click (empty area) ----
    grid().addEventListener("contextmenu", (e) => {
        if (e.target.closest(".finder-item")) return;
        e.preventDefault();
        removeFinderCtxMenu();
        const menu = document.createElement("ul");
        menu.className = "finder-ctx-menu";
        menu.innerHTML = `
          <li id="fctx-new-folder"><i class="fi fi-sr-folder-add"></i> Nueva carpeta</li>
          <li id="fctx-new-file"><i class="fi fi-sr-file-add"></i> Nuevo archivo de texto</li>
          <li class="ctx-sep"></li>
          <li id="fctx-view-grid"><i class="fi fi-sr-apps"></i> Ver como íconos</li>
          <li id="fctx-view-list"><i class="fi fi-sr-list"></i> Ver como lista</li>
        `;
        const menuW = 220, menuH = 180;
        const x = Math.min(e.pageX, window.innerWidth - menuW - 8);
        const y = Math.min(e.pageY, window.innerHeight - menuH - 8);
        menu.style.left = x + "px"; menu.style.top = y + "px";
        document.body.appendChild(menu);
        activeFolderCtxMenu = menu;
        menu.querySelector("#fctx-new-folder").onclick = () => { removeFinderCtxMenu(); createNewFolder(); };
        menu.querySelector("#fctx-new-file").onclick = () => { removeFinderCtxMenu(); createNewFile(); };
        menu.querySelector("#fctx-view-grid").onclick = () => { removeFinderCtxMenu(); setView("grid"); };
        menu.querySelector("#fctx-view-list").onclick = () => { removeFinderCtxMenu(); setView("list"); };
        setTimeout(() => document.addEventListener("click", removeFinderCtxMenu, { once: true }), 10);
    });

    // ---- Deselect on empty click ----
    grid().addEventListener("click", (e) => {
        if (!e.target.closest(".finder-item")) {
            area.querySelectorAll(".finder-item").forEach(i => i.classList.remove("selected"));
            selectedItem = null;
        }
    });

    // ---- Quick Look ----
    function showQuickLook(name, item) {
        const existing = document.getElementById("quickLookOverlay");
        if (existing) existing.remove();
        const overlay = document.createElement("div");
        overlay.id = "quickLookOverlay";
        const isFolder = item.type === "folder";
        const content = isFolder
            ? `<div class="ql-folder-preview">
                <img src="${FOLDER_ICON}">
                <div class="ql-folder-info">${Object.keys(item.contents || {}).length} ítems en esta carpeta</div>
               </div>`
            : `<div class="ql-text">${(item.content || "(archivo vacío)").replace(/</g, "&lt;")}</div>`;
        overlay.innerHTML = `
          <div id="quickLookPanel">
            <div class="ql-header">
              <img src="${isFolder ? FOLDER_ICON : FILE_ICON}" style="width:20px;height:20px;object-fit:contain;">
              <span class="ql-title">${name}</span>
              <button class="ql-close" id="qlCloseBtn">✕</button>
            </div>
            <div class="ql-body">${content}</div>
          </div>
        `;
        document.body.appendChild(overlay);
        overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelector("#qlCloseBtn").onclick = () => overlay.remove();
    }

    // ---- Open file editor ----
    function openFinderFileEditor(fileName, item, parentNode) {
        const id = "notes_finder_" + Date.now();
        apps[id] = {
            title: fileName,
            icon: FILE_ICON,
            width: 580, height: 480,
            type: "notes",
            content: item.content || ""
        };
        // When window opens, save back on content change
        openApp(id);
        setTimeout(() => {
            const w = activeWindows[id]?.win;
            if (!w) return;
            const ta = w.querySelector(".notepad-textarea");
            if (ta) {
                ta.addEventListener("input", () => {
                    item.content = ta.value;
                    item.modified = "Ahora";
                });
            }
        }, 100);
    }

    // ---- New folder ----
    function createNewFolder() {
        showFinderModal("Nueva carpeta", "", (name) => {
            if (!name) return;
            const node = nav().node;
            if (node.contents[name]) { showToast("Finder", `Ya existe "${name}" en esta carpeta.`); return; }
            node.contents[name] = { type: "folder", contents: {}, modified: "Ahora" };
            render(area.querySelector("#fnSearch").value);
            showToast("Finder", `Carpeta "${name}" creada`);
        }, "Nueva carpeta");
    }

    // ---- New file ----
    function createNewFile() {
        showFinderModal("Nuevo archivo", "", (name) => {
            if (!name) return;
            const finalName = name.includes(".") ? name : name + ".txt";
            const node = nav().node;
            if (node.contents[finalName]) { showToast("Finder", `Ya existe "${finalName}".`); return; }
            node.contents[finalName] = { type: "file", app: "notes", content: "", modified: "Ahora" };
            render(area.querySelector("#fnSearch").value);
            showToast("Finder", `Archivo "${finalName}" creado`);
        }, "archivo.txt");
    }

    // ---- Modal for new / rename ----
    function showFinderModal(title, value, callback, placeholder = "") {
        const backdrop = document.createElement("div");
        backdrop.className = "finder-modal-backdrop";
        const modal = document.createElement("div");
        modal.className = "finder-modal";
        modal.innerHTML = `
          <h3>${title}</h3>
          <input type="text" id="finderModalInput" value="${value}" placeholder="${placeholder}" autocomplete="off">
          <div class="finder-modal-btns">
            <button class="finder-modal-btn cancel" id="fmCancel">Cancelar</button>
            <button class="finder-modal-btn ok" id="fmOk">OK</button>
          </div>
        `;
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        const input = modal.querySelector("#finderModalInput");
        input.focus(); input.select();
        const confirm = () => { const val = input.value.trim(); backdrop.remove(); callback(val); };
        modal.querySelector("#fmOk").onclick = confirm;
        modal.querySelector("#fmCancel").onclick = () => backdrop.remove();
        input.onkeydown = (e) => { if (e.key === "Enter") confirm(); if (e.key === "Escape") backdrop.remove(); };
        backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    }

    // ---- View mode ----
    function setView(mode) {
        viewMode = mode;
        area.querySelector("#fnViewGrid").classList.toggle("active", mode === "grid");
        area.querySelector("#fnViewList").classList.toggle("active", mode === "list");
        render(area.querySelector("#fnSearch").value);
    }

    // ---- Sidebar navigation ----
    const sidebarMap = {
        home:  { node: fileSystem.root, name: "Santiago Sterling", path: ["Santiago Sterling"] },
        docs:  { node: fileSystem.root.contents["Documentos"], name: "Documentos", path: ["Santiago Sterling", "Documentos"] },
        music: { node: fileSystem.root.contents["Música"], name: "Música", path: ["Santiago Sterling", "Música"] },
        img:   { node: fileSystem.root.contents["Imágenes"], name: "Imágenes", path: ["Santiago Sterling", "Imágenes"] },
        video: { node: fileSystem.root.contents["Videos"], name: "Videos", path: ["Santiago Sterling", "Videos"] },
    };
    area.querySelectorAll(".finder-sidebar-item[data-nav]").forEach(item => {
        item.onclick = () => {
            const key = item.dataset.nav;
            const dest = sidebarMap[key];
            if (!dest) return;
            area.querySelectorAll(".finder-sidebar-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            navigate(dest.node, dest.name, dest.path);
        };
    });

    // ---- Back / Forward ----
    area.querySelector("#fnBack").onclick = () => {
        if (historyIdx > 0) { historyIdx--; updateNav(); renderBreadcrumb(); render(); }
    };
    area.querySelector("#fnFwd").onclick = () => {
        if (historyIdx < history.length - 1) { historyIdx++; updateNav(); renderBreadcrumb(); render(); }
    };

    // ---- New folder / file buttons ----
    area.querySelector("#fnNewFolder").onclick = createNewFolder;
    area.querySelector("#fnNewFile").onclick = createNewFile;

    // ---- View toggle buttons ----
    area.querySelector("#fnViewGrid").onclick = () => setView("grid");
    area.querySelector("#fnViewList").onclick = () => setView("list");

    // ---- Search ----
    area.querySelector("#fnSearch").addEventListener("input", (e) => {
        render(e.target.value);
    });

    // ---- Keyboard shortcuts ----
    win.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.closest("input, textarea")) {
            if (historyIdx > 0) { historyIdx--; updateNav(); renderBreadcrumb(); render(); }
        }
        if ((e.metaKey || e.ctrlKey) && e.key === "f") {
            e.preventDefault(); area.querySelector("#fnSearch")?.focus();
        }
        if (e.key === "Escape") {
            area.querySelector("#fnSearch").value = "";
            render();
        }
        if (e.key === " " && selectedItem && !e.target.closest("input")) {
            e.preventDefault();
            showQuickLook(selectedItem.name, selectedItem.item);
        }
        if ((e.key === "Delete" || e.key === "Backspace") && selectedItem && e.shiftKey) {
            delete nav().node.contents[selectedItem.name];
            recycleBin.push(selectedItem.name);
            selectedItem = null;
            render(area.querySelector("#fnSearch").value);
        }
    });

    // ---- Initial render ----
    history = [{ node: startFolder || fileSystem.root, name: "Santiago Sterling", path: ["Santiago Sterling"] }];
    historyIdx = 0;
    updateNav();
    renderBreadcrumb();
    render();
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
        { id:"sterlingia", name:"Sterling IA",      desc:"Explora el portafolio con la ayuda de un agente de IA.", cat:"web",        catLabel:"web",              rating:5.0, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-As6MTLYJ6ta7FZgR1G5U6ZUzqfCqvm.png&w=500&q=75" },
        { id:"browser",  name:"Navegador",             desc:"Navega la web con buscador integrado.",                cat:"web",           catLabel:"Web",             rating:4.5, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75" }
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
            <input class="store-search" placeholder="Buscar apps…" id="storeSearch_${win.dataset.app}">
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

function openAppStore() {
  // Aquí va tu lógica existente para abrir la App Store
  document.querySelector('#App Store').style.display = 'block';
}

/* ================================================================
   iOS MOBILE — Complete iPhone-style experience
================================================================ */

function isMobile() { return window.innerWidth <= 768; }

/* ---- App definitions: page 0 (widgets), page 1 (native), page 2 (sterling) ---- */
const IOS_NATIVE_APPS = [
  // Native iPhone apps - page 1
  { id:"phone",      label:"Teléfono",   native:true, nativeType:"phone",     bg:"linear-gradient(145deg,#34c759,#28a745)", emoji:"📞" },
  { id:"messages",   label:"Mensajes",   native:true, nativeType:"messages",  bg:"linear-gradient(145deg,#34c759,#1aad1a)", emoji:"💬" },
  { id:"camera",     label:"Cámara",     native:true, nativeType:"camera",    bg:"linear-gradient(145deg,#6c6c70,#3a3a3c)", emoji:"📷" },
  { id:"photos",     label:"Fotos",      native:true, nativeType:"photos",    bg:"linear-gradient(145deg,#ff9500,#ff6b00)",  emoji:"🌅" },
  { id:"maps",       label:"Mapas",      native:true, nativeType:"maps",      bg:"linear-gradient(145deg,#34c759,#5ac8fa)",  emoji:"🗺️" },
  { id:"settings",   label:"Ajustes",    native:true, nativeType:"settings",  bg:"linear-gradient(145deg,#8e8e93,#636366)", emoji:"⚙️" },
  { id:"notes",      label:"Notas",      native:true, nativeType:"notes-ios", bg:"linear-gradient(145deg,#ffd60a,#ff9f0a)", emoji:"📝" },
  { id:"clock",      label:"Reloj",      native:true, nativeType:"clock",     bg:"linear-gradient(145deg,#1c1c1e,#3a3a3c)", emoji:"🕐" },
  { id:"calendar",   label:"Calendario", native:true, nativeType:"calendar",  bg:"linear-gradient(145deg,#ff3b30,#ff6b30)", emoji:"📅" },
  { id:"calculator", label:"Calculadora",native:true, nativeType:"calculator",bg:"linear-gradient(145deg,#1c1c1e,#2c2c2e)", emoji:"🧮" },
  { id:"health",     label:"Salud",      native:true, nativeType:"health",    bg:"linear-gradient(145deg,#ff2d55,#ff6b81)", emoji:"❤️" },
  { id:"weather",    label:"Clima",      native:true, nativeType:"weather-app",bg:"linear-gradient(145deg,#1a6fd8,#3a9bd5)",emoji:"⛅" },
  { id:"wallet",     label:"Wallet",     native:true, nativeType:"wallet",    bg:"linear-gradient(145deg,#000,#1c1c1e)", emoji:"💳" },
  { id:"music-native",label:"Música",    native:true, nativeType:"music-native",bg:"linear-gradient(145deg,#fc3c44,#fd6f5a)",emoji:"🎵"},
  { id:"contacts",   label:"Contactos",  native:true, nativeType:"contacts",  bg:"linear-gradient(145deg,#8e8e93,#636366)", emoji:"👤" },
  { id:"podcasts",   label:"Podcasts",   native:true, nativeType:"podcasts",  bg:"linear-gradient(145deg,#b05dfb,#8944c4)", emoji:"🎙️" },
];
const IOS_STERLING_APPS = [
  // Santiago's apps via iframe
  { id:"sterlingia",  label:"Sterling IA",   img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-As6MTLYJ6ta7FZgR1G5U6ZUzqfCqvm.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/santiago-chat.html" },
  { id:"player",      label:"Música",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-j9GfZpCuZEAQwYOTxDIVxReq5y0OHg.png&w=500&q=75",   url:"https://santiago131440.github.io/SantiagoSterling/Music.html" },
  { id:"paint",       label:"Sterl-ink",     img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DPM2VMQ9vdZ4HcXLRwCFZ7FK5Fn7Bx.png&w=1000&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/ExperienciaLaboral.html" },
  { id:"buscaminas",  label:"Sterling World", img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-e3kGOJ1Nx9Q68omg5PbnlZh8hFAJkX.png&w=500&q=75", url:"https://santiago131440.github.io/SantiagoSterling/Super%20Mario.html" },
  { id:"explorer",    label:"Finder",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-0QeQPgJUNilwfLLC5l1AnfScdu7OC2.png&w=1000&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/" },
  { id:"aplicaciones",label:"App Store",     img:"https://github.com/Santiago131440/Imagenes-Comparaci-n-de-datos/blob/main/icon-1773955846572.png?raw=true", url:"https://santiago131440.github.io/SantiagoSterling/proyectoApp.html" },
  { id:"excel",       label:"Math FX",       img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DHtLao0TXcz7zsJ6bxv2DltThCLwQ8.png&w=1000&q=75", url:"https://santiago131440.github.io/SantiagoSterling/Sterling%20math%20fx.html" },
  { id:"word",        label:"Letter",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BjimxRD0gb4rZBjr9jbO9LYXmOZJao.png&w=1000&q=75", url:"https://santiago131440.github.io/SantiagoSterling/Sterling%20Letter.html" },
  { id:"powerpoint",  label:"Slides",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-L8T5N6DbL9jezTcIoss4pIKNG256jy.png&w=1000&q=75", url:"https://santiago131440.github.io/SantiagoSterling/Sterling%20Presentation.html" },
  { id:"salarios",    label:"Salarios",      img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CsdmL6Mu7Mz9dPjZYw1Xq22mkGhekV.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/Salarios.html" },
  { id:"video",       label:"Video",         img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Eu2Ph2tWRZNcZUBi5acmRTEYlQhMhx.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/Dashboard1.html" },
  { id:"suma",        label:"Compras",       img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-HCwnlHIkzR4wXtkTVAySMqAWigIejw.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/Dashboard3.html" },
  { id:"mix",         label:"Music Studio",  img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-B2EekBDz0A46XdvgtBjgEAw79EH0Dk.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/mix.html" },
  { id:"airspace",    label:"Captain",       img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-yjBpDcYD9IjVGoIg4LnKkMKL1RBris.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/Buscaminas.html" },
  { id:"examen",      label:"Examen",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fLBUuECujebAYq2Ctir0tmm4ljvF0b.png&w=500&q=75",  url:"https://santiago131440.github.io/SantiagoSterling/registro.html" },
  { id:"browser",     label:"Safari",        img:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75",  url:"https://www.google.com/webhp?igu=1" },
];

/* ---- Status bar clock ---- */
function iosUpdateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
  const el = document.getElementById("iosSbTime");
  if (el) el.textContent = t;
  const wc = document.getElementById("iwclock-time");
  if (wc) wc.textContent = t;
}

/* ---- Widget dates ---- */
function iosUpdateWidgetDates() {
  const now = new Date();
  const months = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
  const monthsFull = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
  const d = now.getDate();
  const m = now.getMonth();
  const el1 = document.getElementById("iwc-month"); if(el1) el1.textContent = months[m];
  const el2 = document.getElementById("iwc-day"); if(el2) el2.textContent = d;
  const el3 = document.getElementById("lw-cal-day"); if(el3) el3.textContent = d;
  const el4 = document.getElementById("lw-cal-month"); if(el4) el4.textContent = monthsFull[m];
  const el5 = document.getElementById("nc-date-label");
  if(el5) el5.textContent = now.toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" });
}

/* ---- Build app icon element ---- */
function makeAppIconEl(appDef, delay) {
  const div = document.createElement("div");
  div.className = "ios-app-icon";
  div.style.animationDelay = delay + "s";
  if (appDef.native) {
    div.innerHTML = `<div class="ios-native-icon" style="background:${appDef.bg};">${appDef.emoji}</div><span>${appDef.label}</span>`;
    div.addEventListener("click", () => iosOpenNativeApp(appDef));
  } else {
    div.innerHTML = `<img src="${appDef.img}" alt="${appDef.label}"><span>${appDef.label}</span>`;
    div.addEventListener("click", () => iosOpenIframeApp(appDef));
  }
  return div;
}

/* ---- Populate grids ---- */
function iosBuildGrids() {
  const g0 = document.getElementById("ios-grid-p0");
  const g1 = document.getElementById("ios-grid-p1");
  const g2 = document.getElementById("ios-grid-p2");
  if (!g0 || !g1 || !g2) return;
  g0.innerHTML = ""; g1.innerHTML = ""; g2.innerHTML = "";
  // Page 0: first 8 native apps shown below widgets
  IOS_NATIVE_APPS.slice(0,8).forEach((app, i) => g0.appendChild(makeAppIconEl(app, i * 0.04)));
  // Page 1: all native apps
  IOS_NATIVE_APPS.forEach((app, i) => g1.appendChild(makeAppIconEl(app, i * 0.03)));
  // Page 2: Sterling apps
  IOS_STERLING_APPS.forEach((app, i) => g2.appendChild(makeAppIconEl(app, i * 0.03)));
}

/* ---- Bind dock items ---- */
function iosBindDock() {
  document.querySelectorAll("#ios-dock .ios-dock-item[data-ios-app]").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.iosApp;
      const native = IOS_NATIVE_APPS.find(a => a.id === id);
      if (native) { iosOpenNativeApp(native); return; }
      const sterling = IOS_STERLING_APPS.find(a => a.id === id);
      if (sterling) iosOpenIframeApp(sterling);
    });
  });
}

/* ---- Page switching ---- */
let iosCurrentPage = 0;
function iosGoToPage(p) {
  const inner = document.getElementById("ios-pages-inner");
  if (!inner) return;
  const pages = inner.querySelectorAll(".ios-page");
  iosCurrentPage = Math.max(0, Math.min(p, pages.length - 1));
  inner.style.transform = `translateX(-${iosCurrentPage * 100}%)`;
  document.querySelectorAll(".ios-dot").forEach((d, i) => d.classList.toggle("active", i === iosCurrentPage));
}

/* ---- Swipe between pages (touch + mouse) ---- */
function iosSetupPageSwipe() {
  const scroll = document.getElementById("ios-pages-scroll");
  if (!scroll) return;
  let startX = 0, startY = 0, isDragging = false;

  // Touch
  scroll.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });
  scroll.addEventListener("touchend", e => {
    if (!isDragging) return; isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (Math.abs(dx) > 40 && dy < 80) {
      if (dx < 0) iosGoToPage(iosCurrentPage + 1);
      else iosGoToPage(iosCurrentPage - 1);
    }
  }, { passive: true });

  // Mouse (desktop preview)
  scroll.addEventListener("mousedown", e => { startX = e.clientX; startY = e.clientY; isDragging = true; });
  scroll.addEventListener("mouseup", e => {
    if (!isDragging) return; isDragging = false;
    const dx = e.clientX - startX;
    const dy = Math.abs(e.clientY - startY);
    if (Math.abs(dx) > 40 && dy < 80) {
      if (dx < 0) iosGoToPage(iosCurrentPage + 1);
      else iosGoToPage(iosCurrentPage - 1);
    }
  });
  scroll.addEventListener("mouseleave", () => isDragging = false);
}

/* ---- Open iframe app ---- */
function iosOpenIframeApp(app) {
  const view = document.getElementById("ios-app-view");
  const frame = document.getElementById("ios-app-frame");
  const nativeView = document.getElementById("ios-native-view");
  document.getElementById("ios-app-title").textContent = app.label;
  nativeView.style.display = "none";
  nativeView.innerHTML = "";
  frame.style.display = "block";
  frame.src = app.url;
  view.classList.remove("closing");
  view.classList.add("open");
}

/* ---- Open native app ---- */
function iosOpenNativeApp(app) {
  const view = document.getElementById("ios-app-view");
  const frame = document.getElementById("ios-app-frame");
  const nativeView = document.getElementById("ios-native-view");
  document.getElementById("ios-app-title").textContent = app.label;
  frame.style.display = "none";
  frame.src = "";
  nativeView.style.display = "block";
  nativeView.innerHTML = buildNativeApp(app.nativeType);
  view.classList.remove("closing");
  view.classList.add("open");
  // Post-render hooks
  if (app.nativeType === "phone")         setupPhoneApp();
  if (app.nativeType === "messages")      setupMessagesApp();
  if (app.nativeType === "calendar")      setupCalendarApp();
  if (app.nativeType === "calculator")    setupCalculatorApp();
  if (app.nativeType === "music-native")  setupMusicNativeApp();
}

/* ---- Close app ---- */
function iosCloseApp() {
  const view = document.getElementById("ios-app-view");
  view.classList.add("closing");
  setTimeout(() => {
    view.classList.remove("open", "closing");
    document.getElementById("ios-app-frame").src = "";
    document.getElementById("ios-native-view").innerHTML = "";
  }, 300);
}

/* ================================================================
   NATIVE APP BUILDERS
================================================================ */
function buildNativeApp(type) {
  switch(type) {
    case "phone":       return buildPhone();
    case "messages":    return buildMessages();
    case "camera":      return buildCamera();
    case "photos":      return buildPhotos();
    case "maps":        return buildMaps();
    case "settings":    return buildSettings();
    case "notes-ios":   return buildNotesIOS();
    case "clock":       return buildClock();
    case "calendar":    return buildCalendarApp();
    case "calculator":  return buildCalculator();
    case "health":      return buildHealth();
    case "weather-app": return buildWeatherApp();
    case "wallet":      return buildWallet();
    case "music-native":return buildMusicNative();
    case "contacts":    return buildContacts();
    case "podcasts":    return buildPodcasts();
    default: return `<div style="padding:40px;text-align:center;color:#666;">App en construcción</div>`;
  }
}

/* ---- Phone ---- */
function buildPhone() {
  return `<div class="phone-app">
    <div class="phone-display">
      <div class="phone-number" id="phone-number"></div>
      <div class="phone-name" id="phone-name">Marcador</div>
    </div>
    <div class="phone-keypad">
      ${[["1",""],["2","ABC"],["3","DEF"],["4","GHI"],["5","JKL"],["6","MNO"],
         ["7","PQRS"],["8","TUV"],["9","WXYZ"],["*",""],["0","+"],["#",""]]
        .map(([n,l])=>`<div class="phone-key" onclick="phoneKey('${n}')">${n}<sub>${l}</sub></div>`).join("")}
    </div>
    <div class="phone-actions">
      <div class="phone-btn del" onclick="phoneDel()">⌫</div>
      <div class="phone-btn call" onclick="phoneCall()">📞</div>
    </div>
  </div>`;
}
function setupPhoneApp() {
  window.phoneKey = (k) => {
    const el = document.getElementById("phone-number");
    if (!el) return;
    if (el.textContent.length < 14) el.textContent += k;
    document.getElementById("phone-name").textContent = "Marcador";
  };
  window.phoneDel = () => {
    const el = document.getElementById("phone-number");
    if (!el) return;
    el.textContent = el.textContent.slice(0, -1);
  };
  window.phoneCall = () => {
    const n = document.getElementById("phone-number")?.textContent;
    document.getElementById("phone-name").textContent = n ? "Llamando…" : "Ingresa un número";
    setTimeout(() => { const el = document.getElementById("phone-name"); if(el && el.textContent === "Llamando…") el.textContent = "Marcador"; }, 2500);
  };
}

/* ---- Messages ---- */
let iosMsgCurrentChat = null;
const iosMsgContacts = [
  { name:"Andrés M.", avatar:"A", color:"#007aff", msgs:[{out:false,text:"¡Hola Santiago! Vi tu portafolio."},{out:true,text:"¡Gracias! Me alegra que te haya gustado."},{out:false,text:"¿Podemos hablar de un proyecto?"}] },
  { name:"Laura S.", avatar:"L", color:"#ff2d55", msgs:[{out:true,text:"Hola Laura, ¿cómo estás?"},{out:false,text:"¡Muy bien! Enviándote el brief ya."}] },
  { name:"Carlos P.", avatar:"C", color:"#5856d6", msgs:[{out:false,text:"¿Terminaste el módulo de IA?"},{out:true,text:"Sí, acabo de subir los cambios al repo."}] },
  { name:"María T.", avatar:"M", color:"#ff9500", msgs:[{out:false,text:"Sterling, tu app de música está increíble."},{out:true,text:"¡Gracias! Fue un proyecto divertido."}] },
];
function buildMessages() {
  if (iosMsgCurrentChat !== null) return buildChat(iosMsgContacts[iosMsgCurrentChat]);
  return `<div class="msgs-app">
    <div class="msgs-search"><input placeholder="🔍  Buscar" readonly></div>
    <div class="msgs-list">
      ${iosMsgContacts.map((c,i) => `
        <div class="msgs-item" onclick="iosOpenChat(${i})">
          <div class="msgs-avatar" style="background:${c.color}">${c.avatar}</div>
          <div class="msgs-content">
            <div class="msgs-name">${c.name}</div>
            <div class="msgs-preview">${c.msgs[c.msgs.length-1].text}</div>
          </div>
          <div class="msgs-time">Ahora</div>
        </div>`).join("")}
    </div>
  </div>`;
}
function buildChat(c) {
  return `<div class="msgs-chat-bg">
    <div class="msgs-bubbles" id="msgs-bubbles">
      ${c.msgs.map(m=>`<div class="msg-bubble ${m.out?'out':'in'}">${m.text}</div>`).join("")}
    </div>
    <div class="msgs-input-bar">
      <input class="msgs-input" id="msgs-input" placeholder="iMessage" type="text" 
        onkeydown="if(event.key==='Enter')iosSendMsg()">
      <button class="msgs-send" onclick="iosSendMsg()">↑</button>
    </div>
  </div>`;
}
function setupMessagesApp() {
  window.iosOpenChat = (i) => {
    iosMsgCurrentChat = i;
    document.getElementById("ios-app-title").textContent = iosMsgContacts[i].name;
    document.getElementById("ios-app-back-label").textContent = "Mensajes";
    const nv = document.getElementById("ios-native-view");
    nv.innerHTML = buildChat(iosMsgContacts[i]);
    const bubbles = document.getElementById("msgs-bubbles");
    if (bubbles) bubbles.scrollTop = 99999;
  };
  window.iosSendMsg = () => {
    const input = document.getElementById("msgs-input");
    if (!input || !input.value.trim()) return;
    const c = iosMsgContacts[iosMsgCurrentChat];
    c.msgs.push({ out:true, text:input.value.trim() });
    input.value = "";
    const nv = document.getElementById("ios-native-view");
    nv.innerHTML = buildChat(c);
    const bubbles = document.getElementById("msgs-bubbles");
    if (bubbles) bubbles.scrollTop = 99999;
    // Auto-reply
    setTimeout(() => {
      c.msgs.push({ out:false, text:"¡Interesante! Cuéntame más 😊" });
      nv.innerHTML = buildChat(c);
      const b2 = document.getElementById("msgs-bubbles");
      if (b2) b2.scrollTop = 99999;
    }, 1500);
  };
}

/* ---- Camera ---- */
function buildCamera() {
  return `<div class="camera-app" style="background:#000;color:white;min-height:100%;display:flex;flex-direction:column;">
    <div class="camera-viewfinder" style="flex:1;">
      <div class="camera-grid-h"></div><div class="camera-grid-h"></div>
      <div class="camera-grid-v"></div><div class="camera-grid-v"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;">
        <div style="font-size:48px;opacity:0.2;">📷</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.4);">Cámara no disponible en web</div>
      </div>
    </div>
    <div class="camera-modes">
      <span class="camera-mode">FOTO</span>
      <span class="camera-mode active">VIDEO</span>
      <span class="camera-mode">RETRATO</span>
    </div>
    <div class="camera-controls">
      <div class="camera-thumb">🖼️</div>
      <div class="camera-shutter" onclick="showToast('Cámara','📸 ¡Foto tomada!')"></div>
      <div class="camera-flip" onclick="showToast('Cámara','🔄 Cámara girada')">🔄</div>
    </div>
  </div>`;
}

/* ---- Photos ---- */
function buildPhotos() {
  const photos = [
    "https://avatars.githubusercontent.com/u/98182135?v=4",
    "https://512pixels.net/wp-content/uploads/2025/06/26-Tahoe-Light-6K-thumb.jpeg",
    "https://512pixels.net/wp-content/uploads/2025/06/26-Tahoe-Dark-6K-thumb.jpeg",
    "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Dawn-thumb.jpeg",
    "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Day-thumb.jpeg",
    "https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Dusk-thumb.jpeg",
  ];
  return `<div class="photos-app">
    <div class="photos-grid-label">Biblioteca</div>
    <div class="photos-grid">
      ${photos.map(p=>`<div class="photo-cell"><img src="${p}" loading="lazy"></div>`).join("")}
      ${Array(6).fill(0).map((_,i)=>`<div class="photo-cell" style="background:hsl(${i*40},30%,75%)"></div>`).join("")}
    </div>
  </div>`;
}

/* ---- Maps ---- */
function buildMaps() {
  return `<div class="maps-app">
    <div class="maps-bg">
      <div class="maps-road h" style="top:40%"></div>
      <div class="maps-road h" style="top:65%"></div>
      <div class="maps-road v" style="left:35%"></div>
      <div class="maps-road v" style="left:65%"></div>
      <div class="maps-pin" style="top:38%;left:50%;">📍</div>
      <div class="maps-search-bar">
        <span class="maps-search-icon">🔍</span>
        <input class="maps-search-input" placeholder="Buscar en Mapas…" readonly value="Cali, Valle del Cauca">
      </div>
    </div>
    <div class="maps-actions">
      <button class="maps-btn"><div class="maps-btn-icon">🚗</div>Conducir</button>
      <button class="maps-btn"><div class="maps-btn-icon">🚶</div>Caminar</button>
      <button class="maps-btn"><div class="maps-btn-icon">🚌</div>Tránsito</button>
      <button class="maps-btn" onclick="showToast('Mapas','📍 Ubicación guardada')"><div class="maps-btn-icon">⭐</div>Guardar</button>
    </div>
  </div>`;
}

/* ---- Settings ---- */
function buildSettings() {
  const items = [
    { icon:"🔔", bg:"#ff3b30", label:"Notificaciones", val:"" },
    { icon:"🔊", bg:"#ff3b30", label:"Sonidos", val:"" },
    { icon:"🌙", bg:"#5856d6", label:"Modo enfoque", val:"No molestar", toggle:false },
    { icon:"⏱", bg:"#ff9500", label:"Tiempo de pantalla", val:"" },
  ];
  const items2 = [
    { icon:"📶", bg:"#0071e3", label:"Wi-Fi", val:"Sterling 5G", toggle:true },
    { icon:"🔵", bg:"#0071e3", label:"Bluetooth", val:"Activado", toggle:true },
    { icon:"✈️", bg:"#8e8e93", label:"Modo avión", val:"", toggle:false },
  ];
  const items3 = [
    { icon:"🎨", bg:"#007aff", label:"Fondo de pantalla", val:"" },
    { icon:"💡", bg:"#636366", label:"Pantalla y brillo", val:"" },
    { icon:"🔒", bg:"#8e8e93", label:"Face ID y código", val:"" },
    { icon:"🔋", bg:"#34c759", label:"Batería", val:"87%" },
  ];
  function renderGroup(items) {
    return `<div class="settings-group">${items.map(item=>`
      <div class="settings-item">
        <div class="settings-icon" style="background:${item.bg}">${item.icon}</div>
        <div class="settings-label">${item.label}</div>
        ${item.val ? `<div class="settings-value">${item.val}</div>` : ''}
        ${item.toggle !== undefined
          ? `<div class="settings-toggle ${item.toggle?'':'off'}" onclick="this.classList.toggle('off')"></div>`
          : `<div class="settings-arrow">›</div>`}
      </div>`).join("")}</div>`;
  }
  return `<div class="settings-app" style="padding-bottom:40px;">
    <div style="padding:20px 16px 12px;display:flex;align-items:center;gap:14px;background:#f2f2f7;">
      <img src="https://avatars.githubusercontent.com/u/98182135?v=4" style="width:56px;height:56px;border-radius:50%;object-fit:cover;">
      <div>
        <div style="font-size:18px;font-weight:600;color:#1c1c1e;">Santiago Sterling</div>
        <div style="font-size:13px;color:#007aff;">iCloud, App Store y más</div>
      </div>
    </div>
    <div class="settings-section"><div class="settings-section-label">General</div>${renderGroup(items)}</div>
    <div class="settings-section"><div class="settings-section-label">Conectividad</div>${renderGroup(items2)}</div>
    <div class="settings-section"><div class="settings-section-label">Pantalla</div>${renderGroup(items3)}</div>
  </div>`;
}

/* ---- Notes ---- */
function buildNotesIOS() {
  return `<div style="background:#fef9e4;min-height:100%;display:flex;flex-direction:column;">
    <div style="padding:12px 16px 8px;border-bottom:0.5px solid rgba(0,0,0,0.1);display:flex;gap:8px;background:rgba(254,249,228,0.9);">
      <button style="padding:6px 12px;background:rgba(0,0,0,0.08);border:none;border-radius:8px;font-size:14px;cursor:pointer;">B</button>
      <button style="padding:6px 12px;background:rgba(0,0,0,0.08);border:none;border-radius:8px;font-size:14px;font-style:italic;cursor:pointer;">I</button>
      <button style="padding:6px 12px;background:rgba(0,0,0,0.08);border:none;border-radius:8px;font-size:14px;text-decoration:underline;cursor:pointer;">U</button>
      <button style="padding:6px 12px;background:rgba(0,0,0,0.08);border:none;border-radius:8px;font-size:14px;cursor:pointer;">✓ Lista</button>
    </div>
    <textarea style="flex:1;padding:20px;background:transparent;border:none;resize:none;outline:none;font-size:16px;line-height:1.75;color:#1c1c1e;font-family:inherit;min-height:400px;"
      placeholder="Nota nueva…">¡Hola! Soy Santiago Sterling 👋

Tecnólogo en Análisis y Desarrollo de Software y en Gestión de Producción Industrial.

Mi propósito es integrar la eficiencia industrial con la inteligencia tecnológica.

• 8+ años en manufactura
• Desarrollador Full-Stack
• IA y Automatización
</textarea>
  </div>`;
}

/* ---- Clock ---- */
function buildClock() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const hDeg = (h % 12) * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;
  const worldClocks = [
    { city:"Cali", tz:"America/Bogota", offset:-5 },
    { city:"Nueva York", tz:"America/New_York", offset:-4 },
    { city:"Madrid", tz:"Europe/Madrid", offset:2 },
    { city:"Tokio", tz:"Asia/Tokyo", offset:9 },
  ];
  function cityTime(offset) {
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ct = new Date(utc + offset * 3600000);
    return ct.toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" });
  }
  return `<div style="background:#1c1c1e;min-height:100%;color:white;display:flex;flex-direction:column;">
    <!-- Analog clock -->
    <div style="display:flex;justify-content:center;padding:30px 0 20px;">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="96" fill="#2c2c2e" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
        ${[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i)=>{
          const r=i%3===0?80:85, x1=100+r*Math.sin(deg*Math.PI/180), y1=100-r*Math.cos(deg*Math.PI/180);
          const x2=100+92*Math.sin(deg*Math.PI/180), y2=100-92*Math.cos(deg*Math.PI/180);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,${i%3===0?0.6:0.3})" stroke-width="${i%3===0?2:1}" stroke-linecap="round"/>`;
        }).join("")}
        <!-- Hour hand -->
        <line x1="100" y1="100" x2="${100+55*Math.sin(hDeg*Math.PI/180)}" y2="${100-55*Math.cos(hDeg*Math.PI/180)}" stroke="white" stroke-width="5" stroke-linecap="round"/>
        <!-- Minute hand -->
        <line x1="100" y1="100" x2="${100+75*Math.sin(mDeg*Math.PI/180)}" y2="${100-75*Math.cos(mDeg*Math.PI/180)}" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <!-- Second hand -->
        <line x1="100" y1="100" x2="${100+80*Math.sin(sDeg*Math.PI/180)}" y2="${100-80*Math.cos(sDeg*Math.PI/180)}" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/>
        <circle cx="100" cy="100" r="5" fill="#ff3b30"/>
      </svg>
    </div>
    <!-- World clocks -->
    <div style="flex:1;overflow-y:auto;">
      <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.5);padding:8px 16px;text-transform:uppercase;letter-spacing:0.5px;">Hora mundial</div>
      ${worldClocks.map(c=>`
        <div style="display:flex;align-items:center;padding:14px 16px;border-bottom:0.5px solid rgba(255,255,255,0.08);">
          <div>
            <div style="font-size:16px;font-weight:500;">${c.city}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.5);">UTC${c.offset>=0?'+':''}${c.offset}</div>
          </div>
          <div style="margin-left:auto;font-size:32px;font-weight:200;letter-spacing:-1px;">${cityTime(c.offset)}</div>
        </div>`).join("")}
    </div>
    <!-- Alarm button -->
    <div style="padding:16px;text-align:center;">
      <button onclick="showToast('Reloj','⏰ Alarma configurada para las 7:00')" 
        style="background:#ff3b30;color:white;border:none;border-radius:14px;padding:14px 32px;font-size:16px;font-weight:600;cursor:pointer;width:100%;">
        + Nueva alarma
      </button>
    </div>
  </div>`;
}

/* ---- Calendar App ---- */
let calAppDate = new Date();
calSelectedDayIOS = new Date().getDate(); // reuse existing global
const calEvents = {
  [new Date().getDate()]: [
    { title:"Reunión de equipo", time:"10:00 AM", color:"#007aff" },
    { title:"Revisión del portafolio", time:"3:00 PM", color:"#ff2d55" },
  ],
  [(new Date().getDate() + 2) % 28 + 1]: [
    { title:"Entrega proyecto Quantix", time:"9:00 AM", color:"#34c759" },
  ],
  [(new Date().getDate() + 5) % 28 + 1]: [
    { title:"Conferencia IA", time:"6:00 PM", color:"#5856d6" },
  ],
};

function buildCalendarApp() {
  const now = new Date();
  const year = calAppDate.getFullYear();
  const month = calAppDate.getMonth();
  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const dayNames = ["Do","Lu","Ma","Mi","Ju","Vi","Sa"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);

  let daysHTML = "";
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const prevDate = new Date(year, month, -firstDay + i + 1).getDate();
    daysHTML += `<div class="cal-native-day other-month">${prevDate}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && d === today.getDate();
    const isSel = d === calSelectedDayIOS && isCurrentMonth;
    const hasEv = calEvents[d] && calEvents[d].length > 0;
    daysHTML += `<div class="cal-native-day${isToday?' today':''}${isSel&&!isToday?' selected':''}${hasEv?' has-event':''}" onclick="calSelectDay(${d})">${d}</div>`;
  }

  // Events for selected day
  const evs = calEvents[calSelectedDayIOS] || [];
  const evDate = new Date(year, month, calSelectedDayIOS);
  const dayLabel = evDate.toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" });

  return `<div class="cal-native-app">
    <div class="cal-native-header">
      <div class="cal-native-month-nav">
        <button class="cal-native-nav-btn" onclick="calChangeMonth(-1)">‹</button>
        <div class="cal-native-month-title">${monthNames[month]} ${year}</div>
        <button class="cal-native-nav-btn" onclick="calChangeMonth(1)">›</button>
      </div>
      <div class="cal-native-weekdays">
        ${dayNames.map(d=>`<div>${d}</div>`).join("")}
      </div>
    </div>
    <div class="cal-native-grid" style="padding:4px 12px 8px;">${daysHTML}</div>
    <div class="cal-native-events">
      <div class="cal-events-date-label">${dayLabel.charAt(0).toUpperCase()+dayLabel.slice(1)}</div>
      ${evs.length ? evs.map(ev=>`
        <div class="cal-event-item">
          <div class="cal-event-color" style="background:${ev.color}"></div>
          <div>
            <div class="cal-event-title">${ev.title}</div>
            <div class="cal-event-time">${ev.time}</div>
          </div>
        </div>`).join("") : `<div class="cal-no-events">Sin eventos este día</div>`}
    </div>
  </div>`;
}

function setupCalendarApp() {
  window.calSelectDay = (d) => {
    calSelectedDayIOS = d;
    const nv = document.getElementById("ios-native-view");
    if (nv) nv.innerHTML = buildCalendarApp();
    setupCalendarApp();
  };
  window.calChangeMonth = (delta) => {
    calAppDate = new Date(calAppDate.getFullYear(), calAppDate.getMonth() + delta, 1);
    const nv = document.getElementById("ios-native-view");
    if (nv) nv.innerHTML = buildCalendarApp();
    setupCalendarApp();
  };
}

/* ---- Calculator App ---- */
let calcExpr = "", calcResult = "0", calcJustEval = false;
function buildCalculator() {
  return `<div class="calc-app">
    <div class="calc-display">
      <div class="calc-expr" id="calc-expr">${calcExpr}</div>
      <div class="calc-result" id="calc-result">${calcResult}</div>
    </div>
    <div class="calc-keypad">
      <div class="calc-key gray" onclick="calcInput('AC')">AC</div>
      <div class="calc-key gray" onclick="calcInput('+/-')">+/-</div>
      <div class="calc-key gray" onclick="calcInput('%')">%</div>
      <div class="calc-key orange" onclick="calcInput('÷')">÷</div>
      <div class="calc-key dark" onclick="calcInput('7')">7</div>
      <div class="calc-key dark" onclick="calcInput('8')">8</div>
      <div class="calc-key dark" onclick="calcInput('9')">9</div>
      <div class="calc-key orange" onclick="calcInput('×')">×</div>
      <div class="calc-key dark" onclick="calcInput('4')">4</div>
      <div class="calc-key dark" onclick="calcInput('5')">5</div>
      <div class="calc-key dark" onclick="calcInput('6')">6</div>
      <div class="calc-key orange" onclick="calcInput('−')">−</div>
      <div class="calc-key dark" onclick="calcInput('1')">1</div>
      <div class="calc-key dark" onclick="calcInput('2')">2</div>
      <div class="calc-key dark" onclick="calcInput('3')">3</div>
      <div class="calc-key orange" onclick="calcInput('+')">+</div>
      <div class="calc-key dark wide" onclick="calcInput('0')" style="grid-column:span 2;aspect-ratio:auto;padding:0 26px;justify-content:flex-start;">0</div>
      <div class="calc-key dark" onclick="calcInput('.')">.</div>
      <div class="calc-key orange" onclick="calcInput('=')">=</div>
    </div>
  </div>`;
}
function setupCalculatorApp() {
  window.calcInput = (key) => {
    const exprEl = document.getElementById("calc-expr");
    const resultEl = document.getElementById("calc-result");
    if (!exprEl || !resultEl) return;
    if (key === "AC") { calcExpr = ""; calcResult = "0"; calcJustEval = false; }
    else if (key === "=") {
      try {
        calcExpr = calcResult;
        const expr = calcExpr.replace(/÷/g,"/").replace(/×/g,"*").replace(/−/g,"-");
        const r = Function('"use strict";return (' + expr + ')')();
        calcResult = parseFloat(r.toFixed(10)).toString();
        calcExpr = ""; calcJustEval = true;
      } catch(e) { calcResult = "Error"; }
    } else if (key === "+/-") {
      calcResult = (parseFloat(calcResult) * -1).toString();
    } else if (key === "%") {
      calcResult = (parseFloat(calcResult) / 100).toString();
    } else if (["÷","×","−","+"].includes(key)) {
      if (calcJustEval) { calcExpr = calcResult + " " + key + " "; calcResult = ""; calcJustEval = false; }
      else { calcExpr += (calcResult||"") + " " + key + " "; calcResult = ""; }
    } else if (key === ".") {
      if (!calcResult.includes(".")) calcResult += (calcResult ? "" : "0") + ".";
    } else {
      if (calcJustEval) { calcResult = key; calcJustEval = false; }
      else calcResult = (calcResult === "0" ? "" : calcResult) + key;
    }
    if (exprEl) exprEl.textContent = calcExpr;
    if (resultEl) resultEl.textContent = calcResult || "0";
  };
}

/* ---- Health App ---- */
function buildHealth() {
  return `<div class="health-app">
    <div class="health-header">
      <div class="health-title">Salud</div>
      <div class="health-subtitle">${new Date().toLocaleDateString("es-ES", {weekday:"long",day:"numeric",month:"long"})}</div>
    </div>
    <div style="overflow-y:auto;padding-bottom:40px;">
      <div class="health-section">
        <div class="health-section-label">Resumen del día</div>
        <div class="health-card">
          <div class="health-icon">🚶</div>
          <div class="health-card-content">
            <div class="health-card-label">Pasos</div>
            <div class="health-card-value">8,234 <span class="health-card-unit">pasos</span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:70%;background:#ff2d55;"></div></div>
          </div>
        </div>
        <div class="health-card">
          <div class="health-icon">🔥</div>
          <div class="health-card-content">
            <div class="health-card-label">Calorías activas</div>
            <div class="health-card-value">420 <span class="health-card-unit">kcal</span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:60%;background:#ff9500;"></div></div>
          </div>
        </div>
        <div class="health-card">
          <div class="health-icon">❤️</div>
          <div class="health-card-content">
            <div class="health-card-label">Frecuencia cardíaca</div>
            <div class="health-card-value">72 <span class="health-card-unit">bpm</span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:55%;background:#ff2d55;"></div></div>
          </div>
        </div>
        <div class="health-card">
          <div class="health-icon">🛌</div>
          <div class="health-card-content">
            <div class="health-card-label">Sueño</div>
            <div class="health-card-value">7h 32m <span class="health-card-unit"></span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:80%;background:#5856d6;"></div></div>
          </div>
        </div>
        <div class="health-card">
          <div class="health-icon">💧</div>
          <div class="health-card-content">
            <div class="health-card-label">Agua</div>
            <div class="health-card-value">1.4 <span class="health-card-unit">litros</span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:45%;background:#5ac8fa;"></div></div>
          </div>
        </div>
        <div class="health-card">
          <div class="health-icon">🏃</div>
          <div class="health-card-content">
            <div class="health-card-label">Distancia</div>
            <div class="health-card-value">5.8 <span class="health-card-unit">km</span></div>
            <div class="health-bar"><div class="health-bar-fill" style="width:50%;background:#34c759;"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---- Weather Full App ---- */
function buildWeatherApp() {
  const hours = ["Ahora","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"];
  const temps  = [26,27,27,28,28,26,24,23,22];
  const emojis = ["⛅","⛅","☀️","☀️","🌤","⛅","🌦","🌦","🌙"];
  return `<div style="background:linear-gradient(180deg,#1a6fd8 0%,#3a9bd5 60%,#87ceeb 100%);min-height:100%;color:white;padding:20px 20px 40px;overflow-y:auto;">
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:14px;opacity:0.85;margin-bottom:4px;">📍 Cali, Colombia</div>
      <div style="font-size:76px;font-weight:100;letter-spacing:-3px;line-height:1;">26°</div>
      <div style="font-size:20px;font-weight:300;margin:4px 0;">Parcialmente nublado</div>
      <div style="font-size:15px;opacity:0.8;">Máx: 29° · Mín: 21°</div>
    </div>
    <!-- Hourly forecast -->
    <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:600;opacity:0.75;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">PRONÓSTICO POR HORA</div>
      <div style="display:flex;gap:14px;overflow-x:auto;padding-bottom:4px;">
        ${hours.map((h,i)=>`<div style="display:flex;flex-direction:column;align-items:center;gap:5px;min-width:44px;">
          <div style="font-size:11px;opacity:0.8;">${h}</div>
          <div style="font-size:20px;">${emojis[i]}</div>
          <div style="font-size:15px;font-weight:500;">${temps[i]}°</div>
        </div>`).join("")}
      </div>
    </div>
    <!-- 5-day forecast -->
    <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:600;opacity:0.75;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">PRÓXIMOS 5 DÍAS</div>
      ${[["Hoy","⛅",29,21],["Martes","🌤",30,22],["Miércoles","🌦",25,20],["Jueves","☀️",31,23],["Viernes","⛅",28,21]].map(([d,e,hi,lo])=>`
        <div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
          <div style="flex:1;font-size:16px;">${d}</div>
          <div style="font-size:22px;margin-right:12px;">${e}</div>
          <div style="font-size:15px;opacity:0.7;margin-right:8px;">${lo}°</div>
          <div style="font-size:15px;font-weight:600;">${hi}°</div>
        </div>`).join("")}
    </div>
    <!-- UV / Humidity -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;">
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;">UV</div>
        <div style="font-size:32px;font-weight:200;">6</div>
        <div style="font-size:13px;opacity:0.8;">Alto</div>
      </div>
      <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;">
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;">Humedad</div>
        <div style="font-size:32px;font-weight:200;">74%</div>
        <div style="font-size:13px;opacity:0.8;">Moderada</div>
      </div>
      <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;">
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;">Viento</div>
        <div style="font-size:32px;font-weight:200;">12</div>
        <div style="font-size:13px;opacity:0.8;">km/h NE</div>
      </div>
      <div style="background:rgba(255,255,255,0.15);border-radius:18px;padding:14px;">
        <div style="font-size:11px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;">Sensación</div>
        <div style="font-size:32px;font-weight:200;">28°</div>
        <div style="font-size:13px;opacity:0.8;">Cálido</div>
      </div>
    </div>
  </div>`;
}

/* ---- Wallet App ---- */
function buildWallet() {
  return `<div style="background:#1c1c1e;min-height:100%;color:white;padding:20px 16px 40px;overflow-y:auto;">
    <div style="font-size:28px;font-weight:700;margin-bottom:20px;">Wallet</div>
    <!-- Cards -->
    <div style="display:flex;flex-direction:column;gap:(-40px);">
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);border-radius:20px;padding:24px;margin-bottom:-60px;box-shadow:0 10px 30px rgba(0,0,0,0.5);position:relative;z-index:3;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="font-size:14px;opacity:0.7;">Visa</div>
          <div style="font-size:24px;">💳</div>
        </div>
        <div style="font-size:18px;letter-spacing:4px;margin:24px 0 12px;font-weight:300;">•••• •••• •••• 4832</div>
        <div style="display:flex;justify-content:space-between;font-size:12px;opacity:0.7;">
          <div>SANTIAGO STERLING</div>
          <div>12/26</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#f7971e,#ffd200);border-radius:20px;padding:24px;margin-bottom:-60px;box-shadow:0 10px 30px rgba(0,0,0,0.4);position:relative;z-index:2;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div style="font-size:14px;opacity:0.7;color:#333;">Mastercard</div>
          <div style="font-size:24px;">💳</div>
        </div>
        <div style="font-size:18px;letter-spacing:4px;margin:24px 0 12px;font-weight:300;color:#333;">•••• •••• •••• 7741</div>
        <div style="display:flex;justify-content:space-between;font-size:12px;opacity:0.7;color:#333;">
          <div>SANTIAGO STERLING</div>
          <div>08/27</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#11998e,#38ef7d);border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,0.4);position:relative;z-index:1;margin-top:80px;">
        <div style="font-size:14px;opacity:0.8;color:#1c1c1e;">Apple Cash</div>
        <div style="font-size:36px;font-weight:200;margin:12px 0;color:#1c1c1e;">$248.50</div>
        <div style="font-size:12px;opacity:0.7;color:#1c1c1e;">Disponible</div>
      </div>
    </div>
    <div style="margin-top:24px;background:#2c2c2e;border-radius:16px;overflow:hidden;">
      ${[["Transferencia","Hace 2h","+ $50.00","#34c759"],["Compra App Store","Ayer","- $4.99","#ff3b30"],["Pago de servicio","Hace 3 días","- $28.000","#ff9500"]].map(([t,d,a,c])=>`
        <div style="padding:14px 16px;border-bottom:0.5px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;">
          <div style="flex:1;">
            <div style="font-size:15px;">${t}</div>
            <div style="font-size:12px;opacity:0.5;margin-top:2px;">${d}</div>
          </div>
          <div style="font-size:16px;font-weight:600;color:${c};">${a}</div>
        </div>`).join("")}
    </div>
  </div>`;
}

/* ---- Music Native App ---- */
let musicPlaying = false;
function buildMusicNative() {
  return `<div style="background:#1c1c1e;min-height:100%;color:white;display:flex;flex-direction:column;align-items:center;padding:30px 24px 40px;gap:20px;">
    <div style="font-size:16px;font-weight:600;opacity:0.6;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Sterling Music</div>
    <div style="width:200px;height:200px;border-radius:24px;background:linear-gradient(135deg,#ff6b35,#f7c948,#ff2d55);display:flex;align-items:center;justify-content:center;font-size:72px;box-shadow:0 20px 60px rgba(255,45,85,0.4);">🎵</div>
    <div style="text-align:center;">
      <div style="font-size:22px;font-weight:700;margin-bottom:4px;">Sterling Mix Vol. 1</div>
      <div style="font-size:16px;opacity:0.6;">Santiago Sterling</div>
    </div>
    <div style="width:100%;">
      <div style="height:3px;background:rgba(255,255,255,0.15);border-radius:2px;margin-bottom:6px;position:relative;">
        <div id="music-progress-bar" style="height:100%;width:35%;background:white;border-radius:2px;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;opacity:0.5;">
        <span id="music-current-time">1:24</span><span>3:58</span>
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:32px;">
      <div style="font-size:28px;cursor:pointer;opacity:0.7;" onclick="showToast('Música','⏮ Anterior')">⏮</div>
      <div id="music-play-btn" style="width:64px;height:64px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:28px;color:#1c1c1e;cursor:pointer;" onclick="musicToggleNative()">▶</div>
      <div style="font-size:28px;cursor:pointer;opacity:0.7;" onclick="showToast('Música','⏭ Siguiente')">⏭</div>
    </div>
    <div style="display:flex;justify-content:space-between;width:100%;padding:0 8px;">
      <div style="font-size:22px;cursor:pointer;opacity:0.6;" onclick="showToast('Música','🔀 Aleatorio')">🔀</div>
      <div style="font-size:22px;cursor:pointer;opacity:0.6;" onclick="showToast('Música','🔁 Repetir')">🔁</div>
    </div>
    <div style="width:100%;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:14px;opacity:0.5;">🔈</span>
        <div style="flex:1;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;">
          <div style="width:70%;height:100%;background:white;border-radius:2px;"></div>
        </div>
        <span style="font-size:14px;opacity:0.5;">🔊</span>
      </div>
    </div>
  </div>`;
}
function setupMusicNativeApp() {
  let musicProgress = 35;
  let seconds = 84;
  let playing = false;
  let interval = null;
  window.musicToggleNative = () => {
    playing = !playing;
    const btn = document.getElementById("music-play-btn");
    if (btn) btn.textContent = playing ? "⏸" : "▶";
    if (playing) {
      interval = setInterval(() => {
        seconds = Math.min(seconds + 1, 238);
        musicProgress = (seconds / 238) * 100;
        const bar = document.getElementById("music-progress-bar");
        const timeEl = document.getElementById("music-current-time");
        if (bar) bar.style.width = musicProgress + "%";
        if (timeEl) timeEl.textContent = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`;
        if (seconds >= 238) { clearInterval(interval); playing = false; if(btn) btn.textContent = "▶"; }
      }, 1000);
    } else {
      clearInterval(interval);
    }
  };
}

/* ---- Contacts App ---- */
function buildContacts() {
  const contacts = [
    { name:"Andrés M.", role:"Cliente", color:"#007aff", emoji:"A" },
    { name:"Carlos P.", role:"Desarrollador", color:"#5856d6", emoji:"C" },
    { name:"Laura S.", role:"Diseñadora", color:"#ff2d55", emoji:"L" },
    { name:"María T.", role:"Gerente", color:"#ff9500", emoji:"M" },
    { name:"Pedro V.", role:"DevOps", color:"#34c759", emoji:"P" },
    { name:"Sofía R.", role:"Analista", color:"#af52de", emoji:"S" },
    { name:"Tomás G.", role:"UX Designer", color:"#5ac8fa", emoji:"T" },
    { name:"Valeria H.", role:"PM", color:"#ff3b30", emoji:"V" },
  ];
  return `<div style="background:#f2f2f7;min-height:100%;">
    <div style="padding:14px 16px 8px;background:white;border-bottom:0.5px solid rgba(0,0,0,0.1);">
      <div style="background:#e5e5ea;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px;">
        <span style="opacity:0.5;">🔍</span>
        <span style="font-size:16px;color:#8e8e93;">Buscar</span>
      </div>
    </div>
    <div style="padding:8px 0;">
      ${contacts.map(c=>`
        <div style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:white;border-bottom:0.5px solid rgba(0,0,0,0.06);cursor:pointer;" onclick="showToast('Contactos','📞 Llamando a ${c.name}…')">
          <div style="width:46px;height:46px;border-radius:50%;background:${c.color};display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:600;flex-shrink:0;">${c.emoji}</div>
          <div>
            <div style="font-size:16px;font-weight:500;color:#1c1c1e;">${c.name}</div>
            <div style="font-size:13px;color:#8e8e93;">${c.role}</div>
          </div>
          <div style="margin-left:auto;color:#007aff;font-size:20px;">›</div>
        </div>`).join("")}
    </div>
  </div>`;
}

/* ---- Podcasts App ---- */
function buildPodcasts() {
  const shows = [
    { title:"Tech & IA Hoy", ep:"Ep. 142: El futuro del software", time:"48 min", emoji:"🎙️", color:"#b05dfb" },
    { title:"Industria 4.0", ep:"Ep. 88: Automatización en Colombia", time:"35 min", emoji:"🏭", color:"#ff9500" },
    { title:"Dev Stories", ep:"Ep. 201: Del sector industrial al código", time:"62 min", emoji:"💻", color:"#007aff" },
    { title:"Data Science CO", ep:"Ep. 57: Machine Learning en producción", time:"44 min", emoji:"📊", color:"#34c759" },
  ];
  return `<div style="background:#1c1c1e;min-height:100%;color:white;">
    <div style="padding:16px 16px 8px;">
      <div style="font-size:28px;font-weight:700;margin-bottom:4px;">Podcasts</div>
      <div style="font-size:14px;opacity:0.5;">Para ti</div>
    </div>
    <div style="padding:0 16px;">
      ${shows.map(s=>`
        <div style="display:flex;gap:14px;padding:14px 0;border-bottom:0.5px solid rgba(255,255,255,0.07);cursor:pointer;align-items:center;" onclick="showToast('Podcasts','▶ Reproduciendo: ${s.title}')">
          <div style="width:56px;height:56px;border-radius:12px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${s.emoji}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;opacity:0.6;margin-bottom:2px;">${s.title}</div>
            <div style="font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.ep}</div>
            <div style="font-size:12px;opacity:0.5;margin-top:2px;">${s.time}</div>
          </div>
          <div style="font-size:22px;color:${s.color};flex-shrink:0;">▶</div>
        </div>`).join("")}
    </div>
  </div>`;
}

/* ================================================================
   CONTROL CENTER & NOTIFICATION CENTER
================================================================ */
function iosOpenControlCenter() {
  const cc = document.getElementById("ios-control-center");
  const nc = document.getElementById("ios-notif-center");
  if (nc) nc.classList.remove("open");
  if (cc) cc.classList.toggle("open");
}
function iosOpenNotifCenter() {
  const cc = document.getElementById("ios-control-center");
  const nc = document.getElementById("ios-notif-center");
  if (cc) cc.classList.remove("open");
  if (nc) nc.classList.toggle("open");
}
function iosCloseAllPanels() {
  document.getElementById("ios-control-center")?.classList.remove("open");
  document.getElementById("ios-notif-center")?.classList.remove("open");
}

/* ================================================================
   SWIPE DOWN GESTURE — status bar area
================================================================ */
function iosSetupSwipeGesture() {
  let touchStartY = 0, touchStartX = 0;
  document.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dx = e.changedTouches[0].clientX - touchStartX;
    // Only if starting near top (status bar area)
    if (touchStartY < 60 && dy > 50 && Math.abs(dx) < 60) {
      const midScreen = window.innerWidth / 2;
      if (touchStartX > midScreen) iosOpenControlCenter();
      else iosOpenNotifCenter();
    }
    // Swipe up from bottom = close app / go home
    if (touchStartY > window.innerHeight - 60 && dy < -60) {
      const view = document.getElementById("ios-app-view");
      if (view && view.classList.contains("open")) iosCloseApp();
    }
  }, { passive: true });
}

/* ================================================================
   INIT
================================================================ */
function initIosMobile() {
  if (!isMobile()) return;

  iosUpdateClock();
  setInterval(iosUpdateClock, 10000);
  iosUpdateWidgetDates();
  iosBuildGrids();
  iosBindDock();
  iosSetupPageSwipe();
  iosSetupSwipeGesture();

  // Back button
  document.getElementById("ios-app-back-btn")?.addEventListener("click", () => {
    if (iosMsgCurrentChat !== null) {
      iosMsgCurrentChat = null;
      document.getElementById("ios-app-title").textContent = "Mensajes";
      document.getElementById("ios-app-back-label").textContent = "Inicio";
      document.getElementById("ios-native-view").innerHTML = buildMessages();
      setupMessagesApp();
    } else {
      iosCloseApp();
    }
  });

  // Control center / notif center buttons
  document.getElementById("cc-close-btn")?.addEventListener("click", iosCloseAllPanels);
  document.getElementById("nc-close-btn")?.addEventListener("click", iosCloseAllPanels);

  // Status bar zones (tap)
  document.getElementById("ios-zone-left")?.addEventListener("click", iosOpenNotifCenter);
  document.getElementById("ios-zone-right")?.addEventListener("click", iosOpenControlCenter);
  document.getElementById("ios-swipe-hint")?.classList.add("active");

  // Widget: weather tap → open weather app
  document.getElementById("iw-weather")?.addEventListener("click", () => {
    const app = IOS_NATIVE_APPS.find(a => a.id === "weather");
    if (app) iosOpenNativeApp(app);
  });

  // Widget: calendar tap → open calendar app
  document.getElementById("iw-calendar-widget")?.addEventListener("click", () => {
    const app = IOS_NATIVE_APPS.find(a => a.id === "calendar");
    if (app) iosOpenNativeApp(app);
  });

  // Widget: activity tap → open health app
  document.getElementById("iw-activity")?.addEventListener("click", () => {
    const app = IOS_NATIVE_APPS.find(a => a.id === "health");
    if (app) iosOpenNativeApp(app);
  });

  // Widget: music tap → open music app
  document.getElementById("iw-music")?.addEventListener("click", (e) => {
    if (!e.target.classList.contains("iwm-btn") && !e.target.classList.contains("iwm-play")) {
      const app = IOS_NATIVE_APPS.find(a => a.id === "music-native");
      if (app) iosOpenNativeApp(app);
    }
  });

  // iOS Search overlay
  const searchOverlay = document.getElementById("ios-search-overlay");
  const searchInput = document.getElementById("ios-search-input");
  const searchResults = document.getElementById("ios-search-results");
  const searchCancel = document.getElementById("ios-search-cancel");

  const allApps = [...IOS_NATIVE_APPS, ...IOS_STERLING_APPS];

  function iosOpenSearch() {
    iosCloseAllPanels();
    if (searchOverlay) { searchOverlay.classList.add("open"); setTimeout(()=>searchInput?.focus(),100); }
  }
  function iosCloseSearch() {
    searchOverlay?.classList.remove("open");
    if (searchInput) { searchInput.value = ""; }
    if (searchResults) searchResults.innerHTML = "";
  }

  searchCancel?.addEventListener("click", iosCloseSearch);
  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchResults.innerHTML = ""; return; }
    const found = allApps.filter(a => a.label.toLowerCase().includes(q));
    searchResults.innerHTML = found.length ? found.map(a => `
      <div class="ios-search-result" onclick="iosSearchOpen('${a.id}')">
        <div class="ios-search-result-icon">${a.emoji || "📱"}</div>
        <div>
          <div class="ios-search-result-label">${a.label}</div>
          <div class="ios-search-result-sub">${a.native ? "App nativa" : "App Sterling"}</div>
        </div>
      </div>`).join("") : `<div style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;font-size:15px;">Sin resultados para "${searchInput.value}"</div>`;
  });

  window.iosSearchOpen = (id) => {
    iosCloseSearch();
    setTimeout(() => {
      const native = IOS_NATIVE_APPS.find(a => a.id === id);
      if (native) { iosOpenNativeApp(native); return; }
      const sterling = IOS_STERLING_APPS.find(a => a.id === id);
      if (sterling) iosOpenIframeApp(sterling);
    }, 200);
  };

  // Pull-down from homescreen = open search
  const pagesScroll = document.getElementById("ios-pages-scroll");
  let pullStartY = 0, pullStartPage = 0;
  pagesScroll?.addEventListener("touchstart", e => {
    pullStartY = e.touches[0].clientY;
    pullStartPage = iosCurrentPage;
  }, { passive: true });
  pagesScroll?.addEventListener("touchend", e => {
    const dy = e.changedTouches[0].clientY - pullStartY;
    // Swipe down on page 0 = open search
    if (pullStartPage === 0 && dy > 70) iosOpenSearch();
  }, { passive: true });

  // Music widget play/pause
  window.iosMusicToggle = () => {
    const btn = document.getElementById("iwm-play-btn");
    if (!btn) return;
    const playing = btn.textContent === "⏸";
    btn.textContent = playing ? "▶" : "⏸";
    showToast("Música", playing ? "⏸ Pausado" : "▶ Reproduciendo: Sterling Mix");
  };

  // Lock screen date widget
  const lwDay = document.getElementById("lw-cal-day");
  const lwMonth = document.getElementById("lw-cal-month");
  if (lwDay || lwMonth) {
    const now = new Date();
    if (lwDay) lwDay.textContent = now.getDate();
    if (lwMonth) {
      const months = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
      lwMonth.textContent = months[now.getMonth()];
    }
  }

  // Battery simulation (fake)
  let batteryPct = 87;
  const battPct = document.getElementById("iwbat-pct");
  const battFill = document.getElementById("iwbat-fill");
  if (battPct) battPct.textContent = batteryPct + "%";
  if (battFill) battFill.style.width = batteryPct + "%";
}

window.addEventListener("load", initIosMobile);
