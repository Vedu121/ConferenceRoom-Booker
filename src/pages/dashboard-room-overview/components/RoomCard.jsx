import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoomCard = ({ room, userRole = 'employee' }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'available':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Available'
        };
      case 'occupied':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'XCircle',
          label: 'Occupied'
        };
      case 'upcoming':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Clock',
          label: 'Upcoming Booking'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          icon: 'AlertCircle',
          label: 'Unknown'
        };
    }
  };

  const handleBookRoom = () => {
    navigate('/room-booking-form', { state: { selectedRoom: room } });
  };

  const statusConfig = getStatusConfig(room?.status);

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-6 transition-smooth hover:shadow-elevation-3">
      {/* Room Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {room?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Floor {room?.floor} • Capacity: {room?.capacity} people
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig?.bgColor}`}>
          <Icon 
            name={statusConfig?.icon} 
            size={14} 
            className={statusConfig?.color}
          />
          <span className={`text-xs font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
      </div>
      {/* Room Details */}
      <div className="space-y-3 mb-4">
        {/* Equipment */}
        <div className="flex items-center space-x-2">
          <Icon name="Monitor" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {room?.equipment?.join(', ')}
          </span>
        </div>

        {/* Current Status Info */}
        {room?.status === 'occupied' && room?.currentBooking && (
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {room?.currentBooking?.organizer} until {room?.currentBooking?.endTime}
            </span>
          </div>
        )}

        {room?.status === 'upcoming' && room?.nextBooking && (
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Next: {room?.nextBooking?.startTime} - {room?.nextBooking?.organizer}
            </span>
          </div>
        )}

        {/* Next Available */}
        {room?.nextAvailable && (
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-success" />
            <span className="text-sm text-success">
              Available from {room?.nextAvailable}
            </span>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => navigate('/room-calendar-view', { state: { selectedRoom: room } })}
          className="text-sm"
        >
          <Icon name="Calendar" size={16} className="mr-2" />
          View Schedule
        </Button>

        {userRole === 'employee' && room?.status === 'available' && (
          <Button
            variant="default"
            onClick={handleBookRoom}
            className="text-sm"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Book Room
          </Button>
        )}

        {userRole === 'reception' && (
          <Button
            variant="outline"
            className="text-sm cursor-default"
            disabled
          >
            <Icon name="Eye" size={16} className="mr-2" />
            View Only
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;