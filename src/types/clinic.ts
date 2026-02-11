// Core Types for Clinic Management System

export type AppointmentStatus =
  | 'agendado'
  | 'confirmado'
  | 'realizado'
  | 'cancelado'
  | 'faltou';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address?: string;
  notes?: string;
  role?: 'patient';
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock auth only
  role: 'admin';
  avatar?: string;
  specialty?: string; // Service/Role description
  createdAt: string;
}

export type UserRole = 'admin' | 'patient' | 'professional';

export type CurrentUser =
  | (Admin & { role: 'admin' })
  | (Patient & { role: 'patient' })
  | (Professional & { role: 'professional' });

export interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  // registrationNumber removed
  color: string; // For calendar display
  avatar?: string;
  role?: 'professional';
  workingHours: WorkingHours[];
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: string;
  professionalIds: string[]; // Which professionals can provide this service
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  serviceId: string;
  roomId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  totalValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  appointmentsToday: number;
  monthlyRevenue: number;
  newPatientsThisMonth: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageAppointmentDuration: number;
}

export interface AppointmentWithDetails extends Appointment {
  patient: Patient;
  professional: Professional;
  service: Service;
  room?: Room;
}

// Filter Types
export interface AppointmentFilters {
  professionalId?: string;
  roomId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}
