'use client';

import { useState, useEffect } from 'react';

import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';
import { createBarberPlatformClientService } from '../lib/client/services';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

interface BookingSlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  max_bookings: number;
  is_active: boolean;
}

interface BookingSlotsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workstation: WorkstationWithUsage | null;
  onSuccess: () => void;
}

export function BookingSlotsDialog({
  open,
  onOpenChange,
  workstation,
  onSuccess,
}: BookingSlotsDialogProps) {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const service = createBarberPlatformClientService(supabase);

  useEffect(() => {
    if (open && workstation) {
      fetchBookingSlots();
    }
  }, [open, workstation]);

  const fetchBookingSlots = async () => {
    try {
      // 这里需要实现获取预约时间段的逻辑
      // 暂时使用模拟数据
      const mockSlots: BookingSlot[] = [
        {
          day_of_week: 1,
          start_time: '09:00',
          end_time: '12:00',
          max_bookings: 2,
          is_active: true,
        },
        {
          day_of_week: 1,
          start_time: '14:00',
          end_time: '18:00',
          max_bookings: 3,
          is_active: true,
        },
      ];
      setSlots(mockSlots);
    } catch (error) {
      console.error('Error fetching booking slots:', error);
      toast.error('Failed to load booking slots');
    }
  };

  const addNewSlot = () => {
    setSlots([
      ...slots,
      {
        day_of_week: 0,
        start_time: '09:00',
        end_time: '17:00',
        max_bookings: 1,
        is_active: true,
      },
    ]);
  };

  const updateSlot = (index: number, field: keyof BookingSlot, value: any) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const saveSlots = async () => {
    if (!workstation) return;

    setIsLoading(true);
    try {
      // 这里需要实现保存预约时间段的逻辑
      console.log('Saving booking slots:', slots);
      toast.success('Booking slots saved successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save booking slots');
      console.error('Error saving booking slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workstation) return null;

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Trans 
              i18nKey="workstations:bookingSlots.title" 
              values={{ number: workstation.number }}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              <Trans i18nKey="workstations:bookingSlots.availableSlots" />
            </h3>
            <Button onClick={addNewSlot} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <Trans i18nKey="workstations:bookingSlots.addSlot" />
            </Button>
          </div>

          {slots.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <Trans i18nKey="workstations:bookingSlots.noSlots" />
            </p>
          ) : (
            <div className="space-y-3">
              {slots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <select
                    value={slot.day_of_week}
                    onChange={(e) => updateSlot(index, 'day_of_week', parseInt(e.target.value))}
                    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {daysOfWeek.map((day, dayIndex) => (
                      <option key={dayIndex} value={dayIndex}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                    className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />

                  <span>-</span>

                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                    className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />

                  <input
                    type="number"
                    min="1"
                    value={slot.max_bookings}
                    onChange={(e) => updateSlot(index, 'max_bookings', parseInt(e.target.value))}
                    className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Max"
                  />

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={slot.is_active}
                      onChange={(e) => updateSlot(index, 'is_active', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      <Trans i18nKey="common:active" />
                    </span>
                  </label>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSlot(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <Trans i18nKey="common:cancel" />
            </Button>
            <Button
              onClick={saveSlots}
              disabled={isLoading}
            >
              {isLoading ? (
                <Trans i18nKey="common:saving" />
              ) : (
                <Trans i18nKey="common:save" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}