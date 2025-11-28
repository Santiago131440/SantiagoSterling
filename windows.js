/* ============================================================
   WINDOWS 11 SIMULATION ULTRA - SISTEMA COMPLETO JS
============================================================ */

/* ============================================================
   VARIABLES GLOBALES
============================================================ */

let activeWindows = {};
let zCounter = 50;

let draggingWindow = null;
let dragOffset = { x: 0, y: 0 };

let resizingWindow = null;
let resizingMode = "";
let resizeStart = { x: 0, y: 0, w: 0, h: 0 };

let draggingIcon = null;
let draggingIconOffset = { x: 0, y: 0 };

let contextTarget = null;

let recycleBin = []; // Archivos eliminados


/* ============================================================
   DEFINICIÓN DE APPS
============================================================ */

const apps = {
    explorer: {
        title: "Explorador de Archivos",
        icon: "https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/folder-icon.png",
        type: "system"
    },

    browser: {
        title: "Navegador",
        icon: "https://icons.iconarchive.com/icons/papirus-team/papirus-apps/512/internet-web-browser-icon.png",
        content: `
            <h2>Navegador Simulado</h2>
            <p>Esto es un navegador básico solo para demostración.</p>
            <input type="text" placeholder="Escribe una URL... (no funciona)">
        `
    },

    notes: {
        title: "Bloc de Notas",
        icon: "https://icons.iconarchive.com/icons/papirus-team/papirus-mimetypes/512/text-x-generic-icon.png",
        content: `
            <textarea style="width:100%; height:100%; background:rgba(255,255,255,0.1); border:0; color:white; padding:10px;">
Escribe tus notas aquí...
            </textarea>
        `
    },

    player: {
        title: "Sterling Music Player",
        icon: "https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/512/Music-icon.png",
        content: `
            <h3>Audio</h3>
            <audio controls style="width:100%;">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">
            </audio>

            <h3 style="margin-top:20px;">Video</h3>
            <video controls width="100%">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4">
            </video>
        `
    },

    "recycle-bin": {
        title: "Papelera",
        icon: "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/recycle-bin-icon.png"
    }
};


/* ============================================================
   SISTEMA DE ARCHIVOS SIMULADO
============================================================ */

const fileSystem = {
    root: {
        type: "folder",
        name: "Este equipo",
        contents: {
            Documentos: {
                type: "folder",
                contents: {
                    "informe.txt": { type: "file", app: "notes" },
                    "lista.md": { type: "file", app: "notes" }
                }
            },

            Música: {
                type: "folder",
                contents: {
                    "cancion.mp3": { type: "file", app: "player" }
                }
            },

            Videos: {
                type: "folder",
                contents: {
                    "demo.mp4": { type: "file", app: "player" }
                }
            }
        }
    }
};


/* ============================================================
   CREAR VENTANAS
============================================================ */

function openApp(appName, extra = null) {

    // Si ya existe, solo traer al frente
    if (activeWindows[appName]) {
        focusWindow(activeWindows[appName].win);
        return;
    }

    const app = apps[appName];

    const win = document.createElement("div");
    win.className = "window";
    win.dataset.app = appName;

    win.style.left = "120px";
    win.style.top = "120px";
    win.style.width = "520px";
    win.style.height = "380px";
    win.style.zIndex = ++zCounter;

    win.innerHTML = `
        <div class="window-header">
            <span>${app.title}</span>
            <div class="window-buttons">
                <div class="win-btn min">–</div>
                <div class="win-btn max">□</div>
                <div class="win-btn close">✕</div>
            </div>
        </div>
        <div class="window-content"><div class="app-area"></div></div>
    `;

    document.getElementById("windowsContainer").appendChild(win);

    const area = win.querySelector(".app-area");

    if (appName === "explorer") {
        loadExplorer(win, fileSystem.root);
    }
    else if (appName === "recycle-bin") {
        loadRecycleBin(win);
    }
    else {
        area.innerHTML = app.content;
    }

    activeWindows[appName] = { win };

    addTaskButton(appName);
    makeDraggable(win);
    makeResizable(win);
}


/* ============================================================
   BARRA DE TAREAS
============================================================ */

function addTaskButton(appName) {
    const app = apps[appName];
    const btn = document.createElement("div");
    btn.className = "task-btn active";
    btn.dataset.app = appName;

    btn.innerHTML = `
        <img src="${app.icon}">
        <span>${app.title}</span>
    `;

    btn.onclick = () => {
        const win = activeWindows[appName].win;

        if (win.style.display === "none") restoreWindow(win);
        else minimizeWindow(win);
    };

    document.getElementById("taskButtons").appendChild(btn);

    activeWindows[appName].btn = btn;
}


/* ============================================================
   MANEJO DE VENTANAS
============================================================ */

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("win-btn")) return;

    const win = e.target.closest(".window");

    if (e.target.classList.contains("close")) closeWindow(win);
    if (e.target.classList.contains("min")) minimizeWindow(win);
    if (e.target.classList.contains("max")) toggleMaximize(win);
});


function closeWindow(win) {
    const app = win.dataset.app;

    win.remove();
    if (activeWindows[app]?.btn) activeWindows[app].btn.remove();

    delete activeWindows[app];
}

function minimizeWindow(win) {
    win.style.display = "none";
    activeWindows[win.dataset.app].btn.classList.remove("active");
}

function restoreWindow(win) {
    win.style.display = "flex";
    win.style.zIndex = ++zCounter;
    activeWindows[win.dataset.app].btn.classList.add("active");
}

function toggleMaximize(win) {
    if (!win.classList.contains("maximized")) {
        win.dataset.oldLeft = win.style.left;
        win.dataset.oldTop = win.style.top;
        win.dataset.oldWidth = win.style.width;
        win.dataset.oldHeight = win.style.height;

        win.style.left = "0px";
        win.style.top = "0px";
        win.style.width = "100%";
        win.style.height = "calc(100% - 48px)";
        win.classList.add("maximized");
    } else {
        win.style.left = win.dataset.oldLeft;
        win.style.top = win.dataset.oldTop;
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
        win.classList.remove("maximized");
    }
}


/* ============================================================
   DRAG WINDOWS
============================================================ */

function makeDraggable(win) {
    const header = win.querySelector(".window-header");

    header.addEventListener("mousedown", (e) => {
        if (win.classList.contains("maximized")) return;

        draggingWindow = win;
        dragOffset.x = e.clientX - win.offsetLeft;
        dragOffset.y = e.clientY - win.offsetTop;

        win.style.zIndex = ++zCounter;
    });
}

document.addEventListener("mousemove", (e) => {
    if (!draggingWindow) return;

    draggingWindow.style.left = (e.clientX - dragOffset.x) + "px";
    draggingWindow.style.top = (e.clientY - dragOffset.y) + "px";

    handleSnapAssistIndicator(e.clientX);
});

document.addEventListener("mouseup", () => {
    if (draggingWindow) applySnapAssist(draggingWindow);
    draggingWindow = null;
    removeSnapIndicator();
});


/* ============================================================
   SNAP ASSIST
============================================================ */

let snapIndicator = null;

function handleSnapAssistIndicator(x) {
    const w = window.innerWidth;

    if (x < 50) {
        showSnapIndicator("left");
    } else if (x > w - 50) {
        showSnapIndicator("right");
    } else {
        removeSnapIndicator();
    }
}

function showSnapIndicator(side) {
    removeSnapIndicator();

    snapIndicator = document.createElement("div");
    snapIndicator.className = "snap-highlight";
    if (side === "right") snapIndicator.classList.add("right");

    document.body.appendChild(snapIndicator);
}

function removeSnapIndicator() {
    if (snapIndicator) snapIndicator.remove();
    snapIndicator = null;
}

function applySnapAssist(win) {
    const x = parseInt(win.style.left);

    if (x < 50) {
        // Snap left
        win.style.left = "0px";
        win.style.top = "0px";
        win.style.width = "50%";
        win.style.height = "calc(100% - 48px)";
    } else if (x > window.innerWidth - 200) {
        // Snap right
        win.style.left = "50%";
        win.style.top = "0px";
        win.style.width = "50%";
        win.style.height = "calc(100% - 48px)";
    }

    removeSnapIndicator();
}


/* ============================================================
   RESIZE WINDOWS
============================================================ */

function makeResizable(win) {
    win.addEventListener("mousemove", (e) => {
        const rect = win.getBoundingClientRect();
        const edge = 6;

        let mode = "";

        if (e.clientX > rect.right - edge) mode = "right";
        if (e.clientY > rect.bottom - edge) mode = mode ? "corner" : "bottom";

        win.dataset.resize = mode;
        win.style.cursor = {
            right: "ew-resize",
            bottom: "ns-resize",
            corner: "nwse-resize"
        }[mode] || "default";
    });

    win.addEventListener("mousedown", (e) => {
        if (!win.dataset.resize) return;

        resizingWindow = win;
        resizingMode = win.dataset.resize;

        resizeStart.x = e.clientX;
        resizeStart.y = e.clientY;
        resizeStart.w = win.offsetWidth;
        resizeStart.h = win.offsetHeight;

        e.preventDefault();
    });
}

document.addEventListener("mousemove", (e) => {
    if (!resizingWindow) return;

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;

    if (resizingMode === "right" || resizingMode === "corner")
        resizingWindow.style.width = (resizeStart.w + dx) + "px";

    if (resizingMode === "bottom" || resizingMode === "corner")
        resizingWindow.style.height = (resizeStart.h + dy) + "px";
});

document.addEventListener("mouseup", () => resizingWindow = null);


/* ============================================================
   DESKTOP ICON DRAGGING
============================================================ */

document.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.onmousedown = (e) => {
        draggingIcon = icon;
        draggingIconOffset.x = e.offsetX;
        draggingIconOffset.y = e.offsetY;
    };

    icon.onclick = () => {
        if (!draggingIcon) openApp(icon.dataset.app);
    };
});

document.addEventListener("mousemove", (e) => {
    if (!draggingIcon) return;

    draggingIcon.style.left = (e.pageX - draggingIconOffset.x) + "px";
    draggingIcon.style.top = (e.pageY - draggingIconOffset.y) + "px";
});

document.addEventListener("mouseup", () => draggingIcon = null);


/* ============================================================
   CONTEXT MENU (ICONOS + ESCRITORIO)
============================================================ */

const ctxMenu = document.getElementById("contextMenu");

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    contextTarget = e.target.closest(".desktop-icon") || null;

    ctxMenu.style.left = e.pageX + "px";
    ctxMenu.style.top = e.pageY + "px";
    ctxMenu.classList.remove("hidden");
});

document.addEventListener("click", () => {
    ctxMenu.classList.add("hidden");
});


document.getElementById("ctxOpen").onclick = () => {
    if (contextTarget) openApp(contextTarget.dataset.app);
};

document.getElementById("ctxDelete").onclick = () => {
    if (!contextTarget) return;

    recycleBin.push(contextTarget.dataset.app);
    contextTarget.remove();
};


/* ============================================================
   PAPELERA
============================================================ */

function loadRecycleBin(win) {
    const area = win.querySelector(".app-area");

    area.innerHTML = "<h3>Papelera</h3>";

    if (recycleBin.length === 0) {
        area.innerHTML += "<p>La papelera está vacía.</p>";
        return;
    }

    recycleBin.forEach(item => {
        area.innerHTML += `
            <div class="file-item" onclick="restoreFromRecycle('${item}')">
                <img src="${apps[item].icon}">
                <span>${apps[item].title}</span>
            </div>
        `;
    });
}

function restoreFromRecycle(appName) {
    recycleBin = recycleBin.filter(x => x !== appName);
    location.reload();
}


/* ============================================================
   EXPLORADOR DE ARCHIVOS
============================================================ */

function loadExplorer(win, folder) {
    const area = win.querySelector(".app-area");

    area.innerHTML = `
        <div class="explorer-container">
            <div class="explorer-sidebar"></div>
            <div class="explorer-main"></div>
        </div>
    `;

    const sidebar = area.querySelector(".explorer-sidebar");
    const main = area.querySelector(".explorer-main");

    sidebar.innerHTML = `<div data-path="root">Este equipo</div>`;

    sidebar.querySelector("div").onclick = () => loadFolder(main, fileSystem.root);

    loadFolder(main, folder);
}

function loadFolder(main, folder) {
    main.innerHTML = "";

    for (let name in folder.contents) {
        const item = folder.contents[name];

        if (item.type === "folder") {
            main.innerHTML += `
                <div class="folder-item" onclick="loadFolder(this.parentNode, fileSystem.root.contents['${name}'])">
                    <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/folder-icon.png">
                    <span>${name}</span>
                </div>`;
        } else if (item.type === "file") {
            main.innerHTML += `
                <div class="file-item" onclick="openApp('${item.app}')">
                    <img src="https://icons.iconarchive.com/icons/custom-icon-design/flatastic-2/512/file-icon.png">
                    <span>${name}</span>
                </div>`
        }
    }
}


/* ============================================================
   PANEL DE SISTEMA (Volumen, WiFi, Reloj)
============================================================ */

document.getElementById("volumeIcon").onclick = () =>
    togglePanel("volumePanel");

document.getElementById("wifiIcon").onclick = () =>
    togglePanel("wifiPanel");

document.getElementById("clock").onclick = () =>
    togglePanel("clockPanel");

function togglePanel(id) {
    const panel = document.getElementById(id);
    panel.classList.toggle("hidden");
}

/* Reloj */
setInterval(() => {
    const t = new Date();
    document.getElementById("clock").textContent =
        t.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

    document.getElementById("clockFull").textContent =
        t.toLocaleString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
}, 1000);


/* ============================================================
   MENÚ INICIO
============================================================ */

document.getElementById("startButton").onclick = () => {
    document.getElementById("startMenu").classList.toggle("hidden");
};

document.querySelectorAll(".start-app").forEach(app => {
    app.onclick = () => {
        openApp(app.dataset.app);
        document.getElementById("startMenu").classList.add("hidden");
    };
});


/* ============================================================
   WALLPAPER
============================================================ */

const wpPanel = document.getElementById("wallpaperPanel");

document.getElementById("openWallpaperPanel").onclick = () =>
    wpPanel.classList.remove("hidden");

document.getElementById("closeWallpaperPanel").onclick = () =>
    wpPanel.classList.add("hidden");

document.getElementById("wallpaperInput").onchange = function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        document.body.style.backgroundImage = `url('${reader.result}')`;
    };

    reader.readAsDataURL(file);
};

document.querySelectorAll("#wallpaperList img").forEach(img => {
    img.onclick = () =>
        document.body.style.backgroundImage = `url('${img.src}')`;
});


/* ============================================================
   MULTI ESCRITORIO (BÁSICO)
============================================================ */

function switchDesktop(n) {
    document.querySelectorAll(".desktop").forEach(d =>
        d.classList.remove("active")
    );

    document.getElementById("desktop" + n).classList.add("active");
}


/* ============================================================
   FIN DEL SISTEMA
============================================================ */

console.log("Windows 11 Simulation Ultra - Sistema listo.");

