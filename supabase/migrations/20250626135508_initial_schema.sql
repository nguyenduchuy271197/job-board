/*
* Initial schema migration for Job Board MVP
* Creates the complete database schema with user management, job postings, applications, and messaging
* Includes RLS policies, enums, triggers, and storage configurations
*/

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enums for type safety and data consistency
create type user_role as enum ('candidate', 'employer', 'admin');
create type application_status as enum ('submitted', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn');
create type job_status as enum ('draft', 'published', 'paused', 'closed', 'expired');
create type employment_type as enum ('full_time', 'part_time', 'contract', 'internship', 'freelance');
create type experience_level as enum ('entry', 'junior', 'mid', 'senior', 'lead', 'executive');
create type message_status as enum ('sent', 'delivered', 'read');

-- Create users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'candidate',
  email text not null unique,
  full_name text,
  phone text,
  avatar_url text,
  location text,
  bio text,
  linkedin_url text,
  portfolio_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'User profiles extending Supabase auth users with role-based information';

-- Create companies table
create table public.companies (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  website text,
  logo_url text,
  industry text,
  location text,
  email text,
  verified boolean not null default false,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.companies is 'Company profiles and information for employers';

-- Create company_members table for employer-company relationship
create table public.company_members (
  id uuid not null default gen_random_uuid() primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(company_id, user_id)
);

comment on table public.company_members is 'Many-to-many relationship between employers and companies';

-- Create skills table
create table public.skills (
  id uuid not null default gen_random_uuid() primary key,
  name text not null unique,
  category text,
  description text,
  created_at timestamptz not null default now()
);

comment on table public.skills is 'Master list of skills that can be associated with users and jobs';

-- Create user_skills junction table
create table public.user_skills (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  proficiency_level integer check (proficiency_level between 1 and 5),
  years_experience integer,
  created_at timestamptz not null default now(),
  unique(user_id, skill_id)
);

comment on table public.user_skills is 'Skills associated with candidates including proficiency levels';

-- Create jobs table
create table public.jobs (
  id uuid not null default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  requirements text,
  salary_min integer,
  salary_max integer,
  currency text not null default 'VND',
  employment_type employment_type not null default 'full_time',
  experience_level experience_level not null default 'junior',
  location text,
  is_remote boolean not null default false,
  status job_status not null default 'draft',
  company_id uuid not null references public.companies(id) on delete cascade,
  created_by uuid references public.users(id) on delete set null,
  published_at timestamptz,
  application_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.jobs is 'Job postings created by employers with detailed requirements and benefits';

-- Create job_skills junction table
create table public.job_skills (
  id uuid not null default gen_random_uuid() primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  is_required boolean not null default false,
  created_at timestamptz not null default now(),
  unique(job_id, skill_id)
);

comment on table public.job_skills is 'Skills required or preferred for specific jobs';

-- Create applications table
create table public.applications (
  id uuid not null default gen_random_uuid() primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references public.users(id) on delete cascade,
  status application_status not null default 'submitted',
  cover_letter text,
  resume_url text,
  notes text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, candidate_id)
);

comment on table public.applications is 'Job applications submitted by candidates with status tracking';

-- Create saved_jobs table
create table public.saved_jobs (
  id uuid not null default gen_random_uuid() primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(job_id, user_id)
);

comment on table public.saved_jobs is 'Jobs bookmarked by candidates for later reference';

-- Create messages table for employer-candidate communication
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  sender_id uuid not null references public.users(id) on delete set null,
  recipient_id uuid not null references public.users(id) on delete set null,
  application_id uuid references public.applications(id) on delete set null,
  subject text,
  content text not null,
  status message_status not null default 'sent',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.messages is 'Direct messages between employers and candidates';

-- Create industries table
create table public.industries (
  id uuid not null default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.industries is 'Master list of industries for companies and job categorization';

-- Create locations table
create table public.locations (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  country text not null default 'Vietnam',
  province text,
  created_at timestamptz not null default now()
);

comment on table public.locations is 'Master list of locations for companies and jobs';

-- Create cvs table  
create table public.cvs (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  file_url text,
  file_name text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.cvs is 'CVs uploaded by candidates with primary CV designation';

-- Create performance indexes
create index idx_users_role on public.users using btree (role);
create index idx_users_email on public.users using btree (email);
create index idx_companies_slug on public.companies using btree (slug);
create index idx_company_members_company_user on public.company_members using btree (company_id, user_id);
create index idx_skills_name on public.skills using btree (name);
create index idx_user_skills_user_id on public.user_skills using btree (user_id);
create index idx_jobs_status on public.jobs using btree (status);
create index idx_jobs_company_id on public.jobs using btree (company_id);
create index idx_jobs_location on public.jobs using btree (location);
create index idx_jobs_employment_type on public.jobs using btree (employment_type);
create index idx_jobs_published_at on public.jobs using btree (published_at);
create index idx_job_skills_job_id on public.job_skills using btree (job_id);
create index idx_applications_job_id on public.applications using btree (job_id);
create index idx_applications_candidate_id on public.applications using btree (candidate_id);
create index idx_applications_status on public.applications using btree (status);
create index idx_saved_jobs_user_id on public.saved_jobs using btree (user_id);
create index idx_messages_sender_recipient on public.messages using btree (sender_id, recipient_id);
create index idx_messages_application_id on public.messages using btree (application_id);
create index idx_industries_slug on public.industries using btree (slug);
create index idx_locations_slug on public.locations using btree (slug);
create index idx_locations_country_province on public.locations using btree (country, province);
create index idx_cvs_user_id on public.cvs using btree (user_id);
create index idx_cvs_primary on public.cvs using btree (is_primary);

-- Helper functions to avoid infinite recursion in RLS policies
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role::text from public.users where id = user_id;
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select public.get_user_role(auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() = 'admin';
$$;

-- Helper function to check if user is company member (avoid recursion)
create or replace function public.is_company_member(company_uuid uuid, user_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.company_members 
    where company_id = company_uuid and user_id = user_uuid
  );
$$;

-- Helper function to check if user is company owner (avoid recursion)
create or replace function public.is_company_owner(company_uuid uuid, user_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.company_members 
    where company_id = company_uuid and user_id = user_uuid and is_primary = true
  );
$$;

-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.jobs enable row level security;
alter table public.job_skills enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.messages enable row level security;
alter table public.industries enable row level security;
alter table public.locations enable row level security;
alter table public.cvs enable row level security;

-- RLS Policies for users table
create policy "Users can view all public profiles" on public.users
  for select
  to authenticated, anon
  using (true);

create policy "Users can insert their own profile" on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users cannot delete profiles" on public.users
  for delete
  to authenticated
  using (false);

create policy "Admins can update all users" on public.users
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS Policies for companies table
create policy "Companies are viewable by everyone" on public.companies
  for select
  to authenticated, anon
  using (true);

create policy "Authenticated users can create companies" on public.companies
  for insert
  to authenticated
  with check (true);

create policy "Company members can update company" on public.companies
  for update
  to authenticated
  using (public.is_company_member(id, auth.uid()))
  with check (public.is_company_member(id, auth.uid()));

create policy "Company owners can delete company" on public.companies
  for delete
  to authenticated
  using (public.is_company_owner(id, auth.uid()));

create policy "Admins can manage all companies" on public.companies
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());



-- RLS Policies for company_members table
create policy "Company members can view company membership" on public.company_members
  for select
  to authenticated
  using (public.is_company_member(company_id, auth.uid()));

create policy "Company owners can add members" on public.company_members
  for insert
  to authenticated
  with check (public.is_company_owner(company_id, auth.uid()));

create policy "Company owners can update members" on public.company_members
  for update
  to authenticated
  using (public.is_company_owner(company_id, auth.uid()))
  with check (public.is_company_owner(company_id, auth.uid()));

create policy "Company owners can remove members" on public.company_members
  for delete
  to authenticated
  using (public.is_company_owner(company_id, auth.uid()));

-- RLS Policies for skills table
create policy "Skills are viewable by everyone" on public.skills
  for select
  to authenticated, anon
  using (true);

create policy "Only authenticated users can create skills" on public.skills
  for insert
  to authenticated
  with check (true);

create policy "Only authenticated users can update skills" on public.skills
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Skills cannot be deleted" on public.skills
  for delete
  to authenticated
  using (false);

-- RLS Policies for user_skills table
create policy "User skills are viewable by everyone" on public.user_skills
  for select
  to authenticated, anon
  using (true);

create policy "Users can add their own skills" on public.user_skills
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own skills" on public.user_skills
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own skills" on public.user_skills
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- RLS Policies for jobs table
create policy "Published jobs are viewable by everyone" on public.jobs
  for select
  to authenticated, anon
  using (status = 'published');

create policy "Company members can view all company jobs" on public.jobs
  for select
  to authenticated
  using (public.is_company_member(company_id, auth.uid()));

create policy "Company members can create jobs" on public.jobs
  for insert
  to authenticated
  with check (public.is_company_member(company_id, auth.uid()));

create policy "Company members can update jobs" on public.jobs
  for update
  to authenticated
  using (public.is_company_member(company_id, auth.uid()))
  with check (public.is_company_member(company_id, auth.uid()));

create policy "Company members can delete jobs" on public.jobs
  for delete
  to authenticated
  using (public.is_company_member(company_id, auth.uid()));

create policy "Admins can manage all jobs" on public.jobs
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS Policies for job_skills table
create policy "Job skills are viewable by everyone" on public.job_skills
  for select
  to authenticated, anon
  using (true);

create policy "Company members can manage job skills" on public.job_skills
  for all
  to authenticated
  using (
    exists(
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id, auth.uid())
    )
  )
  with check (
    exists(
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id, auth.uid())
    )
  );

-- RLS Policies for applications table
create policy "Applications are viewable by applicants and employers" on public.applications
  for select
  to authenticated
  using (
    candidate_id = auth.uid() or 
    exists(
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id, auth.uid())
    )
  );

create policy "Candidates can create applications" on public.applications
  for insert
  to authenticated
  with check (
    candidate_id = auth.uid() and
    public.current_user_role() = 'candidate'
  );

create policy "Employers can update application status" on public.applications
  for update
  to authenticated
  using (
    exists(
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id, auth.uid())
    )
  )
  with check (
    exists(
      select 1 from public.jobs j
      where j.id = job_id and public.is_company_member(j.company_id, auth.uid())
    )
  );

create policy "Candidates can update their own applications" on public.applications
  for update
  to authenticated
  using (candidate_id = auth.uid())
  with check (candidate_id = auth.uid());

-- RLS Policies for saved_jobs table
create policy "Users can view their own saved jobs" on public.saved_jobs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can save jobs" on public.saved_jobs
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can unsave jobs" on public.saved_jobs
  for delete
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for messages table
create policy "Users can view their own messages" on public.messages
  for select
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy "Users can send messages" on public.messages
  for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "Users can update their own messages" on public.messages
  for update
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid())
  with check (sender_id = auth.uid() or recipient_id = auth.uid());

-- RLS Policies for industries table
create policy "Industries are viewable by everyone" on public.industries
  for select
  to authenticated, anon
  using (true);

create policy "Only admins can manage industries" on public.industries
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS Policies for locations table
create policy "Locations are viewable by everyone" on public.locations
  for select
  to authenticated, anon
  using (true);

create policy "Only admins can manage locations" on public.locations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS Policies for cvs table
create policy "Users can view their own CVs" on public.cvs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Employers can view candidate CVs" on public.cvs
  for select
  to authenticated
  using (
    public.current_user_role() = 'employer' and
    exists(
      select 1 from public.applications a
      inner join public.jobs j on a.job_id = j.id
      where a.candidate_id = user_id and public.is_company_member(j.company_id, auth.uid())
    )
  );

create policy "Users can manage their own CVs" on public.cvs
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updated_at fields
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_companies_updated_at
  before update on public.companies
  for each row
  execute function public.handle_updated_at();

create trigger handle_jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.handle_updated_at();

create trigger handle_applications_updated_at
  before update on public.applications
  for each row
  execute function public.handle_updated_at();

create trigger handle_cvs_updated_at
  before update on public.cvs
  for each row
  execute function public.handle_updated_at();

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'role', 'candidate')::user_role
  );
  return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create function to automatically update application count on jobs
create or replace function public.update_job_application_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.jobs
    set application_count = application_count + 1
    where id = new.job_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.jobs
    set application_count = application_count - 1
    where id = old.job_id;
    return old;
  end if;
  return null;
end;
$$;

-- Create trigger for application count updates
create trigger update_job_application_count_trigger
  after insert or delete on public.applications
  for each row execute function public.update_job_application_count();

-- Create function to ensure only one primary CV per user
create or replace function public.enforce_single_primary_cv()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_primary = true then
    -- Set all other CVs for this user to non-primary
    update public.cvs
    set is_primary = false
    where user_id = new.user_id and id != new.id;
  end if;
  return new;
end;
$$;

-- Create trigger for primary CV enforcement
create trigger enforce_single_primary_cv_trigger
  before insert or update on public.cvs
  for each row execute function public.enforce_single_primary_cv();

-- Create storage buckets
insert into storage.buckets (id, name, public) 
values 
  ('avatars', 'avatars', true),
  ('company-logos', 'company-logos', true),
  ('cvs', 'cvs', false)
on conflict (id) do nothing;

-- Storage policies for avatars (public)
create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for company logos (public)
create policy "Company logos are publicly accessible" on storage.objects
  for select using (bucket_id = 'company-logos');

create policy "Company members can upload company logos" on storage.objects
  for insert with check (
    bucket_id = 'company-logos' and
    exists (
      select 1 from public.companies c
      where c.slug = (storage.foldername(name))[1] and public.is_company_member(c.id, auth.uid())
    )
  );

create policy "Company members can update company logos" on storage.objects
  for update using (
    bucket_id = 'company-logos' and
    exists (
      select 1 from public.companies c
      where c.slug = (storage.foldername(name))[1] and public.is_company_member(c.id, auth.uid())
    )
  );

create policy "Company members can delete company logos" on storage.objects
  for delete using (
    bucket_id = 'company-logos' and
    exists (
      select 1 from public.companies c
      where c.slug = (storage.foldername(name))[1] and public.is_company_member(c.id, auth.uid())
    )
  );

-- Storage policies for CVs (private)
create policy "Users can upload their own CVs" on storage.objects
  for insert with check (
    bucket_id = 'cvs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own CVs" on storage.objects
  for select using (
    bucket_id = 'cvs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Employers can view candidate CVs" on storage.objects
  for select using (
    bucket_id = 'cvs' and
    public.current_user_role() = 'employer' and
    exists (
      select 1 from public.applications a
      inner join public.jobs j on a.job_id = j.id
      where a.candidate_id = (storage.foldername(name))[1]::uuid
        and public.is_company_member(j.company_id, auth.uid())
    )
  );

create policy "Users can update their own CVs" on storage.objects
  for update using (
    bucket_id = 'cvs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own CVs" on storage.objects
  for delete using (
    bucket_id = 'cvs' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;
