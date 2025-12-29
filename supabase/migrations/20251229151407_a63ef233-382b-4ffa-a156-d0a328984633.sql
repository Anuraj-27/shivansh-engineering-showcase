-- Create processing_line_products table
CREATE TABLE public.processing_line_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Product Name',
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create processing_line_parameters table for the supply range values
CREATE TABLE public.processing_line_parameters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.processing_line_products(id) ON DELETE CASCADE,
  parameter_name TEXT NOT NULL DEFAULT 'Parameter',
  min_value NUMERIC NOT NULL DEFAULT 0,
  max_value NUMERIC NOT NULL DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.processing_line_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_line_parameters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for processing_line_products
CREATE POLICY "Anyone can view processing line products"
ON public.processing_line_products
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage processing line products"
ON public.processing_line_products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for processing_line_parameters
CREATE POLICY "Anyone can view processing line parameters"
ON public.processing_line_parameters
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage processing line parameters"
ON public.processing_line_parameters
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_processing_line_products_updated_at
BEFORE UPDATE ON public.processing_line_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();