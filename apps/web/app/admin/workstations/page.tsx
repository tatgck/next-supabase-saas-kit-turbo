import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { WorkstationsTable } from '@kit/barber-platform/components';
import { createBarberPlatformService } from '@kit/barber-platform/services';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function WorkstationManagementPage() {
  const client = getSupabaseServerClient();
  const service = createBarberPlatformService(client);
  
  const workstations = await service.getDashboardData().then(data => data.workstations);

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:workstations.title" />}
        description={<Trans i18nKey="barber:workstations.description" />}
      />

      <PageBody>
        <WorkstationsTable workstations={workstations} />
      </PageBody>
    </>
  );
}

export default WorkstationManagementPage;