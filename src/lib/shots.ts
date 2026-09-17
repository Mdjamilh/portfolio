import type { ImageMetadata } from "astro";

/** Screenshots live in src/assets/shots/<repository>.png; a project without one simply shows none. */
const files = import.meta.glob<{ default: ImageMetadata }>("../assets/shots/*.png", { eager: true });

export function shotFor(slug: string): ImageMetadata | undefined {
  return files[`../assets/shots/${slug}.png`]?.default;
}
