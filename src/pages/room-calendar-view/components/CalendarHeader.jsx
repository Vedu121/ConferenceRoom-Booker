import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({ 
  selectedRoom, 
  currentDate, 
  viewMode, 
  onViewModeChange, 
  onPrevious, 
  onNext, 
  onToday 
}) => {
  const formatDateRange = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek?.setDate(startOfWeek?.getDate() + 6);
    
    if (viewMode === 'day') {
      return currentDate?.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      return `${startOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate?.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
  };

  return (
    <div className="bg-card border-b border-border p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Room Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">
              {selectedRoom?.name || 'Conference Room Calendar'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedRoom?.capacity && `Capacity: ${selectedRoom?.capacity} people`}
              {selectedRoom?.location && ` • ${selectedRoom?.location}`}
            </p>
          </div>
        </div>

        {/* View Mode Toggle - Desktop */}
        <div className="hidden lg:flex items-center space-x-2 bg-muted rounded-lg p-1">
          {['day', 'week', 'month']?.map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange(mode)}
              className="px-4 py-2 text-sm font-medium capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="px-3 py-2"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            className="px-3 py-2"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="px-4 py-2 text-sm font-medium"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date Range Display */}
          <div className="text-sm font-medium text-foreground">
            {formatDateRange()}
          </div>

          {/* Mobile View Mode Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const modes = ['day', 'week', 'month'];
                const currentIndex = modes?.indexOf(viewMode);
                const nextMode = modes?.[(currentIndex + 1) % modes?.length];
                onViewModeChange(nextMode);
              }}
              className="px-3 py-2 capitalize"
            >
              <Icon name="Calendar" size={16} className="mr-2" />
              {viewMode}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;