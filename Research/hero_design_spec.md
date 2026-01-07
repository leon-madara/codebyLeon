# Hero Component Design Specification - Code by Leon

Technical specifications for recreating the signature "Creative Bold" hero section with refined glassmorphism and theme logic.

## 🌌 Background & Canvas Logic

The background is a dynamic composition of abstract light glows over a core theme base.

| Element | Dark Mode | Light Mode |
| :--- | :--- | :--- |
| **Canvas Base** | `#021127` (Midnight Blue) | `#F2EFFD` (Pearl White) |
| **Purple Glow** | Primary Accent (Left) | Soft Lavender Tint (Left) |
| **Orange Glow** | Center/Focal | Soft Peach Tint (Center) |
| **Blue Glow** | Secondary Accent (Right) | Sky Blue Tint (Right) |

---

## 🪟 Advanced Glassmorphism (Frosted Panels)

The floating cards utilize a layered rendering approach for a premium, tactile feel.

### 1. The Glass Core
- **Backdrop Blur**: `blur(10px)`
- **Fill Opacity**: Between `0.3` and `0.5`
- **Tinting**:
    - **Dark**: Deep navy tint (`#021127`) at low opacity.
    - **Light**: Pure white (`#FFFFFF`) at low opacity.

### 2. The Dot-Grid Overlay (Google Mixboard Inspired)
- **Pattern**: 1px dots spaced every 10px in a perfect grid.
- **Color**: White (Dark Mode) or Grey (Light Mode) at `0.1` opacity.
- **Placement**: Applied as a background-image layer on top of the blur but behind the text.

### 3. Edge Styling
- **Border**: 1px solid border.
    - **Dark**: Linear gradient (Transparent -> `#D9751A` glow -> Transparent).
    - **Light**: Subtitle grey (`#D6D7D3`) at 0.5 opacity.

---

## 📐 Layout & Hierarchy

Based on the signature direct-view reference.

### Card #1: Primary Identity
- **Position**: Center-Left, elevated.
- **Content**: "NAIROBI-BASED DESIGN STUDIO"
- **Typography**: Bold, Heavy Weight, tracking -0.02em.

### Card #2: Value Proposition
- **Position**: Bottom-Right, slightly lower z-index.
- **Content**: "INNOVATION MEETS TRADITION"
- **Typography**: Medium Weight, tracking +0.05em.

---

## 🛠️ CSS Reference Tokens

```css
:root {
  /* Dark Mode Hero */
  --hero-bg-dark: #021127;
  --glass-blur: 10px;
  --glass-opacity-dark: 0.4;
  --dot-grid-pattern: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  --dot-grid-size: 10px 10px;
}

[data-theme="light"] {
  /* Light Mode Hero */
  --hero-bg-light: #F2EFFD;
  --glass-opacity-light: 0.3;
}
```

## Next Steps
1. **Figma Setup**: Implement the background gradients using the "Mesh Gradient" plugin.
2. **Glass Component**: Create the dot-grid pattern as a tileable component in Figma.
3. **Typography Selection**: Finalize the font pair (Inter for UI, Orbit for Headers).
