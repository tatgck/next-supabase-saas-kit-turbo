import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { AdvertisementsTable } from '@kit/barber-platform/components';
import { createBarberPlatformService } from '@kit/barber-platform/services';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function AdvertisementManagementPage() {
  const client = getSupabaseServerClient();
  const service = createBarberPlatformService(client);
  
  const advertisements = await service.getDashboardData().then(data => data.advertisements);

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:advertisements.title" />}
        description={<Trans i18nKey="barber:advertisements.description" />}
      />

      <PageBody>
        <AdvertisementsTable advertisements={advertisements} />
      </PageBody>
    </>
  );
}

export default AdvertisementManagementPage;