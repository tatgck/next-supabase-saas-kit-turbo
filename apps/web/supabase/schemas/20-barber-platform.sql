/*
 * -------------------------------------------------------
 * Section: Barber Platform
 * 理发平台专用表结构和枚举类型
 * -------------------------------------------------------
 */

-- 门店状态枚举
create type public.store_status as enum('active', 'pending', 'inactive', 'maintenance');

-- 工位状态枚举
create type public.workstation_status as enum('available', 'occupied', 'reserved', 'maintenance');

-- 工位类型枚举
create type public.workstation_type as enum('standard', 'premium', 'vip');

-- 广告类型枚举
create type public.advertisement_type as enum('banner', 'popup', 'video', 'text');

-- 广告平台枚举
create type public.advertisement_platform as enum('web', 'mobile', 'all');

-- 广告状态枚举
create type public.advertisement_status as enum('active', 'paused', 'draft', 'expired');

-- 广告优先级枚举
create type public.advertisement_priority as enum('low', 'medium', 'high', 'urgent');

-- 客服工单类型枚举
create type public.support_ticket_type as enum('complaint', 'inquiry', 'suggestion', 'technical');

-- 客服工单状态枚举
create type public.support_ticket_status as enum('pending', 'in_progress', 'resolved', 'closed');

-- 门店表
create table if not exists public.stores (
  id uuid default extensions.uuid_generate_v4() primary key,
  name varchar(255) not null,
  owner_id uuid references auth.users on delete cascade not null,
  address text not null,
  phone varchar(20),
  email varchar(320),
  status public.store_status default 'pending' not null,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  monthly_revenue numeric(10,2) default 0,
  latitude numeric(10,6),
  longitude numeric(10,6),
  business_hours jsonb,
  description text,
  image_url varchar(1000),
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  created_by uuid references auth.users,
  updated_by uuid references auth.users
);

-- 工位表
create table if not exists public.workstations (
  id uuid default extensions.uuid_generate_v4() primary key,
  store_id uuid references public.stores on delete cascade not null,
  number varchar(20) not null,
  type public.workstation_type default 'standard' not null,
  status public.workstation_status default 'available' not null,
  hourly_rate numeric(8,2) not null,
  daily_rate numeric(8,2) not null,
  discount_percentage numeric(5,2) default 0,
  is_discount_active boolean default false not null,
  discount_start_date timestamptz,
  discount_end_date timestamptz,
  is_shared boolean default false not null,
  shared_start_date timestamptz,
  shared_end_date timestamptz,
  equipment text[],
  current_barber_id uuid references public.barbers(id),
  utilization integer default 0,
  bookings_count integer default 0,
  revenue numeric(10,2) default 0,
  last_used timestamptz,
  next_booking timestamptz,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

-- 工位可预约时间段表
create table if not exists public.workstation_booking_slots (
  id uuid default extensions.uuid_generate_v4() primary key,
  workstation_id uuid references public.workstations on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sunday, 6=Saturday
  start_time time not null,
  end_time time not null,
  max_bookings integer default 1,
  is_active boolean default true not null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  constraint valid_time_range check (start_time < end_time)
);

-- 工位预约表
create table if not exists public.workstation_bookings (
  id uuid default extensions.uuid_generate_v4() primary key,
  workstation_id uuid references public.workstations on delete cascade not null,
  barber_id uuid references auth.users not null,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  status public.workstation_status default 'reserved' not null,
  total_amount numeric(8,2) not null,
  notes text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  constraint valid_booking_time check (start_time < end_time)
);

-- 理发师邀请状态枚举
create type public.barber_invitation_status as enum('pending', 'accepted', 'expired', 'revoked');

-- 理发师表
create table if not exists public.barbers (
  id uuid default extensions.uuid_generate_v4() primary key,
  store_id uuid references public.stores on delete cascade,
  name varchar(255) not null,
  phone varchar(20),
  email varchar(320),
  specialty text[],
  experience_years integer,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  total_bookings integer default 0,
  total_earnings numeric(10,2) default 0,
  is_available boolean default true,
  avatar_url varchar(1000),
  description text,
  invitation_token varchar(100),
  invitation_expires_at timestamptz,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

-- 理发师邀请表
create table if not exists public.barber_invitations (
  id uuid default extensions.uuid_generate_v4() primary key,
  store_id uuid references public.stores on delete cascade not null,
  email varchar(320) not null,
  name varchar(255),
  phone varchar(20),
  token varchar(100) not null unique,
  status public.barber_invitation_status default 'pending' not null,
  expires_at timestamptz not null,
  created_by uuid references auth.users not null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  accepted_at timestamptz
);

-- 广告表
create table if not exists public.advertisements (
  id uuid default extensions.uuid_generate_v4() primary key,
  title varchar(255) not null,
  content text not null,
  type public.advertisement_type not null,
  platform public.advertisement_platform default 'all' not null,
  status public.advertisement_status default 'draft' not null,
  priority public.advertisement_priority default 'medium',
  budget numeric(10,2) not null,
  spent numeric(10,2) default 0,
  impressions integer default 0,
  clicks integer default 0,
  conversions integer default 0,
  start_date date not null,
  end_date date not null,
  target_audience text,
  image_url varchar(1000),
  created_by uuid references auth.users not null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

-- 客服工单表
create table if not exists public.support_tickets (
  id uuid default extensions.uuid_generate_v4() primary key,
  type public.support_ticket_type not null,
  subject varchar(255) not null,
  content text not null,
  user_id uuid references auth.users not null,
  user_email varchar(320) not null,
  status public.support_ticket_status default 'pending' not null,
  priority public.advertisement_priority default 'medium',
  assigned_to uuid references auth.users,
  tags text[],
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  resolved_at timestamptz
);

-- 启用RLS
alter table public.stores enable row level security;
alter table public.workstations enable row level security;
alter table public.barbers enable row level security;
alter table public.advertisements enable row level security;
alter table public.support_tickets enable row level security;

-- 门店RLS策略
create policy "stores_read" on public.stores for select to authenticated using (true);
create policy "stores_insert" on public.stores for insert to authenticated with check (auth.uid() = owner_id);
create policy "stores_update" on public.stores for update to authenticated using (auth.uid() = owner_id);
create policy "stores_delete" on public.stores for delete to authenticated using (auth.uid() = owner_id);

-- 允许服务角色（管理员）完全访问门店
create policy "stores_service_role_full_access" on public.stores for all to service_role using (true);

-- 工位RLS策略
create policy "workstations_read" on public.workstations for select to authenticated using (true);
create policy "workstations_manage" on public.workstations for all to authenticated
  using (exists (select 1 from public.stores where id = store_id and owner_id = auth.uid()));

-- 允许超级管理员完全访问工位
create policy "workstations_super_admin_full_access" on public.workstations for all to authenticated
  using (public.is_super_admin());

-- 工位可预约时间段RLS策略
create policy "workstation_booking_slots_read" on public.workstation_booking_slots for select to authenticated using (true);
create policy "workstation_booking_slots_manage" on public.workstation_booking_slots for all to authenticated 
  using (exists (select 1 from public.workstations w join public.stores s on w.store_id = s.id where w.id = workstation_id and s.owner_id = auth.uid()));

-- 工位预约RLS策略
create policy "workstation_bookings_read" on public.workstation_bookings for select to authenticated 
  using (barber_id = auth.uid() or exists (select 1 from public.workstations w join public.stores s on w.store_id = s.id where w.id = workstation_id and s.owner_id = auth.uid()));
create policy "workstation_bookings_insert" on public.workstation_bookings for insert to authenticated 
  with check (barber_id = auth.uid());
create policy "workstation_bookings_update" on public.workstation_bookings for update to authenticated 
  using (barber_id = auth.uid() or exists (select 1 from public.workstations w join public.stores s on w.store_id = s.id where w.id = workstation_id and s.owner_id = auth.uid()));

-- 理发师RLS策略
create policy "barbers_read" on public.barbers for select to authenticated using (true);
create policy "barbers_manage" on public.barbers for all to authenticated 
  using (id = auth.uid() or exists (select 1 from public.stores where id = store_id and owner_id = auth.uid()));

-- 允许服务角色（管理员）完全访问
create policy "barbers_service_role_full_access" on public.barbers for all to service_role using (true);

-- 理发师邀请RLS策略
create policy "barber_invitations_read" on public.barber_invitations for select to authenticated 
  using (created_by = auth.uid() or exists (select 1 from public.stores where id = store_id and owner_id = auth.uid()));
create policy "barber_invitations_manage" on public.barber_invitations for all to authenticated 
  using (created_by = auth.uid() or exists (select 1 from public.stores where id = store_id and owner_id = auth.uid()));

-- 广告RLS策略
create policy "advertisements_read" on public.advertisements for select to authenticated using (true);
create policy "advertisements_manage" on public.advertisements for all to authenticated using (created_by = auth.uid());

-- 客服工单RLS策略
create policy "support_tickets_read" on public.support_tickets for select to authenticated 
  using (user_id = auth.uid() or assigned_to = auth.uid());
create policy "support_tickets_insert" on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
create policy "support_tickets_update" on public.support_tickets for update to authenticated 
  using (user_id = auth.uid() or assigned_to = auth.uid());

-- 创建索引
create index idx_stores_owner_id on public.stores(owner_id);
create index idx_stores_status on public.stores(status);
create index idx_workstations_store_id on public.workstations(store_id);
create index idx_workstations_status on public.workstations(status);
create index idx_workstations_is_shared on public.workstations(is_shared);
create index idx_workstation_booking_slots_workstation_id on public.workstation_booking_slots(workstation_id);
create index idx_workstation_booking_slots_day_of_week on public.workstation_booking_slots(day_of_week);
create index idx_workstation_bookings_workstation_id on public.workstation_bookings(workstation_id);
create index idx_workstation_bookings_barber_id on public.workstation_bookings(barber_id);
create index idx_workstation_bookings_booking_date on public.workstation_bookings(booking_date);
create index idx_barbers_store_id on public.barbers(store_id);
create index idx_barbers_invitation_token on public.barbers(invitation_token);
create index idx_barber_invitations_token on public.barber_invitations(token);
create index idx_barber_invitations_email on public.barber_invitations(email);
create index idx_barber_invitations_status on public.barber_invitations(status);
create index idx_advertisements_created_by on public.advertisements(created_by);
create index idx_advertisements_status on public.advertisements(status);
create index idx_support_tickets_user_id on public.support_tickets(user_id);
create index idx_support_tickets_status on public.support_tickets(status);

-- 更新触发器函数
create or replace function public.update_updated_at() returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

-- 创建更新触发器
create trigger update_stores_updated_at before update on public.stores
  for each row execute function public.update_updated_at();

create trigger update_workstations_updated_at before update on public.workstations
  for each row execute function public.update_updated_at();

create trigger update_workstation_booking_slots_updated_at before update on public.workstation_booking_slots
  for each row execute function public.update_updated_at();

create trigger update_workstation_bookings_updated_at before update on public.workstation_bookings
  for each row execute function public.update_updated_at();

create trigger update_barbers_updated_at before update on public.barbers
  for each row execute function public.update_updated_at();

create trigger update_barber_invitations_updated_at before update on public.barber_invitations
  for each row execute function public.update_updated_at();

create trigger update_advertisements_updated_at before update on public.advertisements
  for each row execute function public.update_updated_at();

create trigger update_support_tickets_updated_at before update on public.support_tickets
  for each row execute function public.update_updated_at();