CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role); $$;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "properties_admin_read" ON public.properties;
DROP POLICY IF EXISTS "properties_admin_insert" ON public.properties;
DROP POLICY IF EXISTS "properties_admin_update" ON public.properties;
DROP POLICY IF EXISTS "properties_admin_delete" ON public.properties;
DROP POLICY IF EXISTS "property_images_admin_all" ON public.property_images;
DROP POLICY IF EXISTS "leads_admin_read" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_delete" ON public.leads;
DROP POLICY IF EXISTS "property_images_storage_read" ON storage.objects;
DROP POLICY IF EXISTS "property_images_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "property_images_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "property_images_storage_delete" ON storage.objects;

CREATE POLICY "properties_admin_read" ON public.properties FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_insert" ON public.properties FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_update" ON public.properties FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_admin_delete" ON public.properties FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_admin_all" ON public.property_images FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads_admin_read" ON public.leads FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "property_images_storage_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'property-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_storage_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_storage_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'property-images' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "property_images_storage_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-images' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);