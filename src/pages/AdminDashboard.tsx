import { useState } from 'react';
import { User } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockDoctors, mockPatients } from '@/lib/mockData';
import { Users, UserCog, Activity, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleSubscription = (doctorId: string) => {
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === doctorId
          ? { ...doc, isSubscribed: !doc.isSubscribed }
          : doc
      )
    );
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.phone.includes(searchQuery) ||
    doctor.cnic.includes(searchQuery)
  );

  const totalDoctors = doctors.length;
  const totalPatients = mockPatients.length;
  const subscribedDoctors = doctors.filter(d => d.isSubscribed).length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage doctors, view statistics, and control subscriptions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 sm:mb-8">
          <StatsCard
            title="Total Doctors"
            value={totalDoctors}
            icon={UserCog}
            description={`${subscribedDoctors} subscribed`}
          />
          <StatsCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            description="Across all doctors"
          />
          <StatsCard
            title="Active Subscriptions"
            value={subscribedDoctors}
            icon={Activity}
            description={`${totalDoctors - subscribedDoctors} inactive`}
          />
        </div>

        {/* Doctors Table */}
        <div className="bg-card rounded-lg border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Doctor Management</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[120px]">Phone</TableHead>
                  <TableHead className="min-w-[140px]">CNIC</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[180px]">Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No doctors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell className="text-muted-foreground">{doctor.email}</TableCell>
                      <TableCell className="text-muted-foreground">{doctor.phone}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">
                        {doctor.cnic}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doctor.isSubscribed ? 'default' : 'secondary'}>
                          {doctor.isSubscribed ? 'Active' : 'Limited'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={doctor.isSubscribed}
                            onCheckedChange={() => handleToggleSubscription(doctor.id)}
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {doctor.isSubscribed ? 'Subscribed' : 'Free (3 max)'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
