# Theme Strategy: Code by Leon

Building the light and dark mode architecture using the curated color palette.

## 🎨 Color Palette Extraction
Based on your palette, here are the primary hex codes we'll be using:

| Category | Primary | Secondary | Accents | Neutral / Base |
| :--- | :--- | :--- | :--- | :--- |
| **Brand** | `#D9751A` (Orange) | `#A45711` (Deep Orange) | `#FD9F68` (Peach) | `#ECD4AC` (Beige) |
| **Grey Scale** | `#F3F1F9` (White) | `#D6D7D3` (Light Grey) | `#666561` (Mid Grey) | `#111110` (Deep Black) |

---

## ☀️ Light Mode: Clean & Professional
The goal is to feel airy, modern, and trustworthy.

- **Background**: `#F3F1F9` (Soft off-white)
- **Primary Text**: `#13100E` (Deep Black)
- **Secondary Text**: `#544843` (Mid Grey)
- **Primary Buttons**: `#D9751A` (Orange) with White text
- **Secondary Buttons**: Transparent with `#D9751A` border
- **Card Backgrounds**: `#FFFFFF` with subtle `#D6D7D3` borders
- **Highlight Elements**: `#ECD4AC` (Beige) for section backgrounds

---

## 🌙 Dark Mode: Sleek & High-End Dev
The goal is a "Command Center" feel—bold, experienced, and sophisticated.

- **Background**: `#111110` (Deepest Black)
- **Primary Text**: `#D6D7D3` (Light Grey/Soft White)
- **Secondary Text**: `#8D8878` (Muted Beige-grey)
- **Primary Buttons**: `#D9751A` (Orange) with a subtle glow effect
- **Secondary Buttons**: `#4D432F` (Deep Brown) with orange text
- **Card Backgrounds**: `#1F1001` (Darkest Brown/Black) or `#252527` (Deep Grey)
- **Code Snippets**: Dark background with vibrant orange accents

---

## 🔄 The Interaction (Transition)
- **The Toggle**: Since you have that beautiful animated theme toggle (Sun/Moon/Clouds/Stars), we will use the **vibrant peach (`#FD9F68`)** and **deep orange (`#A45711`)** as transition colors.
- **Glassmorphism**: Both modes will utilize transparency:
    - **Light**: Frosted glass using `#FFFFFF` at 60% opacity.
    - **Dark**: Dark glass using `#1F1001` at 70% opacity.

---

## 🛠️ UI Component Mapping

| Component | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- |
| **Navbar** | `#F3F1F9` (Blurry) | `#111110` (Blurry) |
| **Hero Title** | `#13100E` | `#F3F1F9` |
| **CTA Button** | `#D9751A` | `#D9751A` (Glow) |
| **Footer** | `#E3DDDB` | `#13100E` |
| **Link Hover** | `#A45711` | `#FD9F68` |

---

## Next Steps
1. **User Approval**: Do these mappings feel right for the "Professional & Experienced" vibe?
2. **Component Previews**: I can generate a mockup of a specific component (like the services configurator) in both modes.
3. **Palette Finalization**: Any adjustments to the specific hex codes extracted?
