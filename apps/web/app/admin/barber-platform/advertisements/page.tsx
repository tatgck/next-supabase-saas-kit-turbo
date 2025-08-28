import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { AdvertisementsTable } from '@kit/barber-platform/components';
import { createBarberPlatformApi } from '@kit/barber-platform/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function AdvertisementsPage() {
  const client = getSupabaseServerClient();
  const api = createBarberPlatformApi(client);
  
  // 暂时返回空数组，广告数据需要从数据库获取
  const advertisements = [];

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:advertisements.title" />}
        description={<Trans i18nKey="barber:advertisements.description" />}
      />

      <PageBody>
        <AdvertisementsTable
          advertisements={advertisements}
          onViewAdvertisement={(ad) => {
            // 查看广告详情
            console.log('View advertisement:', ad);
          }}
          onEditAdvertisement={(ad) => {
            // 编辑广告
            console.log('Edit advertisement:', ad);
          }}
          onDeleteAdvertisement={(ad) => {
            // 删除广告
            console.log('Delete advertisement:', ad);
          }}
          onToggleStatus={(ad) => {
            // 切换广告状态
            console.log('Toggle advertisement status:', ad);
          }}
        />
      </PageBody>
    </>
  );
}

export default AdvertisementsPage;