import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserProfileDropdown = ({ user = null, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const defaultUser = {
    name: 'Sarah Johnson',
    role: 'Employee',
    email: 'sarah.johnson@company.com',
    avatar: null
  };

  const currentUser = user || defaultUser;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    navigate('/user-authentication');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // Navigate to profile page when implemented
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-error/10 text-error';
      case 'manager':
        return 'bg-warning/10 text-warning';
      case 'employee':
        return 'bg-accent/10 text-accent';
      case 'reception':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 transition-smooth hover:bg-muted/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
          {currentUser?.avatar ? (
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} color="white" />
          )}
        </div>
        <div className="hidden md:block text-left min-w-0">
          <p className="text-sm font-medium text-foreground truncate max-w-32">
            {currentUser?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-32">
            {currentUser?.role}
          </p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-elevation-3 animate-fade-in z-1010">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser?.avatar} 
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} color="white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.email}
                </p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getRoleColor(currentUser?.role)}`}>
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className="w-full justify-start px-3 py-2 text-sm transition-smooth"
            >
              <Icon name="Settings" size={16} className="mr-3" />
              Account Settings
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-full justify-start px-3 py-2 text-sm transition-smooth"
            >
              <Icon name="HelpCircle" size={16} className="mr-3" />
              Help & Support
            </Button>

            <div className="border-t border-border my-1" />
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start px-3 py-2 text-sm text-error hover:text-error hover:bg-error/10 transition-smooth"
            >
              <Icon name="LogOut" size={16} className="mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;