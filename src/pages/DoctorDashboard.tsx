import { useState } from 'react';
import { User, Patient, VisitRecord } from '@/types';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DoctorSidebar } from '@/components/sidebar/DoctorSidebar';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 bg-card">
            <SidebarTrigger />
            <div className="flex-1" />
            <Header user={user} onLogout={onLogout} />
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

              {/* Overview Section */}
              {activeTab === 'overview' && (
                <>
                  {!currentDoctor.isSubscribed && patients.length >= 3 && (
                    <Alert className="mb-4 sm:mb-6 border-destructive/50 bg-destructive/5">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <AlertDescription className="text-sm">
                        You've reached the maximum limit of 3 patients on the free plan. Upgrade to add more patients.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <StatsCard
                      title="My Patients"
                      value={patients.length}
                      icon={Users}
                      description={!currentDoctor.isSubscribed ? `${patients.length}/3 limit` : 'No limit'}
                    />
                    <StatsCard
                      title="Total Visits"
                      value={totalVisits}
                      icon={FileText}
                      description="All patient consultations"
                    />
                  </div>
                </>
              )}

              {/* Patients Tab */}
              {activeTab === 'patients' && (
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <div className="flex flex-col gap-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-lg sm:text-xl font-semibold">My Patients</h3>
                      <Button
                        onClick={() => setIsAddPatientOpen(true)}
                        disabled={!currentDoctor.isSubscribed && patients.length >= 3}
                        className="w-full sm:w-auto"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Patient
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        type="text"
                        placeholder="Search patients..."
                        value={patientSearchQuery}
                        onChange={(e) => setPatientSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {!currentDoctor.isSubscribed && patients.length >= 3 && (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Patient limit reached (3/3). Please upgrade your subscription to add more patients.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[150px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[120px]">Phone</TableHead>
                            <TableHead className="min-w-[140px]">CNIC</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPatients.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              {/* Visit Records Tab */}
              {activeTab === 'visits' && (
                <div className="bg-card rounded-lg border p-4 sm:p-6">
                  <div className="flex flex-col gap-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-lg sm:text-xl font-semibold">Visit Records</h3>
                      <Button
                        onClick={() => setIsAddVisitOpen(true)}
                        className="w-full sm:w-auto"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Visit Record
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        type="text"
                        placeholder="Search records..."
                        value={visitSearchQuery}
                        onChange={(e) => setVisitSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[150px]">Patient</TableHead>
                            <TableHead className="min-w-[120px]">Visit Date</TableHead>
                            <TableHead className="min-w-[150px]">Disease/Condition</TableHead>
                            <TableHead className="min-w-[200px]">Medicine Prescribed</TableHead>
                            <TableHead className="min-w-[120px]">Next Visit</TableHead>
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
                                  <TableCell className="text-muted-foreground">
                                    {record.addedAt.toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{record.disease}</TableCell>
                                  <TableCell className="text-muted-foreground text-sm max-w-xs">
                                    {record.medicineGiven}
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
                </div>
              )}
            </div>

            {/* Add Patient Dialog */}
            <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                  <DialogDescription>
                    Enter patient information to add them to your list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input id="patient-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input id="patient-email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone</Label>
                    <Input id="patient-phone" placeholder="+92 300 1234567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-cnic">CNIC</Label>
                    <Input id="patient-cnic" placeholder="12345-6789012-3" />
                  </div>
                  <Button className="w-full">Add Patient</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Visit Record Dialog */}
            <Dialog open={isAddVisitOpen} onOpenChange={setIsAddVisitOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Visit Record</DialogTitle>
                  <DialogDescription>
                    Record a new patient visit and consultation details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="visit-patient">Patient</Label>
                    <Input id="visit-patient" placeholder="Select patient" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visit-disease">Disease/Condition</Label>
                    <Input id="visit-disease" placeholder="Flu, Cold, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visit-medicine">Medicine Prescribed</Label>
                    <Textarea id="visit-medicine" placeholder="List of medicines..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visit-next">Next Visit (Optional)</Label>
                    <Input id="visit-next" type="date" />
                  </div>
                  <Button className="w-full">Save Visit Record</Button>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
