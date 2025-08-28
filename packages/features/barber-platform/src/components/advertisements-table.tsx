'use client';

import { useState } from 'react';
import { 
  Megaphone, 
  Eye, 
  MousePointer,
  TrendingUp,
  Calendar,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  AlertCircle
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

import { AdvertisementWithMetrics } from '../types';

interface AdvertisementsTableProps {
  advertisements: AdvertisementWithMetrics[];
  loading?: boolean;
  onViewAdvertisement?: (advertisement: AdvertisementWithMetrics) => void;
  onEditAdvertisement?: (advertisement: AdvertisementWithMetrics) => void;
  onDeleteAdvertisement?: (advertisement: AdvertisementWithMetrics) => void;
  onToggleStatus?: (advertisement: AdvertisementWithMetrics) => void;
}

const statusConfig = {
  active: { label: '进行中', variant: 'success' as const, icon: Play },
  paused: { label: '已暂停', variant: 'warning' as const, icon: Pause },
  draft: { label: '草稿', variant: 'secondary' as const, icon: Edit },
  expired: { label: '已过期', variant: 'destructive' as const, icon: AlertCircle }
};

const typeConfig = {
  banner: { label: '横幅广告', variant: 'default' as const },
  popup: { label: '弹窗广告', variant: 'secondary' as const },
  video: { label: '视频广告', variant: 'primary' as const },
  text: { label: '文字广告', variant: 'outline' as const }
};

const platformConfig = {
  web: { label: '网页端', variant: 'secondary' as const },
  mobile: { label: '移动端', variant: 'default' as const },
  all: { label: '全平台', variant: 'primary' as const }
};

const priorityConfig = {
  low: { label: '低', variant: 'secondary' as const },
  medium: { label: '中', variant: 'default' as const },
  high: { label: '高', variant: 'warning' as const },
  urgent: { label: '紧急', variant: 'destructive' as const }
};

export function AdvertisementsTable({
  advertisements,
  loading = false,
  onViewAdvertisement,
  onEditAdvertisement,
  onDeleteAdvertisement,
  onToggleStatus
}: AdvertisementsTableProps) {
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

  if (advertisements.length === 0) {
    return (
      <div className="text-center py-12">
        <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">暂无广告数据</p>
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
          {advertisements.map((ad) => (
            <Card key={ad.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{ad.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant={typeConfig[ad.type].variant}>
                        {typeConfig[ad.type].label}
                      </Badge>
                      <Badge variant={platformConfig[ad.platform].variant}>
                        {platformConfig[ad.platform].label}
                      </Badge>
                      <Badge variant={statusConfig[ad.status].variant}>
                        {statusConfig[ad.status].label}
                      </Badge>
                      <Badge variant={priorityConfig[ad.priority].variant}>
                        {priorityConfig[ad.priority].label}
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
                      {onViewAdvertisement && (
                        <DropdownMenuItem onClick={() => onViewAdvertisement(ad)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                      )}
                      {onEditAdvertisement && (
                        <DropdownMenuItem onClick={() => onEditAdvertisement(ad)}>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑广告
                        </DropdownMenuItem>
                      )}
                      {onToggleStatus && (ad.status === 'active' || ad.status === 'paused') && (
                        <DropdownMenuItem onClick={() => onToggleStatus(ad)}>
                          {ad.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              暂停广告
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              启动广告
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      {onDeleteAdvertisement && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteAdvertisement(ad)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除广告
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {ad.content.length > 100 ? `${ad.content.substring(0, 100)}...` : ad.content}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{ad.impressions.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">展示次数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{ad.clicks.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">点击次数</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {ad.ctr > 0 ? `${ad.ctr.toFixed(2)}%` : '0%'}
                      </div>
                      <div className="text-xs text-muted-foreground">点击率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {ad.conversions.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">转化次数</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        ¥{ad.budget.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">预算</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-orange-600">
                        ¥{ad.spent.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">已花费</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{new Date(ad.start_date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-muted-foreground">至</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{new Date(ad.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {ad.target_audience && (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      <span className="font-medium">目标受众: </span>
                      {ad.target_audience}
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
                  <th className="text-left p-4">广告信息</th>
                  <th className="text-left p-4">类型</th>
                  <th className="text-left p-4">平台</th>
                  <th className="text-left p-4">状态</th>
                  <th className="text-left p-4">展示/点击</th>
                  <th className="text-left p-4">点击率</th>
                  <th className="text-left p-4">预算/花费</th>
                  <th className="text-left p-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {advertisements.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {ad.content.length > 50 ? `${ad.content.substring(0, 50)}...` : ad.content}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={typeConfig[ad.type].variant}>
                        {typeConfig[ad.type].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={platformConfig[ad.platform].variant}>
                        {platformConfig[ad.platform].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusConfig[ad.status].variant}>
                        {statusConfig[ad.status].label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{ad.impressions.toLocaleString()} 展示</div>
                        <div>{ad.clicks.toLocaleString()} 点击</div>
                      </div>
                    </td>
                    <td className="p-4">
                      {ad.ctr > 0 ? `${ad.ctr.toFixed(2)}%` : '0%'}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>预算: ¥{ad.budget.toLocaleString()}</div>
                        <div className="text-orange-600">花费: ¥{ad.spent.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {onViewAdvertisement && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewAdvertisement(ad)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onToggleStatus && (ad.status === 'active' || ad.status === 'paused') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleStatus(ad)}
                          >
                            {ad.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
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