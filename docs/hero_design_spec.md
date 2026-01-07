# Hero Component Design Specification - Code by Leon

Technical specifications for a fully CSS-based hero section with animated abstract elements and a full-screen frosted dot-grid overlay.

---

## 🏗️ Layer Architecture

The hero is built with 4 distinct layers, bottom to top:

| Layer | Description | Z-Index |
| :--- | :--- | :--- |
| **1. Canvas Base** | Solid theme color | 0 |
| **2. Abstract Orbs** | CSS gradient blobs that morph/animate | 1 |
| **3. Frosted Overlay** | Full-screen 10px blur + dot-grid pattern | 2 |
| **4. Content (Glass Cards)** | Glassmorphism panels with text | 3 |

---

## 🎨 Layer 1: Canvas Base

| Mode | Color |
| :--- | :--- |
| **Dark** | `#021127` (Midnight Blue) |
| **Light** | `#F2EFFD` (Pearl White) |

---

## 🌌 Layer 2: Abstract Orbs (CSS Animated)

These are NOT images. They are `div` elements with CSS `radial-gradient`, `border-radius: 50%`, and subtle CSS animations for morphing.

### Orb Definitions

| Orb | Position | Size | Color (Dark) | Color (Light) |
| :--- | :--- | :--- | :--- | :--- |
| **Purple** | Top-Left | ~40vw | `#8B5CF6` → `#6D28D9` | `#C4B5FD` → `#A78BFA` |
| **Orange** | Center | ~50vw | `#F97316` → `#EA580C` | `#FDBA74` → `#FB923C` |
| **Blue** | Bottom-Right | ~35vw | `#3B82F6` → `#2563EB` | `#93C5FD` → `#60A5FA` |

### Morph Animation (Keyframes)

```css
@keyframes morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: translate(5%, 5%) rotate(5deg);
  }
}

.orb {
  animation: morph 15s ease-in-out infinite;
  filter: blur(80px); /* Soft edges */
}
```

---

## 🪟 Layer 3: Full-Screen Frosted Overlay

This layer covers the ENTIRE viewport above the orbs. It applies:
1. A **10px backdrop blur** to frost the abstract elements behind it.
2. A **dot-grid pattern** overlay (like Google Mixboard).

### CSS Implementation

```css
.frosted-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Dot-grid pattern */
  background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
  background-size: 12px 12px;
}

:root {
  --dot-color: rgba(150, 150, 150, 0.15); /* Light mode */
}

[data-theme="dark"] {
  --dot-color: rgba(255, 255, 255, 0.08); /* Dark mode */
}
```

---

## 📦 Layer 4: Glass Cards (Content)

The cards sit ON TOP of the frosted overlay and contain the actual text.

### Card Styles

```css
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 2rem 2.5rem;
}

:root {
  --glass-bg: rgba(255, 255, 255, 0.4);
  --glass-border: rgba(200, 200, 200, 0.3);
}

[data-theme="dark"] {
  --glass-bg: rgba(2, 17, 39, 0.5);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

---

## 📐 Visual Reference

![Light Mode Reference](C:/Users/Allen Leon/.gemini/antigravity/brain/470c2e97-964c-4994-8da8-3102a4c9387c/uploaded_image_0_1766957919202.png)
*Light mode: Pearl white base, soft pastel orbs, frosted dot-grid overlay covering entire screen.*

![Dot Grid Pattern](C:/Users/Allen Leon/.gemini/antigravity/brain/470c2e97-964c-4994-8da8-3102a4c9387c/uploaded_image_1_1766957919202.png)
*The dot-grid pattern that should tile across the frosted overlay.*

---

## 🔑 Key Takeaways

1. **No image backgrounds** - All abstract elements are CSS `div`s with gradients.
2. **Morphing animation** - Orbs subtly change shape over 15s loop.
3. **Full-screen frost** - The 10px blur + dot-grid covers the entire viewport, not just cards.
4. **Cards are layered on top** - Glass cards sit above the frosted layer.

