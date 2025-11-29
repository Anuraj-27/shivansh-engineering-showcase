-- Create owner_info table
CREATE TABLE public.owner_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  thought TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.owner_info ENABLE ROW LEVEL SECURITY;

-- Create policies for owner_info
CREATE POLICY "Admins can manage owner info" 
ON public.owner_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view owner info" 
ON public.owner_info 
FOR SELECT 
USING (true);

-- Create machinery_images table
CREATE TABLE public.machinery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.machinery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for machinery_images
CREATE POLICY "Admins can manage machinery images" 
ON public.machinery_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view machinery images" 
ON public.machinery_images 
FOR SELECT 
USING (true);