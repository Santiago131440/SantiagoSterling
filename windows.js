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
        title: "Explorador de archivos",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-0QeQPgJUNilwfLLC5l1AnfScdu7OC2.png&w=1000&q=75",
        width: 760, height: 500, type: "system"
    },
    aplicaciones: {
        title: "Sterling Store",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-soM5VkrS231RkzTJKdb30Wco5dj6aJ.png&w=500&q=75",
        width: 880, height: 600, type: "system"
    },
    browser: {
        title: "Navegador",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75",
        width: 900, height: 620,
        content: `<div style="width:100%;height:100%;display:flex;flex-direction:column;">
  
  <div style="height:38px;background:rgba(255,255,255,0.05);
  border-bottom:1px solid rgba(255,255,255,0.08);
  display:flex;align-items:center;padding:0 10px;gap:8px;">

    <button onclick="reloadFrame()" 
    style="background:rgba(255,255,255,0.1);border:none;color:white;
    width:28px;height:28px;border-radius:4px;cursor:pointer;font-size:12px;">↺</button>

    <input id="browserInput"
    placeholder="Buscar en Google..."
    onkeydown="if(event.key==='Enter'){searchGoogle()}"
    style="flex:1;background:rgba(255,255,255,0.08);border:none;
    border-radius:4px;height:26px;padding:0 10px;
    font-size:12px;color:white;outline:none;">

  </div>

  <iframe id="browserFrame"
  src="https://www.google.com/webhp?igu=1"
  style="flex:1;border:none;"></iframe>

</div>`

    },
    notes: {
        title: "Bloc de notas",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-zGyBqZLV8MGRs1NxccwHoHjQc5XtsK.png&w=1000&q=75",
        width: 560, height: 420,
        type: "notes",
        content: ""
    },
    player: {
        title: "Sterling Music Player",
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
        title: "Sterl-ink Sketching",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DPM2VMQ9vdZ4HcXLRwCFZ7FK5Fn7Bx.png&w=1000&q=75",
        width: 820, height: 600,
        content: `<iframe src="https://santiago131440.github.io/SantiagoSterling/ExperienciaLaboral.html" style="width:100%;height:100%;border:none;"></iframe>`
    },
    buscaminas: {
        title: "Santiago Sterling World",
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
    "recycle-bin": {
        title: "Papelera de reciclaje",
        icon: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-hojVo7IEsndSCKEMMylnYGeF4E0HrU.png&w=500&q=75",
        width: 640, height: 420
    }
};

/* ============================================================
   FILE SYSTEM
============================================================ */
const fileSystem = {
    root: {
        type: "folder", name: "Este equipo",
        contents: {
            Documentos: {
                type: "folder",
                contents: {
                    "ReadMe.txt": {
                        type: "file", app: "notes",
                        content: `¡Hola! Soy Santiago Sterling\nTecnólogo en análisis y desarrollo de software y tecnólogo en Producción Industrial\n\nSoy un tecnólogo en Gestión de Producción Industrial con más de 8 años de experiencia en plantas de manufactura, y también tecnólogo en Análisis y Desarrollo de Software (SENA).\n\nMi propósito es integrar la eficiencia industrial con la inteligencia tecnológica, aplicando desarrollo de software, automatización y análisis de datos para optimizar procesos y generar soluciones escalables.`
                    },
                    "Notas.txt": { type: "file", app: "notes", content: "- Comprar pan\n- Revisar proyecto Quantix\n- Enviar report" },
                    "Buscaminas.html": { type: "file", app: "notes", content: "Tareas pendientes:\n1. Completar interfaz\n2. Revisar errores\n3. Enviar versión final" },
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
    lockScreen.style.opacity = "0";
    setTimeout(() => {
        lockScreen.style.display = "none";
        showToast("Santiago Sterling", "Bienvenido, Soy Santiago Sterling, y este es mi repositorio, el sitio donde dejo todo mi código de las aplicaciones que he creado.");
    }, 500);
});

/* ============================================================
   CONEXIÓN A GOOGLE
============================================================ */

function searchGoogle(){
  const q = document.getElementById("browserInput").value
  document.getElementById("browserFrame").src =
  "https://www.google.com/search?igu=1&q=" + encodeURIComponent(q)
}

function reloadFrame(){
  const frame = document.getElementById("browserFrame")
  frame.src = frame.src
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

    const vw = window.innerWidth, vh = window.innerHeight - 48;
    const w = app.width || 640, h = app.height || 480;
    const left = Math.max(0, Math.min(vw - w, 80 + Math.random() * 120));
    const top  = Math.max(0, Math.min(vh - h, 60 + Math.random() * 80));

    win.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;z-index:${++zCounter}`;

    win.innerHTML = `
        <div class="window-header">
          <div class="window-title-area">
            <img class="window-title-icon" src="${app.icon}" alt="">
            <span class="title-text">${app.title}</span>
          </div>
          <div class="window-buttons">
            <div class="win-btn min" title="Minimizar">
              <svg viewBox="0 0 10 1"><line x1="0" y1="0.5" x2="10" y2="0.5" stroke="currentColor" stroke-width="1"/></svg>
            </div>
            <div class="win-btn max" title="Maximizar">
              <svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" fill="none" stroke-width="1"/></svg>
            </div>
            <div class="win-btn close" title="Cerrar">
              <svg viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="1.2"/><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="1.2"/></svg>
            </div>
          </div>
        </div>
        <div class="window-content"><div class="app-area" style="width:100%;height:100%;"></div></div>
    `;

    document.getElementById("windowsContainer").appendChild(win);

    const area = win.querySelector(".app-area");

    if (appName === "explorer") {
        loadExplorer(win, fileSystem.root);
    } else if (appName === "aplicaciones") {
        loadStore(win);
    } else if (appName === "recycle-bin") {
        loadRecycleBin(win);
    } else if (app.type === "notes" || appName.startsWith("notes_")) {
        area.innerHTML = `
          <div class="notepad-container">
            <div class="notepad-menubar">
              <span class="notepad-menu-item">Archivo</span>
              <span class="notepad-menu-item">Editar</span>
              <span class="notepad-menu-item">Ver</span>
            </div>
            <textarea class="notepad-textarea" spellcheck="false">${extra || app.content || 'Escribe tus notas aquí...'}</textarea>
            <div class="notepad-statusbar">
              <span>Lín 1, Col 1</span>
              <span>UTF-8</span>
              <span>Windows (CRLF)</span>
            </div>
          </div>
        `;
    } else {
        area.innerHTML = app.content || "";
    }

    activeWindows[appName] = { win };
    addTaskButton(appName);
    makeDraggable(win);
    makeResizable(win);
    focusWindow(win);

    // Window button events
    win.querySelector(".win-btn.close").onclick = () => closeWindow(win);
    win.querySelector(".win-btn.min").onclick = () => minimizeWindow(win);
    win.querySelector(".win-btn.max").onclick = () => toggleMaximize(win);

    // Double-click header to maximize
    win.querySelector(".window-header").ondblclick = () => toggleMaximize(win);
}

function openTextFile(content) {
    const id = "notes_" + Date.now();
    apps[id] = { title: "Archivo de texto", icon: apps.notes.icon, width: 560, height: 400, type: "notes", content };
    openApp(id);
}

/* ============================================================
   TASKBAR BUTTONS
============================================================ */
function addTaskButton(appName) {
    const app = apps[appName];
    const btn = document.createElement("div");
    btn.className = "task-btn active";
    btn.dataset.app = appName;
    btn.setAttribute("data-tooltip", app.title);
    btn.innerHTML = `<img src="${app.icon}" alt="${app.title}">`;

    btn.onclick = () => {
        const w = activeWindows[appName]?.win;
        if (!w) return;
        if (w.style.display === "none") restoreWindow(w);
        else if (w === getFocusedWindow()) minimizeWindow(w);
        else focusWindow(w);
    };

    document.getElementById("taskButtons").appendChild(btn);
    activeWindows[appName].btn = btn;
}

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
   WINDOW MANAGEMENT
============================================================ */
function focusWindow(win) {
    document.querySelectorAll(".window").forEach(w => w.classList.remove("focused"));
    win.style.zIndex = ++zCounter;
    win.classList.add("focused");
    const app = win.dataset.app;
    if (activeWindows[app]?.btn) {
        document.querySelectorAll(".task-btn").forEach(b => b.classList.remove("active"));
        activeWindows[app].btn.classList.add("active");
    }
}

function closeWindow(win) {
    const app = win.dataset.app;
    win.style.animation = "none";
    win.style.transition = "opacity 0.15s, transform 0.15s";
    win.style.opacity = "0";
    win.style.transform = "scale(0.95)";
    setTimeout(() => {
        win.remove();
        if (activeWindows[app]?.btn) activeWindows[app].btn.remove();
        delete activeWindows[app];
    }, 150);
}

function minimizeWindow(win) {
    win.style.transition = "opacity 0.18s, transform 0.18s";
    win.style.opacity = "0";
    win.style.transform = "scale(0.9) translateY(16px)";
    setTimeout(() => {
        win.style.display = "none";
        win.style.opacity = "";
        win.style.transform = "";
        win.style.transition = "";
    }, 180);
    const app = win.dataset.app;
    if (activeWindows[app]?.btn) activeWindows[app].btn.classList.remove("active");
}

function restoreWindow(win) {
    win.style.display = "flex";
    win.style.opacity = "0";
    win.style.transform = "scale(0.94) translateY(8px)";
    requestAnimationFrame(() => {
        win.style.transition = "opacity 0.18s, transform 0.18s";
        win.style.opacity = "1";
        win.style.transform = "scale(1) translateY(0)";
        setTimeout(() => { win.style.transition = ""; }, 200);
    });
    focusWindow(win);
}

function toggleMaximize(win) {
    if (!win.classList.contains("maximized")) {
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevTop = win.style.top;
        win.dataset.prevW = win.style.width;
        win.dataset.prevH = win.style.height;
        win.style.transition = "left 0.2s,top 0.2s,width 0.2s,height 0.2s";
        win.style.left = "0"; win.style.top = "0";
        win.style.width = "100%"; win.style.height = `calc(100vh - 48px)`;
        win.classList.add("maximized");
        // Update max button icon
        win.querySelector(".win-btn.max").innerHTML = `<svg viewBox="0 0 10 10"><rect x="0" y="2" width="8" height="8" stroke="currentColor" fill="none" stroke-width="1"/><polyline points="2,2 2,0 10,0 10,8 8,8" stroke="currentColor" fill="none" stroke-width="1"/></svg>`;
    } else {
        win.style.transition = "left 0.2s,top 0.2s,width 0.2s,height 0.2s";
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.style.width = win.dataset.prevW;
        win.style.height = win.dataset.prevH;
        win.classList.remove("maximized");
        win.querySelector(".win-btn.max").innerHTML = `<svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" fill="none" stroke-width="1"/></svg>`;
        setTimeout(() => win.style.transition = "", 210);
    }
}

/* ============================================================
   DRAG WINDOWS
============================================================ */
function makeDraggable(win) {
    const header = win.querySelector(".window-header");
    header.addEventListener("mousedown", (e) => {
        if (e.target.closest(".window-buttons")) return;
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
        const newLeft = e.clientX - dragOffset.x;
        const newTop  = Math.max(0, e.clientY - dragOffset.y);
        draggingWindow.style.left = newLeft + "px";
        draggingWindow.style.top  = newTop + "px";
        handleSnapIndicator(e.clientX, e.clientY);
    }
    if (resizingWindow) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        if (resizingMode.includes("e")) resizingWindow.style.width  = Math.max(320, resizeStart.w + dx) + "px";
        if (resizingMode.includes("s")) resizingWindow.style.height = Math.max(200, resizeStart.h + dy) + "px";
        if (resizingMode.includes("w")) {
            const newW = Math.max(320, resizeStart.w - dx);
            resizingWindow.style.width = newW + "px";
            resizingWindow.style.left  = (resizeStart.left + resizeStart.w - newW) + "px";
        }
        if (resizingMode.includes("n")) {
            const newH = Math.max(200, resizeStart.h - dy);
            resizingWindow.style.height = newH + "px";
            resizingWindow.style.top    = (resizeStart.top + resizeStart.h - newH) + "px";
        }
    }
    if (draggingIcon) {
        const newX = e.pageX - draggingIconOffset.x;
        const newY = e.pageY - draggingIconOffset.y;
        if (Math.abs(newX - parseInt(draggingIcon.style.left)) > 4 || Math.abs(newY - parseInt(draggingIcon.style.top)) > 4) {
            iconDragMoved = true;
        }
        draggingIcon.style.left = newX + "px";
        draggingIcon.style.top  = Math.min(newY, window.innerHeight - 100) + "px";
    }
});

document.addEventListener("mouseup", () => {
    if (draggingWindow) {
        applySnap(draggingWindow);
        removeSnapIndicator();
        draggingWindow = null;
    }
    resizingWindow = null;
    if (draggingIcon) {
        draggingIcon.classList.remove("dragging");
        draggingIcon = null;
    }
});

/* ============================================================
   SNAP ASSIST
============================================================ */
let snapIndicatorEl = null;

function handleSnapIndicator(x, y) {
    const vw = window.innerWidth, vh = window.innerHeight - 48;
    if (x < 8) showSnapIndicator("left");
    else if (x > vw - 8) showSnapIndicator("right");
    else if (y < 4) showSnapIndicator("full");
    else removeSnapIndicator();
}

function showSnapIndicator(side) {
    if (!snapIndicatorEl) {
        snapIndicatorEl = document.createElement("div");
        snapIndicatorEl.className = "snap-highlight";
        document.body.appendChild(snapIndicatorEl);
    }
    snapIndicatorEl.className = "snap-highlight";
    if (side === "right") snapIndicatorEl.classList.add("right");
}

function removeSnapIndicator() {
    if (snapIndicatorEl) { snapIndicatorEl.remove(); snapIndicatorEl = null; }
}

function applySnap(win) {
    const x = parseInt(win.style.left), y = parseInt(win.style.top);
    const vw = window.innerWidth, vh = window.innerHeight - 48;
    if (x < 8) {
        win.style.left = "0"; win.style.top = "0"; win.style.width = "50%"; win.style.height = vh + "px";
    } else if (x + win.offsetWidth > vw - 8) {
        win.style.left = "50%"; win.style.top = "0"; win.style.width = "50%"; win.style.height = vh + "px";
    } else if (y < 4) {
        toggleMaximize(win);
    }
}

/* ============================================================
   RESIZE WINDOWS
============================================================ */
function makeResizable(win) {
    const EDGE = 6;
    win.addEventListener("mousemove", (e) => {
        if (win.classList.contains("maximized")) return;
        const r = win.getBoundingClientRect();
        let mode = "";
        if (e.clientX > r.right - EDGE) mode += "e";
        if (e.clientX < r.left  + EDGE) mode += "w";
        if (e.clientY > r.bottom - EDGE) mode += "s";
        if (e.clientY < r.top   + EDGE) mode += "n";
        win.dataset.resize = mode;
        const cursors = { e:"ew-resize", w:"ew-resize", s:"ns-resize", n:"ns-resize", es:"nwse-resize", wn:"nwse-resize", en:"nesw-resize", ws:"nesw-resize" };
        win.style.cursor = cursors[mode] || "default";
    });

    win.addEventListener("mousedown", (e) => {
        const mode = win.dataset.resize;
        if (!mode || e.target.closest(".window-header") || e.target.closest(".win-btn")) return;
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

    icon.addEventListener("click", (e) => {
        if (!iconDragMoved) openApp(icon.dataset.app);
    });
});

/* ============================================================
   CONTEXT MENU
============================================================ */
const ctxMenu = document.getElementById("contextMenu");

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextTarget = e.target.closest(".desktop-icon") || null;
    const menuW = 220, menuH = 200;
    const x = Math.min(e.pageX, window.innerWidth  - menuW - 8);
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

document.getElementById("ctxRefresh").onclick = () => {
    ctxMenu.classList.add("hidden");
    showToast("Escritorio", "Actualizando escritorio...");
};

document.getElementById("ctxRename").onclick = () => {
    if (!contextTarget) return;
    ctxMenu.classList.add("hidden");
    const span = contextTarget.querySelector("span");
    const old = span.textContent;
    const input = document.createElement("input");
    input.value = old;
    input.style.cssText = "background:rgba(0,0,0,0.7);color:white;border:1px solid #0078d4;border-radius:2px;font-size:12px;width:72px;text-align:center;outline:none;padding:1px 2px;";
    span.replaceWith(input);
    input.select();
    const done = () => {
        const newSpan = document.createElement("span");
        newSpan.textContent = input.value || old;
        input.replaceWith(newSpan);
    };
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
    showToast("Papelera", `"${apps[appName]?.title}" enviado a la papelera`);
};

document.getElementById("ctxWallpaper").onclick = () => {
    ctxMenu.classList.add("hidden");
    openPanel("wallpaperPanel");
};

/* ============================================================
   WINDOW FOCUS ON CLICK
============================================================ */
document.getElementById("windowsContainer").addEventListener("mousedown", (e) => {
    const win = e.target.closest(".window");
    if (win) focusWindow(win);
});

/* ============================================================
   START MENU
============================================================ */
const startBtn = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

startBtn.onclick = (e) => {
    e.stopPropagation();
    closeAllPanels();
    startMenu.classList.toggle("hidden");
    startBtn.classList.toggle("active", !startMenu.classList.contains("hidden"));
};

document.querySelectorAll(".start-app").forEach(app => {
    app.onclick = () => {
        openApp(app.dataset.app);
        startMenu.classList.add("hidden");
        startBtn.classList.remove("active");
    };
});

document.getElementById("openWallpaperPanel").onclick = () => {
    startMenu.classList.add("hidden");
    startBtn.classList.remove("active");
    openPanel("wallpaperPanel");
};

document.getElementById("openDesktopSwitcher").onclick = () => {
    startMenu.classList.add("hidden");
    startBtn.classList.remove("active");
    window.location.href = "index.html";
};

document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add("hidden");
        startBtn.classList.remove("active");
    }
});

/* ============================================================
   PANELS SYSTEM
============================================================ */
const panelIds = ["wifiPanel", "volumePanel", "calendarPanel", "wallpaperPanel", "startMenu"];

function closeAllPanels(except = null) {
    panelIds.forEach(id => {
        if (id !== except) document.getElementById(id)?.classList.add("hidden");
    });
    startBtn.classList.remove("active");
}

function openPanel(id) {
    closeAllPanels(id);
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden");
}

// Volume / Quick settings
document.getElementById("volumeIcon").onclick = (e) => {
    e.stopPropagation();
    closeAllPanels("volumePanel");
    document.getElementById("volumePanel").classList.toggle("hidden");
};

// WiFi icon inside tray group triggers wifi panel too
const wifiIconEl = document.getElementById("wifiIcon");
if (wifiIconEl) {
    wifiIconEl.onclick = (e) => {
        e.stopPropagation();
        closeAllPanels("wifiPanel");
        document.getElementById("wifiPanel").classList.toggle("hidden");
    };
}

// Clock / Calendar
document.getElementById("clockArea").onclick = (e) => {
    e.stopPropagation();
    closeAllPanels("calendarPanel");
    document.getElementById("calendarPanel").classList.toggle("hidden");
};

document.addEventListener("click", (e) => {
    const isPanel = e.target.closest(".sys-panel, #calendarPanel, #wallpaperPanel");
    if (!isPanel) {
        document.getElementById("wifiPanel")?.classList.add("hidden");
        document.getElementById("volumePanel")?.classList.add("hidden");
        document.getElementById("calendarPanel")?.classList.add("hidden");
    }
});

/* Volume slider */
const volSlider = document.getElementById("volSlider");
const volLabel  = document.getElementById("volLabel");
if (volSlider) {
    volSlider.oninput = () => { volLabel.textContent = volSlider.value; };
}
const briSlider = document.getElementById("briSlider");
const briLabel  = document.getElementById("briLabel");
if (briSlider) {
    briSlider.oninput = () => { briLabel.textContent = briSlider.value; };
}

/* ============================================================
   CLOCK & CALENDAR
============================================================ */
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById("clock-time");
    const dateEl = document.getElementById("clock-date");
    const fullEl = document.getElementById("clockFull");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    if (dateEl) dateEl.textContent = now.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    if (fullEl) fullEl.textContent = now.toLocaleString("es-CO", { weekday:"long", year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

let calCurrentDate = new Date();
let calSelectedDay = null;
const DAYS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

function renderCalendar() {
    const cal = document.getElementById("calendar");
    const monthYearEl = document.getElementById("monthYear");
    if (!cal) return;
    cal.innerHTML = "";
    const year = calCurrentDate.getFullYear(), month = calCurrentDate.getMonth();
    monthYearEl.textContent = calCurrentDate.toLocaleDateString("es-CO", { month:"long", year:"numeric" });
    DAYS.forEach(d => {
        const el = document.createElement("div");
        el.className = "calendar-header";
        el.textContent = d;
        cal.appendChild(el);
    });
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
        el.onclick = () => {
            document.querySelectorAll(".calendar-day").forEach(x => x.classList.remove("calendar-selected"));
            el.classList.add("calendar-selected");
            calSelectedDay = d;
        };
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
const wpPanel = document.getElementById("wallpaperPanel");

document.getElementById("closeWallpaperPanel").onclick = () => wpPanel.classList.add("hidden");

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
        const url = img.src;
        document.body.style.backgroundImage = `url('${url}')`;
        document.getElementById("lockScreen").style.backgroundImage = `url('${url}')`;
        document.querySelectorAll("#wallpaperList img").forEach(i => i.classList.remove("active"));
        img.classList.add("active");
    };
});

/* ============================================================
   EXPLORER
============================================================ */
function loadExplorer(win, folder) {
    const area = win.querySelector(".app-area");
    area.style.padding = "0";

    area.innerHTML = `
        <div class="explorer-container">
          <div class="explorer-sidebar">
            <div class="explorer-sidebar-header">Acceso rápido</div>
            <div class="explorer-sidebar-item active" id="expHome">
              <i class="fi fi-sr-devices"></i> Este equipo
            </div>
            <div class="explorer-sidebar-item" id="expDocs">
              <i class="fi fi-sr-document-folder-gear"></i> Documentos
            </div>
            <div class="explorer-sidebar-item" id="expMusica">
              <i class="fi fi-sr-folder-music"></i> Música
            </div>
            <div class="explorer-sidebar-header" style="margin-top:10px;">Este equipo</div>
            <div class="explorer-sidebar-item">
              <span style="font-size:16px;"><i class="fi fi-sr-disc-drive"></i></span> Disco (C:)
            </div>
            <div class="explorer-sidebar-item">
              <span style="font-size:16px;"><i class="fi fi-sr-disc-drive"></i></span> Disco (D:)
            </div>
          </div>
          <div class="explorer-right">
            <div class="explorer-toolbar">
              <div class="explorer-tool-btn" id="expBtnNew">
                <i class="fi fi-sr-add-document"></i> Nuevo
              </div>
              <div class="explorer-tool-sep"></div>
              <div class="explorer-tool-btn"><i class="fi fi-sr-scissors"></i> Cortar</div>
              <div class="explorer-tool-btn"><i class="fi fi-sr-copy-alt"></i> Copiar</div>
              <div class="explorer-tool-btn"><i class="fi fi-sr-paste"></i> Pegar</div>
              <div class="explorer-tool-sep"></div>
              <div class="explorer-tool-btn"><i class="fi fi-sr-trash-xmark"></i> Eliminar</div>
              <div class="explorer-tool-btn"><i class="fi fi-sr-text-box-edit"></i> Renombrar</div>
            </div>
            <div class="explorer-address">
              <div class="explorer-nav-btn">&#8592;</div>
              <div class="explorer-nav-btn">&#8594;</div>
              <div class="explorer-nav-btn" style="font-size:12px;">&#8593;</div>
              <div class="explorer-address-bar" id="addressBar">Este equipo</div>
            </div>
            <div class="explorer-main" id="explorerMain"></div>
            <div class="explorer-status" id="explorerStatus">0 elementos</div>
          </div>
        </div>
    `;

    area.querySelector("#expHome").onclick = () => loadFolder(area.querySelector("#explorerMain"), fileSystem.root, "Este equipo", area);
    area.querySelector("#expDocs").onclick = () => loadFolder(area.querySelector("#explorerMain"), fileSystem.root.contents["Documentos"], "Documentos", area);
    area.querySelector("#expMusica").onclick = () => loadFolder(area.querySelector("#explorerMain"), fileSystem.root.contents["Música"], "Música", area);

    loadFolder(area.querySelector("#explorerMain"), folder, "Este equipo", area);
}

function loadFolder(main, folder, name, area) {
    main.innerHTML = "";
    if (area) {
        const ab = area.querySelector("#addressBar");
        if (ab) ab.textContent = name || "Este equipo";
        // highlight sidebar
        area.querySelectorAll(".explorer-sidebar-item").forEach(i => i.classList.remove("active"));
    }
    if (!folder || !folder.contents) return;

    const items = Object.entries(folder.contents);
    items.forEach(([itemName, item]) => {
        const el = document.createElement("div");
        el.className = item.type === "folder" ? "folder-item" : "file-item";
        const icon = item.type === "folder"
            ? "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-En0WuV9h3Cjev3oISjtJqXetnfA18d.png&w=1000&q=75"
            : "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-a3SkroygtTE6lQGs0XbfDco9M3lV7H.png&w=1000&q=75";
        el.innerHTML = `<img src="${icon}" alt="${itemName}"><span>${itemName}</span>`;
        if (item.type === "folder") {
            el.ondblclick = () => loadFolder(main, item, itemName, area);
        } else {
            el.ondblclick = () => openTextFile(item.content || "");
        }
        main.appendChild(el);
    });

    if (area) {
        const status = area.querySelector("#explorerStatus");
        if (status) status.textContent = `${items.length} elementos`;
    }
}

/* ============================================================
   RECYCLE BIN
============================================================ */
function loadRecycleBin(win) {
    const area = win.querySelector(".app-area");
    if (recycleBin.length === 0) {
        area.innerHTML = `<div class="recycle-empty"><div style="font-size:64px;opacity:0.25;">🗑️</div><p>La Papelera de reciclaje está vacía</p></div>`;
        return;
    }
    area.style.padding = "16px";
    area.style.display = "flex";
    area.style.flexWrap = "wrap";
    area.style.gap = "8px";
    recycleBin.forEach(appName => {
        const app = apps[appName];
        if (!app) return;
        const el = document.createElement("div");
        el.className = "folder-item";
        el.innerHTML = `<img src="${app.icon}" alt="${app.title}"><span>${app.title}</span>`;
        el.ondblclick = () => {
            recycleBin = recycleBin.filter(x => x !== appName);
            location.reload();
        };
        area.appendChild(el);
    });
}

/* ============================================================
   STORE
============================================================ */
function loadStore(win) {
    const area = win.querySelector(".app-area");
    area.style.padding = "0";
    area.style.overflow = "hidden";

    const storeApps = [
        { id:"player",       name:"Sterling Music Player",    desc:"Reproduce tu música con ecualizador y visualizador de ondas.",         cat:"entertainment", catLabel:"Entretenimiento", rating:4.8, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-j9GfZpCuZEAQwYOTxDIVxReq5y0OHg.png&w=500&q=75",   featured:true },
        { id:"mix",          name:"Sterling Music Studio",    desc:"Crea y mezcla tus propias pistas en esta estación de trabajo audio.",   cat:"creative",      catLabel:"Creativas",      rating:4.7, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-B2EekBDz0A46XdvgtBjgEAw79EH0Dk.png&w=500&q=75" },
        { id:"paint",        name:"Sterl-ink Sketching",      desc:"Herramienta de dibujo con capas, pinceles y exportación SVG.",          cat:"creative",      catLabel:"Creativas",      rating:4.6, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DPM2VMQ9vdZ4HcXLRwCFZ7FK5Fn7Bx.png&w=1000&q=75" },
        { id:"excel",        name:"Sterling Math FX",         desc:"Calculadora científica con gráficas 2D/3D y hojas de cálculo.",         cat:"productivity",  catLabel:"Productividad",  rating:4.9, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-DHtLao0TXcz7zsJ6bxv2DltThCLwQ8.png&w=1000&q=75" },
        { id:"word",         name:"Sterling Letter",          desc:"Procesador de texto con plantillas y exportación PDF.",                  cat:"productivity",  catLabel:"Productividad",  rating:4.7, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-BjimxRD0gb4rZBjr9jbO9LYXmOZJao.png&w=1000&q=75" },
        { id:"powerpoint",   name:"Sterling Presentation",    desc:"Presentaciones con animaciones y temas profesionales.",                 cat:"productivity",  catLabel:"Productividad",  rating:4.5, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-L8T5N6DbL9jezTcIoss4pIKNG256jy.png&w=1000&q=75" },
        { id:"notes",        name:"Bloc de Notas",            desc:"Editor de texto ligero con resaltado de sintaxis y modo enfoque.",       cat:"productivity",  catLabel:"Productividad",  rating:4.4, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-zGyBqZLV8MGRs1NxccwHoHjQc5XtsK.png&w=1000&q=75" },
        { id:"airspace",     name:"Captain Sterling",         desc:"Simulación aérea con física realista y niveles progresivos.",            cat:"entertainment", catLabel:"Entretenimiento", rating:4.6, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-yjBpDcYD9IjVGoIg4LnKkMKL1RBris.png&w=500&q=75" },
        { id:"buscaminas",   name:"Sterling World",           desc:"Aventura de plataformas inspirada en los clásicos del género.",          cat:"entertainment", catLabel:"Entretenimiento", rating:4.8, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-e3kGOJ1Nx9Q68omg5PbnlZh8hFAJkX.png&w=500&q=75" },
        { id:"browser",      name:"Navegador",                desc:"Navega la web con buscador integrado y modo privado.",                   cat:"web",           catLabel:"Web",             rating:4.5, icon:"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-Ed2YpW2egEie9u5OJL1FT5V4ERUOL5.png&w=1000&q=75" }
    ];

    const CATS = [
        { key:"productivity",  label:"Productividad" },
        { key:"creative",      label:"Creativas" },
        { key:"entertainment", label:"Entretenimiento" },
        { key:"web",           label:"Web" }
    ];

    let currentTab = "all";
    let currentSearch = "";

    // ---- inject styles once ----
    if (!document.getElementById("store-styles")) {
        const s = document.createElement("style");
        s.id = "store-styles";
        s.textContent = `
        .store-root{display:flex;flex-direction:column;height:100%;background:rgba(18,18,18,0.97);color:#fff;overflow:hidden;}
        .store-topbar{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;}
        .store-topbar h1{font-size:14px;font-weight:100;flex:1;letter-spacing:.3px;}
        .store-topbar h1 span{color:#60cdff;}
        .store-searchbox{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:5px 10px;width:200px;}
        .store-searchbox input{background:none;border:none;outline:none;color:#fff;font-size:12px;width:100%;}
        .store-searchbox input::placeholder{color:rgba(255,255,255,0.35);}
        .store-tabs{display:flex;gap:2px;padding:8px 16px 0;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;overflow-x:auto;}
        .store-tabs::-webkit-scrollbar{height:0;}
        .s-tab{padding:6px 14px;border-radius:6px 6px 0 0;font-size:12px;cursor:pointer;color:rgba(255,255,255,.5);transition:all .15s;white-space:nowrap;border-bottom:2px solid transparent;}
        .s-tab:hover{color:#fff;background:rgba(255,255,255,.05);}
        .s-tab.active{color:#fff;border-bottom-color:#0078d4;background:rgba(0,120,212,.1);}
        .store-body{flex:1;overflow-y:auto;padding:16px;}
        .store-body::-webkit-scrollbar{width:5px;}
        .store-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px;}
        .store-featured{border-radius:20px;background:linear-gradient(135deg,rgba(233, 1, 40, 0.65) 0%,rgba(0,30,70,.9) 100%);border:1px solid rgba(255,255,255,.1);padding:20px 22px;display:flex;align-items:center;gap:18px;margin-bottom:20px;}
        .store-feat-img{width:62px;height:62px;border-radius:12px;object-fit:contain;background:rgba(255,255,255,.08);padding:4px;flex-shrink:0;}
        .store-feat-text{flex:1;}
        .store-feat-badge{font-size:10px;background:rgba(96,205,255,.15);color:#60cdff;border:1px solid rgba(96,205,255,.3);padding:2px 8px;border-radius:10px;margin-bottom:6px;display:inline-block;}
        .store-feat-text h2{font-size:17px;font-weight:100;margin-bottom:4px;}
        .store-feat-text p{font-size:12px;color:rgba(255,255,255,.6);line-height:1.5;}
        .store-get-btn{padding:8px 20px;background:#0078d4;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:100;cursor:pointer;transition:background .15s;flex-shrink:0;}
        .store-get-btn:hover{background:#006cc1;}
        .store-get-btn.open-state{background:rgba(255,255,255,.1);color:rgba(255,255,255,.65);cursor:default;}
        .store-section-lbl{font-size:12px;font-weight:100;color:rgba(255,255,255,.6);margin:0 0 10px;letter-spacing:.4px;text-transform:uppercase;}
        .store-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-bottom:22px;}
        .s-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;cursor:pointer;transition:background .15s,border-color .15s,transform .15s;display:flex;flex-direction:column;gap:7px;}
        .s-card:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.18);transform:translateY(-2px);}
        .s-card-icon{width:46px;height:46px;object-fit:contain;border-radius:10px;background:rgba(255,255,255,.06);padding:4px;}
        .s-card-name{font-size:12px;font-weight:100;line-height:1.3;}
        .s-card-cat{font-size:10px;color:rgba(255,255,255,.4);}
        .s-card-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:auto;}
        .s-card-stars{font-size:10px;color:#fbbf24;}
        .s-card-rating{font-size:10px;color:rgba(255,255,255,.4);margin-left:2px;}
        .s-card-btn{font-size:11px;background:#0078d4;color:#fff;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;font-weight:100;transition:background .12s;}
        .s-card-btn:hover{background:#006cc1;}
        .s-card-btn.open-state{background:rgba(255,255,255,.1);color:rgba(255,255,255,.6);}
        .store-list{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;}
        .s-list-item{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:background .12s;}
        .s-list-item:hover{background:rgba(255,255,255,.08);}
        .s-list-icon{width:36px;height:36px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,.06);padding:3px;flex-shrink:0;}
        .s-list-info{flex:1;}
        .s-list-name{font-size:13px;font-weight:100;}
        .s-list-desc{font-size:11px;color:rgba(255,255,255,.45);margin-top:1px;}
        .s-list-btn{font-size:11px;background:#0078d4;color:#fff;border:none;border-radius:5px;padding:5px 14px;cursor:pointer;font-weight:100;flex-shrink:0;transition:background .12s;}
        .s-list-btn:hover{background:#006cc1;}
        .s-list-btn.open-state{background:rgba(255,255,255,.1);color:rgba(255,255,255,.65);}
        .store-empty{color:rgba(255,255,255,.35);font-size:13px;padding:30px 0;text-align:center;}
        `;
        document.head.appendChild(s);
    }

    // ---- build skeleton ----
    area.innerHTML = `
        <div class="store-root">
          <div class="store-topbar">
            <h1>Sterling <span>Store</span></h1>
            <div class="store-searchbox">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Explorar aplicaciones..." id="storeSearchInput_${win.dataset.app}">
            </div>
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
    const searchEl = area.querySelector(`#storeSearchInput_${win.dataset.app}`);

    function stars(r) {
        const full = Math.floor(r), half = r - full >= 0.5 ? 1 : 0;
        return "★".repeat(full) + (half ? "½" : "");
    }

    function isOpen(id) { return !!activeWindows[id]; }

    function render() {
        const q = currentSearch.toLowerCase();
        const list = storeApps.filter(a => {
            const matchCat = currentTab === "all" || a.cat === currentTab;
            const matchQ   = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
            return matchCat && matchQ;
        });

        bodyEl.innerHTML = "";

        // --- search mode: list view ---
        if (q) {
            const lbl = document.createElement("div");
            lbl.className = "store-section-lbl";
            lbl.textContent = list.length
                ? `Resultados para "${currentSearch}"`
                : "";
            bodyEl.appendChild(lbl);

            if (!list.length) {
                const empty = document.createElement("div");
                empty.className = "store-empty";
                empty.textContent = "No se encontraron aplicaciones.";
                bodyEl.appendChild(empty);
                return;
            }

            const listWrap = document.createElement("div");
            listWrap.className = "store-list";
            list.forEach(app => {
                const open = isOpen(app.id);
                const item = document.createElement("div");
                item.className = "s-list-item";
                item.innerHTML = `
                    <img class="s-list-icon" src="${app.icon}" alt="${app.name}">
                    <div class="s-list-info">
                      <div class="s-list-name">${app.name}</div>
                      <div class="s-list-desc">${app.desc}</div>
                    </div>
                    <button class="s-list-btn${open ? " open-state" : ""}">${open ? "Abrir" : "Obtener"}</button>
                `;
                item.querySelector(".s-list-btn").onclick = (e) => { e.stopPropagation(); openApp(app.id); };
                item.onclick = () => openApp(app.id);
                listWrap.appendChild(item);
            });
            bodyEl.appendChild(listWrap);
            return;
        }

        // --- featured banner (only on "all" tab) ---
        const feat = storeApps.find(a => a.featured);
        if (currentTab === "all" && feat) {
            const open = isOpen(feat.id);
            const banner = document.createElement("div");
            banner.className = "store-featured";
            banner.innerHTML = `
                <img class="store-feat-img" src="${feat.icon}" alt="${feat.name}">
                <div class="store-feat-text">
                  <div class="store-feat-badge">⭐ Destacado</div>
                  <h2>${feat.name}</h2>
                  <p>${feat.desc}</p>
                </div>
                <button class="store-get-btn${open ? " open-state" : ""}">${open ? "Abierto" : "Obtener"}</button>
            `;
            banner.querySelector(".store-get-btn").onclick = () => openApp(feat.id);
            bodyEl.appendChild(banner);
        }

        // --- grid sections ---
        const sections = currentTab === "all" ? CATS : [CATS.find(c => c.key === currentTab)].filter(Boolean);
        sections.forEach(({ key, label }) => {
            const group = list.filter(a => a.cat === key);
            if (!group.length) return;

            const lbl = document.createElement("div");
            lbl.className = "store-section-lbl";
            lbl.textContent = label;
            bodyEl.appendChild(lbl);

            const grid = document.createElement("div");
            grid.className = "store-grid";
            group.forEach(app => {
                const open = isOpen(app.id);
                const card = document.createElement("div");
                card.className = "s-card";
                card.innerHTML = `
                    <img class="s-card-icon" src="${app.icon}" alt="${app.name}">
                    <div class="s-card-name">${app.name}</div>
                    <div class="s-card-cat">${app.catLabel}</div>
                    <div class="s-card-bottom">
                      <div><span class="s-card-stars">${stars(app.rating)}</span><span class="s-card-rating">${app.rating}</span></div>
                      <button class="s-card-btn${open ? " open-state" : ""}">${open ? "Abrir" : "Obtener"}</button>
                    </div>
                `;
                card.querySelector(".s-card-btn").onclick = (e) => { e.stopPropagation(); openApp(app.id); };
                card.onclick = () => openApp(app.id);
                grid.appendChild(card);
            });
            bodyEl.appendChild(grid);
        });
    }

    // tab clicks
    tabsEl.querySelectorAll(".s-tab").forEach(tab => {
        tab.onclick = () => {
            tabsEl.querySelectorAll(".s-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.dataset.tab;
            currentSearch = "";
            searchEl.value = "";
            render();
        };
    });

    // search
    searchEl.oninput = () => { currentSearch = searchEl.value; render(); };

    render();
}

/* ============================================================
   TOAST NOTIFICATIONS
============================================================ */
function showToast(title, body, icon = "💻") {
    const existing = document.querySelector(".win-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "win-toast";
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-body">${body}</div>
        </div>
        <div class="toast-close" onclick="this.closest('.win-toast').remove()">✕</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.transition = "opacity 0.3s, transform 0.3s";
            toast.style.opacity = "0";
            toast.style.transform = "translateX(20px)";
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

/* ============================================================
   INITIAL ICON POSITIONS
============================================================ */
window.addEventListener("load", () => {
    const positions = {
        explorer:     { left: 24, top: 20  },
        browser:      { left: 24, top: 108 },
        aplicaciones:        { left: 24, top: 206 },
        "recycle-bin":{ left: 24, top: 300 }
    };
    document.querySelectorAll(".desktop-icon").forEach(icon => {
        const p = positions[icon.dataset.app];
        if (p) { icon.style.left = p.left + "px"; icon.style.top = p.top + "px"; }
    });

    // Mark first wallpaper as active
    const firstWp = document.querySelector("#wallpaperList img");
    if (firstWp) firstWp.classList.add("active");
});

/* Search button */
document.getElementById("searchBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllPanels("startMenu");
    startMenu.classList.remove("hidden");
    startBtn.classList.add("active");
});
