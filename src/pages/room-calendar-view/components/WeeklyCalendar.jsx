import React, { useState, useRef, useEffect } from 'react';



const WeeklyCalendar = ({ 
  currentDate, 
  bookings = [], 
  onTimeSlotClick, 
  onBookingClick 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Scroll to current time on mount
    if (scrollContainerRef?.current) {
      const currentHour = new Date()?.getHours();
      const scrollPosition = (currentHour - 6) * 60; // 60px per hour, start at 6 AM
      scrollContainerRef.current.scrollTop = Math.max(0, scrollPosition);
    }
  }, []);

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      days?.push(day);
    }
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots?.push({
        hour,
        time: `${hour?.toString()?.padStart(2, '0')}:00`,
        displayTime: hour === 0 ? '12:00 AM' : 
                    hour < 12 ? `${hour}:00 AM` : 
                    hour === 12 ? '12:00 PM' : 
                    `${hour - 12}:00 PM`
      });
    }
    return slots;
  };

  const getBookingsForSlot = (day, hour) => {
    return bookings?.filter(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      const slotStart = new Date(day);
      slotStart?.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd?.setHours(hour + 1, 0, 0, 0);

      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now?.getHours();
    const minutes = now?.getMinutes();
    return (hours * 60 + minutes) / 60 * 60; // 60px per hour
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const handleSlotClick = (day, hour) => {
    const slotDateTime = new Date(day);
    slotDateTime?.setHours(hour, 0, 0, 0);
    onTimeSlotClick(slotDateTime);
  };

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  return (
    <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-border bg-muted/30">
        <div className="p-3 text-xs font-medium text-muted-foreground border-r border-border">
          Time
        </div>
        {weekDays?.map((day, index) => (
          <div 
            key={index}
            className={`p-3 text-center border-r border-border last:border-r-0 ${
              isToday(day) ? 'bg-primary/10' : ''
            }`}
          >
            <div className="text-xs font-medium text-muted-foreground uppercase">
              {day?.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-semibold mt-1 ${
              isToday(day) ? 'text-primary' : 'text-foreground'
            }`}>
              {day?.getDate()}
            </div>
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div 
        ref={scrollContainerRef}
        className="relative overflow-auto h-96 lg:h-[600px]"
      >
        <div className="grid grid-cols-8 relative">
          {/* Time Column */}
          <div className="border-r border-border">
            {timeSlots?.map((slot) => (
              <div 
                key={slot?.hour}
                className="h-15 border-b border-border p-2 text-xs text-muted-foreground"
              >
                {slot?.displayTime}
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays?.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-border last:border-r-0 relative">
              {timeSlots?.map((slot) => {
                const slotBookings = getBookingsForSlot(day, slot?.hour);
                const hasBooking = slotBookings?.length > 0;
                
                return (
                  <div
                    key={slot?.hour}
                    className={`h-15 border-b border-border relative cursor-pointer transition-colors ${
                      hasBooking 
                        ? 'bg-primary/10 hover:bg-primary/20' :'hover:bg-muted/50'
                    }`}
                    onClick={() => hasBooking ? onBookingClick(slotBookings?.[0]) : handleSlotClick(day, slot?.hour)}
                  >
                    {hasBooking && (
                      <div className="absolute inset-1 bg-primary rounded text-primary-foreground p-1 overflow-hidden">
                        <div className="text-xs font-medium truncate">
                          {slotBookings?.[0]?.title}
                        </div>
                        <div className="text-xs opacity-90 truncate">
                          {slotBookings?.[0]?.organizer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Current Time Indicator */}
              {isToday(day) && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-error z-10 pointer-events-none"
                  style={{ top: `${getCurrentTimePosition()}px` }}
                >
                  <div className="absolute -left-1 -top-1 w-2 h-2 bg-error rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;