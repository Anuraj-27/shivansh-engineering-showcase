-- Add category column to processing_line_products table
ALTER TABLE public.processing_line_products 
ADD COLUMN category TEXT NOT NULL DEFAULT 'slitting-line';

-- Create an index for faster category lookups
CREATE INDEX idx_processing_line_products_category ON public.processing_line_products(category);