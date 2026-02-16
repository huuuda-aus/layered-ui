# Layered UI Prototype (3D Perspective)

Prototype UI that explores stacking full-screen layers in 3D space using CSS `perspective` + `translateZ`, and transitioning between layers by moving a "camera" along the Z axis.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Controls

- **Next layer**: moves the camera forward to the next layer.
- **Previous layer**: moves the camera backward to the previous layer.
- The **last** layer does not show the Next button.

## Implementation notes

- **Rendering**: layers are absolutely positioned and transformed in Z.
- **Camera**: the camera position is applied as a CSS variable (`--camera-z`).
- **Transitions**: CSS transitions animate `transform` / `filter` / `opacity` during navigation.

Key files:

- `src/App.tsx`
- `src/App.css`
