import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Rooms',
      value: stats?.totalRooms,
      icon: 'Building',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Available Now',
      value: stats?.availableRooms,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Currently Occupied',
      value: stats?.occupiedRooms,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Upcoming Bookings',
      value: stats?.upcomingBookings,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card rounded-lg shadow-elevation-1 p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item?.bgColor}`}>
              <Icon 
                name={item?.icon} 
                size={20} 
                className={item?.color}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {item?.value}
              </p>
              <p className="text-sm text-muted-foreground">
                {item?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;