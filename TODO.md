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

✅ Step 2: Add a render loop contract - COMPLETED

Implemented deterministic rendering pipeline with:

- **Render Contract**: Defined RenderCtx, RenderPass, VisibilityState interfaces
- **Render Scheduler**: On-demand rendering with requestAnimationFrame coalescing  
- **Viewer Pipeline**: Single render() entry point with pass registry
- **Four Stages**: Base gerber passes (0-99), overlays (100-199), markers (200-299), selection (300-399)
- **Visibility Manager**: Centralized state management with subscription system
- **Unit Tests**: 18 tests covering render ordering, pass management, and scheduler behavior

Key Features:
- `viewer.render()` as single entry point for all pixel painting
- Deterministic pipeline order with fine-grained control via `order` field
- Internal scheduler prevents flickering/double-renders
- Pass isolation with save/restore context management
- Clean enabled() checks via centralized VisibilityState

Files created:
- src/renderContract.ts (interfaces and order ranges)
- src/renderScheduler.ts (on-demand rendering scheduler)
- src/viewer.ts (main viewer with pipeline registry)
- src/renderPasses.ts (four stage passes and systems)
- src/visibilityManager.ts (centralized visibility state)
- src/viewer.test.ts (comprehensive unit tests)
- src/testSetup.ts (test environment mocks)

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