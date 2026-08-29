# Theming

Components consume semantic CSS custom properties. Choices are `system`, `light`, `dark` and `high-contrast`.

The complete provisional palette and token roles are documented in `DESIGN_SYSTEM.md`. Dark mode is a separate composition rather than a global inversion; imagery is never filtered.

System mode has no `data-theme` and is resolved by `prefers-color-scheme` and `prefers-contrast`. Manual selection writes `casa_mar_theme`. SSR reads the same cookie and applies the root attribute before rendering, so server HTML and hydration agree. No localStorage or browser global is read during SSR. Forced colors remains browser-controlled. The palette is temporary.
