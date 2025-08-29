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
            Barber Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Badge variant={barber.is_available ? 'success' : 'destructive'} className="mr-2">
                      {barber.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                    {barber.experience_years && (
                      <Badge variant="secondary">
                        {barber.experience_years} years
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
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Specialties</h3>
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

            {/* Statistics */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-2xl font-bold">{barber.rating || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Rating</p>
                  <p className="text-xs">({barber.review_count || 0} reviews)</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{barber.total_bookings || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ¥{(barber.total_earnings || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total Earnings</p>
                </div>

                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{barber.experience_years || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Experience Years</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {barber.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {barber.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={onEdit}>
                Edit Information
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}