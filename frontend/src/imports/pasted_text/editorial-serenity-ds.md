# Design System Strategy: Editorial Serenity

## 1. Overview & Creative North Star

**Creative North Star: The Mindful Curator**
This design system moves away from the clinical, rigid grids of traditional healthcare software and toward a "Mindful Curator" aesthetic. It treats the therapist’s dashboard as a high-end editorial space—a sanctuary of calm and focus. By blending the scholarly authority of serif headlines with a modern, breathable interface, we create an environment that feels premium yet deeply human.

The system breaks the "template" look through **intentional asymmetry** and **tonal layering**. We avoid the boxed-in feeling of standard dashboards by using soft, organic corner radii and varying card heights that mimic the natural flow of a curated journal. Every element is designed to reduce cognitive load while maintaining an authoritative, professional presence.

---

## 2. Colors & Surface Philosophy

The palette is anchored in a sophisticated "Cream and Deep Blue" relationship, moving beyond the sterile whites of common UI.

### Color Tokens
- **Primary (`#125E8A`)**: Used for authoritative actions and key brand moments.
- **Secondary (`#537DA2`)**: Used for supportive elements and secondary information.
- **Tertiary (`#B8E6F4`)**: An additional accent color for highlights, badges, or decorative elements.
- **Neutral (`#FFFFFF`)**: A neutral base color for backgrounds, surfaces, and non-chromatic elements, serving as an active card background for maximum "pop".
- **Background/Surface (`#FAFBE6`)**: A warm, cream foundation that reduces eye strain.
- **On-Surface/Text (`#080705`)**: Near-black for high legibility without the harshness of pure black.

### The "No-Line" Rule
To maintain an premium, organic feel, **explicitly prohibit 1px solid borders** for sectioning. Boundaries must be defined through:
* **Tonal Shifts:** Placing a `surface-container-low` (`#F4F5E0`) section against the primary `surface` (`#FAFBE6`).
* **Subtle Depth:** Using the `surface-container-highest` (`#E3E4D0`) for the most critical interactive cards.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine papers.
1. **Base Layer:** `surface` (Cream background).
2. **Dashboard Shell:** `surface-container-low` (Provides a subtle structural shift).
3. **Active Cards:** `neutral_color_hex` (Pure white `#FFFFFF` for maximum "pop" and clarity).

### The "Glass & Gradient" Rule
Floating elements (like modals or sidebars) should utilize **Glassmorphism**. Use a semi-transparent version of `surface` with a `24px` backdrop-blur. For main CTAs, apply a subtle linear gradient from `primary` (`#00466A`) to `primary-container` (`#125E8A`) at a 135-degree angle to add "soul" and depth.

---

## 3. Typography

The typographic system pairs the intellectual, timeless feel of **Newsreader** (Serif) with the modern, functional clarity of **Manrope** (Sans-serif).

| Level | Token | Font | Size/Weight | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Newsreader | 3.5rem | High-level, welcoming hero text. |
| **Headline** | `headline-md` | Newsreader | 1.75rem | Section headers; provides "Editorial" authority. |
| **Title** | `title-md` | Manrope | 1.125rem / Bold | Actionable card titles or dashboard labels. |
| **Body** | `body-md` | Manrope | 0.875rem | Standard therapist notes and descriptions. |
| **Label** | `label-md` | Manrope | 0.75rem / Semi-bold | Metadata, timestamps, and micro-copy. |

*Director’s Note: Use `headline-sm` in Newsreader for titles within cards to maintain the sophisticated therapist-patient narrative.*

---

## 4. Elevation & Depth

We eschew traditional "box shadows" in favor of **Tonal Layering** and **Ambient Light**.

* **The Layering Principle:** Instead of a shadow, an inner card on a dashboard should be `neutral_color_hex` (#FFFFFF) sitting on a `surface-container-low` (#F4F5E0) background. This creates a soft, natural lift.
* **Ambient Shadows:** For floating action buttons or high-priority modals, use a shadow with a blur of `32px`, offset `Y: 8px`, and an opacity of `6%` using the `on-surface` color. This mimics natural sunlight.
* **The "Ghost Border":** If a container requires further definition (e.g., in a search input), use a `1px` border of `outline-variant` at **15% opacity**. Never use a 100% opaque border.
* **Backdrop Blur:** Use `20px - 30px` blur on `surface-variant` containers to create a "frosted glass" effect for navigation bars, allowing the cream background to softly bleed through.

---

## 5. Components

### Buttons
* **Primary:** `primary_color_hex` background with `on-primary` text. Maximum (`3`) roundedness. Use the signature gradient (Primary to Primary-Container).
* **Secondary:** `surface-container-high` background. No border. Soft and integrated.
* **Tertiary:** No background. `primary_color_hex` text weight set to Bold.

### Cards (The "Therapist Card")
* **Shape:** Maximum (`3`) roundedness.
* **Layout:** Forbid divider lines. Use `1.5rem` of vertical whitespace to separate patient info from action buttons.
* **Interactive State:** On hover, shift from `neutral_color_hex` to a subtle `tertiary-fixed` (`#BCEAF8`) tint.

### Inputs & Fields
* **Style:** Minimalist. No bottom line or heavy border. Use `surface-container-highest` as a soft background fill.
* **Focus:** Animate the `outline` token to a `2px` "Ghost Border" at 40% opacity.

### Chips (Filters/Status)
* **Visual:** Pill-shaped (`full` roundedness). Use `secondary-container` for active states and `surface-variant` for inactive.

---

## 6. Do’s and Don’ts

### Do
* **Use Whitespace as Structure:** Use the 8px grid but lean into larger gaps (24px, 32px) to create a "breathable" luxury feel. The overall spacing is compact (`2`).
* **Embrace Newsreader:** Use the serif font for more than just titles—use it for quotes or important patient insights to add weight and empathy.
* **Color-Coded Surfaces:** Use the `tertiary_color_hex` (Light Blue) range to highlight "positive" or "calm" data points in the dashboard.

### Don’t
* **No "Pure" Grey:** Never use `#808080`. All neutrals must be tinted with the `secondary_color_hex` (Blue) or `surface` (Cream) tones to maintain the organic warmth.
* **No Hard Dividers:** Never use a horizontal line to separate list items. Use a `4px` background shift or increased padding.
* **Avoid Tight Corners:** Never use the `0`, `1`, or `2` roundedness scale for primary UI containers. Stick to the `3` (Maximum) roundedness.

---

## 7. Roundedness Scale
* **Maximum (3):** Main dashboard cards, large containers, buttons, inputs.
* **Pill (`full`):** Chips, tags, search bars.