import { Overlay } from './core/renderContract';

// Example A: Simple violation dots overlay (world space)
export function createViolationDotsOverlay(): Overlay {
  return {
    id: "dfm:dots",
    zIndex: 50,
    visible: true,
    drawInWorldSpace: true,
    draw: (ctx, api) => {
      const pts = [
        { x_mm: 10, y_mm: 12 },
        { x_mm: 40, y_mm: 5 },
        { x_mm: 25, y_mm: 30 },
      ];

      // ctx is already in mm->px transform, so radius is in mm here
      ctx.fillStyle = 'red';
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x_mm, p.y_mm, 0.25, 0, Math.PI * 2); // 0.25mm radius
        ctx.fill();
      }
    },
  };
}

// Example B: Tooltip overlay (screen space)
export function createTooltipOverlay(getTooltip: () => { text: string; x_px: number; y_px: number } | null): Overlay {
  return {
    id: "ui:tooltip",
    zIndex: 200,
    visible: true,
    drawInWorldSpace: false,
    draw: (ctx, api) => {
      const hover = getTooltip();
      if (!hover) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(hover.x_px + 12, hover.y_px - 20, 100, 20);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.fillText(hover.text, hover.x_px + 15, hover.y_px - 5);
    },
  };
}

// Example C: Grid overlay (world space)
export function createGridOverlay(spacingMm: number = 1): Overlay {
  return {
    id: "grid:custom",
    zIndex: 10,
    visible: true,
    drawInWorldSpace: true,
    draw: (ctx, api) => {
      const bounds = api.getBoardBounds();
      const viewState = api.getViewState();
      
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
      ctx.lineWidth = 0.1; // 0.1mm lines
      
      ctx.beginPath();
      
      // Vertical lines
      for (let x = bounds.minX_mm; x <= bounds.maxX_mm; x += spacingMm) {
        ctx.moveTo(x, bounds.minY_mm);
        ctx.lineTo(x, bounds.maxY_mm);
      }
      
      // Horizontal lines
      for (let y = bounds.minY_mm; y <= bounds.maxY_mm; y += spacingMm) {
        ctx.moveTo(bounds.minX_mm, y);
        ctx.lineTo(bounds.maxX_mm, y);
      }
      
      ctx.stroke();
    },
  };
}

// Example D: Animated pulsing marker (world space)
export function createPulsingMarkerOverlay(position: { x_mm: number; y_mm: number }): Overlay {
  let animationTime = 0;
  
  return {
    id: "marker:pulsing",
    zIndex: 60,
    visible: true,
    drawInWorldSpace: true,
    draw: (ctx, api) => {
      animationTime += 16; // Approximate 60fps
      const pulse = Math.sin(animationTime / 200) * 0.5 + 0.5; // 0 to 1
      
      ctx.fillStyle = `rgba(255, 0, 0, ${0.3 + pulse * 0.7})`;
      ctx.beginPath();
      ctx.arc(position.x_mm, position.y_mm, 0.5 + pulse * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Request next frame for animation
      api.requestRender("overlay:animate");
    },
  };
}
