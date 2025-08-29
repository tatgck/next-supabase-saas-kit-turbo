'use client';

import { useState } from 'react';
import { 
  Monitor, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@kit/ui/dropdown-menu';
import { Badge } from '@kit/ui/badge';
import { Skeleton } from '@kit/ui/skeleton';

import { WorkstationWithUsage } from '../types';

interface WorkstationsTableProps {
  workstations: WorkstationWithUsage[];
  loading?: boolean;
  onViewWorkstation?: (workstation: WorkstationWithUsage) => void;
  onEditWorkstation?: (workstation: WorkstationWithUsage) => void;
  onDeleteWorkstation?: (workstation: WorkstationWithUsage) => void;
  onAssignBarber?: (workstation: WorkstationWithUsage) => void;
}

const statusConfig = {
  available: { label: '可用', variant: 'success' as const, icon: CheckCircle },
  occupied: { label: '占用中', variant: 'warning' as const, icon: Clock },
  reserved: { label: '已预约', variant: 'info' as const, icon: Clock },
  maintenance: { label: '维护中', variant: 'destructive' as const, icon: XCircle }
};

const typeConfig = {
  standard: { label: '标准', variant: 'secondary' as const },
  premium: { label: '高级', variant: 'default' as const },
  vip: { label: 'VIP', variant: 'primary' as const }
};

export function WorkstationsTable({
  workstations,
  loading = false,
  onViewWorkstation,
  onEditWorkstation,
  onDeleteWorkstation,
  onAssignBarber
}: WorkstationsTableProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!workstations || workstations.length === 0) {
    return (
      <div className="text-center py-12">
        <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No workstation data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            网格视图
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            列表视图
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workstations.map((workstation) => (
            <Card key={workstation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">工位 {workstation.number}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={typeConfig[workstation.type].variant}>
                        {typeConfig[workstation.type].label}
                      </Badge>
                      <Badge variant={statusConfig[workstation.status].variant}>
                        {statusConfig[workstation.status].label}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewWorkstation && (
                        <DropdownMenuItem onClick={() => onViewWorkstation(workstation)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                      )}
                      {onEditWorkstation && (
                        <DropdownMenuItem onClick={() => onEditWorkstation(workstation)}>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑工位
                        </DropdownMenuItem>
                      )}
                      {onAssignBarber && workstation.status === 'available' && (
                        <DropdownMenuItem onClick={() => onAssignBarber(workstation)}>
                          <Users className="h-4 w-4 mr-2" />
                          分配理发师
                        </DropdownMenuItem>
                      )}
                      {onDeleteWorkstation && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteWorkstation(workstation)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除工位
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{workstation.utilization}%</div>
                      <div className="text-xs text-muted-foreground">使用率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{workstation.bookings_count}</div>
                      <div className="text-xs text-muted-foreground">预约数</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>¥{workstation.hourly_rate}/时</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>¥{workstation.daily_rate}/天</span>
                    </div>
                  </div>
                  
                  {workstation.revenue > 0 && (
                    <div className="text-center pt-2 border-t">
                      <div className="text-lg font-semibold text-green-600">
                        ¥{workstation.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">总收入</div>
                    </div>
                  )}
                  
                  {workstation.current_barber_id && (
                    <div className="flex items-center text-sm pt-2 border-t">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>当前理发师: {workstation.current_barber_id}</span>
                    </div>
                  )}
                  
                  {workstation.next_booking && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>下次预约: {new Date(workstation.next_booking).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">工位信息</th>
                  <th className="text-left p-4">类型</th>
                  <th className="text-left p-4">状态</th>
                  <th className="text-left p-4">使用率</th>
                  <th className="text-left p-4">预约数</th>
                  <th className="text-left p-4">时薪</th>
                  <th className="text-left p-4">总收入</th>
                  <th className="text-left p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {workstations.map((workstation) => (
                  <tr key={workstation.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">工位 {workstation.number}</div>
                        <div className="text-sm text-muted-foreground">
                          {workstation.equipment?.join(', ') || '无设备'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={typeConfig[workstation.type].variant}>
                        {typeConfig[workstation.type].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusConfig[workstation.status].variant}>
                        {statusConfig[workstation.status].label}
                      </Badge>
                    </td>
                    <td className="p-4">{workstation.utilization}%</td>
                    <td className="p-4">{workstation.bookings_count}</td>
                    <td className="p-4">¥{workstation.hourly_rate}</td>
                    <td className="p-4">
                      {workstation.revenue > 0 ? (
                        <span className="font-medium text-green-600">
                          ¥{workstation.revenue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {onViewWorkstation && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewWorkstation(workstation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onAssignBarber && workstation.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAssignBarber(workstation)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}