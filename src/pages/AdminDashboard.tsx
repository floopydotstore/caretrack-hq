import { useState } from 'react';
import { User } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockDoctors, mockPatients } from '@/lib/mockData';
import { Users, UserCog, Activity } from 'lucide-react';
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

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [doctors, setDoctors] = useState(mockDoctors);

  const handleToggleSubscription = (doctorId: string) => {
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === doctorId
          ? { ...doc, isSubscribed: !doc.isSubscribed }
          : doc
      )
    );
  };

  const totalDoctors = doctors.length;
  const totalPatients = mockPatients.length;
  const subscribedDoctors = doctors.filter(d => d.isSubscribed).length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage doctors, view statistics, and control subscriptions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
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
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Doctor Management</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
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
                        <span className="text-sm text-muted-foreground">
                          {doctor.isSubscribed ? 'Subscribed' : 'Free (3 max)'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
