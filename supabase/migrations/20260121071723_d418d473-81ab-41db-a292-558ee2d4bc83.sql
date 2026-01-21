-- Drop the old parameters tables (we'll store fixed parameters directly on products/equipments)
DROP TABLE IF EXISTS processing_line_parameters;
DROP TABLE IF EXISTS equipment_parameters;

-- Add fixed parameter columns to processing_line_products
ALTER TABLE processing_line_products 
ADD COLUMN IF NOT EXISTS sheet_width_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_width_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_thickness_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_thickness_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS line_speed_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS line_speed_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS coil_weight_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS coil_weight_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT 'HR / CR / MS / Stainless Steel';

-- Add fixed parameter columns to equipments
ALTER TABLE equipments 
ADD COLUMN IF NOT EXISTS sheet_width_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_width_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_thickness_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS sheet_thickness_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS line_speed_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS line_speed_max numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS coil_weight_min numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS coil_weight_max numeric NOT NULL DEFAULT 0;

-- Drop the old material column from equipments (will be replaced with the new one)
ALTER TABLE equipments DROP COLUMN IF EXISTS material;
ALTER TABLE equipments ADD COLUMN material text NOT NULL DEFAULT 'HR / CR / MS / Stainless Steel';