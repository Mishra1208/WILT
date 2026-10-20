-- =============================================================================
-- WILT · Privacy lockdown (pilot-testing fix: "private user emails can be
-- accessed without login")
--
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run.
--
-- What it does
--   1. Wipes email / phone values already stored in the public profile table
--      (Clerk keeps the real contact details; the app no longer writes them).
--   2. Stops the public (anon) and logged-in (authenticated) API roles from
--      READING email / phone, the newsletter list, and bug reports.
--      Inserts keep working, so sign-ups and bug reports still save.
--   3. Adds a unique index on newsletter emails so duplicates are rejected
--      by the database instead of by a public read.
-- =============================================================================

-- 1. Scrub contact details from public profiles -------------------------------
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'email') then
    execute 'alter table public.user_profiles alter column email drop not null';
    execute 'update public.user_profiles set email = null where email is not null';
  end if;
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'phone') then
    execute 'alter table public.user_profiles alter column phone drop not null';
    execute 'update public.user_profiles set phone = null where phone is not null';
  end if;
end $$;

-- 2a. user_profiles: readable EXCEPT email / phone ------------------------------
-- Column-level grants: revoke table-wide SELECT, then re-grant every column
-- except the private ones.
revoke select on public.user_profiles from anon, authenticated;

do $$
declare
  cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
    into cols
  from information_schema.columns
  where table_schema = 'public'
    and table_name   = 'user_profiles'
    and column_name not in ('email', 'phone');

  execute format('grant select (%s) on public.user_profiles to anon, authenticated', cols);
end $$;

-- Writes still allowed for the app (profile upserts). The app never sends
-- email / phone, so no write privilege is needed on those columns either.
revoke insert, update on public.user_profiles from anon, authenticated;
do $$
declare
  cols text;
begin
  select string_agg(quote_ident(column_name), ', ')
    into cols
  from information_schema.columns
  where table_schema = 'public'
    and table_name   = 'user_profiles'
    and column_name not in ('email', 'phone');

  execute format('grant insert (%s), update (%s) on public.user_profiles to anon, authenticated', cols, cols);
end $$;

-- 2b. newsletter_subscribers: write-only from the browser ---------------------
revoke select, update, delete on public.newsletter_subscribers from anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;

-- 2c. bug_reports: write-only from the browser --------------------------------
revoke select, update, delete on public.bug_reports from anon, authenticated;
grant insert on public.bug_reports to anon, authenticated;

-- If Row Level Security is ON for these two tables, make sure an INSERT policy
-- exists (no SELECT policy is needed or wanted).
do $$
begin
  if (select relrowsecurity from pg_class where oid = 'public.newsletter_subscribers'::regclass) then
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'newsletter_subscribers' and cmd = 'INSERT') then
      execute 'create policy "public can subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true)';
    end if;
  end if;
  if (select relrowsecurity from pg_class where oid = 'public.bug_reports'::regclass) then
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bug_reports' and cmd = 'INSERT') then
      execute 'create policy "public can report bugs" on public.bug_reports for insert to anon, authenticated with check (true)';
    end if;
  end if;
end $$;

-- 3. One subscription per email ------------------------------------------------
-- Remove existing duplicates (keeps the earliest row), then enforce uniqueness.
delete from public.newsletter_subscribers a
using public.newsletter_subscribers b
where lower(a.email) = lower(b.email)
  and a.ctid > b.ctid;

create unique index if not exists newsletter_subscribers_email_unique
  on public.newsletter_subscribers (lower(email));

-- -----------------------------------------------------------------------------
-- Verify (run separately after the script). Both should FAIL with
-- "permission denied" when called with the publishable key:
--   GET /rest/v1/user_profiles?select=email
--   GET /rest/v1/newsletter_subscribers?select=email
-- And this should still work:
--   GET /rest/v1/user_profiles?select=username,xp
-- -----------------------------------------------------------------------------
