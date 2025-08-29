'use client';

import { useState, useEffect } from 'react';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import { useUser } from '@kit/supabase/hooks/use-user';

import { 
  StoresTable, 
  StoreDialog, 
  StoreDetailsDialog 
} from '@kit/barber-platform/components';
import { createBarberPlatformClientService } from '@kit/barber-platform/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

function StoreManagementPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [submitting, setSubmitting] = useState(false);
  const { data: user } = useUser();

  useEffect(() => {
    async function loadStores() {
      try {
        const client = getSupabaseBrowserClient();
        const service = createBarberPlatformClientService(client);
        const data = await service.getDashboardData();
        setStores(data.stores);
      } catch (error) {
        console.error('Failed to load stores:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  const handleViewStore = (store: any) => {
    setSelectedStore(store);
    setDetailsDialogOpen(true);
  };

  const handleEditStore = (store: any) => {
    console.log('Editing store:', store);
    setSelectedStore(store);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteStore = async (store: any) => {
    if (confirm(`Are you sure you want to delete store "${store.name}"?`)) {
      try {
        const client = getSupabaseBrowserClient();
        const service = createBarberPlatformClientService(client);
        await service.deleteStore(store.id);
        
        // Refresh stores list
        const data = await service.getDashboardData();
        setStores(data.stores);
      } catch (error) {
        console.error('Failed to delete store:', error);
        alert('Failed to delete store');
      }
    }
  };

  const handleApproveStore = async (store: any) => {
    try {
      const client = getSupabaseBrowserClient();
      const service = createBarberPlatformClientService(client);
      await service.approveStore(store.id);
      
      // Refresh stores list
      const data = await service.getDashboardData();
      setStores(data.stores);
    } catch (error) {
      console.error('Failed to approve store:', error);
      alert('Failed to approve store');
    }
  };

  const handleRejectStore = async (store: any) => {
    try {
      const client = getSupabaseBrowserClient();
      const service = createBarberPlatformClientService(client);
      await service.rejectStore(store.id);
      
      // Refresh stores list
      const data = await service.getDashboardData();
      setStores(data.stores);
    } catch (error) {
      console.error('Failed to reject store:', error);
      alert('Failed to reject store');
    }
  };

  const handleAddStore = () => {
    setSelectedStore(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleSubmitStore = async (formData: any) => {
    setSubmitting(true);
    try {
      const client = getSupabaseBrowserClient();
      const service = createBarberPlatformClientService(client);
      
      if (dialogMode === 'create') {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        
        await service.createStore({
          ...formData,
          owner_id: user.id
        });
      } else if (dialogMode === 'edit' && selectedStore) {
        await service.updateStore(selectedStore.id, formData);
      }
      
      // Refresh stores list
      const data = await service.getDashboardData();
      setStores(data.stores);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit store:', error);
      alert(`Failed to submit store: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={<Trans i18nKey="barber:stores.title" />}
        description={<Trans i18nKey="barber:stores.description" />}
      >
        <Button onClick={handleAddStore}>
          <Plus className="h-4 w-4 mr-2" />
          <Trans i18nKey="barber:stores.addNew" />
        </Button>
      </PageHeader>

      <PageBody>
        <StoresTable 
          stores={stores}
          loading={loading}
          onViewStore={handleViewStore}
          onEditStore={handleEditStore}
          onDeleteStore={handleDeleteStore}
          onApproveStore={handleApproveStore}
          onRejectStore={handleRejectStore}
        />
      </PageBody>

      {/* Store Dialog for Create/Edit */}
      <StoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={selectedStore}
        onSubmit={handleSubmitStore}
        loading={submitting}
      />

      {/* Store Details Dialog */}
      <StoreDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        store={selectedStore}
        onEdit={() => {
          setDetailsDialogOpen(false);
          setDialogMode('edit');
          setDialogOpen(true);
        }}
      />
    </>
  );
}

export default StoreManagementPage;