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
   * 获取平台运营仪表盘数据
   */
  async getDashboardData() {
    console.info(`[${this.namespace}] Fetching dashboard data...`);

    try {
      const [stores, workstations, barbers] = await Promise.all([
        this.api.getStoresWithStats(),
        this.api.getWorkstationsWithUsage(),
        this.api.getBarbersWithStats()
      ]);

      console.info(`[${this.namespace}] Dashboard data fetched successfully`);

      return {
        stores,
        workstations,
        barbers
      };
    } catch (error) {
      console.error(`[${this.namespace}] Failed to fetch dashboard data:`, error);
      throw error;
    }
  }

  /**
   * 创建新门店
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
      // 抛出更详细的错误信息
      throw new Error(`Failed to create store: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * 更新门店信息
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
   * 删除门店
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
   * 批准门店
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
   * 拒绝门店
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
   * 创建理发师
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

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create barber');
      }

      console.info(`[${this.namespace}] Barber created successfully:`, result.data.id);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to create barber:`, error);
      throw new Error(`Failed to create barber: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * 更新理发师信息
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

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update barber');
      }

      console.info(`[${this.namespace}] Barber updated successfully:`, barberId);
      return result.data;
    } catch (error) {
      console.error(`[${this.namespace}] Failed to update barber:`, error);
      throw new Error(`Failed to update barber: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  /**
   * 删除理发师
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
   * 切换理发师可用状态
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