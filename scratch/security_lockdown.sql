begin;

alter table public.system_config enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

do $$
declare policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('system_config', 'orders', 'reviews')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

-- The storefront needs only this non-sensitive status record directly.
create policy "Public read storefront status"
  on public.system_config
  for select
  to anon, authenticated
  using (key = 'storefront_status');

-- Signed-in customers may read only their own orders. All writes go through
-- validated server actions using the service role.
create policy "Customers read own orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Reviews are submitted and read through server actions so private moderation
-- fields, including customer_email, never become directly queryable.

-- Secrets must never be stored in a client-readable configuration document.
update public.system_config
set value = value - 'razorpay_key_secret'
where key = 'payment_gateway_config';

commit;
