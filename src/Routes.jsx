import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DashboardRoomOverview from './pages/dashboard-room-overview';
import BookingManagement from './pages/booking-management';
import UserAuthentication from './pages/user-authentication';
import RoomBookingForm from './pages/room-booking-form';
import RoomCalendarView from './pages/room-calendar-view';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BookingManagement />} />
        <Route path="/dashboard-room-overview" element={<DashboardRoomOverview />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/room-booking-form" element={<RoomBookingForm />} />
        <Route path="/room-calendar-view" element={<RoomCalendarView />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
