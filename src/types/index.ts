export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Doctor extends User {
  role: 'doctor';
  isSubscribed: boolean;
  phone: string;
  cnic: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  doctorId: string;
  createdAt: Date;
}

export interface VisitRecord {
  id: string;
  patientId: string;
  doctorId: string;
  medicineGiven: string;
  disease: string;
  addedAt: Date;
  nextVisit?: Date;
}
