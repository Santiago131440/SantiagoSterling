/* ── Override closeWindow with animated version ── */
const _origCloseWindow = window.closeWindow;
window.closeWindow = function(win) {
  if (win._closing) return;
  win._closing = true;
  const app = win.dataset.app;
  win.classList.add("closing");
  // Shake the traffic light briefly before closing
  setTimeout(() => {
    win.remove();
    delete activeWindows[app];
    updateDockItem(app, false);
    removeDockMinimized(app);
    checkDockVisibility();
  }, 260);
};

/* ── Override minimizeWindow with genie + thumbnail ── */
const _origMinimize = window.minimizeWindow;
window.minimizeWindow = function(win) {
  if (win._minimizing) return;
  win._minimizing = true;
  const app = win.dataset.app;

  // Capture screenshot-like thumbnail via CSS
  captureWindowThumb(win, (thumbDataUrl) => {
    win.classList.add("minimizing");
    setTimeout(() => {
      win.classList.remove("minimizing");
      win.style.display = "none";
      win._minimizing = false;
      updateDockItem(app, false);
      addDockMinimized(app, win, thumbDataUrl);
      checkDockVisibility();
      bounceDockItem(app, true);
    }, 430);
  });
};

/* ── Override restoreWindow with genie-back effect ── */
const _origRestore = window.restoreWindow;
window.restoreWindow = function(win) {
  removeDockMinimized(win.dataset.app);
  win.style.display = "flex";
  win.classList.add("restoring");
  requestAnimationFrame(() => {
    setTimeout(() => { win.classList.remove("restoring"); }, 460);
  });
  focusWindow(win);
  updateDockItem(win.dataset.app, true);
  checkDockVisibility();
  win.classList.add("focus-pulse");
  setTimeout(() => win.classList.remove("focus-pulse"), 700);
};

/* ── Override openApp to bounce dock icon ── */
const _origOpenApp = window.openApp;
window.openApp = function(appName, extra = null) {
  bounceDockItem(appName);
  _origOpenApp(appName, extra);
};

/* ================================================================
   WINDOW THUMBNAIL CAPTURE
================================================================ */
function captureWindowThumb(win, callback) {
  // Use html2canvas if available, otherwise CSS snapshot
  const w = win.offsetWidth, h = win.offsetHeight;
  const canvas = document.createElement("canvas");
  canvas.width = 200; canvas.height = Math.round(200 * h / w);
  const ctx = canvas.getContext("2d");

  // Draw a simplified representation
  ctx.fillStyle = "#1c1c1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header bar
  ctx.fillStyle = "#e8e8ec";
  ctx.fillRect(0, 0, canvas.width, 20);

  // Traffic lights
  ctx.fillStyle = "#ff5f57"; ctx.beginPath(); ctx.arc(10,10,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#ffbd2e"; ctx.beginPath(); ctx.arc(22,10,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#28c840"; ctx.beginPath(); ctx.arc(34,10,4,0,Math.PI*2); ctx.fill();

  // Title text
  ctx.fillStyle = "#333";
  ctx.font = "7px -apple-system, sans-serif";
  const app = apps[win.dataset.app];
  if (app) {
    ctx.textAlign = "center";
    ctx.fillText(app.title, canvas.width/2, 13);
  }

  // Try to render iframe content color
  ctx.fillStyle = "rgba(60,60,80,0.9)";
  ctx.fillRect(0, 20, canvas.width, canvas.height - 20);

  // Grab dominant color from wallpaper for content area tint
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#0071e3";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 20, canvas.width, canvas.height - 20);

  // App icon in center of thumb
  if (app && app.icon) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const s = 32, x = (canvas.width - s)/2, y = (canvas.height - s)/2 + 4;
      ctx.drawImage(img, x, y, s, s);
      callback(canvas.toDataURL());
    };
    img.onerror = () => callback(canvas.toDataURL());
    img.src = app.icon;
  } else {
    callback(canvas.toDataURL());
  }
}

/* ================================================================
   DOCK MINIMIZED THUMBNAILS
================================================================ */
const dockMinimizedContainer = document.createElement("div");
dockMinimizedContainer.id = "dockMinimized";
dockMinimizedContainer.style.cssText = "display:flex;align-items:flex-end;gap:6px;";

const dockMinSep = document.createElement("div");
dockMinSep.className = "dock-min-sep";
dockMinSep.id = "dockMinSep";
dockMinSep.style.display = "none";

// Insert before trash (last item)
const dockEl2 = document.getElementById("dock");
const trashItem = dockEl2 ? dockEl2.querySelector('.dock-item[data-app="recycle-bin"]') : null;
if (trashItem && dockEl2) {
  dockEl2.insertBefore(dockMinimizedContainer, trashItem);
  dockEl2.insertBefore(dockMinSep, trashItem);
}

function addDockMinimized(appName, win, thumbDataUrl) {
  // Remove existing if any
  removeDockMinimized(appName);

  const app = apps[appName];
  if (!app) return;

  dockMinSep.style.display = "block";

  const item = document.createElement("div");
  item.className = "dock-minimized-item";
  item.dataset.minApp = appName;
  item.title = app.title + " (minimizado)";

  item.innerHTML = `
    <div class="dock-minimized-thumb">
      <img src="${thumbDataUrl}" alt="${app.title}">
      <img class="thumb-app-icon" src="${app.icon}" alt="">
    </div>
    <div class="dock-item-label">${app.title}</div>
  `;

  item.addEventListener("click", () => {
    item.classList.add("bouncing");
    setTimeout(() => item.classList.remove("bouncing"), 750);
    if (win.style.display === "none") {
      restoreWindow(win);
    } else {
      focusWindow(win);
    }
  });

  // Magnification on hover siblings
  item.addEventListener("mouseenter", () => {
    if (dockEl2) dockEl2.classList.add("dock-hovered");
  });
  item.addEventListener("mouseleave", () => {
    if (dockEl2) dockEl2.classList.remove("dock-hovered");
  });

  dockMinimizedContainer.appendChild(item);

  // Entrance animation
  item.style.opacity = "0";
  item.style.transform = "scale(0.5) translateY(20px)";
  requestAnimationFrame(() => {
    item.style.transition = "opacity 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)";
    item.style.opacity = "1";
    item.style.transform = "scale(1) translateY(0)";
  });
}

function removeDockMinimized(appName) {
  const existing = dockMinimizedContainer.querySelector(`[data-min-app="${appName}"]`);
  if (existing) {
    existing.style.transition = "opacity 0.2s, transform 0.2s";
    existing.style.opacity = "0";
    existing.style.transform = "scale(0.5) translateY(10px)";
    setTimeout(() => existing.remove(), 220);
  }
  // Hide separator if no more minimized
  setTimeout(() => {
    if (dockMinimizedContainer.children.length === 0) {
      dockMinSep.style.display = "none";
    }
  }, 250);
}

/* ================================================================
   DOCK ICON BOUNCE
================================================================ */
function bounceDockItem(appName, isMinimized = false) {
  if (isMinimized) {
    const el = dockMinimizedContainer.querySelector(`[data-min-app="${appName}"]`);
    if (el) { el.classList.add("bouncing"); setTimeout(() => el.classList.remove("bouncing"), 750); }
  } else {
    const el = document.querySelector(`#dock .dock-item[data-app="${appName}"]`);
    if (el) { el.classList.add("bouncing"); setTimeout(() => el.classList.remove("bouncing"), 750); }
  }
}

/* ================================================================
   MISSION CONTROL
================================================================ */
const mcOverlay = document.createElement("div");
mcOverlay.id = "missionControl";
mcOverlay.innerHTML = `
  <div class="mc-label-top">Mission Control</div>
  <div id="mcWindowsGrid"></div>
  <div class="mc-desktop-strip">
    <div class="mc-desktop-btn active-desk" onclick="closeMissionControl()"><span>Escritorio 1</span></div>
  </div>
`;
document.body.appendChild(mcOverlay);

// Click backdrop to close
mcOverlay.addEventListener("click", (e) => {
  if (e.target === mcOverlay) closeMissionControl();
});

function openMissionControl() {
  mcOverlay.classList.add("active");
  const grid = document.getElementById("mcWindowsGrid");
  grid.innerHTML = "";
  grid.style.cssText = "display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:flex-start;padding-top:30px;width:100%;";

  const wins = Object.entries(activeWindows);
  if (wins.length === 0) {
    grid.innerHTML = '<div style="color:rgba(255,255,255,0.5);font-size:16px;margin-top:60px;">No hay ventanas abiertas</div>';
    return;
  }

  wins.forEach(([appName, { win }]) => {
    const app = apps[appName];
    if (!app || win.style.display === "none") return;

    const thumb = document.createElement("div");
    thumb.className = "mc-thumb";
    thumb.style.animationDelay = Math.random() * 0.1 + "s";

    const inner = document.createElement("div");
    inner.className = "mc-thumb-inner";
    inner.style.cssText = "width:260px;height:180px;background:#1c1c1e;border-radius:10px;overflow:hidden;";

    // Draw a stylized preview
    captureWindowThumb(win, (dataUrl) => {
      inner.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
    });

    const label = document.createElement("div");
    label.className = "mc-thumb-label";
    label.innerHTML = `<img src="${app.icon}" alt=""><span>${app.title}</span>`;

    const closeBtn = document.createElement("div");
    closeBtn.className = "mc-close-btn";
    closeBtn.textContent = "✕";
    closeBtn.onclick = (e) => { e.stopPropagation(); closeMissionControl(); closeWindow(win); };

    thumb.appendChild(inner);
    thumb.appendChild(label);
    thumb.appendChild(closeBtn);
    thumb.addEventListener("click", () => {
      closeMissionControl();
      setTimeout(() => { focusWindow(win); }, 350);
    });

    grid.appendChild(thumb);
  });
}

function closeMissionControl() {
  mcOverlay.style.animation = "missionIn 0.25s cubic-bezier(0.4,0,1,1) reverse";
  setTimeout(() => {
    mcOverlay.classList.remove("active");
    mcOverlay.style.animation = "";
  }, 250);
}

// Bind Mission Control triggers
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "ArrowUp") { e.preventDefault(); openMissionControl(); }
  if (e.key === "Escape" && mcOverlay.classList.contains("active")) closeMissionControl();
});

// Override existing mission control button
const appleMenuMission = document.getElementById("appleMenuMission");
if (appleMenuMission) {
  appleMenuMission.addEventListener("click", () => {
    closeAppleMenu?.();
    openMissionControl();
  });
}

/* ================================================================
   HOT CORNERS
================================================================ */
function setupHotCorners() {
  const corners = [
    { id:"hotCornerTL", action: () => openMissionControl() },
    { id:"hotCornerTR", action: () => document.getElementById("spotlightBtn")?.click() || document.getElementById("spotlightMenuBtn")?.click() },
    { id:"hotCornerBL", action: () => showDesktop() },
    { id:"hotCornerBR", action: () => showToast("Sistema","🌙 Iniciando modo de suspensión…") },
  ];

  corners.forEach(({ id, action }) => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = "hot-corner";
      document.body.appendChild(el);
    }
    let hotTimer = null;
    el.addEventListener("mouseenter", () => {
      hotTimer = setTimeout(action, 400);
    });
    el.addEventListener("mouseleave", () => clearTimeout(hotTimer));
  });
}

function showDesktop() {
  const anyVisible = Object.values(activeWindows).some(({ win }) => win.style.display !== "none");
  if (anyVisible) {
    Object.values(activeWindows).forEach(({ win }) => {
      if (win.style.display !== "none") {
        win._wasVisible = true;
        win.classList.add("minimizing");
        setTimeout(() => {
          win.classList.remove("minimizing");
          win.style.display = "none";
        }, 430);
      }
    });
    showToast("Finder", "Mostrando escritorio");
  } else {
    Object.values(activeWindows).forEach(({ win }) => {
      if (win._wasVisible) {
        win._wasVisible = false;
        restoreWindow(win);
      }
    });
  }
}

/* ================================================================
   WINDOW SNAP ZONES
================================================================ */
const snapIndicator = document.createElement("div");
snapIndicator.className = "snap-zone-indicator";
document.body.appendChild(snapIndicator);

let snapTarget = null;
const SNAP_MARGIN = 20;
const menuH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 28;

document.addEventListener("mousemove", (e) => {
  if (!draggingWindow) { snapIndicator.classList.remove("visible"); snapTarget = null; return; }
  const vw = window.innerWidth, vh = window.innerHeight;

  if (e.clientY <= menuH + 4) {
    // Top = maximize hint
    snapTarget = "maximize";
    snapIndicator.style.cssText = `top:${menuH}px;left:0;right:0;bottom:0;`;
    snapIndicator.classList.add("visible");
  } else if (e.clientX <= SNAP_MARGIN) {
    snapTarget = "left";
    snapIndicator.style.cssText = `top:${menuH}px;left:0;width:50%;bottom:0;`;
    snapIndicator.classList.add("visible");
  } else if (e.clientX >= vw - SNAP_MARGIN) {
    snapTarget = "right";
    snapIndicator.style.cssText = `top:${menuH}px;right:0;left:50%;bottom:0;`;
    snapIndicator.classList.add("visible");
  } else {
    snapTarget = null;
    snapIndicator.classList.remove("visible");
  }

  // Add dragging-active class for shadow effect
  if (draggingWindow && !draggingWindow.classList.contains("dragging-active")) {
    draggingWindow.classList.add("dragging-active");
  }
});

document.addEventListener("mouseup", () => {
  if (draggingWindow && snapTarget) {
    applySnapZone(draggingWindow, snapTarget);
    snapTarget = null;
    snapIndicator.classList.remove("visible");
  }
  document.querySelectorAll(".window").forEach(w => w.classList.remove("dragging-active"));
});

function applySnapZone(win, zone) {
  const vw = window.innerWidth;
  const vh = window.innerHeight - menuH;
  win._prevGeometry = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };

  if (zone === "maximize") {
    toggleMaximize(win);
  } else if (zone === "left") {
    Object.assign(win.style, { left:"0px", top:menuH+"px", width:(vw/2)+"px", height:vh+"px" });
    win.style.transition = "left 0.25s, top 0.25s, width 0.25s, height 0.25s";
    setTimeout(() => win.style.transition = "", 280);
    showToast(apps[win.dataset.app]?.title || "Ventana", "⬅ Anclado a la izquierda");
  } else if (zone === "right") {
    Object.assign(win.style, { left:(vw/2)+"px", top:menuH+"px", width:(vw/2)+"px", height:vh+"px" });
    win.style.transition = "left 0.25s, top 0.25s, width 0.25s, height 0.25s";
    setTimeout(() => win.style.transition = "", 280);
    showToast(apps[win.dataset.app]?.title || "Ventana", "➡ Anclado a la derecha");
  }
}

/* ================================================================
   DESKTOP RIPPLE EFFECT
================================================================ */
const desktopContainer = document.getElementById("desktop-container");
if (desktopContainer) {
  desktopContainer.addEventListener("click", (e) => {
    if (e.target !== desktopContainer && !e.target.classList.contains("desktop")) return;
    const ripple = document.createElement("div");
    ripple.className = "desktop-ripple";
    ripple.style.cssText = `left:${e.offsetX}px;top:${e.offsetY}px;width:80px;height:80px;margin:-40px 0 0 -40px;`;
    e.currentTarget.querySelector(".desktop.active")?.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  });
}

/* ================================================================
   WINDOW SHAKE ON BLOCKED ACTION
================================================================ */
function shakeWindow(win) {
  win.classList.add("shaking");
  setTimeout(() => win.classList.remove("shaking"), 480);
}

/* ================================================================
   STARTUP / BOOT SEQUENCE
================================================================ */
function runStartupSequence() {
  const boot = document.createElement("div");
  boot.id = "bootScreen";
  boot.innerHTML = `
    <div class="boot-logo">𝕊</div>
    <div style="color:rgba(255,255,255,0.6);font-size:14px;letter-spacing:2px;margin-bottom:28px;">STERLING OS</div>
    <div class="boot-spinner"></div>
  `;
  document.body.appendChild(boot);

  // Play startup chime (silent visual)
  const chime = document.createElement("div");
  chime.id = "startupChime";
  document.body.appendChild(chime);

  setTimeout(() => {
    chime.classList.add("active");
    setTimeout(() => chime.remove(), 2200);
  }, 400);

  setTimeout(() => {
    boot.style.transition = "opacity 0.8s ease";
    boot.style.opacity = "0";
    setTimeout(() => boot.remove(), 800);
  }, 2000);
}

/* ================================================================
   ENHANCED WINDOW TITLE BAR — double-click to minimize
================================================================ */
document.addEventListener("dblclick", (e) => {
  const header = e.target.closest(".window-header");
  if (!header) return;
  const win = header.closest(".window");
  if (!win) return;
  // If not already handled by maximizer
  if (!e.target.closest(".mac-buttons")) {
    minimizeWindow(win);
  }
});

/* ================================================================
   APP LOADING BAR — show briefly when opening windows
================================================================ */
function addLoadingBar(win) {
  const bar = document.createElement("div");
  bar.className = "app-loading-bar";
  win.appendChild(bar);
  win.classList.add("loading");
  setTimeout(() => {
    bar.style.transition = "opacity 0.3s";
    bar.style.opacity = "0";
    setTimeout(() => {
      bar.remove();
      win.classList.remove("loading");
    }, 350);
  }, 1200);
}

/* Patch openApp to add loading bar */
const _origOpenApp2 = window.openApp;
window.openApp = function(appName, extra = null) {
  bounceDockItem(appName);
  const before = Object.keys(activeWindows).length;
  _origOpenApp(appName, extra);
  const win = activeWindows[appName]?.win;
  if (win && Object.keys(activeWindows).length > before) {
    addLoadingBar(win);
  }
};

/* ================================================================
   KEYBOARD SHORTCUTS ENHANCED
================================================================ */
document.addEventListener("keydown", (e) => {
  const meta = e.metaKey || e.ctrlKey;

  // Ctrl+M — minimize active window
  if (meta && e.key === "m") {
    e.preventDefault();
    const focused = document.querySelector(".window.focused");
    if (focused) minimizeWindow(focused);
  }

  // Ctrl+W — close active window
  if (meta && e.key === "w") {
    e.preventDefault();
    const focused = document.querySelector(".window.focused");
    if (focused) closeWindow(focused);
  }

  // Ctrl+Tab — cycle windows
  if (meta && e.key === "Tab") {
    e.preventDefault();
    const openWins = Object.values(activeWindows).filter(({ win }) => win.style.display !== "none");
    if (openWins.length < 2) return;
    const focused = document.querySelector(".window.focused");
    const idx = openWins.findIndex(({ win }) => win === focused);
    const next = openWins[(idx + 1) % openWins.length];
    focusWindow(next.win);
  }
});

/* ================================================================
   ENHANCED CLOCK — seconds display in menu bar
================================================================ */
function updateEnhancedClock() {
  const now = new Date();
  const timeEl = document.getElementById("clock-time");
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString("es-ES", {
      hour: "2-digit", minute: "2-digit"
    });
  }
}
setInterval(updateEnhancedClock, 1000);

/* ================================================================
   SYSTEM TRAY BATTERY SIMULATION
================================================================ */
function initBatteryWidget() {
  // Find battery status in menubar right
  const menubarRight = document.querySelector(".menubar-right");
  if (!menubarRight) return;

  let fakePct = 87;
  const battEl = document.createElement("div");
  battEl.className = "menubar-status";
  battEl.id = "batteryStatus";
  battEl.style.gap = "3px";
  battEl.title = "Batería";
  battEl.innerHTML = `<i class="fi fi-sr-battery-full" id="battIcon"></i><span id="battPct" style="font-size:11px;">${fakePct}%</span>`;

  // Insert before clock
  const clock = document.getElementById("menubar-clock");
  if (clock) menubarRight.insertBefore(battEl, clock);

  // Simulate slow battery drain
  setInterval(() => {
    fakePct = Math.max(10, fakePct - Math.random() * 0.3);
    const pctEl = document.getElementById("battPct");
    const iconEl = document.getElementById("battIcon");
    if (pctEl) pctEl.textContent = Math.round(fakePct) + "%";
    if (iconEl) {
      iconEl.className = fakePct > 60 ? "fi fi-sr-battery-full"
                       : fakePct > 30 ? "fi fi-sr-battery-half"
                       : "fi fi-sr-battery-quarter";
      if (fakePct <= 20) iconEl.style.color = "#ff3b30";
    }
  }, 15000);
}

/* ================================================================
   WIFI STRENGTH ANIMATION IN MENUBAR
================================================================ */
function initWifiWidget() {
  const menubarRight = document.querySelector(".menubar-right");
  if (!menubarRight) return;

  const wifiEl = document.createElement("div");
  wifiEl.className = "menubar-status";
  wifiEl.id = "wifiStatus";
  wifiEl.title = "Wi-Fi: Sterling 5G";
  wifiEl.innerHTML = `<i class="fi fi-sr-wifi"></i>`;

  const clock = document.getElementById("menubar-clock");
  if (clock) menubarRight.insertBefore(wifiEl, clock);
}

/* ================================================================
   WINDOW RESIZE VISUAL FEEDBACK
================================================================ */
const resizeCursors = { n:'n-resize', s:'s-resize', e:'e-resize', w:'w-resize', ne:'ne-resize', nw:'nw-resize', se:'se-resize', sw:'sw-resize' };
// Already handled in main JS, but we can add subtle pulse on resize start
document.addEventListener("mousedown", (e) => {
  const win = e.target.closest(".window");
  if (!win) return;
  win.classList.add("focus-pulse");
  setTimeout(() => win.classList.remove("focus-pulse"), 700);
});

/* ================================================================
   IMMERSIVE WALLPAPER PARALLAX
================================================================ */
let parallaxTicking = false;
document.addEventListener("mousemove", (e) => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(() => {
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    parallaxTicking = false;
  });
});

/* ================================================================
   CONTEXT MENU — ENHANCED DESKTOP
================================================================ */
// Add "Mission Control" option to desktop right-click
const ctxMenu = document.getElementById("contextMenu");
if (ctxMenu) {
  const mcLi = document.createElement("li");
  mcLi.id = "ctxMissionControl";
  mcLi.innerHTML = `<i class="fi fi-sr-grid"></i> Mission Control`;
  mcLi.addEventListener("click", () => {
    ctxMenu.classList.add("hidden");
    openMissionControl();
  });

  const showDeskLi = document.createElement("li");
  showDeskLi.innerHTML = `<i class="fi fi-sr-desktop-wallpaper"></i> Mostrar escritorio`;
  showDeskLi.addEventListener("click", () => {
    ctxMenu.classList.add("hidden");
    showDesktop();
  });

  const sep = document.createElement("li");
  sep.className = "ctx-sep";

  ctxMenu.appendChild(sep);
  ctxMenu.appendChild(mcLi);
  ctxMenu.appendChild(showDeskLi);
}

/* ================================================================
   EXPOSE HELPERS GLOBALLY
================================================================ */
window.openMissionControl  = openMissionControl;
window.closeMissionControl = closeMissionControl;
window.showDesktop         = showDesktop;
window.shakeWindow         = shakeWindow;
window.bounceDockItem      = bounceDockItem;

/* ================================================================
   INIT ALL ENHANCED FEATURES
================================================================ */
window.addEventListener("load", () => {
  setupHotCorners();
  initBatteryWidget();
  initWifiWidget();

  // Run startup sequence only on first load
  if (!sessionStorage.getItem("booted")) {
    sessionStorage.setItem("booted", "1");
    runStartupSequence();
  }

  // Override Mission Control in menubar actions (re-bind)
  setTimeout(() => {
    document.querySelectorAll("[data-action='missionControl']").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".mb-dropdown.open, .mb-dropdown").forEach(d => d.classList.remove("open"));
        openMissionControl();
      });
    });
  }, 500);

  // Show welcome toast after short delay
  setTimeout(() => {
    showToast("Sterling OS", "Bienvenido, Santiago. Sistema listo ✓");
  }, 2500);
});
