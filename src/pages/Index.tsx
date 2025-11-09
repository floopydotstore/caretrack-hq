import { useState } from 'react';
import { User, UserRole } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';
import Auth from './Auth';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (email: string, role: UserRole) => {
    // Mock user creation based on email and role
    const user: User = {
      id: `${role}-${Date.now()}`,
      email,
      role,
      name: email.split('@')[0].replace(/\./g, ' '),
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated || !currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  // Route to appropriate dashboard based on role
  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    case 'doctor':
      return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;
    case 'patient':
      return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
    default:
      return <Auth onLogin={handleLogin} />;
  }
};

export default Index;
