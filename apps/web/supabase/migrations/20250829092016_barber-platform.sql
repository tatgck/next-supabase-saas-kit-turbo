create type "public"."advertisement_platform" as enum ('web', 'mobile', 'all');

create type "public"."advertisement_priority" as enum ('low', 'medium', 'high', 'urgent');

create type "public"."advertisement_status" as enum ('active', 'paused', 'draft', 'expired');

create type "public"."advertisement_type" as enum ('banner', 'popup', 'video', 'text');

create type "public"."barber_invitation_status" as enum ('pending', 'accepted', 'expired', 'revoked');

create type "public"."store_status" as enum ('active', 'pending', 'inactive', 'maintenance');

create type "public"."support_ticket_status" as enum ('pending', 'in_progress', 'resolved', 'closed');

create type "public"."support_ticket_type" as enum ('complaint', 'inquiry', 'suggestion', 'technical');

create type "public"."workstation_status" as enum ('available', 'occupied', 'reserved', 'maintenance');

create type "public"."workstation_type" as enum ('standard', 'premium', 'vip');

create table "public"."advertisements" (
    "id" uuid not null default uuid_generate_v4(),
    "title" character varying(255) not null,
    "content" text not null,
    "type" advertisement_type not null,
    "platform" advertisement_platform not null default 'all'::advertisement_platform,
    "status" advertisement_status not null default 'draft'::advertisement_status,
    "priority" advertisement_priority default 'medium'::advertisement_priority,
    "budget" numeric(10,2) not null,
    "spent" numeric(10,2) default 0,
    "impressions" integer default 0,
    "clicks" integer default 0,
    "conversions" integer default 0,
    "start_date" date not null,
    "end_date" date not null,
    "target_audience" text,
    "image_url" character varying(1000),
    "created_by" uuid not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."advertisements" enable row level security;

create table "public"."barber_invitations" (
    "id" uuid not null default uuid_generate_v4(),
    "store_id" uuid not null,
    "email" character varying(320) not null,
    "name" character varying(255),
    "phone" character varying(20),
    "token" character varying(100) not null,
    "status" barber_invitation_status not null default 'pending'::barber_invitation_status,
    "expires_at" timestamp with time zone not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "accepted_at" timestamp with time zone
);


create table "public"."barbers" (
    "id" uuid not null default uuid_generate_v4(),
    "store_id" uuid,
    "name" character varying(255) not null,
    "phone" character varying(20),
    "email" character varying(320),
    "specialty" text[],
    "experience_years" integer,
    "rating" numeric(3,2) default 0,
    "review_count" integer default 0,
    "total_bookings" integer default 0,
    "total_earnings" numeric(10,2) default 0,
    "is_available" boolean default true,
    "avatar_url" character varying(1000),
    "description" text,
    "invitation_token" character varying(100),
    "invitation_expires_at" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."barbers" enable row level security;

create table "public"."stores" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255) not null,
    "owner_id" uuid not null,
    "address" text not null,
    "phone" character varying(20),
    "email" character varying(320),
    "status" store_status not null default 'pending'::store_status,
    "rating" numeric(3,2) default 0,
    "review_count" integer default 0,
    "monthly_revenue" numeric(10,2) default 0,
    "latitude" numeric(10,6),
    "longitude" numeric(10,6),
    "business_hours" jsonb,
    "description" text,
    "image_url" character varying(1000),
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "created_by" uuid,
    "updated_by" uuid
);


alter table "public"."stores" enable row level security;

create table "public"."support_tickets" (
    "id" uuid not null default uuid_generate_v4(),
    "type" support_ticket_type not null,
    "subject" character varying(255) not null,
    "content" text not null,
    "user_id" uuid not null,
    "user_email" character varying(320) not null,
    "status" support_ticket_status not null default 'pending'::support_ticket_status,
    "priority" advertisement_priority default 'medium'::advertisement_priority,
    "assigned_to" uuid,
    "tags" text[],
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "resolved_at" timestamp with time zone
);


alter table "public"."support_tickets" enable row level security;

create table "public"."workstations" (
    "id" uuid not null default uuid_generate_v4(),
    "store_id" uuid not null,
    "number" character varying(20) not null,
    "type" workstation_type not null default 'standard'::workstation_type,
    "status" workstation_status not null default 'available'::workstation_status,
    "hourly_rate" numeric(8,2) not null,
    "daily_rate" numeric(8,2) not null,
    "equipment" text[],
    "current_barber_id" uuid,
    "utilization" integer default 0,
    "bookings_count" integer default 0,
    "revenue" numeric(10,2) default 0,
    "last_used" timestamp with time zone,
    "next_booking" timestamp with time zone,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."workstations" enable row level security;

CREATE UNIQUE INDEX advertisements_pkey ON public.advertisements USING btree (id);

CREATE UNIQUE INDEX barber_invitations_pkey ON public.barber_invitations USING btree (id);

CREATE UNIQUE INDEX barber_invitations_token_key ON public.barber_invitations USING btree (token);

CREATE UNIQUE INDEX barbers_pkey ON public.barbers USING btree (id);

CREATE INDEX idx_advertisements_created_by ON public.advertisements USING btree (created_by);

CREATE INDEX idx_advertisements_status ON public.advertisements USING btree (status);

CREATE INDEX idx_barber_invitations_email ON public.barber_invitations USING btree (email);

CREATE INDEX idx_barber_invitations_status ON public.barber_invitations USING btree (status);

CREATE INDEX idx_barber_invitations_token ON public.barber_invitations USING btree (token);

CREATE INDEX idx_barbers_invitation_token ON public.barbers USING btree (invitation_token);

CREATE INDEX idx_barbers_store_id ON public.barbers USING btree (store_id);

CREATE INDEX idx_stores_owner_id ON public.stores USING btree (owner_id);

CREATE INDEX idx_stores_status ON public.stores USING btree (status);

CREATE INDEX idx_support_tickets_status ON public.support_tickets USING btree (status);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets USING btree (user_id);

CREATE INDEX idx_workstations_status ON public.workstations USING btree (status);

CREATE INDEX idx_workstations_store_id ON public.workstations USING btree (store_id);

CREATE UNIQUE INDEX stores_pkey ON public.stores USING btree (id);

CREATE UNIQUE INDEX support_tickets_pkey ON public.support_tickets USING btree (id);

CREATE UNIQUE INDEX workstations_pkey ON public.workstations USING btree (id);

alter table "public"."advertisements" add constraint "advertisements_pkey" PRIMARY KEY using index "advertisements_pkey";

alter table "public"."barber_invitations" add constraint "barber_invitations_pkey" PRIMARY KEY using index "barber_invitations_pkey";

alter table "public"."barbers" add constraint "barbers_pkey" PRIMARY KEY using index "barbers_pkey";

alter table "public"."stores" add constraint "stores_pkey" PRIMARY KEY using index "stores_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."workstations" add constraint "workstations_pkey" PRIMARY KEY using index "workstations_pkey";

alter table "public"."advertisements" add constraint "advertisements_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."advertisements" validate constraint "advertisements_created_by_fkey";

alter table "public"."barber_invitations" add constraint "barber_invitations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."barber_invitations" validate constraint "barber_invitations_created_by_fkey";

alter table "public"."barber_invitations" add constraint "barber_invitations_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE not valid;

alter table "public"."barber_invitations" validate constraint "barber_invitations_store_id_fkey";

alter table "public"."barber_invitations" add constraint "barber_invitations_token_key" UNIQUE using index "barber_invitations_token_key";

alter table "public"."barbers" add constraint "barbers_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE not valid;

alter table "public"."barbers" validate constraint "barbers_store_id_fkey";

alter table "public"."stores" add constraint "stores_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."stores" validate constraint "stores_created_by_fkey";

alter table "public"."stores" add constraint "stores_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."stores" validate constraint "stores_owner_id_fkey";

alter table "public"."stores" add constraint "stores_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."stores" validate constraint "stores_updated_by_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_assigned_to_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."workstations" add constraint "workstations_current_barber_id_fkey" FOREIGN KEY (current_barber_id) REFERENCES auth.users(id) not valid;

alter table "public"."workstations" validate constraint "workstations_current_barber_id_fkey";

alter table "public"."workstations" add constraint "workstations_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE not valid;

alter table "public"."workstations" validate constraint "workstations_store_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$function$
;

grant delete on table "public"."advertisements" to "anon";

grant insert on table "public"."advertisements" to "anon";

grant references on table "public"."advertisements" to "anon";

grant select on table "public"."advertisements" to "anon";

grant trigger on table "public"."advertisements" to "anon";

grant truncate on table "public"."advertisements" to "anon";

grant update on table "public"."advertisements" to "anon";

grant delete on table "public"."advertisements" to "authenticated";

grant insert on table "public"."advertisements" to "authenticated";

grant references on table "public"."advertisements" to "authenticated";

grant select on table "public"."advertisements" to "authenticated";

grant trigger on table "public"."advertisements" to "authenticated";

grant truncate on table "public"."advertisements" to "authenticated";

grant update on table "public"."advertisements" to "authenticated";

grant delete on table "public"."advertisements" to "service_role";

grant insert on table "public"."advertisements" to "service_role";

grant references on table "public"."advertisements" to "service_role";

grant select on table "public"."advertisements" to "service_role";

grant trigger on table "public"."advertisements" to "service_role";

grant truncate on table "public"."advertisements" to "service_role";

grant update on table "public"."advertisements" to "service_role";

grant delete on table "public"."barber_invitations" to "anon";

grant insert on table "public"."barber_invitations" to "anon";

grant references on table "public"."barber_invitations" to "anon";

grant select on table "public"."barber_invitations" to "anon";

grant trigger on table "public"."barber_invitations" to "anon";

grant truncate on table "public"."barber_invitations" to "anon";

grant update on table "public"."barber_invitations" to "anon";

grant delete on table "public"."barber_invitations" to "authenticated";

grant insert on table "public"."barber_invitations" to "authenticated";

grant references on table "public"."barber_invitations" to "authenticated";

grant select on table "public"."barber_invitations" to "authenticated";

grant trigger on table "public"."barber_invitations" to "authenticated";

grant truncate on table "public"."barber_invitations" to "authenticated";

grant update on table "public"."barber_invitations" to "authenticated";

grant delete on table "public"."barber_invitations" to "service_role";

grant insert on table "public"."barber_invitations" to "service_role";

grant references on table "public"."barber_invitations" to "service_role";

grant select on table "public"."barber_invitations" to "service_role";

grant trigger on table "public"."barber_invitations" to "service_role";

grant truncate on table "public"."barber_invitations" to "service_role";

grant update on table "public"."barber_invitations" to "service_role";

grant delete on table "public"."barbers" to "anon";

grant insert on table "public"."barbers" to "anon";

grant references on table "public"."barbers" to "anon";

grant select on table "public"."barbers" to "anon";

grant trigger on table "public"."barbers" to "anon";

grant truncate on table "public"."barbers" to "anon";

grant update on table "public"."barbers" to "anon";

grant delete on table "public"."barbers" to "authenticated";

grant insert on table "public"."barbers" to "authenticated";

grant references on table "public"."barbers" to "authenticated";

grant select on table "public"."barbers" to "authenticated";

grant trigger on table "public"."barbers" to "authenticated";

grant truncate on table "public"."barbers" to "authenticated";

grant update on table "public"."barbers" to "authenticated";

grant delete on table "public"."barbers" to "service_role";

grant insert on table "public"."barbers" to "service_role";

grant references on table "public"."barbers" to "service_role";

grant select on table "public"."barbers" to "service_role";

grant trigger on table "public"."barbers" to "service_role";

grant truncate on table "public"."barbers" to "service_role";

grant update on table "public"."barbers" to "service_role";

grant delete on table "public"."stores" to "anon";

grant insert on table "public"."stores" to "anon";

grant references on table "public"."stores" to "anon";

grant select on table "public"."stores" to "anon";

grant trigger on table "public"."stores" to "anon";

grant truncate on table "public"."stores" to "anon";

grant update on table "public"."stores" to "anon";

grant delete on table "public"."stores" to "authenticated";

grant insert on table "public"."stores" to "authenticated";

grant references on table "public"."stores" to "authenticated";

grant select on table "public"."stores" to "authenticated";

grant trigger on table "public"."stores" to "authenticated";

grant truncate on table "public"."stores" to "authenticated";

grant update on table "public"."stores" to "authenticated";

grant delete on table "public"."stores" to "service_role";

grant insert on table "public"."stores" to "service_role";

grant references on table "public"."stores" to "service_role";

grant select on table "public"."stores" to "service_role";

grant trigger on table "public"."stores" to "service_role";

grant truncate on table "public"."stores" to "service_role";

grant update on table "public"."stores" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."workstations" to "anon";

grant insert on table "public"."workstations" to "anon";

grant references on table "public"."workstations" to "anon";

grant select on table "public"."workstations" to "anon";

grant trigger on table "public"."workstations" to "anon";

grant truncate on table "public"."workstations" to "anon";

grant update on table "public"."workstations" to "anon";

grant delete on table "public"."workstations" to "authenticated";

grant insert on table "public"."workstations" to "authenticated";

grant references on table "public"."workstations" to "authenticated";

grant select on table "public"."workstations" to "authenticated";

grant trigger on table "public"."workstations" to "authenticated";

grant truncate on table "public"."workstations" to "authenticated";

grant update on table "public"."workstations" to "authenticated";

grant delete on table "public"."workstations" to "service_role";

grant insert on table "public"."workstations" to "service_role";

grant references on table "public"."workstations" to "service_role";

grant select on table "public"."workstations" to "service_role";

grant trigger on table "public"."workstations" to "service_role";

grant truncate on table "public"."workstations" to "service_role";

grant update on table "public"."workstations" to "service_role";

create policy "advertisements_manage"
on "public"."advertisements"
as permissive
for all
to authenticated
using ((created_by = auth.uid()));


create policy "advertisements_read"
on "public"."advertisements"
as permissive
for select
to authenticated
using (true);


create policy "barber_invitations_manage"
on "public"."barber_invitations"
as permissive
for all
to authenticated
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM stores
  WHERE ((stores.id = barber_invitations.store_id) AND (stores.owner_id = auth.uid()))))));


create policy "barber_invitations_read"
on "public"."barber_invitations"
as permissive
for select
to authenticated
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM stores
  WHERE ((stores.id = barber_invitations.store_id) AND (stores.owner_id = auth.uid()))))));


create policy "barbers_manage"
on "public"."barbers"
as permissive
for all
to authenticated
using (((id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM stores
  WHERE ((stores.id = barbers.store_id) AND (stores.owner_id = auth.uid()))))));


create policy "barbers_read"
on "public"."barbers"
as permissive
for select
to authenticated
using (true);


create policy "stores_delete"
on "public"."stores"
as permissive
for delete
to authenticated
using ((auth.uid() = owner_id));


create policy "stores_insert"
on "public"."stores"
as permissive
for insert
to authenticated
with check ((auth.uid() = owner_id));


create policy "stores_read"
on "public"."stores"
as permissive
for select
to authenticated
using (true);


create policy "stores_update"
on "public"."stores"
as permissive
for update
to authenticated
using ((auth.uid() = owner_id));


create policy "support_tickets_insert"
on "public"."support_tickets"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "support_tickets_read"
on "public"."support_tickets"
as permissive
for select
to authenticated
using (((user_id = auth.uid()) OR (assigned_to = auth.uid())));


create policy "support_tickets_update"
on "public"."support_tickets"
as permissive
for update
to authenticated
using (((user_id = auth.uid()) OR (assigned_to = auth.uid())));


create policy "workstations_manage"
on "public"."workstations"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM stores
  WHERE ((stores.id = workstations.store_id) AND (stores.owner_id = auth.uid())))));


create policy "workstations_read"
on "public"."workstations"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON public.advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_barber_invitations_updated_at BEFORE UPDATE ON public.barber_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON public.barbers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_workstations_updated_at BEFORE UPDATE ON public.workstations FOR EACH ROW EXECUTE FUNCTION update_updated_at();


