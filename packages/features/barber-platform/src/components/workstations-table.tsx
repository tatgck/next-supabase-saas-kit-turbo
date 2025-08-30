'use client';

import { useState } from 'react';

import { Eye, PenSquare, Calendar, UserPlus, Grid, Table, Percent } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@kit/ui/button';
import { DataTable } from '@kit/ui/data-table';
import { If } from '@kit/ui/if';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';
import { WorkstationDetailsDialog } from './workstation-details-dialog';
import { WorkstationEditDialog } from './workstation-edit-dialog';
import { AssignBarberDialog } from './assign-barber-dialog';
import { BookingSlotsDialog } from './booking-slots-dialog';
import { WorkstationsCardView } from './workstations-card-view';
import { DiscountDialog } from './discount-dialog';

interface WorkstationsTableProps {
  workstations: WorkstationWithUsage[];
  onRefresh: () => void;
}

export function WorkstationsTable({ workstations, onRefresh }: WorkstationsTableProps) {
  const [selectedWorkstation, setSelectedWorkstation] = useState<WorkstationWithUsage | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [bookingSlotsDialogOpen, setBookingSlotsDialogOpen] = useState(false);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

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

  const columns: ColumnDef<WorkstationWithUsage>[] = [
    {
      accessorKey: 'number',
      header: () => <Trans i18nKey="workstations:table.number" />,
      cell: ({ row }) => <span className="font-medium">{row.getValue('number')}</span>
    },
    {
      accessorKey: 'type',
      header: () => <Trans i18nKey="workstations:table.type" />,
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue('type')}</span>
      )
    },
    {
      accessorKey: 'status',
      header: () => <Trans i18nKey="workstations:table.status" />,
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue('status')}</span>
      )
    },
    {
      accessorKey: 'is_shared',
      header: () => <Trans i18nKey="workstations:table.shared" />,
      cell: ({ row }) => (
        <If condition={row.getValue('is_shared')}>
          <span className="text-green-600">
            <Trans i18nKey="common:yes" />
          </span>
        </If>
      )
    },
    {
      accessorKey: 'hourly_rate',
      header: () => <Trans i18nKey="workstations:table.hourlyRate" />,
      cell: ({ row }) => `$${Number(row.getValue('hourly_rate')).toFixed(2)}`
    },
    {
      accessorKey: 'daily_rate',
      header: () => <Trans i18nKey="workstations:table.dailyRate" />,
      cell: ({ row }) => `$${Number(row.getValue('daily_rate')).toFixed(2)}`
    },
    {
      accessorKey: 'utilization',
      header: () => <Trans i18nKey="workstations:table.utilization" />,
      cell: ({ row }) => `${row.getValue('utilization')}%`
    },
    {
      id: 'actions',
      header: () => <Trans i18nKey="common:actions" />,
      cell: ({ row }) => {
        const workstation = row.original;
        
        return (
          <div className="flex space-x-2">
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
        );
      }
    }
  ];

  return (
    <>
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('card')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4 mr-2" />
            <Trans i18nKey="common:cardView" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="rounded-l-none"
          >
            <Table className="h-4 w-4 mr-2" />
            <Trans i18nKey="common:tableView" />
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={workstations}
          emptyMessage={<Trans i18nKey="workstations:table.empty" />}
        />
      ) : (
        <WorkstationsCardView 
          workstations={workstations}
          onRefresh={onRefresh}
        />
      )}

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