export const PROCESSING_LINE_CATEGORIES = [
  { slug: "slitting-line", name: "Slitting Line" },
  { slug: "cut-to-length-line", name: "Cut to Length Line" },
  { slug: "pickling-line", name: "Pickling Line" },
  { slug: "wetflux-galvanizing-line", name: "Wetflux Galvanizing Line" },
  { slug: "degreasing-cleaning-line", name: "Degreasing / Cleaning Line" },
  { slug: "annealing-line", name: "Annealing Line" },
  { slug: "tension-leveling-line", name: "Tension Leveling Line" },
  { slug: "color-coating-line", name: "Terminal Equipment for CCL" },
  { slug: "terminal-equipment-cgl", name: "Terminal Equipment for CGL" },
  { slug: "rewinding-line", name: "Rewinding Line" },
  { slug: "rolling-mill-terminal-equipments", name: "Terminal Equipment's Rolling Mill" },
  { slug: "coil-handling-equipments", name: "Coil Handling Equipment's" },
] as const;

export type ProcessingLineCategory = typeof PROCESSING_LINE_CATEGORIES[number]["slug"];

export const getCategoryName = (slug: string): string => {
  const category = PROCESSING_LINE_CATEGORIES.find((c) => c.slug === slug);
  return category?.name || slug;
};

export const getCategorySlug = (name: string): string => {
  const category = PROCESSING_LINE_CATEGORIES.find((c) => c.name === name);
  return category?.slug || name.toLowerCase().replace(/\s+/g, "-");
};
