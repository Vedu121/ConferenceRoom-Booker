import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import BookingStatusIndicator, { useBookingStatus } from '../../components/ui/BookingStatusIndicator';
import CalendarHeader from './components/CalendarHeader';
import WeeklyCalendar from './components/WeeklyCalendar';
import DailyCalendar from './components/DailyCalendar';
import MonthlyCalendar from './components/MonthlyCalendar';
import BookingTooltip from './components/BookingTooltip';
import RoomSelector from './components/RoomSelector';
import Icon from '../../components/AppIcon';


const RoomCalendarView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, message, hideStatus, showSuccess, showError, showInfo } = useBookingStatus();

  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tooltip, setTooltip] = useState({
    isVisible: false,
    booking: null,
    position: { x: 0, y: 0 }
  });

  // Mock data
  const rooms = [
    {
      id: 'conf-001',
      name: 'Executive Boardroom',
      capacity: 12,
      location: 'Floor 10, East Wing',
      equipment: ['Projector', 'Video Conferencing', 'Whiteboard', 'Audio System']
    },
    {
      id: 'conf-002',
      name: 'Innovation Hub',
      capacity: 8,
      location: 'Floor 5, West Wing',
      equipment: ['Smart TV', 'Wireless Presentation', 'Flipchart']
    },
    {
      id: 'conf-003',
      name: 'Collaboration Space',
      capacity: 6,
      location: 'Floor 3, Central',
      equipment: ['Monitor', 'Conference Phone']
    },
    {
      id: 'conf-004',
      name: 'Training Room Alpha',
      capacity: 20,
      location: 'Floor 2, North Wing',
      equipment: ['Projector', 'Sound System', 'Microphones', 'Podium']
    }
  ];

  const mockBookings = [
    {
      id: 'book-001',
      roomId: 'conf-001',
      title: 'Q4 Strategy Meeting',
      organizer: 'Sarah Johnson',
      startTime: new Date(2025, 7, 13, 9, 0)?.toISOString(),
      endTime: new Date(2025, 7, 13, 11, 0)?.toISOString(),
      attendees: ['mike.chen@company.com', 'lisa.wang@company.com', 'david.brown@company.com'],
      description: 'Quarterly strategic planning session with department heads to review performance metrics and set objectives for Q1 2026.'
    },
    {
      id: 'book-002',
      roomId: 'conf-001',
      title: 'Client Presentation',
      organizer: 'Michael Rodriguez',
      startTime: new Date(2025, 7, 13, 14, 0)?.toISOString(),
      endTime: new Date(2025, 7, 13, 15, 30)?.toISOString(),
      attendees: ['client@external.com', 'sales.team@company.com'],
      description: 'Product demonstration and proposal presentation for new enterprise client.'
    },
    {
      id: 'book-003',
      roomId: 'conf-002',
      title: 'Design Review',
      organizer: 'Emily Davis',
      startTime: new Date(2025, 7, 13, 10, 30)?.toISOString(),
      endTime: new Date(2025, 7, 13, 12, 0)?.toISOString(),
      attendees: ['design.team@company.com'],
      description: 'Weekly design review session for upcoming product features.'
    },
    {
      id: 'book-004',
      roomId: 'conf-003',
      title: 'Team Standup',
      organizer: 'Alex Thompson',
      startTime: new Date(2025, 7, 14, 9, 0)?.toISOString(),
      endTime: new Date(2025, 7, 14, 9, 30)?.toISOString(),
      attendees: ['dev.team@company.com'],
      description: 'Daily standup meeting for development team.'
    },
    {
      id: 'book-005',
      roomId: 'conf-004',
      title: 'Training Session',
      organizer: 'Jennifer Wilson',
      startTime: new Date(2025, 7, 15, 13, 0)?.toISOString(),
      endTime: new Date(2025, 7, 15, 17, 0)?.toISOString(),
      attendees: ['hr.team@company.com', 'new.employees@company.com'],
      description: 'Onboarding training session for new employees covering company policies and procedures.'
    }
  ];

  // Initialize from URL params
  useEffect(() => {
    const roomId = searchParams?.get('room');
    if (roomId) {
      const room = rooms?.find(r => r?.id === roomId);
      if (room) {
        setSelectedRoom(room);
      }
    } else {
      // Default to first room
      setSelectedRoom(rooms?.[0]);
    }
  }, [searchParams]);

  // Filter bookings for selected room
  const filteredBookings = selectedRoom 
    ? mockBookings?.filter(booking => booking?.roomId === selectedRoom?.id)
    : [];

  // Navigation handlers
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate?.setDate(currentDate?.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() - 7);
    } else {
      newDate?.setMonth(currentDate?.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate?.setDate(currentDate?.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() + 7);
    } else {
      newDate?.setMonth(currentDate?.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Auto-switch to daily view on mobile for better UX
    if (window.innerWidth < 768 && mode === 'week') {
      setViewMode('day');
      showInfo('Switched to daily view for better mobile experience');
    }
  };

  // Booking handlers
  const handleTimeSlotClick = (dateTime) => {
    if (!selectedRoom) {
      showError('Please select a room first');
      return;
    }
    
    // Navigate to booking form with pre-filled data
    const params = new URLSearchParams({
      room: selectedRoom.id,
      date: dateTime.toISOString().split('T')[0],
      time: dateTime.toTimeString().slice(0, 5)
    });
    navigate(`/room-booking-form?${params?.toString()}`);
  };

  const handleBookingClick = (booking, event) => {
    if (event) {
      setTooltip({
        isVisible: true,
        booking,
        position: {
          x: event?.clientX,
          y: event?.clientY - 10
        }
      });
    }
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const handleEditBooking = (booking) => {
    setTooltip({ isVisible: false, booking: null, position: { x: 0, y: 0 } });
    navigate(`/booking-management?edit=${booking?.id}`);
  };

  const handleCancelBooking = (booking) => {
    setTooltip({ isVisible: false, booking: null, position: { x: 0, y: 0 } });
    showSuccess(`Booking "${booking?.title}" has been cancelled`);
  };

  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    // Update URL without navigation
    const newParams = new URLSearchParams(searchParams);
    if (room) {
      newParams?.set('room', room?.id);
    } else {
      newParams?.delete('room');
    }
    window.history?.replaceState({}, '', `${window.location?.pathname}?${newParams?.toString()}`);
  };

  const renderCalendar = () => {
    if (!selectedRoom) {
      return (
        <div className="flex-1 flex items-center justify-center bg-card border border-border rounded-lg">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Select a Room</h3>
            <p className="text-muted-foreground">Choose a conference room to view its calendar and availability</p>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'day':
        return (
          <DailyCalendar
            currentDate={currentDate}
            bookings={filteredBookings}
            onTimeSlotClick={handleTimeSlotClick}
            onBookingClick={handleBookingClick}
          />
        );
      case 'month':
        return (
          <MonthlyCalendar
            currentDate={currentDate}
            bookings={filteredBookings}
            onDateClick={handleDateClick}
            onBookingClick={handleBookingClick}
          />
        );
      default:
        return (
          <WeeklyCalendar
            currentDate={currentDate}
            bookings={filteredBookings}
            onTimeSlotClick={handleTimeSlotClick}
            onBookingClick={handleBookingClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <NavigationBreadcrumb />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Room Selector Sidebar */}
            <div className="lg:col-span-1">
              <RoomSelector
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomChange={handleRoomChange}
              />
            </div>

            {/* Main Calendar Area */}
            <div className="lg:col-span-3 space-y-4">
              <CalendarHeader
                selectedRoom={selectedRoom}
                currentDate={currentDate}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToday={handleToday}
              />
              
              {renderCalendar()}
            </div>
          </div>
        </div>
      </main>
      {/* Booking Tooltip */}
      <BookingTooltip
        booking={tooltip?.booking}
        isVisible={tooltip?.isVisible}
        position={tooltip?.position}
        onClose={() => setTooltip({ isVisible: false, booking: null, position: { x: 0, y: 0 } })}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
      />
      {/* Status Notifications */}
      <BookingStatusIndicator
        status={status}
        message={message}
        onClose={hideStatus}
      />
    </div>
  );
};

export default RoomCalendarView;