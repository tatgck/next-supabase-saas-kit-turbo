import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';

import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';

import { createBarberPlatformApi } from './api';

export function createBarberPlatformService(client: SupabaseClient<Database>) {
  return new BarberPlatformService(client);
}

class BarberPlatformService {
  private readonly namespace = 'barber-platform';
  private api: ReturnType<typeof createBarberPlatformApi>;

  constructor(private readonly client: SupabaseClient<Database>) {
    this.api = createBarberPlatformApi(client);
  }

  /**
   * 获取平台运营仪表盘数据
   */
  async getDashboardData() {
    const logger = await getLogger();
    const ctx = { name: this.namespace };

    try {
      logger.info(ctx, 'Fetching dashboard data...');

      const [stores, workstations, barbers] = await Promise.all([
        this.api.getStoresWithStats(),
        this.api.getWorkstationsWithUsage(),
        this.api.getBarbersWithStats()
      ]);

      logger.info(ctx, 'Dashboard data fetched successfully');

      return {
        stores,
        workstations,
        barbers
      };
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to fetch dashboard data'
      );
      throw error;
    }
  }

  /**
   * 创建门店并验证权限
   */
  async createStoreWithValidation(storeData: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    owner_id: string;
    business_hours?: any;
    description?: string;
  }, userId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, userId, storeData: { ...storeData } };

    try {
      logger.info(ctx, 'Creating store with validation...');

      // 验证用户权限 - 只有用户自己可以为自己创建门店
      if (storeData.owner_id !== userId) {
        const error = new Error('Unauthorized: Cannot create store for other users');
        logger.error({ ...ctx, error }, 'Permission validation failed');
        throw error;
      }

      const store = await this.api.createStore(storeData);
      
      logger.info({ ...ctx, storeId: store.id }, 'Store created successfully');
      
      return store;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to create store'
      );
      throw error;
    }
  }

  /**
   * 更新门店信息并验证权限
   */
  async updateStoreWithValidation(storeId: string, updates: Partial<Database['public']['Tables']['stores']['Update']>, userId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, storeId, userId, updates };

    try {
      logger.info(ctx, 'Updating store with validation...');

      // First get store information to validate permissions
      const store = await this.api.getStoreById(storeId);
      
      if (!store) {
        const error = new Error('Store not found');
        logger.error({ ...ctx, error }, 'Store not found');
        throw error;
      }

      // Validate user permissions - only store owner can update
      if (store.owner_id !== userId) {
        const error = new Error('Unauthorized: Only store owner can update');
        logger.error({ ...ctx, error }, 'Permission validation failed');
        throw error;
      }

      const updatedStore = await this.api.updateStore(storeId, updates);
      
      logger.info(ctx, 'Store updated successfully');
      
      return updatedStore;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to update store'
      );
      throw error;
    }
  }

  /**
   * 删除门店并验证权限
   */
  async deleteStoreWithValidation(storeId: string, userId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, storeId, userId };

    try {
      logger.info(ctx, 'Deleting store with validation...');

      // First get store information to validate permissions
      const store = await this.api.getStoreById(storeId);
      
      if (!store) {
        const error = new Error('Store not found');
        logger.error({ ...ctx, error }, 'Store not found');
        throw error;
      }

      // Validate user permissions - only store owner can delete
      if (store.owner_id !== userId) {
        const error = new Error('Unauthorized: Only store owner can delete');
        logger.error({ ...ctx, error }, 'Permission validation failed');
        throw error;
      }

      await this.api.deleteStore(storeId);
      
      logger.info(ctx, 'Store deleted successfully');
      
      return { success: true };
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to delete store'
      );
      throw error;
    }
  }

  /**
   * 批准门店（管理员权限）
   */
  async approveStore(storeId: string, adminUserId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, storeId, adminUserId };

    try {
      logger.info(ctx, 'Approving store...');

      // 这里应该添加管理员权限验证
      // 使用现有的管理员验证函数
      
      const store = await this.api.approveStore(storeId);
      
      logger.info(ctx, 'Store approved successfully');
      
      return store;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to approve store'
      );
      throw error;
    }
  }

  /**
   * 拒绝门店（管理员权限）
   */
  async rejectStore(storeId: string, adminUserId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, storeId, adminUserId };

    try {
      logger.info(ctx, 'Rejecting store...');

      // 这里应该添加管理员权限验证
      // 使用现有的管理员验证函数
      
      const store = await this.api.rejectStore(storeId);
      
      logger.info(ctx, 'Store rejected successfully');
      
      return store;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to reject store'
      );
      throw error;
    }
  }

  /**
   * 分配理发师到工位并验证权限
   */
  async assignBarberToWorkstationWithValidation(workstationId: string, barberId: string, userId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, workstationId, barberId, userId };

    try {
      logger.info(ctx, 'Assigning barber to workstation with validation...');

      // 获取工位信息验证权限
      const workstation = await this.api.getWorkstationsWithUsage()
        .then(workstations => workstations.find(ws => ws.id === workstationId));
      
      if (!workstation) {
        const error = new Error('Workstation not found');
        logger.error({ ...ctx, error }, 'Workstation not found');
        throw error;
      }

      // 获取门店信息验证用户权限
      const store = await this.api.getStoreById(workstation.store_id);
      
      if (!store) {
        const error = new Error('Store not found');
        logger.error({ ...ctx, error }, 'Store not found');
        throw error;
      }

      // 验证用户权限 - 只有门店所有者可以分配工位
      if (store.owner_id !== userId) {
        const error = new Error('Unauthorized: Only store owner can assign workstations');
        logger.error({ ...ctx, error }, 'Permission validation failed');
        throw error;
      }

      const updatedWorkstation = await this.api.assignBarberToWorkstation(workstationId, barberId);
      
      logger.info(ctx, 'Barber assigned to workstation successfully');
      
      return updatedWorkstation;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to assign barber to workstation'
      );
      throw error;
    }
  }

  /**
   * 切换理发师可用状态并验证权限
   */
  async toggleBarberAvailabilityWithValidation(barberId: string, isAvailable: boolean, userId: string) {
    const logger = await getLogger();
    const ctx = { name: this.namespace, barberId, isAvailable, userId };

    try {
      logger.info(ctx, 'Toggling barber availability with validation...');

      // 获取理发师信息
      const barber = await this.api.getBarbersWithStats()
        .then(barbers => barbers.find(b => b.id === barberId));
      
      if (!barber) {
        const error = new Error('Barber not found');
        logger.error({ ...ctx, error }, 'Barber not found');
        throw error;
      }

      // Validate permissions: barber themselves or store owner can toggle status
      if (barber.id !== userId && barber.store_id) {
        // If it's a store barber, validate store owner permissions
        const store = await this.api.getStoreById(barber.store_id);
        
        if (!store || store.owner_id !== userId) {
          const error = new Error('Unauthorized: Only barber or store owner can toggle availability');
          logger.error({ ...ctx, error }, 'Permission validation failed');
          throw error;
        }
      }

      const updatedBarber = await this.api.toggleBarberAvailability(barberId, isAvailable);
      
      logger.info(ctx, 'Barber availability toggled successfully');
      
      return updatedBarber;
    } catch (error) {
      logger.error(
        { ...ctx, error },
        'Failed to toggle barber availability'
      );
      throw error;
    }
  }
}