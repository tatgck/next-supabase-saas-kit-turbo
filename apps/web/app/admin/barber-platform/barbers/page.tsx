import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { BarbersTable } from '@kit/barber-platform/components';
import { createBarberPlatformApi } from '@kit/barber-platform/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function BarbersPage() {
  const client = getSupabaseServerClient();
  const api = createBarberPlatformApi(client);
  
  const barbers = await api.getBarbersWithStats();

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:barbers.title" />}
        description={<Trans i18nKey="barber:barbers.description" />}
      />

      <PageBody>
        <BarbersTable
          barbers={barbers}
          onViewBarber={(barber) => {
            // 查看理发师详情
            console.log('View barber:', barber);
          }}
          onEditBarber={(barber) => {
            // 编辑理发师
            console.log('Edit barber:', barber);
          }}
          onDeleteBarber={(barber) => {
            // 删除理发师
            console.log('Delete barber:', barber);
          }}
          onToggleAvailability={(barber) => {
            // 切换可用状态
            console.log('Toggle availability:', barber);
          }}
        />
      </PageBody>
    </>
  );
}

export default BarbersPage;