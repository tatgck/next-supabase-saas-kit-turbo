'use client';

import { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Switch } from '@kit/ui/switch';
import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';
import { createBarberPlatformClientService } from '../lib/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

const workstationSchema = z.object({
  number: z.string().min(1, 'Workstation number is required'),
  type: z.enum(['standard', 'premium', 'vip']),
  is_shared: z.boolean(),
  shared_start_date: z.string().optional(),
  shared_end_date: z.string().optional(),
  equipment: z.array(z.string()).optional(),
});

type WorkstationFormData = z.infer<typeof workstationSchema>;

interface WorkstationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workstation: WorkstationWithUsage | null;
  onSuccess: () => void;
}

export function WorkstationEditDialog({
  open,
  onOpenChange,
  workstation,
  onSuccess,
}: WorkstationEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const service = createBarberPlatformClientService(supabase);

  const form = useForm<WorkstationFormData>({
    resolver: zodResolver(workstationSchema),
    defaultValues: {
      number: '',
      type: 'standard',
      is_shared: false,
      shared_start_date: '',
      shared_end_date: '',
      equipment: [],
    },
  });

  // Reset form when workstation changes
  useEffect(() => {
    if (workstation && open) {
      form.reset({
        number: workstation.number,
        type: workstation.type,
        is_shared: workstation.is_shared,
        shared_start_date: workstation.shared_start_date || '',
        shared_end_date: workstation.shared_end_date || '',
        equipment: workstation.equipment || [],
      });
    }
  }, [workstation, form, open]);

  const onSubmit = async (data: WorkstationFormData) => {
    if (!workstation) return;

    setIsLoading(true);
    try {
      // Use admin API to bypass RLS restrictions
      const response = await fetch('/api/admin/workstations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update',
          data: { id: workstation.id, updates: data }
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update workstation');
      }

      toast.success('Workstation updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update workstation');
      console.error('Error updating workstation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workstation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="workstations:edit.title" values={{ number: workstation.number }} />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="workstations:form.number" />
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey="workstations:form.type" />
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <FormField
              control={form.control}
              name="is_shared"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Trans i18nKey="workstations:form.sharedWorkstation" />
                    </FormLabel>
                    <FormDescription>
                      <Trans i18nKey="workstations:form.sharedDescription" />
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('is_shared') && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shared_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey="workstations:form.sharingStartDate" />
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shared_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey="workstations:form.sharingEndDate" />
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <Trans i18nKey="common:cancel" />
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Trans i18nKey="common:updating" />
                ) : (
                  <Trans i18nKey="common:update" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}