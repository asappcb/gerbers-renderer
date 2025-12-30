✅ Step 1: Formalize transforms - COMPLETED

Created ViewportTransform module with:

- Camera state storage (center_mm, zoom, rotation_rad, mirrorX/mirrorY)
- 3x3 matrix operations (world->screen and inverse)
- boardToScreen/screenToBoard methods
- Comprehensive unit tests (8 test cases passing)
- Canvas integration example

Coordinate conventions locked in:
- Board space (mm): x right, y up
- Screen space (px): x right, y down (canvas default)
- Screen origin: top left
- zoom = pixels per mm

Files created:
- src/viewportTransform.ts (core module)
- src/viewportTransform.test.ts (unit tests)
- src/viewportTransform.example.ts (canvas integration)

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