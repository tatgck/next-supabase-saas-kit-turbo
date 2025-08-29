'use client';

import { useState } from 'react';
import { 
  User, 
  Star, 
  DollarSign,
  Calendar,
  MapPin,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail
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

import { BarberWithStats } from '../types';

interface BarbersTableProps {
  barbers: BarberWithStats[];
  loading?: boolean;
  onViewBarber?: (barber: BarberWithStats) => void;
  onEditBarber?: (barber: BarberWithStats) => void;
  onDeleteBarber?: (barber: BarberWithStats) => void;
  onToggleAvailability?: (barber: BarberWithStats) => void;
}

export function BarbersTable({
  barbers,
  loading = false,
  onViewBarber,
  onEditBarber,
  onDeleteBarber,
  onToggleAvailability
}: BarbersTableProps) {
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

  if (barbers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No barber data available</p>
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
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            List View
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{barber.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={barber.is_available ? 'success' : 'destructive'}>
                        {barber.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                      {barber.experience_years && (
                        <Badge variant="secondary">
                          {barber.experience_years} years
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewBarber && (
                        <DropdownMenuItem onClick={() => onViewBarber(barber)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      {onEditBarber && (
                        <DropdownMenuItem onClick={() => onEditBarber(barber)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Information
                        </DropdownMenuItem>
                      )}
                      {onToggleAvailability && (
                        <DropdownMenuItem onClick={() => onToggleAvailability(barber)}>
                          {barber.is_available ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Set as Unavailable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Set as Available
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      {onDeleteBarber && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteBarber(barber)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Barber
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {barber.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="font-medium">{barber.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({barber.review_count} reviews)
                      </span>
                    </div>
                  )}
                  
                  {barber.specialty && barber.specialty.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Specialty: </span>
                      {barber.specialty.join(', ')}
                    </div>
                  )}
                  
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
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{barber.total_bookings}</div>
                      <div className="text-xs text-muted-foreground">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ¥{barber.total_earnings.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Earnings</div>
                    </div>
                  </div>
                  
                  {barber.description && (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      {barber.description}
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
                  <th className="text-left p-4">Barber Info</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Experience</th>
                  <th className="text-left p-4">Total Bookings</th>
                  <th className="text-left p-4">Total Earnings</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {barbers.map((barber) => (
                  <tr key={barber.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{barber.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {barber.specialty?.join(', ') || 'No specialty'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={barber.is_available ? 'success' : 'destructive'}>
                        {barber.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {barber.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {barber.rating}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({barber.review_count})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No ratings yet</span>
                      )}
                    </td>
                    <td className="p-4">
                      {barber.experience_years ? `${barber.experience_years} years` : '-'}
                    </td>
                    <td className="p-4">{barber.total_bookings}</td>
                    <td className="p-4">
                      <span className="font-medium text-green-600">
                        ¥{barber.total_earnings.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {onViewBarber && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewBarber(barber)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onToggleAvailability && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleAvailability(barber)}
                          >
                            {barber.is_available ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
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