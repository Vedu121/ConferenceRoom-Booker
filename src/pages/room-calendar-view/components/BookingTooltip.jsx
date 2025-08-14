import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingTooltip = ({ 
  booking, 
  isVisible, 
  position, 
  onClose, 
  onEdit, 
  onCancel 
}) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef?.current && !tooltipRef?.current?.contains(event?.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !booking) return null;

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours === 0) {
      return `${diffMinutes}m`;
    } else if (diffMinutes === 0) {
      return `${diffHours}h`;
    } else {
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  const getStatusColor = () => {
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    if (now < start) return 'text-primary';
    if (now >= start && now <= end) return 'text-success';
    return 'text-muted-foreground';
  };

  const getStatusText = () => {
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'In Progress';
    return 'Completed';
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-1030 bg-popover border border-border rounded-lg shadow-elevation-4 p-4 max-w-sm w-80 animate-fade-in"
      style={{
        left: position?.x,
        top: position?.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-popover-foreground truncate">
            {booking?.title}
          </h4>
          <div className={`text-xs font-medium mt-1 ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 -mt-1 -mr-1"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>
      {/* Details */}
      <div className="space-y-2 mb-4">
        {/* Time */}
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Clock" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-popover-foreground">
            {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
          </span>
          <span className="text-muted-foreground">
            ({getDuration()})
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Calendar" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-popover-foreground">
            {formatDate(booking?.startTime)}
          </span>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="User" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-popover-foreground">
            {booking?.organizer}
          </span>
        </div>

        {/* Attendees */}
        {booking?.attendees && booking?.attendees?.length > 0 && (
          <div className="flex items-start space-x-2 text-sm">
            <Icon name="Users" size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-popover-foreground">
                {booking?.attendees?.length} attendee{booking?.attendees?.length !== 1 ? 's' : ''}
              </span>
              {booking?.attendees?.length <= 3 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {booking?.attendees?.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {booking?.description && (
          <div className="flex items-start space-x-2 text-sm">
            <Icon name="FileText" size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-popover-foreground text-xs leading-relaxed">
              {booking?.description}
            </p>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(booking)}
          className="text-xs"
        >
          <Icon name="Edit" size={12} className="mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel(booking)}
          className="text-xs text-error hover:text-error hover:bg-error/10"
        >
          <Icon name="Trash2" size={12} className="mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BookingTooltip;