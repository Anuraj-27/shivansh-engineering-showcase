// Fixed parameter structure - DO NOT MODIFY
export const FIXED_PARAMETERS = [
  { name: "Sheet Width", unit: "mm", key: "sheet_width" },
  { name: "Sheet Thickness", unit: "mm", key: "sheet_thickness" },
  { name: "Line Speed", unit: "mpm", key: "line_speed" },
  { name: "Coil Weight", unit: "kg", key: "coil_weight" },
] as const;

export interface FixedSpecificationData {
  sheet_width_min: number;
  sheet_width_max: number;
  sheet_thickness_min: number;
  sheet_thickness_max: number;
  line_speed_min: number;
  line_speed_max: number;
  coil_weight_min: number;
  coil_weight_max: number;
  material: string;
}

export const DEFAULT_SPECIFICATION_DATA: FixedSpecificationData = {
  sheet_width_min: 0,
  sheet_width_max: 0,
  sheet_thickness_min: 0,
  sheet_thickness_max: 0,
  line_speed_min: 0,
  line_speed_max: 0,
  coil_weight_min: 0,
  coil_weight_max: 0,
  material: "HR / CR / MS / Stainless Steel",
};
