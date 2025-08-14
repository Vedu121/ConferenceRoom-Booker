import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const BookingStatusIndicator = ({ 
  status = null, 
  message = '', 
  onClose = null,
  autoHide = true,
  duration = 5000,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (status && message) {
      setIsVisible(true);
      setIsAnimating(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [status, message, autoHide, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 200);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: 'CheckCircle',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          borderColor: 'border-success',
          iconColor: 'text-success-foreground'
        };
      case 'error':
        return {
          icon: 'XCircle',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          borderColor: 'border-error',
          iconColor: 'text-error-foreground'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          borderColor: 'border-warning',
          iconColor: 'text-warning-foreground'
        };
      case 'info':
        return {
          icon: 'Info',
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
          borderColor: 'border-primary',
          iconColor: 'text-primary-foreground'
        };
      case 'loading':
        return {
          icon: 'Loader2',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          borderColor: 'border-muted',
          iconColor: 'text-muted-foreground'
        };
      default:
        return {
          icon: 'Bell',
          bgColor: 'bg-card',
          textColor: 'text-card-foreground',
          borderColor: 'border-border',
          iconColor: 'text-muted-foreground'
        };
    }
  };

  if (!isVisible || !status || !message) {
    return null;
  }

  const config = getStatusConfig(status);

  return (
    <div className={`fixed top-20 right-4 z-1020 ${className}`}>
      <div 
        className={`
          ${config?.bgColor} ${config?.textColor} ${config?.borderColor}
          border rounded-md shadow-elevation-3 p-4 max-w-sm min-w-80
          transform transition-all duration-200 ease-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon 
              name={config?.icon} 
              size={20} 
              className={`${config?.iconColor} ${status === 'loading' ? 'animate-spin' : ''}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">
              {message}
            </p>
          </div>
          
          {onClose && (
            <button
              onClick={handleClose}
              className={`flex-shrink-0 ${config?.iconColor} hover:opacity-70 transition-opacity`}
              aria-label="Close notification"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        
        {/* Progress bar for auto-hide */}
        {autoHide && status !== 'loading' && (
          <div className="mt-3 w-full bg-black/10 rounded-full h-1">
            <div 
              className="bg-current h-1 rounded-full transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Hook for managing booking status notifications
export const useBookingStatus = () => {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const showStatus = (type, msg) => {
    setStatus(type);
    setMessage(msg);
  };

  const hideStatus = () => {
    setStatus(null);
    setMessage('');
  };

  const showSuccess = (msg) => showStatus('success', msg);
  const showError = (msg) => showStatus('error', msg);
  const showWarning = (msg) => showStatus('warning', msg);
  const showInfo = (msg) => showStatus('info', msg);
  const showLoading = (msg) => showStatus('loading', msg);

  return {
    status,
    message,
    showStatus,
    hideStatus,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  };
};

export default BookingStatusIndicator;