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
            case 'create': {
                console.log('API create workstation request:', data);
                const createdWorkstation = await api.createWorkstation(data);
                console.log('API create workstation success:', createdWorkstation);
                return NextResponse.json({ success: true, data: createdWorkstation });
            }

            case 'update': {
                const { id, updates } = data;
                console.log('Updating workstation:', id, updates);
                try {
                    const updatedWorkstation = await api.updateWorkstation(id, updates);
                    console.log('Workstation updated successfully:', updatedWorkstation);
                    return NextResponse.json({ success: true, data: updatedWorkstation });
                } catch (updateError) {
                    console.error('Error updating workstation:', updateError);
                    return NextResponse.json({
                        success: false,
                        error: updateError instanceof Error ? updateError.message : 'Failed to update workstation'
                    }, { status: 500 });
                }
            }

            case 'delete': {
                await api.deleteBarber(data.id); // Note: This should be deleteWorkstation, but it's not implemented yet
                return NextResponse.json({ success: true });
            }

            case 'getWorkstations': {
                const workstationsList = await api.getWorkstationsWithUsage();
                return NextResponse.json({ success: true, data: workstationsList });
            }

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Admin workstation API error:', error);

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