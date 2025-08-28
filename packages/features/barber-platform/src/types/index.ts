import { Database } from '@kit/supabase/database';

export type Store = Database['public']['Tables']['stores']['Row'];
export type Workstation = Database['public']['Tables']['workstations']['Row'];
export type Barber = Database['public']['Tables']['barbers']['Row'];
export type Advertisement = Database['public']['Tables']['advertisements']['Row'];

export interface StoreWithStats extends Store {
  barber_count: number;
  workstation_count: number;
  monthly_revenue: number;
  rating: number;
  review_count: number;
}

export interface WorkstationWithUsage extends Workstation {
  utilization: number;
  bookings_count: number;
  revenue: number;
  current_barber?: string;
}

export interface BarberWithStats extends Barber {
  rating: number;
  review_count: number;
  total_bookings: number;
  total_earnings: number;
}

export interface AdvertisementWithMetrics extends Advertisement {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  spent: number;
}