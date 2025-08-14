import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DateTimeSelector = ({
  selectedDate,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  errors = {},
  disabled = false
}) => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  const currentTime = new Date()?.toTimeString()?.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Date & Time</span>
      </div>
      {/* Date Selection */}
      <Input
        label="Meeting Date"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e?.target?.value)}
        min={today}
        error={errors?.date}
        required
        disabled={disabled}
      />
      {/* Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e?.target?.value)}
          error={errors?.startTime}
          required
          disabled={disabled}
        />
        
        <Input
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e?.target?.value)}
          error={errors?.endTime}
          required
          disabled={disabled}
        />
      </div>
      {/* Timezone Info */}
      <div className="bg-muted/50 rounded-md p-3">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Times are displayed in your local timezone. All bookings are stored in UTC.
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelector;