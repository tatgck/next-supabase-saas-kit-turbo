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

const barberFormSchema = z.object({
  name: z.string().min(1, '理发师姓名是必填项'),
  phone: z.string().optional(),
  email: z.string().email('请输入有效的邮箱地址').optional().or(z.literal('')),
  experience_years: z.coerce.number().min(0, '经验年限不能为负数').optional(),
  specialty: z.string().optional(),
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
      experience_years: undefined,
      specialty: '',
      description: '',
      is_available: true,
    },
  });

  // 当barber变化或对话框打开时重置表单值
  useEffect(() => {
    if (open) {
      if (barber) {
        form.reset({
          name: barber.name || '',
          phone: barber.phone || '',
          email: barber.email || '',
          experience_years: barber.experience_years || undefined,
          specialty: Array.isArray(barber.specialty) ? barber.specialty.join(', ') : barber.specialty || '',
          description: barber.description || '',
          is_available: barber.is_available ?? true,
        });
      } else {
        // 如果是新增，清空表单
        form.reset({
          name: '',
          phone: '',
          email: '',
          experience_years: undefined,
          specialty: '',
          description: '',
          is_available: true,
        });
      }
    }
  }, [barber, form, open]);

  const handleSubmit = async (data: BarberFormValues) => {
    try {
      // 将specialty字符串转换为数组
      const submitData = {
        ...data,
        specialty: data.specialty ? data.specialty.split(',').map(s => s.trim()).filter(Boolean) : []
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
            {barber ? '编辑理发师' : '新增理发师'}
          </DialogTitle>
          <DialogDescription>
            {barber 
              ? '更新理发师信息'
              : '填写理发师详细信息'
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
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入理发师姓名" {...field} />
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
                  <FormLabel>电话</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入电话号码" {...field} />
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
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入邮箱地址" type="email" {...field} />
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
                  <FormLabel>经验年限</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="请输入经验年限" 
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

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专长</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="请输入专长，多个用逗号分隔" 
                      {...field} 
                    />
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
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="请输入理发师描述信息" 
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
                      可预约状态
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      是否允许客户预约该理发师
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
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : (barber ? '更新理发师' : '创建理发师')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}