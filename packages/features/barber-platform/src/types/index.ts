import { Database } from '@kit/supabase/database';

export type Store = Database['public']['Tables']['stores']['Row'];
export type Workstation = Database['public']['Tables']['workstations']['Row'];
export type Barber = Database['public']['Tables']['barbers']['Row'];
export type Advertisement = Database['public']['Tables']['advertisements']['Row'];

export interface StoreWithStats extends Omit<Store, 'rating' | 'review_count' | 'monthly_revenue'> {
  barber_count: number;
  workstation_count: number;
  monthly_revenue: number | null;
  rating: number | null;
  review_count: number | null;
}

export interface WorkstationWithUsage extends Omit<Workstation, 'utilization' | 'bookings_count' | 'revenue'> {
  utilization: number | null;
  bookings_count: number | null;
  revenue: number | null;
  current_barber?: string;
  store?: {
    name: string;
  };
  discount_percentage?: number;
  is_discount_active?: boolean;
  discount_start_date?: string;
  discount_end_date?: string;
  is_shared?: boolean;
  shared_start_date?: string;
  shared_end_date?: string;
}

export interface BarberWithStats extends Omit<Barber, 'rating' | 'review_count' | 'total_bookings' | 'total_earnings'> {
  rating: number | null;
  review_count: number | null;
  total_bookings: number | null;
  total_earnings: number | null;
}

export interface AdvertisementWithMetrics extends Advertisement {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  spent: number;
}