---
name: Ethereal Comfort
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#534345'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#867274'
  outline-variant: '#d9c1c3'
  surface-tint: '#944555'
  primary: '#944555'
  on-primary: '#ffffff'
  primary-container: '#f191a1'
  on-primary-container: '#6f2838'
  inverse-primary: '#ffb2bd'
  secondary: '#575d78'
  on-secondary: '#ffffff'
  secondary-container: '#d8defe'
  on-secondary-container: '#5b617d'
  tertiary: '#605e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b0acac'
  on-tertiary-container: '#424040'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bd'
  on-primary-fixed: '#3e0214'
  on-primary-fixed-variant: '#772e3e'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#bfc5e4'
  on-secondary-fixed: '#141a32'
  on-secondary-fixed-variant: '#3f465f'
  tertiary-fixed: '#e6e1e1'
  tertiary-fixed-dim: '#cac5c6'
  on-tertiary-fixed: '#1c1b1c'
  on-tertiary-fixed-variant: '#484647'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  section-padding: 120px
  element-gap: 16px
---

## Brand & Style

This design system is built upon the philosophy of "Floral Minimalism." It targets a discerning audience that values the intersection of tactile comfort and sophisticated aesthetics. The brand personality is serene, confident, and intimately connected to the concept of self-care.

The visual style utilizes a **Soft-Modern Minimalism** approach. It avoids the coldness of traditional corporate minimalism by introducing organic warmth through color and subtle motion. The UI should evoke a sense of weightlessness, mirroring the feeling of premium innerwear against the skin. High-end editorial layouts, generous "breathing room," and a focus on high-fidelity photography are the pillars of this aesthetic.

## Colors

The palette is anchored by "Bloom Pink" (#F191A1), a soft, emotive hue used for primary actions and brand accents. To ensure a premium, grounded feel, "Midnight Navy" (#0A1128) is used exclusively for typography and structural elements, providing high contrast without the harshness of pure black.

White and high-key neutrals form the canvas of the design system, creating an expansive, airy atmosphere. Success, warning, and error states should be handled through desaturated versions of green and gold to maintain the soft-modern harmony, avoiding jarring neon tones.

## Typography

The typography strategy pairs the soft, contemporary curves of **Plus Jakarta Sans** for headlines with the refined, geometric precision of **Manrope** for functional text. 

Headlines should be set with generous leading and slight negative letter-spacing to create a "locked-in" editorial look. Display type utilizes a light weight (300) to emphasize the brand's delicate nature. Body text is prioritized for legibility and breathability, utilizing a 1.6 line-height to ensure a relaxed reading experience. The `label-caps` style is used for small metadata, navigation items, and overlines to provide a structural contrast to the fluid headlines.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop (12 columns) and a fluid model for mobile. The layout philosophy is "Centric and Airy," pushing content toward the center with significant outer margins to simulate the white space found in high-end fashion lookbooks.

Spacing follows an 8px linear scale, but large-scale components should lean into the higher end of the scale (e.g., 80px, 120px) to separate major content blocks. Vertical rhythm is essential; use whitespace as a functional tool to group related items rather than relying on lines or borders.

## Elevation & Depth

To maintain the soft-modern aesthetic, this design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Ambient Diffusion**. 

Surface elevations are achieved by layering the tertiary color (off-white) against pure white backgrounds. When shadows are necessary (such as for floating action buttons or elevated cards), use "Petal Shadows": extremely high-blur (40px+), low-opacity (4-6%) shadows tinted with the Midnight Navy or Bloom Pink to prevent a "dirty" gray appearance. Soft backdrop blurs (10px - 20px) are encouraged for navigation overlays to maintain a sense of translucent layering.

## Shapes

The shape language is "Organic-Geometric." Elements utilize a **Rounded** (0.5rem base) corner radius to soften the layout while maintaining a clean, modern structure. 

Buttons and interactive chips should feel tactile and inviting. For large image containers, a slightly more aggressive radius (`rounded-xl`) can be used to mimic the softness of fabric. Circles are reserved for specific brand elements, like color swatches or profile avatars, to provide a rhythmic counterpoint to the rectangular grid.

## Components

**Buttons:** 
Primary buttons are solid "Bloom Pink" with white text, featuring a subtle scale-up animation on hover. Secondary buttons use a "Midnight Navy" ghost style (thin border) for a more grounded, sophisticated look.

**Input Fields:**
Fields are minimalist, featuring only a bottom border in a light neutral tone. Upon focus, the border transitions to Bloom Pink with a subtle floating label.

**Cards:**
Product cards should have no visible borders. They rely on the background color of the image and generous padding. The product name and price are centered below the image in a clean vertical stack.

**Chips:**
Used for sizes or filters, chips utilize a pill-shape with a light neutral background. The active state is indicated by a solid Midnight Navy fill, providing a clear, confident selection.

**Additional Components:**
*   **Progressive Image Loader:** A soft pink blurred placeholder that fades into the high-res product shot.
*   **Fabric Info Overlay:** A semi-transparent modal with high backdrop-blur used to detail the material compositions.