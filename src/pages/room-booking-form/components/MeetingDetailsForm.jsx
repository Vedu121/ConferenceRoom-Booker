import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const MeetingDetailsForm = ({
  meetingTitle,
  onMeetingTitleChange,
  organizerName,
  onOrganizerNameChange,
  organizerEmail,
  onOrganizerEmailChange,
  errors = {},
  disabled = false
}) => {
  return (
    <div className="space-y-6">
      {/* Meeting Title */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Meeting Details</span>
        </div>
        
        <Input
          label="Meeting Title"
          type="text"
          placeholder="Enter meeting title"
          value={meetingTitle}
          onChange={(e) => onMeetingTitleChange(e?.target?.value)}
          error={errors?.meetingTitle}
          required
          disabled={disabled}
          maxLength={100}
        />
      </div>
      {/* Organizer Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Organizer Information</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Organizer Name"
            type="text"
            placeholder="Enter organizer name"
            value={organizerName}
            onChange={(e) => onOrganizerNameChange(e?.target?.value)}
            error={errors?.organizerName}
            required
            disabled={disabled}
            maxLength={50}
          />
          
          <Input
            label="Organizer Email"
            type="email"
            placeholder="Enter organizer email"
            value={organizerEmail}
            onChange={(e) => onOrganizerEmailChange(e?.target?.value)}
            error={errors?.organizerEmail}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsForm;