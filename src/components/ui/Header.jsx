import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-room-overview', icon: 'LayoutDashboard' },
    { label: 'Calendar', path: '/room-calendar-view', icon: 'Calendar' },
    { label: 'My Bookings', path: '/booking-management', icon: 'BookOpen' },
    { label: 'Book Room', path: '/room-booking-form', icon: 'Plus' }
  ];

  const currentUser = {
    name: 'Sarah Johnson',
    role: 'Employee',
    email: 'sarah.johnson@company.com'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/user-authentication');
    setIsUserMenuOpen(false);
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">ConferenceRoom</h1>
                <p className="text-xs text-muted-foreground -mt-1">Booker</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                className="px-4 py-2 text-sm font-medium transition-smooth"
              >
                <Icon name={item?.icon} size={16} className="mr-2" />
                {item?.label}
              </Button>
            ))}
          </nav>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2"
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                />
              </Button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-elevation-3 animate-fade-in z-1010">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
                      {currentUser?.role}
                    </span>
                  </div>
                  <div className="p-1">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start px-3 py-2 text-sm"
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in">
            <nav className="p-4 space-y-2">
              {navigationItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActivePath(item?.path) ? "default" : "ghost"}
                  onClick={() => handleNavigation(item?.path)}
                  className="w-full justify-start px-4 py-3 text-sm font-medium"
                >
                  <Icon name={item?.icon} size={18} className="mr-3" />
                  {item?.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;