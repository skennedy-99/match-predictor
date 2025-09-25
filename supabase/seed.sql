insert into public.users(name) values
  ('Stephen'),
  ('Sean'),
  ('Gerard'),
  ('Jack')
on conflict (name) do nothing;


