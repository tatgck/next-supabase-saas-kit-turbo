'use client';

import { useState } from 'react';
import { Eye, PenSquare, Calendar, UserPlus, Monitor, Percent } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';
import { WorkstationDetailsDialog } from './workstation-details-dialog';
import { WorkstationEditDialog } from './workstation-edit-dialog';
import { AssignBarberDialog } from './assign-barber-dialog';
import { BookingSlotsDialog } from './booking-slots-dialog';
import { DiscountDialog } from './discount-dialog';

interface WorkstationsCardViewProps {
  workstations: WorkstationWithUsage[];
  onRefresh: () => void;
}

export function WorkstationsCardView({ workstations, onRefresh }: WorkstationsCardViewProps) {
  const [selectedWorkstation, setSelectedWorkstation] = useState<WorkstationWithUsage | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [bookingSlotsDialogOpen, setBookingSlotsDialogOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);

  const handleViewDetails = (workstation: WorkstationWithUsage) => {
    setSelectedWorkstation(workstation);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (workstation: WorkstationWithUsage) => {
    setSelectedWorkstation(workstation);
    setEditDialogOpen(true);
  };

  const handleAssignBarber = (workstation: WorkstationWithUsage) => {
    setSelectedWorkstation(workstation);
    setAssignDialogOpen(true);
  };

  const handleManageBookingSlots = (workstation: WorkstationWithUsage) => {
    setSelectedWorkstation(workstation);
    setBookingSlotsDialogOpen(true);
  };

  const handleManageDiscount = (workstation: WorkstationWithUsage) => {
    setSelectedWorkstation(workstation);
    setDiscountDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'warning';
      case 'maintenance': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'premium': return 'secondary';
      case 'vip': return 'default';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {workstations.map((workstation) => (
          <Card key={workstation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    {workstation.number}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusColor(workstation.status)}>
                      <Trans i18nKey={`workstations:status.${workstation.status}`} />
                    </Badge>
                    <Badge variant={getTypeColor(workstation.type)}>
                      <Trans i18nKey={`workstations:type.${workstation.type}`} />
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.utilization" />
                  </span>
                  <span className="font-medium">
                    {workstation.utilization}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    <Trans i18nKey="workstations:details.bookingsCount" />
                  </span>
                  <span className="font-medium">
                    {workstation.bookings_count}
                  </span>
                </div>
              </div>


              {/* Store Information */}
              {workstation.store && (
                <div className="text-sm border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      <Trans i18nKey="workstations:store" />
                    </span>
                    <span className="font-medium">
                      {workstation.store.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Shared Status */}
              {workstation.is_shared && (
                <div className="text-sm text-green-600 border-t pt-3">
                  <Trans i18nKey="workstations:shared.available" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-3 border-t">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewDetails(workstation)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(workstation)}
                  title="Edit Workstation"
                >
                  <PenSquare className="h-4 w-4" />
                </Button>

                <If condition={workstation.status === 'available'}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAssignBarber(workstation)}
                    title="Assign Barber"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </If>

                <If condition={workstation.is_shared}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleManageBookingSlots(workstation)}
                    title="Manage Booking Slots"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </If>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleManageDiscount(workstation)}
                  title="Manage Discount"
                >
                  <Percent className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <WorkstationDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        workstation={selectedWorkstation}
      />

      <WorkstationEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        workstation={selectedWorkstation}
        onSuccess={onRefresh}
      />

      <AssignBarberDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        workstation={selectedWorkstation}
        onSuccess={onRefresh}
      />

      <BookingSlotsDialog
        open={bookingSlotsDialogOpen}
        onOpenChange={setBookingSlotsDialogOpen}
        workstation={selectedWorkstation}
        onSuccess={onRefresh}
      />

      <DiscountDialog
        open={discountDialogOpen}
        onOpenChange={setDiscountDialogOpen}
        workstation={selectedWorkstation}
        onSuccess={onRefresh}
      />
    </>
  );
}