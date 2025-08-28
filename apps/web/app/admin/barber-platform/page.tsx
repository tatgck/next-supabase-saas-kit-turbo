import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { OperationsDashboard } from '@kit/barber-platform/components';
import { createBarberPlatformService } from '@kit/barber-platform/services';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function BarberPlatformPage() {
  const client = getSupabaseServerClient();
  const service = createBarberPlatformService(client);
  
  const dashboardData = await service.getDashboardData();

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:platform.title" />}
        description={<Trans i18nKey="barber:platform.description" />}
      />

      <PageBody>
        <OperationsDashboard
          stores={dashboardData.stores}
          workstations={dashboardData.workstations}
          barbers={dashboardData.barbers}
        />
      </PageBody>
    </>
  );
}

export default BarberPlatformPage;