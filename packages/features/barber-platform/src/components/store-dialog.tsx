'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { Textarea } from '@kit/ui/textarea';

const storeFormSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  description: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

interface StoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: any;
  onSubmit: (data: StoreFormValues) => Promise<void>;
  loading?: boolean;
}

export function StoreDialog({
  open,
  onOpenChange,
  store,
  onSubmit,
  loading = false,
}: StoreDialogProps) {
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: store?.name || '',
      address: store?.address || '',
      phone: store?.phone || '',
      email: store?.email || '',
      description: store?.description || '',
    },
  });

  // 当store变化或对话框打开时重置表单值
  useEffect(() => {
    if (open) {
      if (store) {
        form.reset({
          name: store.name || '',
          address: store.address || '',
          phone: store.phone || '',
          email: store.email || '',
          description: store.description || '',
        });
      } else {
        // 如果是新增，清空表单
        form.reset({
          name: '',
          address: '',
          phone: '',
          email: '',
          description: '',
        });
      }
    }
  }, [store, form, open]);

  const handleSubmit = async (data: StoreFormValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to submit store form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {store ? 'Edit Store' : 'Add New Store'}
          </DialogTitle>
          <DialogDescription>
            {store 
              ? 'Update the store information below.'
              : 'Fill in the details to create a new store.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter store address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter store description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (store ? 'Update Store' : 'Create Store')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}