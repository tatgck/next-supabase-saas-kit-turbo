'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { WorkstationsTable, WorkstationCreateDialog } from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function WorkstationManagementPage() {
  const [workstations, setWorkstations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkstations();
  }, []);

  const loadWorkstations = async () => {
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
  };

  const handleAddWorkstation = () => {
    setCreateDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="workstations:title" />}
        description={<Trans i18nKey="workstations:description" />}
      >
        <Button onClick={handleAddWorkstation}>
          <Plus className="h-4 w-4 mr-2" />
          <Trans i18nKey="workstations:addNew" />
        </Button>
      </PageHeader>

      <PageBody>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">
              <Trans i18nKey="common:loading" />
            </div>
          </div>
        ) : (
          <WorkstationsTable 
            workstations={workstations}
            onRefresh={loadWorkstations}
          />
        )}
      </PageBody>

      <WorkstationCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadWorkstations}
      />
    </>
  );
}

export default WorkstationManagementPage;