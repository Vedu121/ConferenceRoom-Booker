import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BookingFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'all',
    room: 'all',
    status: 'all',
    organizer: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const roomOptions = [
    { value: 'all', label: 'All Rooms' },
    { value: 'conference-a', label: 'Conference Room A' },
    { value: 'conference-b', label: 'Conference Room B' },
    { value: 'boardroom', label: 'Executive Boardroom' },
    { value: 'meeting-1', label: 'Meeting Room 1' },
    { value: 'meeting-2', label: 'Meeting Room 2' },
    { value: 'training', label: 'Training Room' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'next-month', label: 'Next Month' }
  ];

  const organizerOptions = [
    { value: 'all', label: 'All Organizers' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'mike-chen', label: 'Mike Chen' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'james-wilson', label: 'James Wilson' },
    { value: 'lisa-brown', label: 'Lisa Brown' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      dateRange: 'all',
      room: 'all',
      status: 'all',
      organizer: 'all'
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '' && value !== 'all');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search Bar - Always Visible */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search by meeting title..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="whitespace-nowrap"
          >
            Advanced Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearAll}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="border-t border-border pt-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
            
            <Select
              label="Room"
              options={roomOptions}
              value={filters?.room}
              onChange={(value) => handleFilterChange('room', value)}
              searchable
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Organizer"
              options={organizerOptions}
              value={filters?.organizer}
              onChange={(value) => handleFilterChange('organizer', value)}
              searchable
            />
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters?.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Search: "{filters?.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.room !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {roomOptions?.find(opt => opt?.value === filters?.room)?.label}
              <button
                onClick={() => handleFilterChange('room', 'all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters?.organizer !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {organizerOptions?.find(opt => opt?.value === filters?.organizer)?.label}
              <button
                onClick={() => handleFilterChange('organizer', 'all')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingFilters;