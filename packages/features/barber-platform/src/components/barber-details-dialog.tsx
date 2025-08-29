'use client';

import { 
  User, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';

interface BarberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barber?: any;
  onEdit?: () => void;
}

export function BarberDetailsDialog({
  open,
  onOpenChange,
  barber,
  onEdit,
}: BarberDetailsDialogProps) {
  if (!barber) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            {barber.name}
          </DialogTitle>
          <DialogDescription>
            理发师详细信息
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">基本信息</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge variant={barber.is_available ? 'success' : 'destructive'} className="mr-2">
                      {barber.is_available ? '可预约' : '不可预约'}
                    </Badge>
                    {barber.experience_years && (
                      <Badge variant="secondary">
                        {barber.experience_years}年经验
                      </Badge>
                    )}
                  </div>
                  
                  {barber.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {barber.phone}
                    </div>
                  )}
                  
                  {barber.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {barber.email}
                    </div>
                  )}
                </div>
              </div>

              {barber.specialty && barber.specialty.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">专长</h3>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(barber.specialty) ? (
                      barber.specialty.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">
                        {barber.specialty}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 统计信息 */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">统计数据</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-2xl font-bold">{barber.rating || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">评分</p>
                  <p className="text-xs">({barber.review_count || 0}评价)</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{barber.total_bookings || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">总预约数</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ¥{(barber.total_earnings || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">总收入</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{barber.experience_years || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">经验年限</p>
                </div>
              </div>
            </div>
          </div>

          {/* 描述 */}
          {barber.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">描述</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {barber.description}
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
            {onEdit && (
              <Button onClick={onEdit}>
                编辑信息
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}