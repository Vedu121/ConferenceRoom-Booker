import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import RoomFilters from './components/RoomFilters';
import RoomGrid from './components/RoomGrid';

const DashboardRoomOverview = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    capacity: 'all',
    equipment: 'all',
    status: 'all',
    timeframe: 'now'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole] = useState('employee'); // Could be 'employee' or 'reception'

  // Mock room data
  const mockRooms = [
    {
      id: 1,
      name: "Executive Boardroom",
      floor: 3,
      capacity: 12,
      equipment: ["Projector", "Video Conference", "Whiteboard"],
      status: "available",
      nextAvailable: "Available now",
      currentBooking: null,
      nextBooking: null
    },
    {
      id: 2,
      name: "Innovation Hub",
      floor: 2,
      capacity: 8,
      equipment: ["TV Display", "Whiteboard", "Audio System"],
      status: "occupied",
      nextAvailable: "2:30 PM",
      currentBooking: {
        organizer: "Sarah Johnson",
        endTime: "2:30 PM"
      },
      nextBooking: null
    },
    {
      id: 3,
      name: "Collaboration Space A",
      floor: 1,
      capacity: 6,
      equipment: ["TV Display", "Whiteboard"],
      status: "upcoming",
      nextAvailable: "3:00 PM",
      currentBooking: null,
      nextBooking: {
        startTime: "3:00 PM",
        organizer: "Mike Chen"
      }
    },
    {
      id: 4,
      name: "Focus Room 1",
      floor: 2,
      capacity: 4,
      equipment: ["TV Display"],
      status: "available",
      nextAvailable: "Available now",
      currentBooking: null,
      nextBooking: null
    },
    {
      id: 5,
      name: "Training Center",
      floor: 1,
      capacity: 20,
      equipment: ["Projector", "Audio System", "Whiteboard", "Video Conference"],
      status: "available",
      nextAvailable: "Available now",
      currentBooking: null,
      nextBooking: null
    },
    {
      id: 6,
      name: "Creative Studio",
      floor: 3,
      capacity: 10,
      equipment: ["TV Display", "Whiteboard", "Audio System"],
      status: "occupied",
      nextAvailable: "4:00 PM",
      currentBooking: {
        organizer: "Design Team",
        endTime: "4:00 PM"
      },
      nextBooking: null
    }
  ];

  // Simulate data loading
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRooms(mockRooms);
        setError(null);
      } catch (err) {
        setError("Failed to load room data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Filter rooms based on current filters
  useEffect(() => {
    let filtered = [...rooms];

    // Filter by capacity
    if (filters?.capacity !== 'all') {
      filtered = filtered?.filter(room => {
        switch (filters?.capacity) {
          case '1-5':
            return room?.capacity <= 5;
          case '6-10':
            return room?.capacity >= 6 && room?.capacity <= 10;
          case '11-20':
            return room?.capacity >= 11 && room?.capacity <= 20;
          case '20+':
            return room?.capacity > 20;
          default:
            return true;
        }
      });
    }

    // Filter by equipment
    if (filters?.equipment !== 'all') {
      filtered = filtered?.filter(room => {
        const equipmentMap = {
          'projector': 'Projector',
          'tv': 'TV Display',
          'whiteboard': 'Whiteboard',
          'video-conference': 'Video Conference',
          'audio-system': 'Audio System'
        };
        return room?.equipment?.includes(equipmentMap?.[filters?.equipment]);
      });
    }

    // Filter by status
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(room => room?.status === filters?.status);
    }

    // Filter by timeframe (simplified for demo)
    if (filters?.timeframe === 'available') {
      filtered = filtered?.filter(room => room?.status === 'available');
    }

    setFilteredRooms(filtered);
  }, [rooms, filters]);

  // Calculate stats
  const stats = {
    totalRooms: rooms?.length,
    availableRooms: rooms?.filter(room => room?.status === 'available')?.length,
    occupiedRooms: rooms?.filter(room => room?.status === 'occupied')?.length,
    upcomingBookings: rooms?.filter(room => room?.status === 'upcoming')?.length
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRooms([...mockRooms]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Conference Room Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor room availability and manage bookings across all conference rooms
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats stats={stats} />

          {/* Quick Actions */}
          <QuickActions 
            userRole={userRole} 
            onRefresh={handleRefresh}
          />

          {/* Room Filters */}
          <RoomFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalRooms={rooms?.length}
            availableRooms={stats?.availableRooms}
          />

          {/* Room Grid */}
          <RoomGrid
            rooms={filteredRooms}
            userRole={userRole}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardRoomOverview;