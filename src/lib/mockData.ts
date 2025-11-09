import { Doctor, Patient, VisitRecord, User } from '@/types';

// Mock current user - change this to test different roles
export const mockCurrentUser: User = {
  id: 'admin-1',
  email: 'admin@hospital.com',
  role: 'admin',
  name: 'Admin User',
};

export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    email: 'dr.smith@hospital.com',
    role: 'doctor',
    name: 'Dr. John Smith',
    isSubscribed: true,
    phone: '+92-300-1234567',
    cnic: '42101-1234567-1',
  },
  {
    id: 'doc-2',
    email: 'dr.jones@hospital.com',
    role: 'doctor',
    name: 'Dr. Sarah Jones',
    isSubscribed: false,
    phone: '+92-301-9876543',
    cnic: '42101-9876543-2',
  },
  {
    id: 'doc-3',
    email: 'dr.ahmed@hospital.com',
    role: 'doctor',
    name: 'Dr. Ahmed Khan',
    isSubscribed: true,
    phone: '+92-333-5555555',
    cnic: '42101-5555555-3',
  },
];

export const mockPatients: Patient[] = [
  {
    id: 'pat-1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    phone: '+92-321-1111111',
    cnic: '42201-1111111-1',
    doctorId: 'doc-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pat-2',
    name: 'Bob Williams',
    email: 'bob@email.com',
    phone: '+92-322-2222222',
    cnic: '42201-2222222-2',
    doctorId: 'doc-1',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'pat-3',
    name: 'Carol Davis',
    email: 'carol@email.com',
    phone: '+92-323-3333333',
    cnic: '42201-3333333-3',
    doctorId: 'doc-2',
    createdAt: new Date('2024-03-10'),
  },
];

export const mockVisitRecords: VisitRecord[] = [
  {
    id: 'visit-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    medicineGiven: 'Paracetamol 500mg',
    disease: 'Fever',
    addedAt: new Date('2024-03-01'),
    nextVisit: new Date('2024-03-15'),
  },
  {
    id: 'visit-2',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    medicineGiven: 'Ibuprofen 400mg',
    disease: 'Headache',
    addedAt: new Date('2024-03-20'),
  },
  {
    id: 'visit-3',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    medicineGiven: 'Amoxicillin 500mg',
    disease: 'Bacterial Infection',
    addedAt: new Date('2024-03-05'),
    nextVisit: new Date('2024-03-19'),
  },
  {
    id: 'visit-4',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    medicineGiven: 'Cetirizine 10mg',
    disease: 'Allergies',
    addedAt: new Date('2024-03-12'),
    nextVisit: new Date('2024-04-12'),
  },
];
