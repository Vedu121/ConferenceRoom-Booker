import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RoomSelector = ({ 
  rooms = [], 
  selectedRoom, 
  onRoomChange, 
  error = null,
  disabled = false 
}) => {
  const roomOptions = rooms?.map(room => ({
    value: room?.id,
    label: `${room?.name} - ${room?.location}`,
    description: `Capacity: ${room?.capacity} people • ${room?.equipment?.join(', ')}`
  }));

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon name="MapPin" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Conference Room</span>
      </div>
      
      <Select
        options={roomOptions}
        value={selectedRoom}
        onChange={onRoomChange}
        placeholder="Select a conference room"
        searchable
        disabled={disabled}
        error={error}
        required
      />
    </div>
  );
};

export default RoomSelector;