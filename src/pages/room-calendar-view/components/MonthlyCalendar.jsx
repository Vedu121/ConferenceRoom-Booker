import React from 'react';
import Icon from '../../../components/AppIcon';

const MonthlyCalendar = ({ 
  currentDate, 
  bookings = [], 
  onDateClick, 
  onBookingClick 
}) => {
  const getMonthDays = () => {
    const year = currentDate?.getFullYear();
    const month = currentDate?.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days?.push(new Date(currentDay));
      currentDay?.setDate(currentDay?.getDate() + 1);
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    return bookings?.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate?.toDateString() === date?.toDateString();
    });
  };

  const isCurrentMonth = (date) => {
    return date?.getMonth() === currentDate?.getMonth();
  };

  const isToday = (date) => {
    return date?.toDateString() === new Date()?.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthDays = getMonthDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {currentDate?.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-muted-foreground rounded"></div>
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>
      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/20">
        {weekDays?.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {monthDays?.map((date, index) => {
          const dayBookings = getBookingsForDate(date);
          const hasBookings = dayBookings?.length > 0;
          const isCurrentMonthDate = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          const isPast = isPastDate(date);
          
          return (
            <div
              key={index}
              className={`h-24 lg:h-32 border-r border-b border-border last:border-r-0 cursor-pointer transition-colors ${
                isCurrentMonthDate 
                  ? 'hover:bg-muted/50' :'bg-muted/20 hover:bg-muted/30'
              } ${
                isTodayDate ? 'bg-primary/5' : ''
              }`}
              onClick={() => onDateClick(date)}
            >
              <div className="p-2 h-full flex flex-col">
                {/* Date Number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isTodayDate 
                      ? 'text-primary font-semibold' 
                      : isCurrentMonthDate 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  } ${
                    isPast && !isTodayDate ? 'opacity-60' : ''
                  }`}>
                    {date?.getDate()}
                  </span>
                  
                  {isTodayDate && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>

                {/* Bookings */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayBookings?.slice(0, 3)?.map((booking, bookingIndex) => (
                    <div
                      key={bookingIndex}
                      className="text-xs bg-primary text-primary-foreground rounded px-1 py-0.5 truncate cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onBookingClick(booking);
                      }}
                    >
                      {booking?.title}
                    </div>
                  ))}
                  
                  {dayBookings?.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayBookings?.length - 3} more
                    </div>
                  )}
                </div>

                {/* Availability Indicator */}
                {isCurrentMonthDate && !isPast && (
                  <div className="flex justify-end mt-1">
                    {hasBookings ? (
                      <Icon name="Clock" size={12} className="text-warning" />
                    ) : (
                      <Icon name="Plus" size={12} className="text-accent opacity-60" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;