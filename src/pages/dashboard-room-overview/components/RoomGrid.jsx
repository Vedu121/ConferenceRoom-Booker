import React from 'react';
import RoomCard from './RoomCard';
import Icon from '../../../components/AppIcon';

const RoomGrid = ({ rooms, userRole, isLoading = false, error = null }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg shadow-elevation-1 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-muted rounded-full w-20"></div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
            <div className="flex justify-between pt-4 border-t border-border">
              <div className="h-8 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg shadow-elevation-1 p-8 text-center">
        <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Unable to Load Rooms
        </h3>
        <p className="text-muted-foreground mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location?.reload()}
          className="text-primary hover:text-primary/80 transition-smooth"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!rooms || rooms?.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-elevation-1 p-8 text-center">
        <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Rooms Found
        </h3>
        <p className="text-muted-foreground">
          No conference rooms match your current filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms?.map((room) => (
        <RoomCard 
          key={room?.id} 
          room={room} 
          userRole={userRole}
        />
      ))}
    </div>
  );
};

export default RoomGrid;