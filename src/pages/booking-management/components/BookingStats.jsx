import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingStats = ({ bookings, userRole }) => {
  const getStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: bookings?.length,
      upcoming: bookings?.filter(b => new Date(b.startTime) > now)?.length,
      today: bookings?.filter(b => {
        const bookingDate = new Date(b.startTime);
        return bookingDate >= today && bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      })?.length,
      thisWeek: bookings?.filter(b => new Date(b.startTime) >= thisWeek)?.length,
      thisMonth: bookings?.filter(b => new Date(b.startTime) >= thisMonth)?.length,
      confirmed: bookings?.filter(b => b?.status === 'confirmed')?.length,
      pending: bookings?.filter(b => b?.status === 'pending')?.length,
      cancelled: bookings?.filter(b => b?.status === 'cancelled')?.length,
      completed: bookings?.filter(b => b?.status === 'completed')?.length
    };

    return stats;
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.total,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: userRole === 'reception' ? 'All bookings in system' : 'Your total bookings'
    },
    {
      title: 'Upcoming',
      value: stats?.upcoming,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Future meetings'
    },
    {
      title: 'Today',
      value: stats?.today,
      icon: 'CalendarDays',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Meetings today'
    },
    {
      title: 'This Week',
      value: stats?.thisWeek,
      icon: 'CalendarRange',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'This week\'s meetings'
    }
  ];

  const statusCards = [
    {
      title: 'Confirmed',
      value: stats?.confirmed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Cancelled',
      value: stats?.cancelled,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Completed',
      value: stats?.completed,
      icon: 'Check',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat?.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat?.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Status Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={16} className="text-primary" />
          Booking Status Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards?.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={16} className={stat?.color} />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{stat?.value}</p>
                <p className="text-xs text-muted-foreground">{stat?.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Insights */}
      {stats?.total > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Target" size={14} className="text-success" />
              <span className="text-muted-foreground">
                {Math.round((stats?.confirmed / stats?.total) * 100)}% confirmation rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={14} className="text-primary" />
              <span className="text-muted-foreground">
                {Math.round(stats?.thisMonth / 4)} avg bookings per week
              </span>
            </div>
            {stats?.upcoming > 0 && (
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-warning" />
                <span className="text-muted-foreground">
                  {stats?.upcoming} upcoming meetings
                </span>
              </div>
            )}
            {stats?.today > 0 && (
              <div className="flex items-center gap-2">
                <Icon name="CalendarDays" size={14} className="text-accent" />
                <span className="text-muted-foreground">
                  {stats?.today} meetings scheduled today
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStats;