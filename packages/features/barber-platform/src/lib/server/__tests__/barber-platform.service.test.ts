import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@kit/supabase/database';

import { createBarberPlatformService } from '../services';

// 创建测试用的Supabase客户端
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const client = createClient<Database>(supabaseUrl, supabaseKey);

describe('BarberPlatformService', () => {
  let service: ReturnType<typeof createBarberPlatformService>;

  beforeEach(() => {
    service = createBarberPlatformService(client);
  });

  describe('getDashboardData', () => {
    it('should return dashboard data with stores, workstations, and barbers', async () => {
      const result = await service.getDashboardData();
      
      expect(result).toHaveProperty('stores');
      expect(result).toHaveProperty('workstations');
      expect(result).toHaveProperty('barbers');
      expect(Array.isArray(result.stores)).toBe(true);
      expect(Array.isArray(result.workstations)).toBe(true);
      expect(Array.isArray(result.barbers)).toBe(true);
    });
  });

  describe('createStoreWithValidation', () => {
    it('should create a store with valid data', async () => {
      const storeData = {
        name: '测试门店',
        address: '测试地址',
        owner_id: '00000000-0000-0000-0000-000000000000',
        phone: '13800138000',
        email: 'test@example.com'
      };

      const store = await service.createStoreWithValidation(storeData, '00000000-0000-0000-0000-000000000000');
      
      expect(store).toHaveProperty('id');
      expect(store.name).toBe('测试门店');
      expect(store.status).toBe('pending');
    });

    it('should throw error when creating store for other users', async () => {
      const storeData = {
        name: '测试门店',
        address: '测试地址',
        owner_id: '00000000-0000-0000-0000-000000000001', // 不同的用户ID
        phone: '13800138000',
        email: 'test@example.com'
      };

      await expect(
        service.createStoreWithValidation(storeData, '00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow('Unauthorized');
    });
  });
});