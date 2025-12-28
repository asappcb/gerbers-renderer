import "./viewer.css";
import type { BoardGeom, BoardViewer, ViewerLayers, ViewerSideMode } from "./types";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function posMod(v: number, m: number) {
  if (!Number.isFinite(v) || !Number.isFinite(m) || m <= 0) return 0;
  return ((v % m) + m) % m;
}

function setImgSrc(img: HTMLImageElement, url?: string) {
  if (url && url.startsWith("blob:")) {
    img.setAttribute("src", url);
  } else if (url && url.length > 0) {
    // allow non-blob URLs too, if you ever use them
    img.setAttribute("src", url);
  } else {
    img.removeAttribute("src"); // critical: prevents it defaulting to current document URL
  }
}

function mustGet<T extends HTMLElement>(root: HTMLElement, selector: string): T {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Missing required element: ${selector}`);
  return el as T;
}

export type BoardViewerOptions = {
  onDownload?: () => void;
};

export function createBoardViewer(host: HTMLElement, opts: BoardViewerOptions = {}): BoardViewer {
  const downloadIcon = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 17v3h16v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

  host.innerHTML = `
    <div class="board-viewer-root">
      <div class="viewer-header">
        <div class="viewer-header-left">
          <p class="viewer-header-title">Board viewer</p>
          <p class="viewer-header-sub" id="viewer-subtitle">Scroll to zoom, drag to pan</p>
        </div>

        <div class="viewer-header-right">
          <div class="controls">
            <div class="segment" title="Side">
              <input id="side-top" type="radio" name="side" value="top" checked />
              <label for="side-top">Top</label>

              <input id="side-bottom" type="radio" name="side" value="bottom" />
              <label for="side-bottom">Bottom</label>
            </div>

            <label class="toggle" title="Grid">
              <input type="checkbox" id="grid-toggle" />
              Grid
            </label>

            <div class="select" title="Grid units">
              Units
              <select id="grid-units">
                <option value="in" selected>in</option>
                <option value="mm">mm</option>
              </select>
            </div>

            <button class="btn" id="fit-btn" type="button" title="Fit to viewport">Fit</button>
            <button class="btn btn-primary" id="download-btn" type="button" title="Download">
              ${downloadIcon}
              Download
            </button>
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <div id="board-viewport">
          <canvas id="grid-canvas"></canvas>
          <div id="board-content">
            <div id="board-stage">
              <div class="board-clip" id="boardClip">
                <div class="layer-frame" id="layer-fr4" style="z-index:0;">
                  <img class="layer fr4" id="img-fr4" alt="FR4" />
                </div>

                <div class="layer-frame" id="layer-bottom-copper"><img class="layer" id="img-bottom-copper" alt="Bottom copper" /></div>
                <div class="layer-frame" id="layer-bottom-mask"><img class="layer" id="img-bottom-mask" alt="Bottom mask" /></div>
                <div class="layer-frame" id="layer-bottom-silk"><img class="layer" id="img-bottom-silk" alt="Bottom silk" /></div>

                <div class="layer-frame" id="layer-top-copper"><img class="layer" id="img-top-copper" alt="Top copper" /></div>
                <div class="layer-frame" id="layer-top-mask"><img class="layer" id="img-top-mask" alt="Top mask" /></div>
                <div class="layer-frame" id="layer-top-silk"><img class="layer" id="img-top-silk" alt="Top silk" /></div>

                <div class="layer-frame" id="layer-drills"><img class="layer" id="img-drills" alt="Drills" /></div>
                <div class="layer-frame" id="layer-vias"><img class="layer" id="img-vias" alt="Vias" /></div>
              </div>
            </div>
          </div>

          <div class="board-viewer-hint">Scroll to zoom, drag to pan.</div>
        </div>
      </div>
    </div>
  `;

  const root = host.firstElementChild as HTMLElement;
  const viewport = mustGet<HTMLDivElement>(root, "#board-viewport");
  const content = mustGet<HTMLDivElement>(root, "#board-content");
  const stage = mustGet<HTMLDivElement>(root, "#board-stage");
  const boardClip = mustGet<HTMLDivElement>(root, "#boardClip");

  const gridCanvas = mustGet<HTMLCanvasElement>(root, "#grid-canvas");
  const gridToggle = mustGet<HTMLInputElement>(root, "#grid-toggle");
  const gridUnits = mustGet<HTMLSelectElement>(root, "#grid-units");
  const fitBtn = mustGet<HTMLButtonElement>(root, "#fit-btn");
  const downloadBtn = mustGet<HTMLButtonElement>(root, "#download-btn");

  const radios = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="side"]'));

  const imgFr4 = mustGet<HTMLImageElement>(root, "#img-fr4");
  const imgTopCopper = mustGet<HTMLImageElement>(root, "#img-top-copper");
  const imgBottomCopper = mustGet<HTMLImageElement>(root, "#img-bottom-copper");
  const imgTopMask = mustGet<HTMLImageElement>(root, "#img-top-mask");
  const imgBottomMask = mustGet<HTMLImageElement>(root, "#img-bottom-mask");
  const imgTopSilk = mustGet<HTMLImageElement>(root, "#img-top-silk");
  const imgBottomSilk = mustGet<HTMLImageElement>(root, "#img-bottom-silk");
  const imgDrills = mustGet<HTMLImageElement>(root, "#img-drills");
  const imgVias = mustGet<HTMLImageElement>(root, "#img-vias");

  let boardGeom: BoardGeom | null = null;
  let layers: ViewerLayers = {};

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartTranslateX = 0;
  let dragStartTranslateY = 0;

  let rafPending = false;
  let didInteract = false;

  function clampScale(v: number) {
    return clamp(v, 0.2, 8);
  }

  function requestTransform() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      content.style.transform =
        `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      if (gridToggle.checked) drawGrid();
    });
  }

  function fitBoardToViewport(marginFrac = 0.08) {
    const vp = viewport.getBoundingClientRect();
    const stageW = stage.offsetWidth || 1;
    const stageH = stage.offsetHeight || 1;

    const usableW = Math.max(1, vp.width * (1 - 2 * marginFrac));
    const usableH = Math.max(1, vp.height * (1 - 2 * marginFrac));

    scale = clampScale(Math.min(usableW / stageW, usableH / stageH));
    translateX = (vp.width - scale * stageW) / 2;
    translateY = (vp.height - scale * stageH) / 2;

    requestTransform();
  }

  function computePxPerIn() {
    let pxPerIn = 1000.0;
    if (boardGeom?.board?.width_in) {
      const rect = stage.getBoundingClientRect();
      const worldW = rect.width / scale;
      if (Number.isFinite(worldW) && worldW > 0) pxPerIn = worldW / boardGeom.board.width_in;
    }
    return pxPerIn;
  }

  function resizeGridCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = viewport.getBoundingClientRect();
    gridCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
    gridCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
    gridCanvas.style.width = `${rect.width}px`;
    gridCanvas.style.height = `${rect.height}px`;
  }

  function drawGrid() {
    if (!gridToggle.checked) {
      gridCanvas.style.display = "none";
      return;
    }
    gridCanvas.style.display = "block";

    const ctx = gridCanvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = viewport.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pxPerIn = computePxPerIn();
    const pxPerMm = pxPerIn / 25.4;

    const units = gridUnits.value;
    const minorWorldPx = units === "mm" ? pxPerMm * 1 : pxPerIn * 0.1;
    const majorWorldPx = units === "mm" ? pxPerMm * 10 : pxPerIn * 1.0;

    const minor = minorWorldPx * scale;
    const major = majorWorldPx * scale;
    if (!Number.isFinite(minor) || minor < 6) return;

    const oxMinor = posMod(translateX, minor);
    const oyMinor = posMod(translateY, minor);
    const oxMajor = posMod(translateX, major);
    const oyMajor = posMod(translateY, major);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(17, 24, 39, 0.12)";
    ctx.beginPath();
    for (let x = oxMinor; x < w; x += minor) {
      const xi = Math.round(x) + 0.5;
      ctx.moveTo(xi, 0);
      ctx.lineTo(xi, h);
    }
    for (let y = oyMinor; y < h; y += minor) {
      const yi = Math.round(y) + 0.5;
      ctx.moveTo(0, yi);
      ctx.lineTo(w, yi);
    }
    ctx.stroke();

    if (Number.isFinite(major) && major >= 12) {
      ctx.strokeStyle = "rgba(17, 24, 39, 0.22)";
      ctx.beginPath();
      for (let x = oxMajor; x < w; x += major) {
        const xi = Math.round(x) + 0.5;
        ctx.moveTo(xi, 0);
        ctx.lineTo(xi, h);
      }
      for (let y = oyMajor; y < h; y += major) {
        const yi = Math.round(y) + 0.5;
        ctx.moveTo(0, yi);
        ctx.lineTo(w, yi);
      }
      ctx.stroke();
    }
  }

  function setLayerFrameVisible(frameId: string, on: boolean) {
    const el = root.querySelector<HTMLElement>(`#${frameId}`);
    if (!el) return;
    el.style.display = on ? "block" : "none";
  }

  function setBoardMask(url: string | undefined) {
    if (!url) return;
    boardClip.style.setProperty("--board-mask-url", `url('${url}')`);
  }

  function showSideMode(mode: ViewerSideMode) {
    const showTop = mode === "top";
    const showBottom = mode === "bottom";

    setLayerFrameVisible("layer-top-copper", showTop && !!layers.top_copper);
    setLayerFrameVisible("layer-top-mask", showTop && !!layers.top_mask);
    setLayerFrameVisible("layer-top-silk", showTop && !!layers.top_silk);

    setLayerFrameVisible("layer-bottom-copper", showBottom && !!layers.bottom_copper);
    setLayerFrameVisible("layer-bottom-mask", showBottom && !!layers.bottom_mask);
    setLayerFrameVisible("layer-bottom-silk", showBottom && !!layers.bottom_silk);

    setLayerFrameVisible("layer-drills", !!layers.drills);
    setLayerFrameVisible("layer-vias", !!layers.vias);

    const maskUrl =
      mode === "bottom"
        ? (layers.bottom_board_mask ?? layers.top_board_mask)
        : (layers.top_board_mask ?? layers.bottom_board_mask);

    if (maskUrl) setBoardMask(maskUrl);
  }

  function setStageFromGeometry() {
    if (!boardGeom?.board) return;
    const SCALE = 1000.0; // same constant used in your renderer logic in result.html
    const W = Math.round((boardGeom.board.width_in || 1) * SCALE);
    const H = Math.round((boardGeom.board.height_in || 1) * SCALE);
    stage.style.width = `${W}px`;
    stage.style.height = `${H}px`;
  }

  // Events
  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    didInteract = true;

    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const oldScale = scale;
    const zoomFactor = 1.1;

    scale = event.deltaY < 0 ? clampScale(scale * zoomFactor) : clampScale(scale / zoomFactor);

    const zoomRatio = scale / oldScale;
    translateX = mouseX - (mouseX - translateX) * zoomRatio;
    translateY = mouseY - (mouseY - translateY) * zoomRatio;

    requestTransform();
  }, { passive: false });

  viewport.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    didInteract = true;

    isDragging = true;
    viewport.classList.add("grabbing");
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStartTranslateX = translateX;
    dragStartTranslateY = translateY;
  });

  const onMove = (event: MouseEvent) => {
    if (!isDragging) return;
    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;
    translateX = dragStartTranslateX + dx;
    translateY = dragStartTranslateY + dy;
    requestTransform();
  };

  const onUp = () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove("grabbing");
  };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  gridToggle.addEventListener("change", () => {
    resizeGridCanvas();
    drawGrid();
  });
  gridUnits.addEventListener("change", drawGrid);
  fitBtn.addEventListener("click", () => fitBoardToViewport(0.08));
  downloadBtn.addEventListener("click", () => {
    opts.onDownload?.();
  });

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      const mode = (radios.find((x) => x.checked)?.value || "top") as ViewerSideMode;
      showSideMode(mode);
    });
  });

  window.addEventListener("resize", () => {
    resizeGridCanvas();
    if (!didInteract) fitBoardToViewport(0.08);
    else requestTransform();
  });

  function setData(data: { boardGeom: BoardGeom; layers: ViewerLayers }) {
    boardGeom = data.boardGeom;
    layers = data.layers;

    // images
    setImgSrc(imgTopCopper, layers.top_copper);
    setImgSrc(imgBottomCopper, layers.bottom_copper);
    setImgSrc(imgTopMask, layers.top_mask);
    setImgSrc(imgBottomMask, layers.bottom_mask);
    setImgSrc(imgTopSilk, layers.top_silk);
    setImgSrc(imgBottomSilk, layers.bottom_silk);
    setImgSrc(imgDrills, layers.drills);
    setImgSrc(imgVias, layers.vias);

    // FR4 base
    setImgSrc(imgFr4, layers.top_copper ?? layers.bottom_copper);

    setStageFromGeometry();
    resizeGridCanvas();
    fitBoardToViewport(0.08);

    const mode = (radios.find((x) => x.checked)?.value || "top") as ViewerSideMode;
    showSideMode(mode);
    requestTransform();
  }

  function dispose() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    host.innerHTML = "";
  }

  return {
    setData,
    setSideMode: (mode) => {
      const r = radios.find((x) => x.value === mode);
      if (r) r.checked = true;
      showSideMode(mode);
    },
    fit: () => fitBoardToViewport(0.08),
    dispose,
  };
}
