import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConflictWarning = ({
  conflicts = [],
  suggestedTimes = [],
  onSelectSuggestedTime,
  className = ""
}) => {
  if (conflicts?.length === 0) {
    return null;
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`)?.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-warning/10 border border-warning/20 rounded-md p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-warning mb-1">
              Booking Conflict Detected
            </h4>
            <p className="text-sm text-warning/80">
              The selected time slot conflicts with existing bookings:
            </p>
          </div>

          {/* Conflict Details */}
          <div className="space-y-2">
            {conflicts?.map((conflict, index) => (
              <div key={index} className="bg-warning/5 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warning">
                      {conflict?.title}
                    </p>
                    <p className="text-xs text-warning/70">
                      {formatTime(conflict?.startTime)} - {formatTime(conflict?.endTime)}
                    </p>
                  </div>
                  <div className="text-xs text-warning/70">
                    by {conflict?.organizer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Times */}
          {suggestedTimes?.length > 0 && (
            <div>
              <p className="text-sm text-warning/80 mb-2">
                Suggested available times:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTimes?.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSuggestedTime(suggestion)}
                    className="text-xs border-warning/30 text-warning hover:bg-warning/10"
                  >
                    {formatTime(suggestion?.startTime)} - {formatTime(suggestion?.endTime)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConflictWarning;