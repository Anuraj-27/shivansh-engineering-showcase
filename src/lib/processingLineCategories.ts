export const PROCESSING_LINE_CATEGORIES = [
  { slug: "slitting-line", name: "Slitting Line" },
  { slug: "cut-to-length-line", name: "Cut to Length Line" },
  { slug: "pickling-line", name: "Pickling Line" },
  { slug: "wetflux-galvanizing-line", name: "Wetflux Galvanizing Line" },
  { slug: "degreasing-cleaning-line", name: "Degreasing / Cleaning Line" },
  { slug: "annealing-line", name: "Annealing Line" },
  { slug: "color-coating-line", name: "Color Coating Line" },
  { slug: "rewinding-line", name: "Rewinding Line" },
  { slug: "inspection-line", name: "Inspection Line" },
  { slug: "edge-preparation-line", name: "Edge Preparation Line" },
  { slug: "rolling-mill-terminal-equipments", name: "Rolling Mill Terminal Equipment's" },
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
