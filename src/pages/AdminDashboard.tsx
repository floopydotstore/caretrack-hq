import { useState } from 'react';
import { User } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockDoctors, mockPatients } from '@/lib/mockData';
import { Users, UserCog, Activity, Search } from 'lucide-react';
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
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/sidebar/AdminSidebar';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 bg-card">
            <SidebarTrigger />
            <div className="flex-1" />
            <Header user={user} onLogout={onLogout} />
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage doctors, patients, and system settings
                </p>
              </div>

              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
              )}

              {/* Doctors Section */}
              {activeSection === 'doctors' && (
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold">Doctor Management</h3>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[140px]">CNIC</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[120px] text-center">Subscription</TableHead>
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
                                    {doctor.isSubscribed ? 'Subscribed' : 'Free'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Switch
                                    checked={doctor.isSubscribed}
                                    onCheckedChange={() => handleToggleSubscription(doctor.id)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              {/* Patients Section */}
              {activeSection === 'patients' && (
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">All Patients</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[140px]">CNIC</TableHead>
                            <TableHead className="min-w-[150px]">Doctor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPatients.map((patient) => {
                            const doctor = mockDoctors.find(d => d.id === patient.doctorId);
                            return (
                              <TableRow key={patient.id} className="hover:bg-muted/30">
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                                <TableCell className="text-muted-foreground">{patient.phone}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-sm">
                                  {patient.cnic}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{doctor?.name}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
