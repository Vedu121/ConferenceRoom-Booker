import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationHeader from './components/AuthenticationHeader';
import AuthenticationForm from './components/AuthenticationForm';
import SecurityIndicators from './components/SecurityIndicators';
import LoadingOverlay from './components/LoadingOverlay';

const UserAuthentication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('conferenceRoomUser') || 
                      sessionStorage.getItem('conferenceRoomUser');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Redirect based on role
        if (userData?.role === 'reception') {
          navigate('/room-calendar-view');
        } else {
          navigate('/dashboard-room-overview');
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('conferenceRoomUser');
        sessionStorage.removeItem('conferenceRoomUser');
      }
    }
  }, [navigate]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Main Authentication Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-elevation-3 p-8">
          {/* Header Section */}
          <AuthenticationHeader />
          
          {/* Authentication Form */}
          <AuthenticationForm 
            onAuthSuccess={handleAuthSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {/* Security Indicators */}
          <SecurityIndicators />
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Signing you in..."
      />
    </div>
  );
};

export default UserAuthentication;