import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RoomFilters = ({ 
  filters, 
  onFiltersChange, 
  totalRooms = 0, 
  availableRooms = 0 
}) => {
  const capacityOptions = [
    { value: 'all', label: 'All Capacities' },
    { value: '1-5', label: '1-5 people' },
    { value: '6-10', label: '6-10 people' },
    { value: '11-20', label: '11-20 people' },
    { value: '20+', label: '20+ people' }
  ];

  const equipmentOptions = [
    { value: 'all', label: 'All Equipment' },
    { value: 'projector', label: 'Projector' },
    { value: 'tv', label: 'TV Display' },
    { value: 'whiteboard', label: 'Whiteboard' },
    { value: 'video-conference', label: 'Video Conference' },
    { value: 'audio-system', label: 'Audio System' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Rooms' },
    { value: 'available', label: 'Available Now' },
    { value: 'occupied', label: 'Currently Occupied' },
    { value: 'upcoming', label: 'Upcoming Bookings' }
  ];

  const timeframeOptions = [
    { value: 'now', label: 'Available Now' },
    { value: '1hour', label: 'Next 1 Hour' },
    { value: '2hours', label: 'Next 2 Hours' },
    { value: 'today', label: 'Rest of Today' },
    { value: 'tomorrow', label: 'Tomorrow' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filter Rooms</h2>
        </div>
        
        {/* Room Count Summary */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">
              {availableRooms} Available
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <span className="text-muted-foreground">
              {totalRooms} Total Rooms
            </span>
          </div>
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Capacity"
          options={capacityOptions}
          value={filters?.capacity}
          onChange={(value) => handleFilterChange('capacity', value)}
          className="w-full"
        />

        <Select
          label="Equipment"
          options={equipmentOptions}
          value={filters?.equipment}
          onChange={(value) => handleFilterChange('equipment', value)}
          className="w-full"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="w-full"
        />

        <Select
          label="Availability"
          options={timeframeOptions}
          value={filters?.timeframe}
          onChange={(value) => handleFilterChange('timeframe', value)}
          className="w-full"
        />
      </div>
      {/* Active Filters Summary */}
      {(filters?.capacity !== 'all' || 
        filters?.equipment !== 'all' || 
        filters?.status !== 'all' || 
        filters?.timeframe !== 'now') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">
                Filters applied - showing filtered results
              </span>
            </div>
            <button
              onClick={() => onFiltersChange({
                capacity: 'all',
                equipment: 'all',
                status: 'all',
                timeframe: 'now'
              })}
              className="text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomFilters;