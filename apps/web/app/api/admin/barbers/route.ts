import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { isSuperAdmin } from '@kit/admin';
import { createBarberPlatformApi } from '@kit/barber-platform/api';

export async function POST(request: NextRequest) {
  try {
    // 验证用户是否为超级管理员
    const client = getSupabaseServerClient();
    const userIsSuperAdmin = await isSuperAdmin(client);
    
    if (!userIsSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' }, 
        { status: 403 }
      );
    }
    
    const adminClient = getSupabaseServerAdminClient();
    const api = createBarberPlatformApi(adminClient);
    
    const { action, data } = await request.json();
    
    switch (action) {
      case 'create':
        const createdBarber = await api.createBarber(data);
        return NextResponse.json({ success: true, data: createdBarber });
        
      case 'update':
        const { id, updates } = data;
        const updatedBarber = await api.updateBarber(id, updates);
        return NextResponse.json({ success: true, data: updatedBarber });
        
      case 'delete':
        await api.deleteBarber(data.id);
        return NextResponse.json({ success: true });
        
      case 'toggleAvailability':
        const { barberId, isAvailable } = data;
        const toggledBarber = await api.toggleBarberAvailability(barberId, isAvailable);
        return NextResponse.json({ success: true, data: toggledBarber });
        
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin barber API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}