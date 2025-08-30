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

const discountSchema = z.object({
  discount_percentage: z.number().min(0).max(100),
  discount_start_date: z.string().optional(),
  discount_end_date: z.string().optional(),
  is_discount_active: z.boolean(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workstation: WorkstationWithUsage | null;
  onSuccess: () => void;
}

export function DiscountDialog({
  open,
  onOpenChange,
  workstation,
  onSuccess,
}: DiscountDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const service = createBarberPlatformClientService(supabase);

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      discount_percentage: 0,
      discount_start_date: '',
      discount_end_date: '',
      is_discount_active: false,
    },
  });

  // Reset form when workstation changes
  useEffect(() => {
    if (workstation && open) {
      form.reset({
        discount_percentage: workstation.discount_percentage || 0,
        discount_start_date: workstation.discount_start_date || '',
        discount_end_date: workstation.discount_end_date || '',
        is_discount_active: workstation.is_discount_active || false,
      });
    }
  }, [workstation, form, open]);

  const onSubmit = async (data: DiscountFormData) => {
    if (!workstation) return;

    setIsLoading(true);
    try {
      // Update the workstation's discount information
      const updates = {
        discount_percentage: data.is_discount_active ? data.discount_percentage : 0,
        is_discount_active: data.is_discount_active,
        discount_start_date: data.discount_start_date || null,
        discount_end_date: data.discount_end_date || null,
      };

      await service.updateWorkstation(workstation.id, updates);
      toast.success('Discount settings updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update discount settings');
      console.error('Error updating discount settings:', error);
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
            <Trans i18nKey="workstations:discount.title" values={{ number: workstation.number }} />
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="is_discount_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Trans i18nKey="workstations:discount.enableDiscount" />
                    </FormLabel>
                    <FormDescription>
                      <Trans i18nKey="workstations:discount.enableDescription" />
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

            {form.watch('is_discount_active') && (
              <>
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Trans i18nKey="workstations:discount.percentage" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        <Trans i18nKey="workstations:discount.percentageDescription" />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount_start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans i18nKey="workstations:discount.startDate" />
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
                    name="discount_end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Trans i18nKey="workstations:discount.endDate" />
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
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
                  <Trans i18nKey="common:saving" />
                ) : (
                  <Trans i18nKey="common:save" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}