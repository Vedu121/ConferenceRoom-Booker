import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CancelBookingModal = ({ booking, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(booking, reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const attendeeCount = booking?.attendeeCount || 0;
  const hasAttendees = attendeeCount > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Cancel Booking</h2>
            <p className="text-sm text-muted-foreground">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Booking Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-foreground">{booking?.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} />
                <span>{booking?.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={14} />
                <span>{formatDateTime(booking?.startTime)}</span>
              </div>
              {hasAttendees && (
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={14} />
                  <span>{attendeeCount} attendees will be notified</span>
                </div>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-warning">
                  Cancellation Notice
                </p>
                <ul className="text-sm text-foreground space-y-1">
                  <li>• The room will become available for other bookings</li>
                  {hasAttendees && (
                    <li>• All {attendeeCount} attendees will receive cancellation emails</li>
                  )}
                  <li>• This booking will be marked as cancelled in the system</li>
                  <li>• You can still view this booking in your history</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <Input
              label="Reason for cancellation (optional)"
              type="text"
              placeholder="e.g., Meeting postponed, Room no longer needed..."
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              description="This reason will be included in the cancellation email"
            />
          </div>

          {/* Email Preview */}
          {hasAttendees && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="Mail" size={14} className="text-primary" />
                Email Notification Preview
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Subject:</strong> Meeting Cancelled - {booking?.title}</p>
                <p><strong>Recipients:</strong> {attendeeCount} attendees</p>
                <p><strong>Content:</strong> Meeting details, cancellation reason, and next steps</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isLoading}
            iconName="Trash2"
            iconPosition="left"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;