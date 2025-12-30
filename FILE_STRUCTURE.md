# File Structure Organization

## Overview
The gerbers-renderer project uses a modern canvas-based render pipeline system for PCB visualization and rendering.

## Directory Structure

```
src/
├── core/                    # Core functionality (detection, errors, etc.)
├── io/                      # I/O operations
├── parse/                   # Parsing utilities
├── render/                  # Rendering utilities
├── render-pipeline/         # Modern canvas-based render pipeline
│   ├── core/               # Core render pipeline components
│   │   ├── renderContract.ts      # Render context and contracts
│   │   ├── renderScheduler.ts     # Render scheduling system
│   │   ├── testSetup.ts           # Test environment setup
│   │   ├── viewportTransform.ts   # Coordinate transformation system
│   │   ├── viewportTransform.test.ts
│   │   └── viewportTransform.example.ts
│   ├── events.ts              # Typed event emitter system
│   ├── viewerEvents.ts        # Viewer event type definitions
│   ├── integratedViewer.ts  # Complete integrated viewer implementation
│   ├── markerPass.ts         # Marker rendering pass
│   ├── markerPicker.ts       # Marker picking and selection
│   ├── markerStore.ts        # Marker storage and management
│   ├── overlayRegistry.ts     # Overlay system management
│   ├── renderPasses.ts      # Render pass factories and systems
│   ├── viewer.ts            # Base viewer class with visibility & events
│   ├── visibilityManager.ts  # Centralized visibility management
│   ├── viewer.test.ts       # Tests for viewer system
│   ├── eventSystem.test.ts   # Tests for event system
│   ├── markerSystem.test.ts  # Tests for marker system
│   ├── overlayRegistry.test.ts # Tests for overlay system
│   └── visibilityPlumbing.test.ts # Tests for visibility system
├── types/                   # TypeScript type definitions
├── viewer/                  # Shared viewer types and styles
│   ├── types.ts             # Shared TypeScript types
│   └── viewer.css           # Viewer styles
└── index.ts                 # Main exports
```

## Render Pipeline System

### Modern Render Pipeline (src/render-pipeline/)
- **Integrated Viewer**: Canvas-based rendering with modern pipeline
- **Uses**: Single canvas, mathematical transforms, render passes
- **Status**: Production-ready, actively maintained

## Key Components

### Core Render Pipeline (src/render-pipeline/core/)
- `viewportTransform.ts`: Precise coordinate transformations
- `renderContract.ts`: Type definitions for render system (includes VisibilityState)
- `renderScheduler.ts`: Efficient render scheduling
- `testSetup.ts`: Test environment configuration

### Event System (src/render-pipeline/)
- `events.ts`: Typed event emitter with on/off/once/emit
- `viewerEvents.ts`: Viewer event type definitions (hover, select, click, view change)
- `eventSystem.test.ts`: Comprehensive event system tests

### Visibility Management (src/render-pipeline/)
- `visibilityManager.ts`: Centralized visibility state management with subscriptions
- `visibilityPlumbing.test.ts`: Tests for visibility system integration

### Marker System (src/render-pipeline/)
- `markerStore.ts`: High-performance marker storage with spatial indexing
- `markerPicker.ts`: Efficient marker picking and selection
- `markerPass.ts`: Marker rendering pass with LOD
- `markerSystem.test.ts`: Complete marker system tests

### Overlay System (src/render-pipeline/)
- `overlayRegistry.ts`: Overlay management and rendering
- `overlayRegistry.test.ts`: Overlay system tests

### Render System (src/render-pipeline/)
- `viewer.ts`: Base viewer class with centralized visibility & event system
- `integratedViewer.ts`: Complete viewer with UI and controls
- `renderPasses.ts`: Render pass factories and utilities

## Usage

Use `createIntegratedViewer()` from `src/render-pipeline/` for all new projects:

## Exports

All functionality is exported through the main `index.ts` file:

```typescript
// Modern render pipeline
import { 
  createIntegratedViewer,
  Viewer,
  ViewportTransform,
  RenderScheduler,
  VisibilityManager,
  Emitter,
  // Event system exports
  type ViewerEvents,
  // Marker system exports  
  type Marker,
  MarkerStore,
  MarkerPicker,
  createMarkerPass,
  // Overlay system exports
  type Overlay,
  OverlayRegistry,
  createOverlayPass,
  // Render pass exports
  type RenderPass,
  type RenderCtx,
  type VisibilityState,
  createGerberPass,
  createSelectionPass,
  // ... other render pipeline exports
} from "gerbers-renderer";
```

## Benefits of Organization

1. **Modern Architecture**: Canvas-based render pipeline with centralized systems
2. **Event-Driven**: Typed event system for reactive interactions
3. **Centralized Visibility**: Single source of truth for layer visibility
4. **High Performance**: Spatial indexing for markers, efficient render scheduling
5. **Modularity**: Each component has a single responsibility
6. **Maintainability**: Easy to locate and modify specific functionality
7. **Testability**: Comprehensive test coverage for all systems
8. **Scalability**: Easy to add new render passes, events, and features
9. **Type Safety**: Full TypeScript support throughout all systems
10. **Performance**: Efficient single-canvas rendering with mathematical transforms
