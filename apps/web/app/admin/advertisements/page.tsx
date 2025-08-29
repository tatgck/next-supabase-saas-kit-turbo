'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { AdvertisementsTable } from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function AdvertisementManagementPage() {
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdvertisements() {
      try {
        // 广告数据需要从数据库获取，这里暂时使用空数组
        setAdvertisements([]);
      } catch (error) {
        console.error('Failed to load advertisements:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAdvertisements();
  }, []);

  const handleViewAdvertisement = (advertisement: any) => {
    console.log('View advertisement:', advertisement);
  };

  const handleEditAdvertisement = (advertisement: any) => {
    console.log('Edit advertisement:', advertisement);
  };

  const handleDeleteAdvertisement = (advertisement: any) => {
    console.log('Delete advertisement:', advertisement);
  };

  const handleToggleStatus = (advertisement: any) => {
    console.log('Toggle advertisement status:', advertisement);
  };

  const handleAddAdvertisement = () => {
    console.log('Add new advertisement');
  };

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:advertisements.title" />}
        description={<Trans i18nKey="barber:advertisements.description" />}
      >
        <Button onClick={handleAddAdvertisement}>
          <Plus className="h-4 w-4 mr-2" />
          <Trans i18nKey="barber:advertisements.addNew" />
        </Button>
      </PageHeader>

      <PageBody>
        <AdvertisementsTable 
          advertisements={advertisements}
          loading={loading}
          onViewAdvertisement={handleViewAdvertisement}
          onEditAdvertisement={handleEditAdvertisement}
          onDeleteAdvertisement={handleDeleteAdvertisement}
          onToggleStatus={handleToggleStatus}
        />
      </PageBody>
    </>
  );
}

export default AdvertisementManagementPage;