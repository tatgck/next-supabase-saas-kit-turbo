import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@kit/supabase/database';
import { StoreWithStats, WorkstationWithUsage, BarberWithStats } from '../../types';

class BarberPlatformApi {
  constructor(private readonly client: SupabaseClient<Database>) { }

  /**
   * Get store list with statistics
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
   * Get workstation list with usage statistics
   */
  async getWorkstationsWithUsage(storeId?: string): Promise<WorkstationWithUsage[]> {
    let query = this.client
      .from('workstations')
      .select(`
        *,
        store:stores(name)
      `);

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
   * Get barber list with statistics
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
   * Get single store details
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
   * Create barber
   */
  async createBarber(barberData: {
    name: string;
    phone?: string;
    email?: string;
    experience_years?: number;
    specialty?: string[];
    specialties?: string[]; // 支持前端传入的字段名
    description?: string;
    is_available?: boolean;
  }) {
    console.log('Creating barber with data:', barberData);

    try {
      // 处理字段映射：specialties -> specialty
      const dataToInsert = {
        name: barberData.name,
        phone: barberData.phone,
        email: barberData.email,
        experience_years: barberData.experience_years,
        specialty: barberData.specialty || barberData.specialties, // 支持两种字段名
        description: barberData.description,
        is_available: barberData.is_available ?? true
      };

      console.log('Inserting barber data:', dataToInsert);

      const { data, error } = await this.client
        .from('barbers')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Database error creating barber:', error);
        throw error;
      }

      console.log('Barber created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createBarber:', error);
      throw error;
    }
  }

  /**
   * Update store information
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
   * Delete store
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
   * Approve store
   */
  async approveStore(storeId: string) {
    return this.updateStore(storeId, { status: 'active' });
  }

  /**
   * Reject store
   */
  async rejectStore(storeId: string) {
    return this.updateStore(storeId, { status: 'inactive' });
  }

  /**
   * Create workstation
   */
  async createWorkstation(workstationData: {
    store_id: string;
    number: string;
    type: Database['public']['Enums']['workstation_type'];
    is_shared?: boolean;
    shared_start_date?: string;
    shared_end_date?: string;
    equipment?: string[];
  }) {
    // 过滤掉空字符串的日期字段，提供默认值
    const dataToInsert = {
      ...workstationData,
      shared_start_date: workstationData.shared_start_date || null,
      shared_end_date: workstationData.shared_end_date || null,
      // 提供数据库schema中必需的默认值
      hourly_rate: 0,
      daily_rate: 0,
      discount_percentage: 0,
    };

    const { data, error } = await this.client
      .from('workstations')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update workstation information
   */
  async updateWorkstation(workstationId: string, updates: Partial<Database['public']['Tables']['workstations']['Update']>) {
    console.log('Updating workstation with data:', updates);

    // 处理空字符串时间戳字段，转换为null
    const processedUpdates = { ...updates };

    // 处理时间戳字段：空字符串 -> null
    if (processedUpdates.shared_start_date === '') {
      processedUpdates.shared_start_date = null;
    }
    if (processedUpdates.shared_end_date === '') {
      processedUpdates.shared_end_date = null;
    }
    // 其他时间戳字段如果存在也进行处理
    if ('discount_start_date' in processedUpdates && processedUpdates.discount_start_date === '') {
      (processedUpdates as any).discount_start_date = null;
    }
    if ('discount_end_date' in processedUpdates && processedUpdates.discount_end_date === '') {
      (processedUpdates as any).discount_end_date = null;
    }

    console.log('Processed updates:', processedUpdates);

    const { data, error } = await this.client
      .from('workstations')
      .update(processedUpdates)
      .eq('id', workstationId)
      .select();

    if (error) {
      console.error('Database error updating workstation:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error(`Workstation with ID ${workstationId} not found`);
    }

    console.log('Workstation updated successfully:', data[0]);
    return data[0];
  }

  /**
   * Assign barber to workstation
   */
  async assignBarberToWorkstation(workstationId: string, barberId: string) {
    return this.updateWorkstation(workstationId, {
      current_barber_id: barberId,
      status: 'occupied'
    });
  }

  /**
   * Release workstation
   */
  async releaseWorkstation(workstationId: string) {
    return this.updateWorkstation(workstationId, {
      current_barber_id: null,
      status: 'available'
    });
  }

  /**
   * Update barber information
   */
  async updateBarber(barberId: string, updates: any) {
    console.log('Updating barber in database:', barberId, updates);

    try {
      // 过滤掉不存在的字段（如 specialties -> specialty）
      const validUpdates: Partial<Database['public']['Tables']['barbers']['Update']> = {};

      if (updates.name !== undefined) validUpdates.name = updates.name;
      if (updates.phone !== undefined) validUpdates.phone = updates.phone;
      if (updates.email !== undefined) validUpdates.email = updates.email;
      if (updates.experience_years !== undefined) validUpdates.experience_years = updates.experience_years;
      if (updates.specialty !== undefined) validUpdates.specialty = updates.specialty;
      if (updates.specialties !== undefined) validUpdates.specialty = updates.specialties; // 处理 specialties -> specialty 映射
      if (updates.description !== undefined) validUpdates.description = updates.description;
      if (updates.is_available !== undefined) validUpdates.is_available = updates.is_available;

      const { data, error } = await this.client
        .from('barbers')
        .update(validUpdates)
        .eq('id', barberId)
        .select()
        .single();

      if (error) {
        console.error('Database error updating barber:', error);
        throw error;
      }

      if (!data) {
        console.error(`Barber with ID ${barberId} not found or no changes made`);
        throw new Error(`Barber with ID ${barberId} not found or no changes made`);
      }

      console.log('Barber updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateBarber:', error);
      throw error;
    }
  }

  /**
   * Delete barber
   */
  async deleteBarber(barberId: string) {
    const { error } = await this.client
      .from('barbers')
      .delete()
      .eq('id', barberId);

    if (error) {
      throw error;
    }
  }

  /**
   * Toggle barber availability
   */
  async toggleBarberAvailability(barberId: string, isAvailable: boolean) {
    return this.updateBarber(barberId, { is_available: isAvailable });
  }

  /**
   * Create barber invitation
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
   * Get invitation information
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
   * Accept invitation and create barber
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
   * Get store invitation list
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
   * Revoke invitation
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