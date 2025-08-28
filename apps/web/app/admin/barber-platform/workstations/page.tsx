import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { WorkstationsTable } from '@kit/barber-platform/components';
import { createBarberPlatformApi } from '@kit/barber-platform/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function WorkstationsPage() {
  const client = getSupabaseServerClient();
  const api = createBarberPlatformApi(client);
  
  const workstations = await api.getWorkstationsWithUsage();

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:workstations.title" />}
        description={<Trans i18nKey="barber:workstations.description" />}
      />

      <PageBody>
        <WorkstationsTable
          workstations={workstations}
          onViewWorkstation={(workstation) => {
            // 查看工位详情
            console.log('View workstation:', workstation);
          }}
          onEditWorkstation={(workstation) => {
            // 编辑工位
            console.log('Edit workstation:', workstation);
          }}
          onDeleteWorkstation={(workstation) => {
            // 删除工位
            console.log('Delete workstation:', workstation);
          }}
          onAssignBarber={(workstation) => {
            // 分配理发师
            console.log('Assign barber to workstation:', workstation);
          }}
        />
      </PageBody>
    </>
  );
}

export default WorkstationsPage;