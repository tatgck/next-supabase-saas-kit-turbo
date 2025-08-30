'use client';

import { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';
import { createBarberPlatformClientService } from '../lib/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

interface Barber {
  id: string;
  name: string;
  email?: string;
}

interface AssignBarberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workstation: WorkstationWithUsage | null;
  onSuccess: () => void;
}

export function AssignBarberDialog({
  open,
  onOpenChange,
  workstation,
  onSuccess,
}: AssignBarberDialogProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const service = createBarberPlatformClientService(supabase);

  useEffect(() => {
    if (open && workstation) {
      fetchAvailableBarbers();
    }
  }, [open, workstation]);

  const fetchAvailableBarbers = async () => {
    try {
      const { data: barbersData, error } = await supabase
        .from('barbers')
        .select('id, name, email, phone')
        .eq('is_available', true)
        .order('name');

      if (error) {
        throw error;
      }

      if (barbersData) {
        setBarbers(barbersData.map(barber => ({
          id: barber.id,
          name: barber.name,
          email: barber.email || undefined,
          phone: barber.phone || undefined
        })));
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast.error('Failed to load barbers');
    }
  };

  const handleAssign = async () => {
    if (!workstation || !selectedBarberId) return;

    setIsLoading(true);
    try {
      await service.assignBarberToWorkstation(workstation.id, selectedBarberId);
      toast.success('Barber assigned successfully');
      onSuccess();
      onOpenChange(false);
      setSelectedBarberId('');
    } catch (error) {
      toast.error('Failed to assign barber');
      console.error('Error assigning barber:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workstation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Trans 
              i18nKey="workstations:assign.title" 
              values={{ number: workstation.number }}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              <Trans i18nKey="workstations:assign.selectBarber" />
            </label>
            <Select value={selectedBarberId} onValueChange={setSelectedBarberId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a barber" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name} {barber.email && `(${barber.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <Trans i18nKey="common:cancel" />
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedBarberId || isLoading}
            >
              {isLoading ? (
                <Trans i18nKey="common:assigning" />
              ) : (
                <Trans i18nKey="common:assign" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}