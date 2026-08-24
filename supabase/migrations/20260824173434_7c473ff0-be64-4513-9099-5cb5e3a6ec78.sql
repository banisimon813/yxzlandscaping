CREATE OR REPLACE FUNCTION public.claim_owner_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id = auth.uid();

  IF v_email IS DISTINCT FROM 'yxzlandscaping@gmail.com' THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_owner_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_owner_admin() TO authenticated;