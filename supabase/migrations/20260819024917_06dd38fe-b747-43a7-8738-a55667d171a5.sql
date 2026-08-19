-- Enums
CREATE TYPE public.property_type AS ENUM ('HOUSE','APARTMENT','LAND','LOT','FARM','FARMHOUSE','COMMERCIAL_ROOM','WAREHOUSE');
CREATE TYPE public.transaction_type AS ENUM ('SALE','RENT');
CREATE TYPE public.property_status AS ENUM ('DRAFT','PUBLISHED','SOLD','RENTED','UNAVAILABLE');
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name',''), COALESCE(NEW.email,''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE SEQUENCE public.property_code_seq START 1;
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code text NOT NULL UNIQUE DEFAULT ('IMV-' || lpad(nextval('public.property_code_seq')::text, 5, '0')),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  property_type public.property_type NOT NULL,
  transaction_type public.transaction_type NOT NULL,
  status public.property_status NOT NULL DEFAULT 'DRAFT',
  price numeric(14,2) NOT NULL DEFAULT 0,
  city text NOT NULL,
  neighborhood text NOT NULL DEFAULT '',
  address text,
  show_address boolean NOT NULL DEFAULT false,
  zip_code text,
  land_area numeric(12,2),
  built_area numeric(12,2),
  bedrooms integer,
  bathrooms integer,
  suites integer,
  parking_spaces integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT ON public.properties TO anon;
GRANT ALL ON public.properties TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.property_code_seq TO authenticated, service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_public_read" ON public.properties FOR SELECT TO anon, authenticated USING (status = 'PUBLISHED');
CREATE POLICY "properties_admin_read" ON public.properties FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_insert" ON public.properties FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_update" ON public.properties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_delete" ON public.properties FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX properties_status_idx ON public.properties (status);
CREATE INDEX properties_city_idx ON public.properties (city);

CREATE TABLE public.property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  path text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT SELECT ON public.property_images TO anon;
GRANT ALL ON public.property_images TO service_role;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_public_read" ON public.property_images FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.status = 'PUBLISHED'));
CREATE POLICY "property_images_admin_all" ON public.property_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX property_images_property_idx ON public.property_images (property_id);

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_admin_read" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "property_images_storage_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'property-images');
CREATE POLICY "property_images_storage_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_storage_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_storage_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.properties (slug, title, description, property_type, transaction_type, status, price, city, neighborhood, address, show_address, zip_code, land_area, built_area, bedrooms, bathrooms, suites, parking_spaces) VALUES
('casa-alto-paraiso-3-quartos', 'Casa com 3 quartos em Alto Paraíso', '[DADOS DE DESENVOLVIMENTO] Casa térrea com ampla área externa, ótima iluminação natural e quintal arborizado.', 'HOUSE', 'SALE', 'PUBLISHED', 750000, 'Alto Paraíso', 'Centro', 'Rua das Acácias, 120', true, '73770-000', 400, 180, 3, 2, 1, 2),
('apartamento-goiania-setor-bueno', 'Apartamento moderno no Setor Bueno', '[DADOS DE DESENVOLVIMENTO] Apartamento reformado, andar alto, com varanda gourmet e vista livre.', 'APARTMENT', 'SALE', 'PUBLISHED', 620000, 'Goiânia', 'Setor Bueno', 'Av. T-63, 900', false, '74230-100', NULL, 95, 3, 2, 1, 2),
('apartamento-aluguel-goiania-centro', 'Apartamento para alugar no Centro', '[DADOS DE DESENVOLVIMENTO] Apartamento mobiliado, próximo a comércio e transporte público.', 'APARTMENT', 'RENT', 'PUBLISHED', 2200, 'Goiânia', 'Centro', NULL, false, '74000-000', NULL, 62, 2, 1, 0, 1),
('lote-alto-paraiso-parque-das-aguas', 'Lote plano no Parque das Águas', '[DADOS DE DESENVOLVIMENTO] Lote plano, pronto para construir, em condomínio com infraestrutura completa.', 'LOT', 'SALE', 'PUBLISHED', 180000, 'Alto Paraíso', 'Parque das Águas', NULL, false, NULL, 360, NULL, NULL, NULL, NULL, NULL),
('chacara-alto-paraiso-nascente', 'Chácara com nascente e pomar', '[DADOS DE DESENVOLVIMENTO] Chácara com nascente própria, pomar formado e casa sede aconchegante.', 'FARMHOUSE', 'SALE', 'PUBLISHED', 1250000, 'Alto Paraíso', 'Zona Rural', NULL, false, NULL, 20000, 220, 4, 3, 2, 4),
('sala-comercial-goiania-marista', 'Sala comercial no Setor Marista', '[DADOS DE DESENVOLVIMENTO] Sala comercial em edifício corporativo, com recepção e estacionamento rotativo.', 'COMMERCIAL_ROOM', 'RENT', 'PUBLISHED', 3500, 'Goiânia', 'Setor Marista', 'Rua 1132, 55', true, '74180-150', NULL, 48, NULL, 1, NULL, 1),
('galpao-aparecida-industrial', 'Galpão logístico com pé-direito alto', '[DADOS DE DESENVOLVIMENTO] Galpão com docas, escritório interno e fácil acesso à rodovia.', 'WAREHOUSE', 'RENT', 'PUBLISHED', 18000, 'Aparecida de Goiânia', 'Distrito Industrial', NULL, false, NULL, 3000, 1200, NULL, 2, NULL, 10),
('fazenda-produtiva-pirenopolis', 'Fazenda produtiva com 120 hectares', '[DADOS DE DESENVOLVIMENTO] Fazenda com pastagem formada, curral, casa sede e boa disponibilidade de água.', 'FARM', 'SALE', 'DRAFT', 4800000, 'Pirenópolis', 'Zona Rural', NULL, false, NULL, 1200000, 320, 5, 4, 2, 6);

INSERT INTO public.property_images (property_id, path, is_primary, sort_order)
SELECT p.id, i.url, i.ord = 0, i.ord
FROM public.properties p
JOIN LATERAL (VALUES
  ('https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70', 0),
  ('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70', 1),
  ('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70', 2)
) AS i(url, ord) ON true;