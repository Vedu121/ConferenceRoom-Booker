import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ userRole = 'employee', onRefresh }) => {
  const navigate = useNavigate();

  const handleQuickBook = () => {
    navigate('/room-booking-form');
  };

  const handleViewBookings = () => {
    navigate('/booking-management');
  };

  const handleViewCalendar = () => {
    navigate('/room-calendar-view');
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Zap" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>

        {/* Refresh Button */}
        <Button
          variant="ghost"
          onClick={onRefresh}
          className="p-2"
          title="Refresh room status"
        >
          <Icon name="RefreshCw" size={16} />
        </Button>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {userRole === 'employee' && (
          <Button
            variant="default"
            onClick={handleQuickBook}
            className="w-full justify-start"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Book Room Now
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleViewCalendar}
          className="w-full justify-start"
        >
          <Icon name="Calendar" size={16} className="mr-2" />
          Calendar View
        </Button>

        {userRole === 'employee' && (
          <Button
            variant="outline"
            onClick={handleViewBookings}
            className="w-full justify-start"
          >
            <Icon name="BookOpen" size={16} className="mr-2" />
            My Bookings
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => window.location?.reload()}
          className="w-full justify-start"
        >
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Reset View
        </Button>
      </div>
      {/* Reception Mode Notice */}
      {userRole === 'reception' && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Reception Mode: View-only access to room schedules
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;