import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DailyCalendar = ({ 
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
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollContainerRef?.current) {
      const currentHour = new Date()?.getHours();
      const scrollPosition = (currentHour - 6) * 80;
      scrollContainerRef.current.scrollTop = Math.max(0, scrollPosition);
    }
  }, []);

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots?.push({
          hour,
          minute,
          time: `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`,
          displayTime: hour === 0 && minute === 0 ? '12:00 AM' :
                      hour === 0 && minute === 30 ? '12:30 AM' :
                      hour < 12 ? `${hour}:${minute?.toString()?.padStart(2, '0')} AM` :
                      hour === 12 ? `12:${minute?.toString()?.padStart(2, '0')} PM` :
                      `${hour - 12}:${minute?.toString()?.padStart(2, '0')} PM`
        });
      }
    }
    return slots;
  };

  const getBookingsForSlot = (hour, minute) => {
    return bookings?.filter(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      const slotStart = new Date(currentDate);
      slotStart?.setHours(hour, minute, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd?.setMinutes(slotStart?.getMinutes() + 30);

      return bookingStart < slotEnd && bookingEnd > slotStart;
    });
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    if (now?.toDateString() !== currentDate?.toDateString()) return -1;
    
    const hours = now?.getHours();
    const minutes = now?.getMinutes();
    return (hours * 2 + minutes / 30) * 40; // 40px per 30-minute slot
  };

  const isToday = () => {
    return currentDate?.toDateString() === new Date()?.toDateString();
  };

  const handleSlotClick = (hour, minute) => {
    const slotDateTime = new Date(currentDate);
    slotDateTime?.setHours(hour, minute, 0, 0);
    onTimeSlotClick(slotDateTime);
  };

  const timeSlots = getTimeSlots();
  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isToday() ? 'Today' : currentDate?.toLocaleDateString('en-US', { year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              30-minute intervals
            </span>
          </div>
        </div>
      </div>
      {/* Time Slots */}
      <div 
        ref={scrollContainerRef}
        className="relative overflow-auto h-96 lg:h-[600px]"
      >
        <div className="relative">
          {timeSlots?.map((slot, index) => {
            const slotBookings = getBookingsForSlot(slot?.hour, slot?.minute);
            const hasBooking = slotBookings?.length > 0;
            const isHourStart = slot?.minute === 0;
            
            return (
              <div
                key={index}
                className={`h-10 border-b border-border flex cursor-pointer transition-colors ${
                  isHourStart ? 'border-b-2' : 'border-b border-dashed'
                } ${
                  hasBooking 
                    ? 'bg-primary/10 hover:bg-primary/20' :'hover:bg-muted/50'
                }`}
                onClick={() => hasBooking ? onBookingClick(slotBookings?.[0]) : handleSlotClick(slot?.hour, slot?.minute)}
              >
                {/* Time Label */}
                <div className="w-20 flex-shrink-0 p-2 border-r border-border">
                  {isHourStart && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {slot?.displayTime}
                    </span>
                  )}
                </div>
                {/* Content Area */}
                <div className="flex-1 relative p-2">
                  {hasBooking && (
                    <div className="absolute inset-1 bg-primary rounded text-primary-foreground p-2 overflow-hidden">
                      <div className="text-sm font-medium truncate">
                        {slotBookings?.[0]?.title}
                      </div>
                      <div className="text-xs opacity-90 truncate">
                        {slotBookings?.[0]?.organizer}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(slotBookings[0].startTime)?.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })} - {new Date(slotBookings[0].endTime)?.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current Time Indicator */}
          {isToday() && currentTimePosition >= 0 && (
            <div 
              className="absolute left-20 right-0 h-0.5 bg-error z-10 pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="absolute -left-1 -top-1 w-2 h-2 bg-error rounded-full"></div>
              <div className="absolute right-2 -top-2 text-xs text-error font-medium bg-card px-1 rounded">
                {currentTime?.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCalendar;