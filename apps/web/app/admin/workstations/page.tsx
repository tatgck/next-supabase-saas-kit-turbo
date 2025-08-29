'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { WorkstationsTable } from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function WorkstationManagementPage() {
  const [workstations, setWorkstations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkstations() {
      try {
        const client = getSupabaseBrowserClient();
        const service = createBarberPlatformClientService(client);
        const data = await service.getDashboardData();
        setWorkstations(data.workstations);
      } catch (error) {
        console.error('Failed to load workstations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkstations();
  }, []);

  const handleViewWorkstation = (workstation: any) => {
    console.log('View workstation:', workstation);
  };

  const handleEditWorkstation = (workstation: any) => {
    console.log('Edit workstation:', workstation);
  };

  const handleDeleteWorkstation = (workstation: any) => {
    console.log('Delete workstation:', workstation);
  };

  const handleAssignBarber = (workstation: any) => {
    console.log('Assign barber to workstation:', workstation);
  };

  const handleAddWorkstation = () => {
    console.log('Add new workstation');
  };

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:workstations.title" />}
        description={<Trans i18nKey="barber:workstations.description" />}
      >
        <Button onClick={handleAddWorkstation}>
          <Plus className="h-4 w-4 mr-2" />
          <Trans i18nKey="barber:workstations.addNew" />
        </Button>
      </PageHeader>

      <PageBody>
        <WorkstationsTable 
          workstations={workstations}
          loading={loading}
          onViewWorkstation={handleViewWorkstation}
          onEditWorkstation={handleEditWorkstation}
          onDeleteWorkstation={handleDeleteWorkstation}
          onAssignBarber={handleAssignBarber}
        />
      </PageBody>
    </>
  );
}

export default WorkstationManagementPage;