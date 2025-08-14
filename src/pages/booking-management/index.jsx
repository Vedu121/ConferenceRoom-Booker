import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import BookingStatusIndicator, { useBookingStatus } from '../../components/ui/BookingStatusIndicator';
import BookingFilters from './components/BookingFilters';
import BookingTable from './components/BookingTable';
import BookingDetailsModal from './components/BookingDetailsModal';
import CancelBookingModal from './components/CancelBookingModal';
import BookingStats from './components/BookingStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BookingManagement = () => {
  const navigate = useNavigate();
  const { status, message, showSuccess, showError, showLoading, hideStatus } = useBookingStatus();
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [userRole] = useState('employee'); // Could be 'employee' or 'reception'

  // Mock booking data
  const mockBookings = [
    {
      id: 'BK-2025-001',
      title: 'Weekly Team Standup',
      description: 'Regular team sync meeting to discuss progress and blockers',
      room: 'Conference Room A',
      organizer: 'Sarah Johnson',
      startTime: new Date('2025-01-13T09:00:00'),
      endTime: new Date('2025-01-13T10:00:00'),
      attendeeCount: 8,
      status: 'confirmed',
      createdAt: new Date('2025-01-10T14:30:00'),
      attendees: ['mike.chen@company.com', 'emily.davis@company.com', 'james.wilson@company.com', 'lisa.brown@company.com']
    },
    {
      id: 'BK-2025-002',
      title: 'Client Presentation - Q1 Results',
      description: 'Quarterly business review presentation for key stakeholders',
      room: 'Executive Boardroom',
      organizer: 'Sarah Johnson',
      startTime: new Date('2025-01-14T14:00:00'),
      endTime: new Date('2025-01-14T16:00:00'),
      attendeeCount: 12,
      status: 'confirmed',
      createdAt: new Date('2025-01-08T11:15:00'),
      attendees: ['mike.chen@company.com', 'emily.davis@company.com', 'client@external.com']
    },
    {
      id: 'BK-2025-003',
      title: 'Product Planning Session',
      description: 'Strategic planning for upcoming product releases',
      room: 'Meeting Room 1',
      organizer: 'Mike Chen',
      startTime: new Date('2025-01-15T10:30:00'),
      endTime: new Date('2025-01-15T12:00:00'),
      attendeeCount: 6,
      status: 'pending',
      createdAt: new Date('2025-01-12T16:45:00'),
      attendees: ['sarah.johnson@company.com', 'james.wilson@company.com']
    },
    {
      id: 'BK-2025-004',
      title: 'Training Workshop - New Software',
      description: 'Hands-on training session for new project management software',
      room: 'Training Room',
      organizer: 'Emily Davis',
      startTime: new Date('2025-01-16T13:00:00'),
      endTime: new Date('2025-01-16T17:00:00'),
      attendeeCount: 15,
      status: 'confirmed',
      createdAt: new Date('2025-01-05T09:20:00'),
      attendees: ['sarah.johnson@company.com', 'mike.chen@company.com', 'james.wilson@company.com']
    },
    {
      id: 'BK-2025-005',
      title: 'Budget Review Meeting',
      description: 'Monthly budget review and expense analysis',
      room: 'Conference Room B',
      organizer: 'Sarah Johnson',
      startTime: new Date('2025-01-10T11:00:00'),
      endTime: new Date('2025-01-10T12:30:00'),
      attendeeCount: 5,
      status: 'completed',
      createdAt: new Date('2025-01-07T13:10:00'),
      attendees: ['mike.chen@company.com', 'lisa.brown@company.com']
    },
    {
      id: 'BK-2025-006',
      title: 'Emergency Team Meeting',
      description: 'Urgent discussion about project timeline changes',
      room: 'Meeting Room 2',
      organizer: 'James Wilson',
      startTime: new Date('2025-01-11T15:00:00'),
      endTime: new Date('2025-01-11T16:00:00'),
      attendeeCount: 4,
      status: 'cancelled',
      createdAt: new Date('2025-01-11T14:00:00'),
      attendees: ['sarah.johnson@company.com', 'emily.davis@company.com']
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadBookings = async () => {
      setIsLoading(true);
      showLoading('Loading your bookings...');
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter bookings based on user role
        let userBookings = mockBookings;
        if (userRole === 'employee') {
          // Show only bookings where user is organizer
          userBookings = mockBookings?.filter(booking => booking?.organizer === 'Sarah Johnson');
        }
        
        setBookings(userBookings);
        setFilteredBookings(userBookings);
        hideStatus();
      } catch (error) {
        showError('Failed to load bookings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [userRole]);

  const handleFiltersChange = (filters) => {
    let filtered = [...bookings];

    // Apply search filter
    if (filters?.search) {
      filtered = filtered?.filter(booking =>
        booking?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        booking?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters?.dateRange) {
        case 'today':
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= today && bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          });
          break;
        case 'tomorrow':
          const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= tomorrow && bookingDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          });
          break;
        case 'this-week':
          const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
          const nextWeek = new Date(thisWeek.getTime() + (7 * 24 * 60 * 60 * 1000));
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= thisWeek && bookingDate < nextWeek;
          });
          break;
        case 'next-week':
          const currentWeekEnd = new Date(today.getTime() + ((7 - today.getDay()) * 24 * 60 * 60 * 1000));
          const nextWeekEnd = new Date(currentWeekEnd.getTime() + (7 * 24 * 60 * 60 * 1000));
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= currentWeekEnd && bookingDate < nextWeekEnd;
          });
          break;
        case 'this-month':
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= thisMonth && bookingDate < nextMonth;
          });
          break;
        case 'next-month':
          const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 1);
          filtered = filtered?.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate >= nextMonthStart && bookingDate < nextMonthEnd;
          });
          break;
      }
    }

    // Apply room filter
    if (filters?.room !== 'all') {
      filtered = filtered?.filter(booking => booking?.room?.toLowerCase()?.includes(filters?.room?.replace('-', ' ')));
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(booking => booking?.status === filters?.status);
    }

    // Apply organizer filter
    if (filters?.organizer !== 'all') {
      const organizerName = filters?.organizer?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      filtered = filtered?.filter(booking => booking?.organizer?.includes(organizerName));
    }

    setFilteredBookings(filtered);
  };

  const handleClearFilters = () => {
    setFilteredBookings(bookings);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleEditBooking = (booking) => {
    navigate('/room-booking-form', { state: { editBooking: booking } });
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (booking, reason) => {
    showLoading('Cancelling booking...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking status
      const updatedBookings = bookings?.map(b => 
        b?.id === booking?.id ? { ...b, status: 'cancelled' } : b
      );
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings?.filter(b => 
        userRole === 'reception' || b?.organizer === 'Sarah Johnson'
      ));
      
      showSuccess(`Booking "${booking?.title}" has been cancelled successfully. Email notifications sent to all attendees.`);
      setIsCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      showError('Failed to cancel booking. Please try again.');
    }
  };

  const handleNewBooking = () => {
    navigate('/room-booking-form');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Loading your bookings...</p>
              </div>
            </div>
          </div>
        </main>
        <BookingStatusIndicator status={status} message={message} onClose={hideStatus} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Breadcrumb Navigation */}
          <NavigationBreadcrumb />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {userRole === 'reception' ? 'All Bookings' : 'My Bookings'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {userRole === 'reception' ?'View and manage all conference room bookings' :'Manage your conference room reservations and upcoming meetings'
                }
              </p>
            </div>
            
            {userRole !== 'reception' && (
              <Button
                variant="default"
                onClick={handleNewBooking}
                iconName="Plus"
                iconPosition="left"
                className="whitespace-nowrap"
              >
                Book New Room
              </Button>
            )}
          </div>

          {/* Booking Statistics */}
          <BookingStats bookings={filteredBookings} userRole={userRole} />

          {/* Filters */}
          <BookingFilters 
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Bookings Table */}
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onEditBooking={handleEditBooking}
            onCancelBooking={handleCancelBooking}
            userRole={userRole}
          />

          {/* Empty State for No Bookings */}
          {bookings?.length === 0 && !isLoading && (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="Calendar" size={64} className="text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-medium text-foreground mb-3">
                {userRole === 'reception' ? 'No bookings in system' : 'No bookings yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {userRole === 'reception' ?'There are currently no room bookings in the system. Bookings will appear here once users start making reservations.' :'You haven\'t made any room bookings yet. Start by booking a conference room for your next meeting or event.'
                }
              </p>
              {userRole !== 'reception' && (
                <Button
                  variant="default"
                  onClick={handleNewBooking}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Book Your First Room
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
        userRole={userRole}
      />
      <CancelBookingModal
        booking={selectedBooking}
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmCancel}
      />
      {/* Status Indicator */}
      <BookingStatusIndicator status={status} message={message} onClose={hideStatus} />
    </div>
  );
};

export default BookingManagement;