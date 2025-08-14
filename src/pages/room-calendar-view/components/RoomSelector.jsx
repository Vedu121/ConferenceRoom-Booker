import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RoomSelector = ({ 
  rooms = [], 
  selectedRoom, 
  onRoomChange, 
  className = "" 
}) => {
  const roomOptions = rooms?.map(room => ({
    value: room?.id,
    label: room?.name,
    description: `${room?.capacity} people • ${room?.location}`
  }));

  const handleRoomChange = (roomId) => {
    const room = rooms?.find(r => r?.id === roomId);
    onRoomChange(room);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Icon name="MapPin" size={16} color="white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Select Room</h3>
          <p className="text-xs text-muted-foreground">Choose a conference room to view its calendar</p>
        </div>
      </div>
      <Select
        options={roomOptions}
        value={selectedRoom?.id || ''}
        onChange={handleRoomChange}
        placeholder="Choose a room..."
        searchable
        className="w-full"
      />
      {selectedRoom && (
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-foreground">{selectedRoom?.name}</h4>
              <p className="text-xs text-muted-foreground">{selectedRoom?.location}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Users" size={12} />
                <span>{selectedRoom?.capacity}</span>
              </div>
              {selectedRoom?.equipment && selectedRoom?.equipment?.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <Icon name="Monitor" size={12} />
                  <span>{selectedRoom?.equipment?.length} items</span>
                </div>
              )}
            </div>
          </div>

          {selectedRoom?.equipment && selectedRoom?.equipment?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Equipment:</p>
              <div className="flex flex-wrap gap-1">
                {selectedRoom?.equipment?.slice(0, 3)?.map((item, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-accent/10 text-accent px-2 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
                {selectedRoom?.equipment?.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{selectedRoom?.equipment?.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomSelector;