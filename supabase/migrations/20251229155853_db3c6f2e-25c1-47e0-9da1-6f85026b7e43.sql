-- Create equipments table
CREATE TABLE public.equipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Equipment Name',
  image_url TEXT,
  material TEXT NOT NULL DEFAULT '0',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment parameters table
CREATE TABLE public.equipment_parameters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
  parameter_name TEXT NOT NULL DEFAULT 'Parameter',
  min_value NUMERIC NOT NULL DEFAULT 0,
  max_value NUMERIC NOT NULL DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_parameters ENABLE ROW LEVEL SECURITY;

-- RLS policies for equipments
CREATE POLICY "Anyone can view equipments" 
ON public.equipments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage equipments" 
ON public.equipments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS policies for equipment parameters
CREATE POLICY "Anyone can view equipment parameters" 
ON public.equipment_parameters 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage equipment parameters" 
ON public.equipment_parameters 
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_equipments_updated_at
BEFORE UPDATE ON public.equipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();