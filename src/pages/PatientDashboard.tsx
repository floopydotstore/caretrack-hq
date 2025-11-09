import { useState } from 'react';
import { User, VisitRecord } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockVisitRecords, mockPatients, mockDoctors } from '@/lib/mockData';
import { FileText, Calendar, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const [searchDate, setSearchDate] = useState('');
  
  // Find current patient
  const currentPatient = mockPatients.find(p => p.email === user.email) || mockPatients[0];
  
  // Get all visit records for this patient
  const allVisitRecords = mockVisitRecords.filter(v => v.patientId === currentPatient.id);
  
  // Filter by date if search is active
  const filteredRecords = searchDate
    ? allVisitRecords.filter(record => 
        record.addedAt.toLocaleDateString().includes(searchDate) ||
        record.nextVisit?.toLocaleDateString().includes(searchDate)
      )
    : allVisitRecords;

  const upcomingVisits = allVisitRecords.filter(
    v => v.nextVisit && v.nextVisit > new Date()
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Medical Records</h2>
          <p className="text-muted-foreground">
            View your visit history and upcoming appointments
          </p>
        </div>

        {/* Patient Info Card */}
        <Card className="p-6 mb-8 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{currentPatient.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{currentPatient.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{currentPatient.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">CNIC</p>
              <p className="font-medium font-mono">{currentPatient.cnic}</p>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <StatsCard
            title="Total Visits"
            value={allVisitRecords.length}
            icon={FileText}
            description="All medical consultations"
          />
          <StatsCard
            title="Upcoming Visits"
            value={upcomingVisits}
            icon={Calendar}
            description="Scheduled appointments"
          />
        </div>

        {/* Search and Records */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Visit History</h3>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <Label htmlFor="date-search" className="sr-only">Search by date</Label>
                <Input
                  id="date-search"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-48"
                  placeholder="Search by date"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Disease/Condition</TableHead>
                  <TableHead>Medicine Prescribed</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Next Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No visit records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => {
                    const doctor = mockDoctors.find(d => d.id === record.doctorId);
                    return (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {record.addedAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.disease}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs">
                          {record.medicineGiven}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doctor?.name}
                        </TableCell>
                        <TableCell>
                          {record.nextVisit ? (
                            <Badge variant="outline" className="whitespace-nowrap">
                              {record.nextVisit.toLocaleDateString()}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
