import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationBreadcrumb = ({ 
  customBreadcrumbs = null, 
  showHome = true,
  className = "" 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard-room-overview': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/room-calendar-view': { label: 'Calendar View', icon: 'Calendar' },
    '/booking-management': { label: 'My Bookings', icon: 'BookOpen' },
    '/room-booking-form': { label: 'Book Room', icon: 'Plus' },
    '/user-authentication': { label: 'Sign In', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    if (showHome && location?.pathname !== '/dashboard-room-overview') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/dashboard-room-overview',
        icon: 'LayoutDashboard'
      });
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      
      if (route && currentPath !== '/dashboard-room-overview') {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on dashboard or if only one item
  if (location?.pathname === '/dashboard-room-overview' || breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleBack = () => {
    if (breadcrumbs?.length > 1) {
      const previousBreadcrumb = breadcrumbs?.[breadcrumbs?.length - 2];
      navigate(previousBreadcrumb?.path);
    } else {
      navigate('/dashboard-room-overview');
    }
  };

  return (
    <nav 
      className={`flex items-center space-x-2 py-3 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      {/* Mobile Back Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-2 -ml-2"
          aria-label="Go back"
        >
          <Icon name="ArrowLeft" size={16} />
        </Button>
      </div>
      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center space-x-2 flex-1">
        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb?.path || index}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground flex-shrink-0" 
              />
            )}
            
            <div className="flex items-center space-x-1 min-w-0">
              {breadcrumb?.icon && (
                <Icon 
                  name={breadcrumb?.icon} 
                  size={14} 
                  className={`flex-shrink-0 ${
                    breadcrumb?.isLast 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                />
              )}
              
              {breadcrumb?.isLast ? (
                <span className="text-sm font-medium text-foreground truncate">
                  {breadcrumb?.label}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation(breadcrumb?.path)}
                  className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground transition-smooth truncate"
                >
                  {breadcrumb?.label}
                </Button>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Mobile Current Page */}
      <div className="md:hidden flex items-center space-x-2 flex-1">
        {breadcrumbs?.length > 0 && (
          <div className="flex items-center space-x-2 min-w-0">
            {breadcrumbs?.[breadcrumbs?.length - 1]?.icon && (
              <Icon 
                name={breadcrumbs?.[breadcrumbs?.length - 1]?.icon} 
                size={16} 
                className="text-foreground flex-shrink-0" 
              />
            )}
            <span className="text-sm font-medium text-foreground truncate">
              {breadcrumbs?.[breadcrumbs?.length - 1]?.label}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBreadcrumb;