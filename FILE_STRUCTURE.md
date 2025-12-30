# File Structure Organization

## Overview
The gerbers-renderer project has been reorganized to separate the legacy DOM-based viewer from the new canvas-based render pipeline system.

## Directory Structure

```
src/
├── core/                    # Core functionality (detection, errors, etc.)
├── io/                      # I/O operations
├── parse/                   # Parsing utilities
├── render/                  # Legacy rendering system
├── render-pipeline/         # NEW: Modern canvas-based render pipeline
│   ├── core/               # Core render pipeline components
│   │   ├── renderContract.ts      # Render context and contracts
│   │   ├── renderScheduler.ts     # Render scheduling system
│   │   ├── testSetup.ts           # Test environment setup
│   │   ├── viewportTransform.ts   # Coordinate transformation system
│   │   ├── viewportTransform.test.ts
│   │   └── viewportTransform.example.ts
│   ├── integratedViewer.ts  # Complete integrated viewer implementation
│   ├── renderPasses.ts      # Render pass factories and systems
│   ├── viewer.ts            # Base viewer class
│   ├── viewer.test.ts       # Tests for viewer system
│   └── visibilityManager.ts # Visibility state management
├── types/                   # TypeScript type definitions
├── viewer/                  # Legacy DOM-based viewer
│   ├── BoardViewer.ts       # Legacy board viewer implementation
│   ├── types.ts             # Legacy viewer types
│   └── viewer.css           # Legacy viewer styles
└── index.ts                 # Main exports
```

## Legacy vs New Systems

### Legacy System (src/viewer/)
- **BoardViewer.ts**: DOM-based rendering with CSS transforms
- **Uses**: HTML `<img>` elements, CSS transforms
- **Status**: Maintained for backward compatibility

### New Render Pipeline (src/render-pipeline/)
- **Integrated Viewer**: Canvas-based rendering with modern pipeline
- **Uses**: Single canvas, mathematical transforms, render passes
- **Status**: Production-ready, recommended for new projects

## Key Components

### Core Render Pipeline (src/render-pipeline/core/)
- `viewportTransform.ts`: Precise coordinate transformations
- `renderContract.ts`: Type definitions for render system
- `renderScheduler.ts`: Efficient render scheduling
- `testSetup.ts`: Test environment configuration

### Render System (src/render-pipeline/)
- `viewer.ts`: Base viewer class with render pipeline
- `integratedViewer.ts`: Complete viewer with UI and controls
- `renderPasses.ts`: Render pass factories and utilities
- `visibilityManager.ts`: Centralized visibility management

## Migration Path

1. **Legacy**: Continue using `createBoardViewer()` from `src/viewer/`
2. **New**: Use `createIntegratedViewer()` from `src/render-pipeline/`
3. **Hybrid**: Both systems can coexist in the same application

## Exports

All functionality is exported through the main `index.ts` file:

```typescript
// Legacy
import { createBoardViewer } from "gerbers-renderer";

// New render pipeline
import { 
  createIntegratedViewer,
  Viewer,
  ViewportTransform,
  RenderScheduler,
  // ... other render pipeline exports
} from "gerbers-renderer";
```

## Benefits of Organization

1. **Clear Separation**: Legacy and new systems are clearly separated
2. **Modularity**: Each component has a single responsibility
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Testability**: Tests are co-located with their modules
5. **Scalability**: Easy to add new render passes and features
6. **Backward Compatibility**: Legacy system remains untouched
