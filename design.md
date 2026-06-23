---
name: Kawaii Minimalist
colors:
  surface: '#e4fffa'
  surface-dim: '#b9e2dc'
  surface-bright: '#e4fffa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#d3fcf6'
  surface-container: '#cdf6f0'
  surface-container-high: '#c7f0eb'
  surface-container-highest: '#c2ebe5'
  on-surface: '#00201d'
  on-surface-variant: '#3c4948'
  inverse-surface: '#0d3633'
  inverse-on-surface: '#d0f9f3'
  outline: '#6c7a78'
  outline-variant: '#bbc9c7'
  surface-tint: '#006a66'
  primary: '#006a66'
  on-primary: '#ffffff'
  primary-container: '#00b4ad'
  on-primary-container: '#003f3c'
  inverse-primary: '#4edad3'
  secondary: '#78555e'
  on-secondary: '#ffffff'
  secondary-container: '#ffd1dc'
  on-secondary-container: '#7a5761'
  tertiary: '#576400'
  on-tertiary: '#ffffff'
  tertiary-container: '#98ab22'
  on-tertiary-container: '#343c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#70f7ef'
  primary-fixed-dim: '#4edad3'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#00504c'
  secondary-fixed: '#ffd9e2'
  secondary-fixed-dim: '#e7bbc6'
  on-secondary-fixed: '#2d141c'
  on-secondary-fixed-variant: '#5e3e47'
  tertiary-fixed: '#d8ed61'
  tertiary-fixed-dim: '#bcd147'
  on-tertiary-fixed: '#191e00'
  on-tertiary-fixed-variant: '#414b00'
  background: '#e4fffa'
  on-background: '#00201d'
  surface-variant: '#c2ebe5'
  soft-lilac: '#E6E6FA'
  mint-glaze: '#F0FFF0'
  cream-background: '#FFF8E9'
  strawberry-pop: '#FF6B6B'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system embodies a "Kawaii Minimalist" aesthetic, harmonizing the energetic, whimsical spirit of Korean stationery with the orderly precision of premium self-care retail. The brand personality is cheerful, approachable, and meticulously organized. 

The visual style is a hybrid of **Minimalism** and **Soft UI**. It utilizes expansive white space and a structured grid to maintain clarity, while injecting personality through soft pastels, playful rounded geometry, and subtle tactile effects. The goal is to evoke a sense of "organized joy"—where the interface feels as delightful and high-quality as a curated gift box.

## Colors

The palette is anchored by a vibrant Teal primary (inspired by clean beauty) and a soft Candy Pink secondary. These are supported by a curated selection of "stationery pastels" used for categorization and decorative accents.

- **Primary**: Used for high-priority actions and brand-led UI elements.
- **Secondary**: Applied to playful highlights, hover states, and "soft" interactive elements.
- **Neutral**: A deep forest green-black provides sophisticated contrast for text and iconography, moving away from harsh pure blacks.
- **Backgrounds**: The system uses an off-white cream base (`#FFF8E9`) to soften the visual impact compared to sterile white, enhancing the warm, friendly vibe.

## Typography

The typographic system pairs the soft, friendly curves of **Plus Jakarta Sans** for headings with the pragmatic, neutral legibility of **Work Sans** for functional text.

- **Headings**: Use a "tight" line-height and generous font weights to create impact and a playful sense of volume.
- **Body**: Prioritizes readability with slightly increased line-height for a breezy, breathable feel.
- **Labels**: Utilize slightly heavier weights and subtle letter-spacing for clear hierarchy in buttons and navigation.

## Layout & Spacing

The system follows a **Fixed-Fluid Grid** hybrid. On desktop, content is contained within a 1280px max-width, while smaller devices use fluid margins.

- **Grid Strategy**: A 12-column grid for desktop, 6-column for tablet, and 2-column for mobile product listings. 
- **Rhythm**: All spacing is derived from a 4px base unit. 
- **Negative Space**: Generous vertical margins (64px+) between sections are mandatory to maintain the "minimalist" aspect of the aesthetic, preventing the "vibrant" colors from becoming visually overwhelming.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Soft Ambient Shadows**. Instead of heavy dropshadows, the design uses "glow" style shadows that match the surface color or use a low-opacity neutral tint.

- **Surface Levels**: Cards sit on a Level 1 elevation with a very soft, diffused shadow (12px blur, 5% opacity).
- **Interactive Depth**: Hovering over elements should trigger a "lift" effect—the shadow becomes slightly larger and the element scales by 1-2% for a tactile, "squishy" feel.
- **Glassmorphism**: Use backdrop blurs (10px - 20px) specifically for navigation bars and product quick-view overlays to maintain context while keeping the interface feeling light and airy.

## Shapes

The shape language is consistently "Friendly Geometric." 

- **Containers**: Cards and primary sections use the `rounded-lg` (16px) setting to evoke a modern, approachable feel.
- **Interactive Elements**: Buttons and input fields use a consistent 8px radius.
- **Badges/Chips**: Always use a full "pill" shape (rounded-full) to contrast against the more structured rectangular cards.
- **Decorative Elements**: Occasional use of "squircle" shapes for icons or profile photos to add a unique Korean stationery flair.

## Components

### Buttons
Primary buttons are solid Teal with white text, featuring an 8px radius. Secondary buttons use a thick 2px border in the primary color with a transparent background. All buttons utilize a "bounce" transition on click.

### Product Cards
Clean, minimalist white cards with a subtle border in `#F0F0F0`. The image should be the hero, with typography left-aligned below. On hover, the image should slightly zoom, and an "Add to Cart" pill-shaped button should fade in.

### Chips & Badges
Small, high-contrast labels used for "New" or "Sale." Use the `secondary_color` (Pink) for discounts and the `tertiary_color` (Lime) for new arrivals to ensure they pop against the cream background.

### Input Fields
Soft white backgrounds with a subtle inset shadow to appear slightly recessed. When focused, the border transitions to the primary Teal with a soft glow.

### Cute Iconography
Icons should have a consistent 2px stroke width with rounded caps and joins. Avoid sharp corners. Use the neutral forest green for icons to maintain a sophisticated yet friendly look.