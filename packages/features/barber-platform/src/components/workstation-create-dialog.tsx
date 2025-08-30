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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { createBarberPlatformClientService } from '../lib/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

const workstationSchema = z.object({
  store_id: z.string().min(1, 'Store selection is required'),
  number: z.string().min(1, 'Workstation number is required'),
  type: z.enum(['standard', 'premium', 'vip']),
  is_shared: z.boolean(),
  shared_start_date: z.string().optional(),
  shared_end_date: z.string().optional(),
  equipment: z.array(z.string()).optional(),
});

type WorkstationFormData = z.infer<typeof workstationSchema>;

interface Store {
  id: string;
  name: string;
  status: string;
}

interface WorkstationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WorkstationCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: WorkstationCreateDialogProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const service = createBarberPlatformClientService(supabase);

  const form = useForm<WorkstationFormData>({
    resolver: zodResolver(workstationSchema),
    defaultValues: {
      store_id: '',
      number: '',
      type: 'standard',
      is_shared: false,
      shared_start_date: '',
      shared_end_date: '',
      equipment: [],
    },
  });

  useEffect(() => {
    if (open) {
      fetchActiveStores();
    }
  }, [open]);

  const fetchActiveStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, status')
        .eq('status', 'active')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setStores(data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    }
  };

  const onSubmit = async (data: WorkstationFormData) => {
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
          action: 'create',
          data: data
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create workstation');
      }

      toast.success('Workstation created successfully');
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to create workstation');
      console.error('Error creating workstation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="workstations:create.title" />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Store Selection */}
            <FormField
              control={form.control}
              name="store_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans i18nKey="workstations:form.store" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a store" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <Trans i18nKey="common:creating" />
                ) : (
                  <Trans i18nKey="common:create" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}