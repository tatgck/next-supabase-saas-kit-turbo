import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';
import { StoreWithStats, WorkstationWithUsage, BarberWithStats } from '../../types';

class BarberPlatformApi {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * 获取门店列表及统计信息
   */
  async getStoresWithStats(): Promise<StoreWithStats[]> {
    const { data, error } = await this.client
      .from('stores')
      .select(`
        *,
        barber_count: barbers(count),
        workstation_count: workstations(count),
        monthly_revenue
      `);

    if (error) {
      throw error;
    }

    return data.map(store => ({
      ...store,
      barber_count: store.barber_count?.[0]?.count || 0,
      workstation_count: store.workstation_count?.[0]?.count || 0,
      monthly_revenue: store.monthly_revenue || 0,
      rating: store.rating || 0,
      review_count: store.review_count || 0
    }));
  }

  /**
   * 获取工位列表及使用统计
   */
  async getWorkstationsWithUsage(storeId?: string): Promise<WorkstationWithUsage[]> {
    let query = this.client
      .from('workstations')
      .select('*');

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 获取理发师列表及统计信息
   */
  async getBarbersWithStats(storeId?: string): Promise<BarberWithStats[]> {
    let query = this.client
      .from('barbers')
      .select('*');

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 获取单个门店详情
   */
  async getStoreById(storeId: string): Promise<StoreWithStats | null> {
    const { data, error } = await this.client
      .from('stores')
      .select(`
        *,
        barber_count: barbers(count),
        workstation_count: workstations(count),
        monthly_revenue
      `)
      .eq('id', storeId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      barber_count: data.barber_count?.[0]?.count || 0,
      workstation_count: data.workstation_count?.[0]?.count || 0,
      monthly_revenue: data.monthly_revenue || 0
    };
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
    const { data, error } = await this.client
      .from('stores')
      .insert([{
        ...storeData,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 更新门店信息
   */
  async updateStore(storeId: string, updates: Partial<Database['public']['Tables']['stores']['Update']>) {
    const { data, error } = await this.client
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(`Store with ID ${storeId} not found or no changes made`);
    }

    return data;
  }

  /**
   * 删除门店
   */
  async deleteStore(storeId: string) {
    const { error } = await this.client
      .from('stores')
      .delete()
      .eq('id', storeId);

    if (error) {
      throw error;
    }
  }

  /**
   * 批准门店
   */
  async approveStore(storeId: string) {
    return this.updateStore(storeId, { status: 'active' });
  }

  /**
   * 拒绝门店
   */
  async rejectStore(storeId: string) {
    return this.updateStore(storeId, { status: 'inactive' });
  }

  /**
   * 创建工位
   */
  async createWorkstation(workstationData: {
    store_id: string;
    number: string;
    type: Database['public']['Enums']['workstation_type'];
    hourly_rate: number;
    daily_rate: number;
    equipment?: string[];
  }) {
    const { data, error } = await this.client
      .from('workstations')
      .insert([workstationData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 更新工位信息
   */
  async updateWorkstation(workstationId: string, updates: Partial<Database['public']['Tables']['workstations']['Update']>) {
    const { data, error } = await this.client
      .from('workstations')
      .update(updates)
      .eq('id', workstationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 分配理发师到工位
   */
  async assignBarberToWorkstation(workstationId: string, barberId: string) {
    return this.updateWorkstation(workstationId, {
      current_barber_id: barberId,
      status: 'occupied'
    });
  }

  /**
   * 释放工位
   */
  async releaseWorkstation(workstationId: string) {
    return this.updateWorkstation(workstationId, {
      current_barber_id: null,
      status: 'available'
    });
  }

  /**
   * 更新理发师信息
   */
  async updateBarber(barberId: string, updates: Partial<Database['public']['Tables']['barbers']['Update']>) {
    const { data, error } = await this.client
      .from('barbers')
      .update(updates)
      .eq('id', barberId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 切换理发师可用状态
   */
  async toggleBarberAvailability(barberId: string, isAvailable: boolean) {
    return this.updateBarber(barberId, { is_available: isAvailable });
  }

  /**
   * 创建理发师邀请
   */
  async createBarberInvitation(invitationData: {
    store_id: string;
    email: string;
    name?: string;
    phone?: string;
    expires_in_hours?: number;
  }) {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (invitationData.expires_in_hours || 72));

    const { data, error } = await this.client
      .from('barber_invitations' as any)
      .insert([{
        store_id: invitationData.store_id,
        email: invitationData.email,
        name: invitationData.name,
        phone: invitationData.phone,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: (await this.client.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { ...data, invite_url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invitation?token=${token}` };
  }

  /**
   * 获取邀请信息
   */
  async getInvitationByToken(token: string) {
    const { data, error } = await this.client
      .from('barber_invitations' as any)
      .select('*, store:stores(name, slug)')
      .eq('token', token)
      .gte('expires_at', new Date().toISOString())
      .eq('status', 'pending')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 接受邀请并创建理发师
   */
  async acceptInvitation(token: string, userData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  }) {
    const { data: invitation, error: inviteError } = await this.client
      .from('barber_invitations' as any)
      .update({ 
        status: 'accepted' as any,
        accepted_at: new Date().toISOString()
      })
      .eq('token', token)
      .select()
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // 创建理发师记录
    const { data: barber, error: barberError } = await this.client
      .from('barbers')
      .insert([{
        id: userData.id,
        store_id: invitation.store_id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        invitation_token: token
      }])
      .select()
      .single();

    if (barberError) {
      throw barberError;
    }

    return barber;
  }

  /**
   * 获取门店的邀请列表
   */
  async getStoreInvitations(storeId: string) {
    const { data, error } = await this.client
      .from('barber_invitations' as any)
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * 撤销邀请
   */
  async revokeInvitation(invitationId: string) {
    const { error } = await this.client
      .from('barber_invitations' as any)
      .update({ status: 'revoked' as any })
      .eq('id', invitationId);

    if (error) {
      throw error;
    }
  }
}

export function createBarberPlatformApi(client: SupabaseClient<Database>) {
  return new BarberPlatformApi(client);
}