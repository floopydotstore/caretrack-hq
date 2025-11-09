import { useState } from 'react';
import { User, Doctor, Patient, VisitRecord } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockDoctors, mockPatients, mockVisitRecords } from '@/lib/mockData';
import { Users, FileText, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const currentDoctor = mockDoctors.find(d => d.email === user.email) || mockDoctors[0];
  const [patients, setPatients] = useState<Patient[]>(
    mockPatients.filter(p => p.doctorId === currentDoctor.id)
  );
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>(
    mockVisitRecords.filter(v => v.doctorId === currentDoctor.id)
  );

  const canAddMore = currentDoctor.isSubscribed || patients.length < 3;
  const totalVisits = visitRecords.length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Doctor Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your patients and visit records
            </p>
          </div>
          <Badge variant={currentDoctor.isSubscribed ? 'default' : 'secondary'} className="text-sm px-4 py-2">
            {currentDoctor.isSubscribed ? 'Premium Account' : 'Free Account (3 patients max)'}
          </Badge>
        </div>

        {/* Subscription Warning */}
        {!currentDoctor.isSubscribed && patients.length >= 3 && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              You've reached your patient limit. Contact admin to upgrade your subscription.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <StatsCard
            title="My Patients"
            value={patients.length}
            icon={Users}
            description={!currentDoctor.isSubscribed ? `${3 - patients.length} slots remaining` : 'Unlimited'}
          />
          <StatsCard
            title="Total Visits"
            value={totalVisits}
            icon={FileText}
            description="All patient visits"
          />
        </div>

        {/* Tabs for Patients and Visits */}
        <Tabs defaultValue="patients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="visits">Visit Records</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Patient List</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!canAddMore} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Patient
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Patient</DialogTitle>
                      <DialogDescription>
                        Enter patient details. CNIC and phone must be unique.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+92-321-1234567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cnic">CNIC</Label>
                        <Input id="cnic" placeholder="42201-1234567-1" required />
                      </div>
                      <Button type="submit" className="w-full">Add Patient</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>CNIC</TableHead>
                      <TableHead>Added On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                        <TableCell className="text-muted-foreground">{patient.phone}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {patient.cnic}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {patient.createdAt.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Visit Records</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Visit Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Visit Record</DialogTitle>
                      <DialogDescription>
                        Record details of the patient visit
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient">Select Patient</Label>
                        <Input id="patient" placeholder="Search patient..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disease">Disease/Diagnosis</Label>
                        <Input id="disease" placeholder="e.g., Fever, Headache" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medicine">Medicine Given</Label>
                        <Textarea id="medicine" placeholder="List medications and dosages" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextVisit">Next Visit (Optional)</Label>
                        <Input id="nextVisit" type="date" />
                      </div>
                      <Button type="submit" className="w-full">Save Visit Record</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Patient</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Next Visit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitRecords.map((record) => {
                      const patient = patients.find(p => p.id === record.patientId);
                      return (
                        <TableRow key={record.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{patient?.name}</TableCell>
                          <TableCell className="text-muted-foreground">{record.disease}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {record.medicineGiven}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {record.addedAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {record.nextVisit ? (
                              <Badge variant="outline">
                                {record.nextVisit.toLocaleDateString()}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
