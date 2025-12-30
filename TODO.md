Step 1: Formalize transforms

Create a single Transform2D (or ViewportTransform) module that:

stores camera state

computes matrix world->screen and inverse

exposes boardToScreen/screenToBoard

Add unit tests immediately.

Step 2: Add a render loop contract

Even if you render on-demand, standardize:

viewer.render() calls:

base gerber passes

overlays (sorted by zIndex)

markers

selection highlights

Step 3: Overlay registry

Map<string, Overlay>

overlay has draw, visible, zIndex

call overlays every render with stable api

Step 4: Marker system

Store markers in a list + spatial index

Draw markers with a simple screen-space constant radius when zoomed out

Add picking using screenToBoard

Step 5: Event emitter

Simple on/off/emit

Emit selection and hover events only when state changes (avoid spam)

Step 6: Layer visibility plumbing

Don’t thread booleans everywhere. Centralize a VisibilityState and pass to render passes.