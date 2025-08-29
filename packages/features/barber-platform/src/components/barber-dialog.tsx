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
import { Switch } from '@kit/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Badge } from '@kit/ui/badge';
import { X } from 'lucide-react';

const barberFormSchema = z.object({
  name: z.string().min(1, 'Barber name is required'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  experience_years: z.coerce.number().min(0, 'Experience years cannot be negative').optional(),
  specialties: z.array(z.string()).default([]),
  description: z.string().optional(),
  is_available: z.boolean().default(true),
});

type BarberFormValues = z.infer<typeof barberFormSchema>;

interface BarberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: any;
  onSubmit: (data: BarberFormValues) => Promise<void>;
  loading?: boolean;
}

export function BarberDialog({
  open,
  onOpenChange,
  barber,
  onSubmit,
  loading = false,
}: BarberDialogProps) {
  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      experience_years: 0,
      specialties: [],
      description: '',
      is_available: true,
    },
  });

  // Reset form values when barber changes or dialog opens
  useEffect(() => {
    if (open) {
      if (barber) {
        form.reset({
          name: barber.name || '',
          phone: barber.phone || '',
          email: barber.email || '',
          experience_years: barber.experience_years || 0,
          specialties: Array.isArray(barber.specialty) ? barber.specialty : (barber.specialty ? [barber.specialty] : []),
          description: barber.description || '',
          is_available: barber.is_available ?? true,
        });
      } else {
        // If creating new, clear the form
        form.reset({
          name: '',
          phone: '',
          email: '',
          experience_years: 0,
          specialties: [],
          description: '',
          is_available: true,
        });
      }
    }
  }, [barber, form, open]);

  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      const currentSpecialties = form.getValues('specialties');
      if (!currentSpecialties.includes(newSpecialty.trim())) {
        form.setValue('specialties', [...currentSpecialties, newSpecialty.trim()]);
      }
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    const currentSpecialties = form.getValues('specialties');
    form.setValue('specialties', currentSpecialties.filter(s => s !== specialtyToRemove));
  };

  const handleSubmit = async (data: BarberFormValues) => {
    try {
      // Use specialties array directly
      const submitData = {
        ...data,
        specialty: data.specialties
      };
      await onSubmit(submitData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to submit barber form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {barber ? 'Edit Barber' : 'Add New Barber'}
          </DialogTitle>
          <DialogDescription>
            {barber 
              ? 'Update barber information'
              : 'Fill in barber details'
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter barber name" {...field} />
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
              name="experience_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Years</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter years of experience" 
                      type="number" 
                      min="0"
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Specialties</FormLabel>
              <div className="space-y-2">
                {/* Display added tags */}
                <div className="flex flex-wrap gap-2">
                  {form.watch('specialties').map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {/* Input for adding new tags */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a specialty"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSpecialty} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter barber description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Availability
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to book this barber
                    </p>
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

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (barber ? 'Update Barber' : 'Create Barber')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}