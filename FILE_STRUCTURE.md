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
│   ├── integratedViewer.ts  # Complete integrated viewer implementation
│   ├── renderPasses.ts      # Render pass factories and systems
│   ├── viewer.ts            # Base viewer class
│   ├── viewer.test.ts       # Tests for viewer system
│   └── visibilityManager.ts # Visibility state management
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
- `renderContract.ts`: Type definitions for render system
- `renderScheduler.ts`: Efficient render scheduling
- `testSetup.ts`: Test environment configuration

### Render System (src/render-pipeline/)
- `viewer.ts`: Base viewer class with render pipeline
- `integratedViewer.ts`: Complete viewer with UI and controls
- `renderPasses.ts`: Render pass factories and utilities
- `visibilityManager.ts`: Centralized visibility management

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
  // ... other render pipeline exports
} from "gerbers-renderer";
```

## Benefits of Organization

1. **Modern Architecture**: Canvas-based render pipeline system
2. **Modularity**: Each component has a single responsibility
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Testability**: Tests are co-located with their modules
5. **Scalability**: Easy to add new render passes and features
6. **Performance**: Efficient single-canvas rendering with mathematical transforms
