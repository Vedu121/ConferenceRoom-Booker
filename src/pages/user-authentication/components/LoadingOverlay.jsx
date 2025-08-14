import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = "Authenticating..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 p-6 max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Loader2" size={24} className="text-primary animate-spin" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-1">
              {message}
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your credentials
            </p>
          </div>
          
          <div className="w-full bg-muted rounded-full h-1">
            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;