'use client';

import { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Users,
  MoreVertical,
  CheckCircle,
  Clock,
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

import { StoreWithStats } from '../types';

interface StoresTableProps {
  stores: StoreWithStats[];
  loading?: boolean;
  onViewStore?: (store: StoreWithStats) => void;
  onEditStore?: (store: StoreWithStats) => void;
  onDeleteStore?: (store: StoreWithStats) => void;
  onApproveStore?: (store: StoreWithStats) => void;
  onRejectStore?: (store: StoreWithStats) => void;
}

const statusConfig = {
  active: { label: '营业中', variant: 'success' as const, icon: CheckCircle },
  pending: { label: '待审核', variant: 'warning' as const, icon: Clock },
  inactive: { label: '已停业', variant: 'destructive' as const, icon: XCircle },
  maintenance: { label: '维护中', variant: 'secondary' as const, icon: Clock }
};

export function StoresTable({
  stores,
  loading = false,
  onViewStore,
  onEditStore,
  onDeleteStore,
  onApproveStore,
  onRejectStore
}: StoresTableProps) {
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

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">暂无门店数据</p>
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
          {stores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {store.owner_id ? '已关联店主' : '无店主'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewStore && (
                        <DropdownMenuItem onClick={() => onViewStore(store)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                      )}
                      {onEditStore && (
                        <DropdownMenuItem onClick={() => onEditStore(store)}>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑门店
                        </DropdownMenuItem>
                      )}
                      {store.status === 'pending' && onApproveStore && (
                        <DropdownMenuItem onClick={() => onApproveStore(store)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          批准门店
                        </DropdownMenuItem>
                      )}
                      {store.status === 'pending' && onRejectStore && (
                        <DropdownMenuItem onClick={() => onRejectStore(store)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          拒绝门店
                        </DropdownMenuItem>
                      )}
                      {onDeleteStore && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteStore(store)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除门店
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={statusConfig[store.status].variant}>
                    {statusConfig[store.status].label}
                  </Badge>
                  {store.rating > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {store.rating}
                      <span className="ml-1">({store.review_count})</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="line-clamp-2">{store.address}</span>
                  </div>
                  
                  {store.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {store.phone}
                    </div>
                  )}
                  
                  {store.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {store.email}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{store.barber_count || 0}</div>
                      <div className="text-xs text-muted-foreground">理发师</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{store.workstation_count || 0}</div>
                      <div className="text-xs text-muted-foreground">工位</div>
                    </div>
                  </div>
                  
                  {store.monthly_revenue > 0 && (
                    <div className="text-center pt-2 border-t">
                      <div className="text-lg font-semibold text-green-600">
                        ¥{store.monthly_revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">月收入</div>
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
                  <th className="text-left p-4">门店信息</th>
                  <th className="text-left p-4">状态</th>
                  <th className="text-left p-4">评分</th>
                  <th className="text-left p-4">理发师</th>
                  <th className="text-left p-4">工位</th>
                  <th className="text-left p-4">月收入</th>
                  <th className="text-left p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {store.address}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusConfig[store.status].variant}>
                        {statusConfig[store.status].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {store.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {store.rating}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({store.review_count})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">暂无评分</span>
                      )}
                    </td>
                    <td className="p-4">{store.barber_count || 0}</td>
                    <td className="p-4">{store.workstation_count || 0}</td>
                    <td className="p-4">
                      {store.monthly_revenue > 0 ? (
                        <span className="font-medium text-green-600">
                          ¥{store.monthly_revenue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {onViewStore && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewStore(store)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {store.status === 'pending' && onApproveStore && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApproveStore(store)}
                          >
                            <CheckCircle className="h-4 w-4" />
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