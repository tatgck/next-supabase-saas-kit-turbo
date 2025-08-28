'use client';

import { 
  Store, 
  Users, 
  Monitor, 
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
  Eye,
  Clock
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Progress } from '@kit/ui/progress';
import { Badge } from '@kit/ui/badge';

import { StoreWithStats, WorkstationWithUsage, BarberWithStats } from '../types';

interface OperationsDashboardProps {
  stores: StoreWithStats[];
  workstations: WorkstationWithUsage[];
  barbers: BarberWithStats[];
  loading?: boolean;
  onViewStore?: (store: StoreWithStats) => void;
  onViewWorkstation?: (workstation: WorkstationWithUsage) => void;
  onViewBarber?: (barber: BarberWithStats) => void;
}

export function OperationsDashboard({
  stores,
  workstations,
  barbers,
  loading = false,
  onViewStore,
  onViewWorkstation,
  onViewBarber
}: OperationsDashboardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 计算统计数据
  const totalStores = stores.length;
  const activeStores = stores.filter(store => store.status === 'active').length;
  const pendingStores = stores.filter(store => store.status === 'pending').length;
  
  const totalWorkstations = workstations.length;
  const availableWorkstations = workstations.filter(ws => ws.status === 'available').length;
  const occupiedWorkstations = workstations.filter(ws => ws.status === 'occupied').length;
  const workstationUtilization = totalWorkstations > 0 
    ? Math.round((workstations.reduce((sum, ws) => sum + ws.utilization, 0) / totalWorkstations))
    : 0;
  
  const totalBarbers = barbers.length;
  const availableBarbers = barbers.filter(barber => barber.is_available).length;
  const totalRevenue = stores.reduce((sum, store) => sum + store.monthly_revenue, 0);
  const totalBookings = barbers.reduce((sum, barber) => sum + barber.total_bookings, 0);
  
  const avgBarberRating = totalBarbers > 0 
    ? Math.round((barbers.reduce((sum, barber) => sum + barber.rating, 0) / totalBarbers) * 100) / 100
    : 0;

  const topStores = [...stores]
    .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
    .slice(0, 3);

  const topBarbers = [...barbers]
    .sort((a, b) => b.total_earnings - a.total_earnings)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">门店总数</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStores}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="success">{activeStores} 营业中</Badge>
              <Badge variant="warning">{pendingStores} 待审核</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">工位总数</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkstations}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="success">{availableWorkstations} 可用</Badge>
              <Badge variant="warning">{occupiedWorkstations} 占用</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">理发师总数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBarbers}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="success">{availableBarbers} 可预约</Badge>
              <Badge variant="destructive">{totalBarbers - availableBarbers} 不可预约</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalBookings} 次预约
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">工位使用率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">平均使用率</span>
                <span className="text-sm font-medium">{workstationUtilization}%</span>
              </div>
              <Progress value={workstationUtilization} />
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(workstations.reduce((sum, ws) => sum + ws.bookings_count, 0) / totalWorkstations || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">平均预约数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ¥{Math.round(workstations.reduce((sum, ws) => sum + ws.revenue, 0) / totalWorkstations || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">平均收入</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(workstations.reduce((sum, ws) => sum + ws.utilization, 0) / totalWorkstations || 0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">平均利用率</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">理发师绩效</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">平均评分</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{avgBarberRating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(totalBookings / totalBarbers || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">人均预约</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ¥{Math.round(totalRevenue / totalBarbers || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">人均收入</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(barbers.reduce((sum, barber) => sum + barber.experience_years, 0) / totalBarbers || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">平均经验(年)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 排行榜 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              门店收入排行榜
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <div key={store.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ¥{store.monthly_revenue.toLocaleString()}
                    </div>
                    {onViewStore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewStore(store)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              理发师收入排行榜
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBarbers.map((barber, index) => (
                <div key={barber.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{barber.name}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {barber.rating}
                        <span className="ml-2">({barber.review_count}评价)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ¥{barber.total_earnings.toLocaleString()}
                    </div>
                    {onViewBarber && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewBarber(barber)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}