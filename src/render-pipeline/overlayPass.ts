import { RenderPass, RenderCtx, RENDER_ORDER, OverlayApi } from './core/renderContract';
import { OverlayRegistry } from './overlayRegistry';

export function createOverlayPass(overlayRegistry: OverlayRegistry, overlayApi: OverlayApi): RenderPass {
  return {
    id: "overlay:all",
    order: RENDER_ORDER.OVERLAYS_MIN,
    enabled: () => true,
    draw: (rc: RenderCtx) => {
      const worldMat = rc.xform.getWorldToScreenMatrix();
      const visibleOverlays = overlayRegistry.getSortedVisible();
      
      for (const ov of visibleOverlays) {
        rc.ctx.save();

        if (ov.drawInWorldSpace) {
          // draw in mm
          rc.ctx.setTransform(worldMat[0], worldMat[3], worldMat[1], worldMat[4], worldMat[2], worldMat[5]);
        } else {
          // draw in px
          rc.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        ov.draw(rc.ctx, overlayApi);
        rc.ctx.restore();
      }
    },
  };
}
