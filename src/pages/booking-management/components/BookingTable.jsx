import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingTable = ({ bookings, onViewDetails, onEditBooking, onCancelBooking, userRole }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', direction: 'asc' });

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      pending: { color: 'bg-warning/10 text-warning', icon: 'Clock' },
      cancelled: { color: 'bg-error/10 text-error', icon: 'XCircle' },
      completed: { color: 'bg-muted text-muted-foreground', icon: 'Check' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date?.getFullYear() !== new Date()?.getFullYear() ? 'numeric' : undefined
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = React.useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig?.key) {
      sortableBookings?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const canEditBooking = (booking) => {
    if (userRole === 'reception') return false;
    return booking?.organizer === 'Sarah Johnson' && booking?.status !== 'cancelled' && booking?.status !== 'completed';
  };

  const canCancelBooking = (booking) => {
    if (userRole === 'reception') return false;
    return booking?.organizer === 'Sarah Johnson' && booking?.status !== 'cancelled' && booking?.status !== 'completed';
  };

  if (bookings?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
        <p className="text-muted-foreground mb-4">
          {userRole === 'reception' 
            ? "There are no bookings matching your current filters." :"You haven't made any bookings yet. Start by booking a room for your next meeting."
          }
        </p>
        {userRole !== 'reception' && (
          <Button variant="default" iconName="Plus" iconPosition="left">
            Book a Room
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Meeting Title
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('room')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Room
                  {getSortIcon('room')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('organizer')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Organizer
                  {getSortIcon('organizer')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('startTime')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Date & Time
                  {getSortIcon('startTime')}
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Attendees</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings?.map((booking) => {
              const startDateTime = formatDateTime(booking?.startTime);
              const endDateTime = formatDateTime(booking?.endTime);
              
              return (
                <tr key={booking?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{booking?.title}</p>
                      {booking?.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                          {booking?.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{booking?.room}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} color="white" />
                      </div>
                      <span className="text-sm text-foreground">{booking?.organizer}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{startDateTime?.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {startDateTime?.time} - {endDateTime?.time}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{booking?.attendeeCount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(booking?.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(booking)}
                        iconName="Eye"
                        className="p-2"
                      />
                      {canEditBooking(booking) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditBooking(booking)}
                          iconName="Edit"
                          className="p-2"
                        />
                      )}
                      {canCancelBooking(booking) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelBooking(booking)}
                          iconName="Trash2"
                          className="p-2 text-error hover:text-error hover:bg-error/10"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedBookings?.map((booking) => {
          const startDateTime = formatDateTime(booking?.startTime);
          const endDateTime = formatDateTime(booking?.endTime);
          
          return (
            <div key={booking?.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{booking?.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon name="MapPin" size={12} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{booking?.room}</span>
                  </div>
                </div>
                {getStatusBadge(booking?.status)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{booking?.organizer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{startDateTime?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {startDateTime?.time} - {endDateTime?.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{booking?.attendeeCount} attendees</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(booking)}
                  iconName="Eye"
                  iconPosition="left"
                  className="flex-1"
                >
                  View
                </Button>
                {canEditBooking(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBooking(booking)}
                    iconName="Edit"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                )}
                {canCancelBooking(booking) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancelBooking(booking)}
                    iconName="Trash2"
                    className="text-error hover:text-error hover:bg-error/10 border-error/20"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTable;