import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { StoresTable } from '@kit/barber-platform/components';
import { createBarberPlatformApi } from '@kit/barber-platform/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function StoresPage() {
  const client = getSupabaseServerClient();
  const api = createBarberPlatformApi(client);
  
  const stores = await api.getStoresWithStats();

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:stores.title" />}
        description={<Trans i18nKey="barber:stores.description" />}
      />

      <PageBody>
        <StoresTable
          stores={stores}
          onViewStore={(store) => {
            // 查看门店详情
            console.log('View store:', store);
          }}
          onEditStore={(store) => {
            // 编辑门店
            console.log('Edit store:', store);
          }}
          onDeleteStore={(store) => {
            // 删除门店
            console.log('Delete store:', store);
          }}
          onApproveStore={(store) => {
            // 批准门店
            console.log('Approve store:', store);
          }}
          onRejectStore={(store) => {
            // 拒绝门店
            console.log('Reject store:', store);
          }}
        />
      </PageBody>
    </>
  );
}

export default StoresPage;