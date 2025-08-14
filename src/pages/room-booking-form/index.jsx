import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import BookingStatusIndicator, { useBookingStatus } from '../../components/ui/BookingStatusIndicator';
import RoomSelector from './components/RoomSelector';
import MeetingDetailsForm from './components/MeetingDetailsForm';
import DateTimeSelector from './components/DateTimeSelector';
import AttendeesInput from './components/AttendeesInput';
import ConflictWarning from './components/ConflictWarning';
import BookingFormActions from './components/BookingFormActions';
import Icon from '../../components/AppIcon';

const RoomBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, message, showSuccess, showError, showLoading, hideStatus } = useBookingStatus();

  // Form state
  const [selectedRoom, setSelectedRoom] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [organizerName, setOrganizerName] = useState('Sarah Johnson');
  const [organizerEmail, setOrganizerEmail] = useState('sarah.johnson@company.com');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const mockRooms = [
    {
      id: 'conf-room-a',
      name: 'Conference Room A',
      location: 'Floor 2, East Wing',
      capacity: 12,
      equipment: ['Projector', 'Whiteboard', 'Video Conferencing']
    },
    {
      id: 'conf-room-b',
      name: 'Conference Room B',
      location: 'Floor 2, West Wing',
      capacity: 8,
      equipment: ['TV Display', 'Whiteboard']
    },
    {
      id: 'meeting-room-1',
      name: 'Meeting Room 1',
      location: 'Floor 3, North',
      capacity: 6,
      equipment: ['TV Display', 'Phone Conference']
    },
    {
      id: 'boardroom',
      name: 'Executive Boardroom',
      location: 'Floor 4, Executive Suite',
      capacity: 16,
      equipment: ['Large Display', 'Video Conferencing', 'Audio System']
    }
  ];

  const mockExistingBookings = [
    {
      id: 'booking-1',
      roomId: 'conf-room-a',
      title: 'Weekly Team Standup',
      organizer: 'Mike Chen',
      date: '2025-08-13',
      startTime: '09:00',
      endTime: '10:00'
    },
    {
      id: 'booking-2',
      roomId: 'conf-room-a',
      title: 'Client Presentation',
      organizer: 'Lisa Wang',
      date: '2025-08-13',
      startTime: '14:00',
      endTime: '15:30'
    },
    {
      id: 'booking-3',
      roomId: 'conf-room-b',
      title: 'Project Review',
      organizer: 'David Smith',
      date: '2025-08-13',
      startTime: '11:00',
      endTime: '12:00'
    }
  ];

  // Initialize form with pre-selected room if coming from dashboard
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roomId = searchParams?.get('roomId');
    if (roomId && mockRooms?.find(room => room?.id === roomId)) {
      setSelectedRoom(roomId);
    }

    // Set default date to today
    const today = new Date()?.toISOString()?.split('T')?.[0];
    setSelectedDate(today);
  }, [location?.search]);

  // Conflict detection
  useEffect(() => {
    if (selectedRoom && selectedDate && startTime && endTime) {
      checkForConflicts();
    } else {
      setConflicts([]);
      setSuggestedTimes([]);
    }
  }, [selectedRoom, selectedDate, startTime, endTime]);

  const checkForConflicts = () => {
    const roomBookings = mockExistingBookings?.filter(
      booking => booking?.roomId === selectedRoom && booking?.date === selectedDate
    );

    const conflictingBookings = roomBookings?.filter(booking => {
      const bookingStart = booking?.startTime;
      const bookingEnd = booking?.endTime;
      
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });

    setConflicts(conflictingBookings);

    // Generate suggested times if conflicts exist
    if (conflictingBookings?.length > 0) {
      generateSuggestedTimes(roomBookings);
    } else {
      setSuggestedTimes([]);
    }
  };

  const generateSuggestedTimes = (roomBookings) => {
    const suggestions = [];
    const duration = calculateDuration(startTime, endTime);
    
    // Business hours: 8:00 AM to 6:00 PM
    const businessStart = '08:00';
    const businessEnd = '18:00';
    
    // Find available slots
    const sortedBookings = [...roomBookings]?.sort((a, b) => a?.startTime?.localeCompare(b?.startTime));
    
    // Check slot before first booking
    if (sortedBookings?.length > 0) {
      const firstBookingStart = sortedBookings?.[0]?.startTime;
      if (addMinutes(businessStart, duration) <= firstBookingStart) {
        suggestions?.push({
          startTime: businessStart,
          endTime: addMinutes(businessStart, duration)
        });
      }
    }
    
    // Check slots between bookings
    for (let i = 0; i < sortedBookings?.length - 1; i++) {
      const currentEnd = sortedBookings?.[i]?.endTime;
      const nextStart = sortedBookings?.[i + 1]?.startTime;
      
      if (addMinutes(currentEnd, duration) <= nextStart) {
        suggestions?.push({
          startTime: currentEnd,
          endTime: addMinutes(currentEnd, duration)
        });
      }
    }
    
    // Check slot after last booking
    if (sortedBookings?.length > 0) {
      const lastBookingEnd = sortedBookings?.[sortedBookings?.length - 1]?.endTime;
      if (addMinutes(lastBookingEnd, duration) <= businessEnd) {
        suggestions?.push({
          startTime: lastBookingEnd,
          endTime: addMinutes(lastBookingEnd, duration)
        });
      }
    }
    
    setSuggestedTimes(suggestions?.slice(0, 3)); // Show max 3 suggestions
  };

  const calculateDuration = (start, end) => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    return endMinutes - startMinutes;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time?.split(':')?.map(Number);
    return hours * 60 + minutes;
  };

  const addMinutes = (time, minutes) => {
    const totalMinutes = timeToMinutes(time) + minutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours?.toString()?.padStart(2, '0')}:${mins?.toString()?.padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRoom) {
      newErrors.room = 'Please select a conference room';
    }

    if (!meetingTitle?.trim()) {
      newErrors.meetingTitle = 'Meeting title is required';
    } else if (meetingTitle?.length > 100) {
      newErrors.meetingTitle = 'Meeting title must be 100 characters or less';
    }

    if (!organizerName?.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    } else if (organizerName?.length > 50) {
      newErrors.organizerName = 'Organizer name must be 50 characters or less';
    }

    if (!organizerEmail?.trim()) {
      newErrors.organizerEmail = 'Organizer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(organizerEmail)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    if (!selectedDate) {
      newErrors.date = 'Meeting date is required';
    } else {
      const today = new Date()?.toISOString()?.split('T')?.[0];
      if (selectedDate < today) {
        newErrors.date = 'Meeting date cannot be in the past';
      }
    }

    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (startTime && endTime) {
      if (startTime >= endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
      
      const duration = calculateDuration(startTime, endTime);
      if (duration < 15) {
        newErrors.endTime = 'Meeting must be at least 15 minutes long';
      }
      if (duration > 480) { // 8 hours
        newErrors.endTime = 'Meeting cannot exceed 8 hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSelectSuggestedTime = (suggestion) => {
    setStartTime(suggestion?.startTime);
    setEndTime(suggestion?.endTime);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);
    showLoading('Creating your booking...');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedRoomData = mockRooms?.find(room => room?.id === selectedRoom);
      const bookingData = {
        id: `booking-${Date.now()}`,
        roomId: selectedRoom,
        roomName: selectedRoomData?.name,
        title: meetingTitle,
        organizer: organizerName,
        organizerEmail,
        date: selectedDate,
        startTime,
        endTime,
        attendees,
        createdAt: new Date()?.toISOString()
      };

      console.log('Booking created:', bookingData);

      showSuccess(`Booking confirmed! ${selectedRoomData?.name} reserved for ${new Date(selectedDate)?.toLocaleDateString()}`);
      
      // Reset form
      setTimeout(() => {
        navigate('/booking-management');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      showError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Book Conference Room</h1>
                <p className="text-sm text-muted-foreground">
                  Create a new room reservation with automatic conflict detection
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-card rounded-lg shadow-elevation-2 border border-border">
            <div className="p-6 space-y-8">
              {/* Room Selection */}
              <RoomSelector
                rooms={mockRooms}
                selectedRoom={selectedRoom}
                onRoomChange={setSelectedRoom}
                error={errors?.room}
                disabled={isSubmitting}
              />

              {/* Meeting Details */}
              <MeetingDetailsForm
                meetingTitle={meetingTitle}
                onMeetingTitleChange={setMeetingTitle}
                organizerName={organizerName}
                onOrganizerNameChange={setOrganizerName}
                organizerEmail={organizerEmail}
                onOrganizerEmailChange={setOrganizerEmail}
                errors={errors}
                disabled={isSubmitting}
              />

              {/* Date & Time */}
              <DateTimeSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                startTime={startTime}
                onStartTimeChange={setStartTime}
                endTime={endTime}
                onEndTimeChange={setEndTime}
                errors={errors}
                disabled={isSubmitting}
              />

              {/* Conflict Warning */}
              {conflicts?.length > 0 && (
                <ConflictWarning
                  conflicts={conflicts}
                  suggestedTimes={suggestedTimes}
                  onSelectSuggestedTime={handleSelectSuggestedTime}
                />
              )}

              {/* Attendees */}
              <AttendeesInput
                attendees={attendees}
                onAttendeesChange={setAttendees}
                error={errors?.attendees}
                disabled={isSubmitting}
              />

              {/* Form Actions */}
              <BookingFormActions
                onSubmit={handleSubmit}
                onCancel={() => navigate('/dashboard-room-overview')}
                isLoading={isSubmitting}
                disabled={Object.keys(errors)?.length > 0}
                hasConflicts={conflicts?.length > 0}
              />
            </div>
          </div>
        </div>
      </main>
      <BookingStatusIndicator
        status={status}
        message={message}
        onClose={hideStatus}
      />
    </div>
  );
};

export default RoomBookingForm;