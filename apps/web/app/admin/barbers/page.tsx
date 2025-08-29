import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { BarbersTable } from '@kit/barber-platform/components';
import { createBarberPlatformService } from '@kit/barber-platform/services';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function BarberManagementPage() {
  const client = getSupabaseServerClient();
  const service = createBarberPlatformService(client);
  
  const barbers = await service.getDashboardData().then(data => data.barbers);

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:barbers.title" />}
        description={<Trans i18nKey="barber:barbers.description" />}
      />

      <PageBody>
        <BarbersTable barbers={barbers} />
      </PageBody>
    </>
  );
}

export default BarberManagementPage;