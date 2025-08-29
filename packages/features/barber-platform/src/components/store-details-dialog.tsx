'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  User,
  Star,
  Users,
  Monitor
} from 'lucide-react';

interface StoreDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: any;
  onEdit?: (store: any) => void;
}

export function StoreDetailsDialog({
  open,
  onOpenChange,
  store,
  onEdit,
}: StoreDetailsDialogProps) {
  const statusConfig = {
    active: { label: 'Active', variant: 'success' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    inactive: { label: 'Inactive', variant: 'destructive' as const },
    maintenance: { label: 'Maintenance', variant: 'secondary' as const }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{store?.name || 'Unnamed Store'}</span>
            <Badge variant={statusConfig[store?.status || 'pending'].variant}>
              {statusConfig[store?.status || 'pending'].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Store details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{store?.address || 'No address provided'}</span>
            </div>

            {store?.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{store.phone}</span>
              </div>
            )}

            {store?.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{store.email}</span>
              </div>
            )}

            {store?.business_hours && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Business Hours: {JSON.stringify(store.business_hours)}</span>
              </div>
            )}

            {store?.owner_id && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Owner ID: {store.owner_id}</span>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{store?.barber_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Barbers</div>
                </div>
              </div>

              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-semibold">{store?.workstation_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Workstations</div>
                </div>
              </div>

              {store?.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
                  <div>
                    <div className="font-semibold">{store?.rating}</div>
                    <div className="text-sm text-muted-foreground">
                      Rating ({store?.review_count || 0} reviews)
                    </div>
                  </div>
                </div>
              )}

              {store?.monthly_revenue > 0 && (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">¥</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      ¥{(store?.monthly_revenue || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {store?.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{store.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(store!)}>
                Edit Store
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}