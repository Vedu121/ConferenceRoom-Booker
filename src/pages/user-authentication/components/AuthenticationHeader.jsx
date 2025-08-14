import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthenticationHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-elevation-2">
          <Icon name="Calendar" size={32} color="white" />
        </div>
      </div>

      {/* App Title */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">ConferenceRoom</h1>
        <p className="text-lg text-primary font-medium -mt-1">Booker</p>
      </div>

      {/* Welcome Message */}
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to manage conference room bookings
        </p>
      </div>
    </div>
  );
};

export default AuthenticationHeader;