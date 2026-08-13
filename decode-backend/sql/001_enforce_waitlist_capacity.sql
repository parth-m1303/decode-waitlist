-- Run this once in the Supabase SQL editor for the Decode project.
-- It does NOT change the waitlist_users table schema/columns/data.
-- It adds a BEFORE INSERT trigger that enforces the 200-user cap
-- atomically, closing the race condition that a check-then-insert
-- from the Node API alone cannot fully prevent under concurrency.
--
-- How it works: pg_advisory_xact_lock takes a transaction-scoped lock
-- keyed by a constant string, so concurrent inserts are serialized
-- through this one checkpoint. Each transaction waits its turn,
-- re-counts after the previous one has committed, and only then
-- decides whether the waitlist is full. The lock is released
-- automatically when the transaction commits or rolls back.

create or replace function public.enforce_waitlist_capacity()
returns trigger
language plpgsql
as $$
begin
  perform pg_advisory_xact_lock(hashtext('waitlist_users_capacity'));

  if (select count(*) from public.waitlist_users) >= 200 then
    raise exception 'WAITLIST_FULL' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists waitlist_capacity_guard on public.waitlist_users;

create trigger waitlist_capacity_guard
before insert on public.waitlist_users
for each row
execute function public.enforce_waitlist_capacity();
