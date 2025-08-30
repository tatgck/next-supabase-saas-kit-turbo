'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { WorkstationWithUsage } from '../types';

interface WorkstationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workstation: WorkstationWithUsage | null;
}

export function WorkstationDetailsDialog({
  open,
  onOpenChange,
  workstation,
}: WorkstationDetailsDialogProps) {
  if (!workstation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="workstations:details.title" values={{ number: workstation.number }} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                <Trans i18nKey="workstations:details.basicInfo" />
              </h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.number" />
                  </dt>
                  <dd>{workstation.number}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.type" />
                  </dt>
                  <dd className="capitalize">{workstation.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.status" />
                  </dt>
                  <dd className="capitalize">{workstation.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.shared" />
                  </dt>
                  <dd>
                    <If condition={workstation.is_shared}>
                      <span className="text-green-600">
                        <Trans i18nKey="common:yes" />
                      </span>
                    </If>
                  </dd>
                </div>
              </dl>
            </div>

          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                <Trans i18nKey="workstations:details.performance" />
              </h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:table.utilization" />
                  </dt>
                  <dd>{workstation.utilization}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:details.bookingsCount" />
                  </dt>
                  <dd>{workstation.bookings_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    <Trans i18nKey="workstations:details.revenue" />
                  </dt>
                  <dd>${workstation.revenue.toFixed(2)}</dd>
                </div>
                <If condition={workstation.last_used}>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      <Trans i18nKey="workstations:details.lastUsed" />
                    </dt>
                    <dd>{new Date(workstation.last_used).toLocaleDateString()}</dd>
                  </div>
                </If>
                <If condition={workstation.next_booking}>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      <Trans i18nKey="workstations:details.nextBooking" />
                    </dt>
                    <dd>{new Date(workstation.next_booking).toLocaleString()}</dd>
                  </div>
                </If>
              </dl>
            </div>

            <If condition={workstation.is_shared && workstation.shared_start_date && workstation.shared_end_date}>
              <div>
                <h3 className="font-semibold">
                  <Trans i18nKey="workstations:details.sharingPeriod" />
                </h3>
                <dl className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      <Trans i18nKey="workstations:details.startDate" />
                    </dt>
                    <dd>{new Date(workstation.shared_start_date).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      <Trans i18nKey="workstations:details.endDate" />
                    </dt>
                    <dd>{new Date(workstation.shared_end_date).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </If>

            <If condition={workstation.equipment && workstation.equipment.length > 0}>
              <div>
                <h3 className="font-semibold">
                  <Trans i18nKey="workstations:details.equipment" />
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {workstation.equipment.map((item, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </If>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}