# perspective-layered-ui

A React component library for creating interactive layered UI scenes with 3D perspective effects. Stack full-screen layers and navigate between them with smooth transitions.

[![npm version](https://img.shields.io/npm/v/perspective-layered-ui.svg)](https://www.npmjs.com/package/perspective-layered-ui)

## Installation

```bash
npm install perspective-layered-ui
```

## Usage

First, import the component and the required CSS:

```tsx
import { LayeredScene } from 'perspective-layered-ui';
import 'perspective-layered-ui/dist/perspective-layered-ui.css';
```

Then use it in your React app:

```tsx
import { LayeredScene } from 'perspective-layered-ui';
import 'perspective-layered-ui/dist/perspective-layered-ui.css';

function App() {
  return (
    <LayeredScene>
      <div style={{ background: 'red', height: '100vh' }}>Layer 1</div>
      <div style={{ background: 'green', height: '100vh' }}>Layer 2</div>
      <div style={{ background: 'blue', height: '100vh' }}>Layer 3</div>
    </LayeredScene>
  );
}
```

## Props

- `transitionMs`: Duration of navigation transitions in milliseconds (default: 250).
- `easing`: CSS easing function for transitions (default: 'linear').
- `depthSpacingPx`: Z-axis spacing between layers in pixels (default: 200).
- `perspectivePx`: Perspective value for 3D effect in pixels (default: 3000).
- `blurAt1Px`, `blurAt2Px`: Blur amounts for layers at increasing distances (defaults: 6, 10).
- `opacityAt1`, `opacityAt2`: Opacity values for layers at increasing distances (defaults: 0.7, 0.45).
- `minVisibleOpacity`: Minimum opacity for visible layers (default: 0.2).
- `initialIndex`: Starting layer index (default: 0).
- `disableNavigationButtons`: Disables automatic PREV/NEXT buttons (default: false).

## Features

- Smooth 3D transitions between layers
- Customizable perspective and depth
- Blur and opacity effects for depth perception
- Keyboard and programmatic navigation
- Lightweight and dependency-free (requires React)

## License

MIT
