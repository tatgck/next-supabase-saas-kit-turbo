import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { isSuperAdmin } from '@kit/admin';
import { createBarberPlatformApi } from '@kit/barber-platform/api';

export async function POST(request: NextRequest) {
  try {
    // Verify user is super admin
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
        console.log('API create barber request:', data);
        const createdBarber = await api.createBarber(data);
        console.log('API create barber success:', createdBarber);
        return NextResponse.json({ success: true, data: createdBarber });
        
      case 'update':
        const { id, updates } = data;
        console.log('Updating barber:', id, updates);
        try {
          const updatedBarber = await api.updateBarber(id, updates);
          console.log('Barber updated successfully:', updatedBarber);
          return NextResponse.json({ success: true, data: updatedBarber });
        } catch (updateError) {
          console.error('Error updating barber:', updateError);
          return NextResponse.json({ 
            success: false, 
            error: updateError instanceof Error ? updateError.message : 'Failed to update barber' 
          }, { status: 500 });
        }
        
      case 'delete':
        await api.deleteBarber(data.id);
        return NextResponse.json({ success: true });
        
      case 'toggleAvailability':
        const { barberId, isAvailable } = data;
        const toggledBarber = await api.toggleBarberAvailability(barberId, isAvailable);
        return NextResponse.json({ success: true, data: toggledBarber });
        
      case 'getBarbers':
        const barbersList = await api.getBarbersWithStats();
        return NextResponse.json({ success: true, data: barbersList });
        
      case 'getDashboardData':
        const [stores, workstations, barbersData] = await Promise.all([
          api.getStoresWithStats(),
          api.getWorkstationsWithUsage(),
          api.getBarbersWithStats()
        ]);
        return NextResponse.json({ success: true, data: { stores, workstations, barbers: barbersData } });
        
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin barber API error:', error);
    
    // 确保返回有效的 JSON 响应
    const errorResponse = {
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    };
    
    console.log('Returning error response:', errorResponse);
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}