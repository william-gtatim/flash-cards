create extension if not exists pgcrypto;

create table if not exists public.categories (
                                                 id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, name)
    );

create table if not exists public.tags (
                                           id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, name)
    );

create table if not exists public.flashcards (
                                                 id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    category_id uuid null references public.categories (id) on delete set null,
    front jsonb not null,
    back jsonb not null,
    is_archived boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
    );

create table if not exists public.flashcardcard_tags (
                                                         id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    card_id uuid not null references public.flashcards (id) on delete cascade,
    tag_id uuid not null references public.tags (id) on delete cascade,
    created_at timestamptz not null default now()
    );

create table if not exists public.flashcard_reviews (
                                                        id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    card_id uuid not null references public.flashcards (id) on delete cascade,
    reviewed_at timestamptz not null default now(),
    grade smallint not null check (grade between 1 and 4)
    );

create table if not exists public.flashcard_card_progress (
                                                              id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    card_id uuid not null references public.flashcards (id) on delete cascade,
    level smallint not null default 1 check (level between 1 and 4),
    last_grade smallint null check (last_grade is null or last_grade between 1 and 4),
    last_reviewed_at timestamptz null,
    next_due_at timestamptz null,
    correct_streak integer not null default 0 check (correct_streak >= 0),
    review_count integer not null default 0 check (review_count >= 0),
    updated_at timestamptz not null default now()
    );

create index if not exists idx_flashcards_user on public.flashcards (user_id);
create index if not exists idx_flashcards_user_category on public.flashcards (user_id, category_id);
create index if not exists idx_flashcards_archived on public.flashcards (user_id, is_archived);

create index if not exists idx_categories_user on public.categories (user_id);
create index if not exists idx_tags_user on public.tags (user_id);

create index if not exists idx_card_tags_user on public.flashcardcard_tags (user_id);
create index if not exists idx_card_tags_tag on public.flashcardcard_tags (tag_id);
create index if not exists idx_card_tags_card on public.flashcardcard_tags (card_id);

create index if not exists idx_reviews_user_card_time on public.flashcard_reviews (user_id, card_id, reviewed_at desc);
create index if not exists idx_progress_due on public.flashcard_card_progress (user_id, next_due_at);

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcardcard_tags enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.flashcard_card_progress enable row level security;

create policy flashcard_categories_insert_authenticated
on public.categories
for insert
to authenticated
with check (true);

create policy flashcard_categories_select_own
on public.categories
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcard_categories_update_own
on public.categories
for update
               to authenticated
               using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcard_categories_delete_own
on public.categories
for delete
to authenticated
using (user_id = auth.uid());

create policy flashcard_tags_insert_authenticated
on public.tags
for insert
to authenticated
with check (true);

create policy flashcard_tags_select_own
on public.tags
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcard_tags_update_own
on public.tags
for update
               to authenticated
               using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcard_tags_delete_own
on public.tags
for delete
to authenticated
using (user_id = auth.uid());

create policy flashcards_insert_authenticated
on public.flashcards
for insert
to authenticated
with check (true);

create policy flashcards_select_own
on public.flashcards
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcards_update_own
on public.flashcards
for update
               to authenticated
               using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcards_delete_own
on public.flashcards
for delete
to authenticated
using (user_id = auth.uid());

create policy flashcard_card_tags_insert_authenticated
on public.flashcardcard_tags
for insert
to authenticated
with check (true);

create policy flashcard_card_tags_select_own
on public.flashcardcard_tags
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcard_card_tags_delete_own
on public.flashcardcard_tags
for delete
to authenticated
using (user_id = auth.uid());

create policy flashcard_reviews_insert_authenticated
on public.flashcard_reviews
for insert
to authenticated
with check (true);

create policy flashcard_reviews_select_own
on public.flashcard_reviews
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcard_reviews_delete_own
on public.flashcard_reviews
for delete
to authenticated
using (user_id = auth.uid());

create policy flashcard_card_progress_insert_authenticated
on public.flashcard_card_progress
for insert
to authenticated
with check (true);

create policy flashcard_card_progress_select_own
on public.flashcard_card_progress
for select
                      to authenticated
                      using (user_id = auth.uid());

create policy flashcard_card_progress_update_own
on public.flashcard_card_progress
for update
               to authenticated
               using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy flashcard_card_progress_delete_own
on public.flashcard_card_progress
for delete
to authenticated
using (user_id = auth.uid());


alter table public.categories
    add column if not exists parent_id uuid null;

alter table public.categories
    add constraint categories_parent_fk
        foreign key (parent_id)
            references public.categories (id)
            on delete cascade;

create index if not exists idx_categories_parent
    on public.categories (parent_id);

create or replace function public.set_user_id_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
end if;

  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
return new;
end if;

  if tg_op = 'UPDATE' then
    new.user_id := old.user_id;
return new;
end if;

return new;
end;
$$;

create trigger trg_categories_user
    before insert or update on public.categories
                         for each row
                         execute function public.set_user_id_from_auth();

create trigger trg_tags_user
    before insert or update on public.tags
                         for each row
                         execute function public.set_user_id_from_auth();

create trigger trg_flashcards_user
    before insert or update on public.flashcards
                         for each row
                         execute function public.set_user_id_from_auth();

create trigger trg_flashcardcard_tags_user
    before insert or update on public.flashcardcard_tags
                         for each row
                         execute function public.set_user_id_from_auth();

create trigger trg_flashcard_reviews_user
    before insert or update on public.flashcard_reviews
                         for each row
                         execute function public.set_user_id_from_auth();

create trigger trg_flashcard_card_progress_user
    before insert or update on public.flashcard_card_progress
                         for each row
                         execute function public.set_user_id_from_auth();