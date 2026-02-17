# perspective-layered-ui

A React component library for creating interactive layered UI scenes with 3D perspective effects. Stack full-screen layers and navigate between them with smooth transitions.

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

The `LayeredScene` component accepts the following props:

- `children`: `ReactNode` - The layers to display (each child is a layer).
- `className?`: `string` - Additional CSS class for the container.
- `style?`: `CSSProperties` - Inline styles for the container.
- `transitionMs?`: `number` - Transition duration in milliseconds (default: 250).
- `easing?`: `string` - CSS easing function (default: 'ease-out').
- `depthSpacingPx?`: `number` - Z-axis spacing between layers (default: 200).
- `perspectivePx?`: `number` - Perspective value for the 3D effect (default: 3000).
- `blurAt1Px?`: `number` - Blur amount for layers at distance 1 (default: 6).
- `blurAt2Px?`: `number` - Blur amount for layers at distance 2 (default: 10).
- `opacityAt1?`: `number` - Opacity for layers at distance 1 (default: 0.7).
- `opacityAt2?`: `number` - Opacity for layers at distance 2 (default: 0.45).
- `minVisibleOpacity?`: `number` - Minimum opacity for visible layers (default: 0.2).
- `initialIndex?`: `number` - Initial active layer index (default: 0).

## Features

- Smooth 3D transitions between layers
- Customizable perspective and depth
- Blur and opacity effects for depth perception
- Keyboard and programmatic navigation
- Lightweight and dependency-free (requires React)

## License

MIT
