'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { useUser } from '@kit/supabase/hooks/use-user';

import { 
  BarbersTable, 
  BarberDialog, 
  BarberDetailsDialog 
} from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function BarberManagementPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const { data: user } = useUser();

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
    setSelectedBarber(barber);
    setDetailsDialogOpen(true);
  };

  const handleEditBarber = (barber: any) => {
    // Set barber first, then open dialog
    setSelectedBarber(barber);
    setDialogMode('edit');
    // Small delay to ensure barber is set first
    setTimeout(() => setDialogOpen(true), 10);
  };

  const handleDeleteBarber = async (barber: any) => {
    if (confirm(`Are you sure you want to delete barber "${barber.name}"?`)) {
      try {
        const client = getSupabaseBrowserClient();
        const service = createBarberPlatformClientService(client);
        await service.deleteBarber(barber.id);
        
        // Refresh barbers list
        const data = await service.getDashboardData();
        setBarbers(data.barbers);
      } catch (error) {
        console.error('Failed to delete barber:', error);
        alert('Failed to delete barber');
      }
    }
  };

  const handleToggleAvailability = async (barber: any) => {
    try {
      const client = getSupabaseBrowserClient();
      const service = createBarberPlatformClientService(client);
      await service.toggleBarberAvailability(barber.id, !barber.is_available);
      
      // Refresh barbers list
      const data = await service.getDashboardData();
      setBarbers(data.barbers);
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      alert('Failed to update availability status');
    }
  };

  const handleAddBarber = () => {
    setSelectedBarber(null);
    setDialogMode('create');
    // Small delay to ensure barber is cleared first
    setTimeout(() => setDialogOpen(true), 10);
  };

  const handleSubmitBarber = async (formData: any) => {
    setSubmitting(true);
    try {
      const client = getSupabaseBrowserClient();
      const service = createBarberPlatformClientService(client);
      
      if (dialogMode === 'create') {
        await service.createBarber(formData);
      } else if (dialogMode === 'edit' && selectedBarber) {
        await service.updateBarber(selectedBarber.id, formData);
      }
      
      // Refresh barbers list
      const data = await service.getDashboardData();
      setBarbers(data.barbers);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit barber:', error);
      alert(`Failed to submit barber information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
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

      {/* Barber Dialog for Create/Edit */}
      <BarberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        barber={selectedBarber}
        onSubmit={handleSubmitBarber}
        loading={submitting}
      />

      {/* Barber Details Dialog */}
      <BarberDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        barber={selectedBarber}
        onEdit={() => {
          setDetailsDialogOpen(false);
          setDialogMode('edit');
          setDialogOpen(true);
        }}
      />
    </>
  );
}

export default BarberManagementPage;