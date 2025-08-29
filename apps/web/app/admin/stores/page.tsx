import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { StoresTable } from '@kit/barber-platform/components';
import { createBarberPlatformService } from '@kit/barber-platform/services';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function StoreManagementPage() {
  const client = getSupabaseServerClient();
  const service = createBarberPlatformService(client);
  
  const stores = await service.getDashboardData().then(data => data.stores);

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:stores.title" />}
        description={<Trans i18nKey="barber:stores.description" />}
      />

      <PageBody>
        <StoresTable stores={stores} />
      </PageBody>
    </>
  );
}

export default StoreManagementPage;