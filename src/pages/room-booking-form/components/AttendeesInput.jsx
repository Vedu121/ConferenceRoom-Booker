import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AttendeesInput = ({
  attendees = [],
  onAttendeesChange,
  error = null,
  disabled = false
}) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleAddAttendee = () => {
    if (!currentEmail?.trim()) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!validateEmail(currentEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (attendees?.includes(currentEmail?.toLowerCase())) {
      setEmailError('This email is already added');
      return;
    }

    onAttendeesChange([...attendees, currentEmail?.toLowerCase()]);
    setCurrentEmail('');
    setEmailError('');
  };

  const handleRemoveAttendee = (emailToRemove) => {
    onAttendeesChange(attendees?.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleAddAttendee();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="Users" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Attendees (Optional)</span>
      </div>
      {/* Email Input */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter attendee email address"
            value={currentEmail}
            onChange={(e) => {
              setCurrentEmail(e?.target?.value);
              setEmailError('');
            }}
            onKeyPress={handleKeyPress}
            error={emailError}
            disabled={disabled}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleAddAttendee}
          disabled={disabled || !currentEmail?.trim()}
          iconName="Plus"
          className="px-4"
        >
          Add
        </Button>
      </div>
      {/* Attendees List */}
      {attendees?.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">
            {attendees?.length} attendee{attendees?.length !== 1 ? 's' : ''} added:
          </span>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {attendees?.map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2"
              >
                <span className="text-sm text-foreground truncate flex-1 mr-2">
                  {email}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveAttendee(email)}
                  disabled={disabled}
                  iconName="X"
                  size="xs"
                  className="text-muted-foreground hover:text-error"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default AttendeesInput;