import { useState } from 'react';
import { User, Doctor, Patient, VisitRecord } from '@/types';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/layout/StatsCard';
import { mockDoctors, mockPatients, mockVisitRecords } from '@/lib/mockData';
import { Users, FileText, Plus, AlertCircle, Search } from 'lucide-react';
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
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [visitSearchQuery, setVisitSearchQuery] = useState('');

  const canAddMore = currentDoctor.isSubscribed || patients.length < 3;
  const totalVisits = visitRecords.length;

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
    patient.phone.includes(patientSearchQuery) ||
    patient.cnic.includes(patientSearchQuery)
  );

  const filteredVisitRecords = visitRecords.filter(record => {
    const patient = patients.find(p => p.id === record.patientId);
    return (
      record.disease.toLowerCase().includes(visitSearchQuery.toLowerCase()) ||
      record.medicineGiven.toLowerCase().includes(visitSearchQuery.toLowerCase()) ||
      patient?.name.toLowerCase().includes(visitSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Doctor Dashboard</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your patients and visit records
            </p>
          </div>
          <Badge variant={currentDoctor.isSubscribed ? 'default' : 'secondary'} className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
            {currentDoctor.isSubscribed ? 'Premium Account' : 'Free Account (3 patients max)'}
          </Badge>
        </div>

        {/* Subscription Warning */}
        {!currentDoctor.isSubscribed && patients.length >= 3 && (
          <Alert className="mb-4 sm:mb-6 border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-sm text-destructive">
              You've reached your patient limit. Contact admin to upgrade your subscription.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mb-6 sm:mb-8">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients" className="text-sm sm:text-base">Patients</TabsTrigger>
            <TabsTrigger value="visits" className="text-sm sm:text-base">Visit Records</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="bg-card rounded-lg border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Patient List</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={!canAddMore} className="gap-2 w-full sm:w-auto">
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
              </div>
              
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[120px]">Phone</TableHead>
                      <TableHead className="min-w-[140px]">CNIC</TableHead>
                      <TableHead className="min-w-[110px]">Added On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <div className="bg-card rounded-lg border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Visit Records</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search visits..."
                      value={visitSearchQuery}
                      onChange={(e) => setVisitSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="gap-2 w-full sm:w-auto">
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
              </div>
              
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="min-w-[150px]">Patient</TableHead>
                      <TableHead className="min-w-[120px]">Disease</TableHead>
                      <TableHead className="min-w-[150px]">Medicine</TableHead>
                      <TableHead className="min-w-[110px]">Visit Date</TableHead>
                      <TableHead className="min-w-[110px]">Next Visit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVisitRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No visit records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVisitRecords.map((record) => {
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
