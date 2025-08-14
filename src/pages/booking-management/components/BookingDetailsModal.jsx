import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingDetailsModal = ({ booking, isOpen, onClose, onEdit, onCancel, userRole }) => {
  if (!isOpen || !booking) return null;

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { color: 'text-success', bgColor: 'bg-success/10', icon: 'CheckCircle' },
      pending: { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'Clock' },
      cancelled: { color: 'text-error', bgColor: 'bg-error/10', icon: 'XCircle' },
      completed: { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: 'Check' }
    };
    return configs?.[status] || configs?.pending;
  };

  const startDateTime = formatDateTime(booking?.startTime);
  const endDateTime = formatDateTime(booking?.endTime);
  const statusConfig = getStatusConfig(booking?.status);

  const canEdit = userRole !== 'reception' && booking?.organizer === 'Sarah Johnson' &&
    booking?.status !== 'cancelled' && booking?.status !== 'completed';
  const canCancel = userRole !== 'reception' && booking?.organizer === 'Sarah Johnson' &&
    booking?.status !== 'cancelled' && booking?.status !== 'completed';

  const attendeesList = booking?.attendees || [
    "mike.chen@company.com",
    "emily.davis@company.com",
    "james.wilson@company.com",
    "lisa.brown@company.com"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
              <p className="text-sm text-muted-foreground">ID: {booking?.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            className="p-2"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-foreground mb-2">{booking?.title}</h3>
              {booking?.description && (
                <p className="text-muted-foreground">{booking?.description}</p>
              )}
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig?.bgColor}`}>
              <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
              <span className={`text-sm font-medium ${statusConfig?.color}`}>
                {booking?.status?.charAt(0)?.toUpperCase() + booking?.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Meeting Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                Date & Time
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
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
                  <Icon name="Timer" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60))} minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Room & Organizer */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                Location & Host
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{booking?.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{booking?.organizer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{booking?.attendeeCount} attendees</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees List */}
          <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Icon name="Users" size={16} className="text-primary" />
              Attendees ({attendeesList?.length})
            </h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attendeesList?.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={12} color="white" />
                    </div>
                    <span className="text-sm text-foreground truncate">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-primary" />
              Additional Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground ml-2">
                  {new Date(booking.createdAt || Date.now())?.toLocaleDateString('en-US')}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="text-foreground ml-2 font-mono">{booking?.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Room Capacity:</span>
                <span className="text-foreground ml-2">12 people</span>
              </div>
              <div>
                <span className="text-muted-foreground">Equipment:</span>
                <span className="text-foreground ml-2">Projector, Whiteboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {booking?.status === 'confirmed' && (
              <span className="flex items-center gap-1">
                <Icon name="Mail" size={14} />
                Email notifications sent to all attendees
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(booking)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Booking
              </Button>
            )}

            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => onCancel(booking)}
                iconName="Trash2"
                iconPosition="left"
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;