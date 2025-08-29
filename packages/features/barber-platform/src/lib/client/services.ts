import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';

import { createBarberPlatformApi } from '../server/api';

export function createBarberPlatformClientService(client: SupabaseClient<Database>) {
  return new BarberPlatformClientService(client);
}

class BarberPlatformClientService {
  private readonly namespace = 'barber-platform';
  private api: ReturnType<typeof createBarberPlatformApi>;

  constructor(private readonly client: SupabaseClient<Database>) {
    this.api = createBarberPlatformApi(client);
  }

  /**
   * Get platform operation dashboard data
   */
  async getDashboardData() {
    console.info(`[${this.namespace}] Fetching dashboard data...`);

    try {
      // 使用管理员API获取数据，避免RLS限制
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'getDashboardData'
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      console.info(`[${this.namespace}] Dashboard data fetched successfully`);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to fetch dashboard data:`, error);
      throw error;
    }
  }

  /**
   * Create new store
   */
  async createStore(storeData: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    owner_id: string;
    business_hours?: any;
    description?: string;
  }) {
    console.info(`[${this.namespace}] Creating new store:`, storeData.name);

    try {
      const result = await this.api.createStore(storeData);
      console.info(`[${this.namespace}] Store created successfully:`, result.id);
      return result;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to create store:`, error);
      // Throw more detailed error message
      throw new Error(`Failed to create store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Update store information
   */
  async updateStore(storeId: string, updates: any) {
    console.info(`[${this.namespace}] Updating store ${storeId}:`, updates);

    try {
      const result = await this.api.updateStore(storeId, updates);
      console.info(`[${this.namespace}] Store updated successfully:`, storeId);
      return result;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to update store:`, error);
      throw new Error(`Failed to update store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Delete store
   */
  async deleteStore(storeId: string) {
    console.info(`[${this.namespace}] Deleting store:`, storeId);

    try {
      await this.api.deleteStore(storeId);
      console.info(`[${this.namespace}] Store deleted successfully:`, storeId);
    } catch (error) {
      console.error(`[${this.namespace}] Failed to delete store:`, error);
      throw new Error(`Failed to delete store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Approve store
   */
  async approveStore(storeId: string) {
    console.info(`[${this.namespace}] Approving store:`, storeId);

    try {
      const result = await this.api.approveStore(storeId);
      console.info(`[${this.namespace}] Store approved successfully:`, storeId);
      return result;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to approve store:`, error);
      throw new Error(`Failed to approve store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Reject store
   */
  async rejectStore(storeId: string) {
    console.info(`[${this.namespace}] Rejecting store:`, storeId);

    try {
      const result = await this.api.rejectStore(storeId);
      console.info(`[${this.namespace}] Store rejected successfully:`, storeId);
      return result;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to reject store:`, error);
      throw new Error(`Failed to reject store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Create barber
   */
  async createBarber(barberData: {
    name: string;
    phone?: string;
    email?: string;
    experience_years?: number;
    specialty?: string[];
    description?: string;
    is_available?: boolean;
  }) {
    console.info(`[${this.namespace}] Creating new barber:`, barberData.name);

    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'create',
          data: barberData
        }),
      });

      let result;
      try {
        const responseText = await response.text();
        console.log(`[${this.namespace}] Raw API response:`, responseText);
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error(`[${this.namespace}] Failed to parse API response:`, parseError);
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
      }
      
      if (!response.ok || !result.success) {
        console.error(`[${this.namespace}] Create barber API error:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          result: result
        });
        throw new Error(result.error || `Failed to create barber: ${response.status} ${response.statusText}`);
      }

      console.info(`[${this.namespace}] Barber created successfully:`, result.data.id);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to create barber:`, error);
      throw new Error(`Failed to create barber: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Update barber information
   */
  async updateBarber(barberId: string, updates: any) {
    console.info(`[${this.namespace}] Updating barber ${barberId}:`, updates);

    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update',
          data: { id: barberId, updates }
        }),
      });

      let result;
      try {
        const responseText = await response.text();
        console.log(`[${this.namespace}] Raw update API response:`, responseText);
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error(`[${this.namespace}] Failed to parse update API response:`, parseError);
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
      }
      
      if (!response.ok) {
        console.error(`[${this.namespace}] Update barber API error:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          result: result
        });
        throw new Error(result.error || `Failed to update barber: ${response.status} ${response.statusText}`);
      }

      if (!result.success) {
        console.error(`[${this.namespace}] Update barber API error:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          result: result
        });
        throw new Error(result.error || `Failed to update barber: API returned unsuccessful result`);
      }

      console.info(`[${this.namespace}] Barber updated successfully:`, barberId);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to update barber:`, error);
      throw new Error(`Failed to update barber: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Delete barber
   */
  async deleteBarber(barberId: string) {
    console.info(`[${this.namespace}] Deleting barber:`, barberId);

    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'delete',
          data: { id: barberId }
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete barber');
      }

      console.info(`[${this.namespace}] Barber deleted successfully:`, barberId);
    } catch (error) {
      console.error(`[${this.namespace}] Failed to delete barber:`, error);
      throw new Error(`Failed to delete barber: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * Toggle barber availability
   */
  async toggleBarberAvailability(barberId: string, isAvailable: boolean) {
    console.info(`[${this.namespace}] Toggling barber availability:`, barberId, isAvailable);

    try {
      const response = await fetch('/api/admin/barbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'toggleAvailability',
          data: { barberId, isAvailable }
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle barber availability');
      }

      console.info(`[${this.namespace}] Barber availability toggled successfully:`, barberId);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to toggle barber availability:`, error);
      throw new Error(`Failed to toggle barber availability: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }
}