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
}