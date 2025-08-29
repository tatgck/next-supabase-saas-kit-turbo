'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';

import { BarbersTable } from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function BarberManagementPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBarbers() {
      try {
        const client = getSupabaseBrowserClient();
        const service = createBarberPlatformClientService(client);
        const data = await service.getDashboardData();
        setBarbers(data.barbers);
      } catch (error) {
        console.error('Failed to load barbers:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBarbers();
  }, []);

  const handleViewBarber = (barber: any) => {
    console.log('View barber:', barber);
  };

  const handleEditBarber = (barber: any) => {
    console.log('Edit barber:', barber);
  };

  const handleDeleteBarber = (barber: any) => {
    console.log('Delete barber:', barber);
  };

  const handleToggleAvailability = (barber: any) => {
    console.log('Toggle availability:', barber);
  };

  const handleAddBarber = () => {
    console.log('Add new barber');
  };

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:barbers.title" />}
        description={<Trans i18nKey="barber:barbers.description" />}
      >
        <Button onClick={handleAddBarber}>
          <Plus className="h-4 w-4 mr-2" />
          <Trans i18nKey="barber:barbers.addNew" />
        </Button>
      </PageHeader>

      <PageBody>
        <BarbersTable 
          barbers={barbers}
          loading={loading}
          onViewBarber={handleViewBarber}
          onEditBarber={handleEditBarber}
          onDeleteBarber={handleDeleteBarber}
          onToggleAvailability={handleToggleAvailability}
        />
      </PageBody>
    </>
  );
}

export default BarberManagementPage;