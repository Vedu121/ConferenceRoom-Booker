import React from 'react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const BookingFormActions = ({
  onSubmit,
  onCancel,
  isLoading = false,
  disabled = false,
  hasConflicts = false
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard-room-overview');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-border">
      <Button
        variant="ghost"
        onClick={handleCancel}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      
      <Button
        variant={hasConflicts ? "warning" : "default"}
        onClick={onSubmit}
        loading={isLoading}
        disabled={disabled || isLoading}
        iconName={hasConflicts ? "AlertTriangle" : "Calendar"}
        iconPosition="left"
        className="w-full sm:w-auto"
      >
        {hasConflicts ? 'Book Despite Conflicts' : 'Create Booking'}
      </Button>
    </div>
  );
};

export default BookingFormActions;