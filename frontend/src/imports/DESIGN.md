# Design System Specification: Editorial Rawness

## 1. Overview & Creative North Star
**Creative North Star: "The Brutalist Gallery"**

This design system rejects the "template-ready" look of modern SaaS in favor of a high-end, editorial aesthetic. It is inspired by the intersection of physical print media and raw industrial materiality. The goal is to create a digital experience that feels "curated" rather than "built." 

We achieve this through **Intentional Asymmetry** and **Aggressive Whitespace**. By breaking the rigid 12-column grid and allowing elements to overlap or sit in unexpected gutters, we create a sense of bespoke craftsmanship. Every pixel must feel intentional, avoiding the generic "boxed-in" feel of standard UI components.

## 2. Colors & Materiality

The palette is anchored by high-contrast "International Orange" and deep "Midnight Grape," set against a warm, tactile off-white background.

### The Color Logic
- **Primary (`#a73a00` / `#ff5c00`):** Used sparingly for high-impact calls to action and signature accents.
- **Secondary (`#6d4ca8`):** Provides a sophisticated, intellectual depth to the palette.
- **Surface (`#fff8f4`):** Our "canvas." It is warm, mimicking premium uncoated paper stock.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through background color shifts. 
- A section transition is marked by moving from `surface` to `surface-container-low`.
- To highlight a module, use a subtle tonal shift rather than a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked materials. 
- **Base Layer:** `surface`
- **Component Layer:** `surface-container-low` or `surface-container`
- **Floating/Active Layer:** `surface-container-highest`

### Signature Textures: Glass & Gradients
To move beyond "flat" design, use **Glassmorphism** for floating navigation or overlays. Utilize `backdrop-blur: 12px` combined with a semi-transparent `surface-variant` (20-40% opacity). Main CTAs should feature a subtle linear gradient from `primary` to `primary-container` to give them a "lit from within" glow.

## 3. Typography: The Editorial Voice

Typography is the structural backbone of this system. It relies on the tension between bold, wide sans-serifs and delicate, technical mono-spaced fonts.

- **Display & Headlines (Space Grotesk / StabilGrotesk):** These are meant to be loud. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a "wall of text" impact.
- **Body (Work Sans):** Chosen for its neutrality and high legibility. Use `body-lg` (1rem) for standard reading.
- **Labels (Space Grotesk / Courier New):** Use mono-spaced technical labels for metadata, prices, or secondary tags to evoke the feeling of a manifest or raw material tag.

**Hierarchy Tip:** Convey authority by skipping sizes. Don't just go from 18px to 20px; jump from `body-md` (14px) directly to `headline-lg` (32px) to create visual drama.

## 4. Elevation & Depth

We eschew traditional "Drop Shadows" in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
- **Ambient Shadows:** If a floating element is required, shadows must be "Ambient."
    - Blur: `40px` to `80px`
    - Opacity: `4%` to `8%`
    - Color: Tinted with `on-surface` (never pure black).
- **The Ghost Border:** If accessibility requires a container edge, use the `outline-variant` token at **15% opacity**. 100% opaque borders are strictly forbidden.

## 5. Components

### Buttons
- **Primary:** Sharp `0px` corners. Background: `primary-container`. Text: `on-primary-container`. Padding: `spacing-4` (vertical) by `spacing-8` (horizontal).
- **Secondary:** Transparent background, `0px` corners, with a "Ghost Border" (15% opacity).
- **Interactions:** On hover, the primary button should shift to `primary` (the darker variant) with a `200ms` ease-out transition.

### Chips & Tags
- **Style:** Small, all-caps labels using `label-sm`.
- **Shape:** Strictly rectangular (`0px` radius).
- **Color:** `surface-container-high` with `on-surface-variant` text.

### Input Fields
- **Design:** Underline-only or subtle background fill (`surface-container-lowest`). 
- **State:** Error states use `error` color for the label and a 2px bottom-bar—never a full-box red border.

### Cards & Lists
- **The Divider Rule:** Strictly forbid horizontal divider lines. 
- **Separation:** Use `spacing-12` or `spacing-16` to let content breathe. If separation is visually required, use a subtle background shift to `surface-container-low`.

### Bespoke Component: The "Manifest" List
A list item layout where the title is `headline-sm` on the left, and metadata (Price/Category) is aligned to the far right in `label-md` (Mono-spaced). No borders—only a change in hover background to `surface-container`.

## 6. Do's and Don'ts

### Do:
- **Use "Uncomfortable" Whitespace:** Leave more room than you think you need. Whitespace is a luxury signal.
- **Embrace Sharp Edges:** Every corner is `0px`. Roundness suggests consumer-grade "softness"; we want professional-grade "precision."
- **Align to the Baseline:** Ensure typography across different columns aligns horizontally to maintain the editorial structure.

### Don't:
- **Don't use 1px Borders:** It breaks the "Gallery" aesthetic and makes the UI look like a standard dashboard.
- **Don't Center Everything:** High-end design lives in the asymmetrical. Push content to the edges; use 1/3 vs 2/3 layout splits.
- **Don't use Standard Shadows:** Avoid the "floating card" look of Material Design. We want the "stacked paper" look of a physical portfolio.