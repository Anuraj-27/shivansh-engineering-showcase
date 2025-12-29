-- Add unit column to processing_line_parameters table
ALTER TABLE public.processing_line_parameters
ADD COLUMN unit text NOT NULL DEFAULT 'mm';

-- Add unit column to equipment_parameters table
ALTER TABLE public.equipment_parameters
ADD COLUMN unit text NOT NULL DEFAULT 'mm';