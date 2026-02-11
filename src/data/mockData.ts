// import { Patient, Professional, Service, Room, Appointment } from '@/types/clinic';

// // Mock Patients
// export const mockPatients: Patient[] = [
//   {
//     id: 'p1',
//     name: 'Maria Silva Santos',
//     email: 'maria.silva@email.com',
//     phone: '(11) 99999-1234',
//     birthDate: '1985-03-15',
//     cpf: '123.456.789-00',
//     address: 'Rua das Flores, 123 - São Paulo, SP',
//     notes: 'Alérgica a penicilina',
//     createdAt: '2024-01-15T10:00:00Z',
//   },
//   {
//     id: 'p2',
//     name: 'João Pedro Oliveira',
//     email: 'joao.pedro@email.com',
//     phone: '(11) 98888-5678',
//     birthDate: '1990-07-22',
//     cpf: '234.567.890-11',
//     address: 'Av. Paulista, 1000 - São Paulo, SP',
//     createdAt: '2024-01-20T14:30:00Z',
//   },
//   {
//     id: 'p3',
//     name: 'Ana Carolina Ferreira',
//     email: 'ana.carolina@email.com',
//     phone: '(11) 97777-9012',
//     birthDate: '1978-11-08',
//     cpf: '345.678.901-22',
//     address: 'Rua Augusta, 500 - São Paulo, SP',
//     notes: 'Diabética tipo 2',
//     createdAt: '2024-02-01T09:15:00Z',
//   },
//   {
//     id: 'p4',
//     name: 'Carlos Eduardo Lima',
//     email: 'carlos.lima@email.com',
//     phone: '(11) 96666-3456',
//     birthDate: '1995-04-30',
//     cpf: '456.789.012-33',
//     createdAt: '2024-02-10T11:45:00Z',
//   },
//   {
//     id: 'p5',
//     name: 'Fernanda Costa Ribeiro',
//     email: 'fernanda.costa@email.com',
//     phone: '(11) 95555-7890',
//     birthDate: '1982-09-12',
//     cpf: '567.890.123-44',
//     address: 'Rua Oscar Freire, 200 - São Paulo, SP',
//     createdAt: '2024-02-15T16:00:00Z',
//   },
// ];

// // Mock Professionals
// export const mockProfessionals: Professional[] = [
//   {
//     id: 'prof1',
//     name: 'Dr. Ricardo Mendes',
//     email: 'ricardo.mendes@clinica.com',
//     phone: '(11) 94444-1111',
//     specialty: 'Clínica Geral',
//     registrationNumber: 'CRM 123456',
//     color: '#1e3a5f',
//     workingHours: [
//       { dayOfWeek: 1, start: '08:00', end: '18:00' },
//       { dayOfWeek: 2, start: '08:00', end: '18:00' },
//       { dayOfWeek: 3, start: '08:00', end: '18:00' },
//       { dayOfWeek: 4, start: '08:00', end: '18:00' },
//       { dayOfWeek: 5, start: '08:00', end: '16:00' },
//     ],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 'prof2',
//     name: 'Dra. Camila Rodrigues',
//     email: 'camila.rodrigues@clinica.com',
//     phone: '(11) 93333-2222',
//     specialty: 'Dermatologia',
//     registrationNumber: 'CRM 234567',
//     color: '#2a9d8f',
//     workingHours: [
//       { dayOfWeek: 1, start: '09:00', end: '17:00' },
//       { dayOfWeek: 2, start: '09:00', end: '17:00' },
//       { dayOfWeek: 4, start: '09:00', end: '17:00' },
//       { dayOfWeek: 5, start: '09:00', end: '17:00' },
//     ],
//     createdAt: '2023-06-15T08:00:00Z',
//   },
//   {
//     id: 'prof3',
//     name: 'Dr. Paulo Nascimento',
//     email: 'paulo.nascimento@clinica.com',
//     phone: '(11) 92222-3333',
//     specialty: 'Fisioterapia',
//     registrationNumber: 'CREFITO 345678',
//     color: '#e9c46a',
//     workingHours: [
//       { dayOfWeek: 1, start: '07:00', end: '19:00' },
//       { dayOfWeek: 2, start: '07:00', end: '19:00' },
//       { dayOfWeek: 3, start: '07:00', end: '19:00' },
//       { dayOfWeek: 4, start: '07:00', end: '19:00' },
//       { dayOfWeek: 5, start: '07:00', end: '15:00' },
//     ],
//     createdAt: '2023-07-01T08:00:00Z',
//   },
//   {
//     id: 'prof4',
//     name: 'Dra. Juliana Almeida',
//     email: 'juliana.almeida@clinica.com',
//     phone: '(11) 91111-4444',
//     specialty: 'Nutrição',
//     registrationNumber: 'CRN 456789',
//     color: '#f4a261',
//     workingHours: [
//       { dayOfWeek: 2, start: '08:00', end: '16:00' },
//       { dayOfWeek: 3, start: '08:00', end: '16:00' },
//       { dayOfWeek: 4, start: '08:00', end: '16:00' },
//     ],
//     createdAt: '2023-08-01T08:00:00Z',
//   },
// ];

// // Mock Services
// export const mockServices: Service[] = [
//   {
//     id: 's1',
//     name: 'Consulta Clínica Geral',
//     description: 'Avaliação médica completa',
//     duration: 30,
//     price: 250.0,
//     category: 'Consulta',
//     professionalIds: ['prof1'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 's2',
//     name: 'Consulta Dermatológica',
//     description: 'Avaliação e tratamento de pele',
//     duration: 45,
//     price: 350.0,
//     category: 'Consulta',
//     professionalIds: ['prof2'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 's3',
//     name: 'Sessão de Fisioterapia',
//     description: 'Tratamento fisioterapêutico',
//     duration: 60,
//     price: 180.0,
//     category: 'Terapia',
//     professionalIds: ['prof3'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 's4',
//     name: 'Consulta Nutricional',
//     description: 'Avaliação e plano alimentar',
//     duration: 60,
//     price: 280.0,
//     category: 'Consulta',
//     professionalIds: ['prof4'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 's5',
//     name: 'Retorno',
//     description: 'Consulta de acompanhamento',
//     duration: 20,
//     price: 150.0,
//     category: 'Consulta',
//     professionalIds: ['prof1', 'prof2', 'prof4'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
//   {
//     id: 's6',
//     name: 'Peeling Químico',
//     description: 'Procedimento estético facial',
//     duration: 90,
//     price: 450.0,
//     category: 'Procedimento',
//     professionalIds: ['prof2'],
//     createdAt: '2023-06-01T08:00:00Z',
//   },
// ];

// // Mock Rooms
// export const mockRooms: Room[] = [
//   { id: 'room1', name: 'Consultório 1', description: 'Clínica Geral', isActive: true },
//   { id: 'room2', name: 'Consultório 2', description: 'Dermatologia', isActive: true },
//   { id: 'room3', name: 'Sala de Fisioterapia', description: 'Equipada para fisio', isActive: true },
//   { id: 'room4', name: 'Consultório 3', description: 'Nutrição', isActive: true },
// ];

// // Helper to get current week dates
// const getWeekDates = () => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const monday = new Date(today);
//   monday.setDate(today.getDate() - dayOfWeek + 1);
  
//   const dates = [];
//   for (let i = 0; i < 7; i++) {
//     const date = new Date(monday);
//     date.setDate(monday.getDate() + i);
//     dates.push(date.toISOString().split('T')[0]);
//   }
//   return dates;
// };

// const weekDates = getWeekDates();

// // Mock Appointments
// export const mockAppointments: Appointment[] = [
//   {
//     id: 'apt1',
//     patientId: 'p1',
//     professionalId: 'prof1',
//     serviceId: 's1',
//     roomId: 'room1',
//     date: weekDates[0],
//     startTime: '09:00',
//     endTime: '09:30',
//     status: 'completed',
//     totalValue: 250.0,
//     createdAt: '2024-01-10T08:00:00Z',
//     updatedAt: '2024-01-10T10:00:00Z',
//   },
//   {
//     id: 'apt2',
//     patientId: 'p2',
//     professionalId: 'prof2',
//     serviceId: 's2',
//     roomId: 'room2',
//     date: weekDates[0],
//     startTime: '10:00',
//     endTime: '10:45',
//     status: 'confirmed',
//     createdAt: '2024-01-11T08:00:00Z',
//     updatedAt: '2024-01-11T08:00:00Z',
//   },
//   {
//     id: 'apt3',
//     patientId: 'p3',
//     professionalId: 'prof3',
//     serviceId: 's3',
//     roomId: 'room3',
//     date: weekDates[1],
//     startTime: '08:00',
//     endTime: '09:00',
//     status: 'scheduled',
//     createdAt: '2024-01-12T08:00:00Z',
//     updatedAt: '2024-01-12T08:00:00Z',
//   },
//   {
//     id: 'apt4',
//     patientId: 'p4',
//     professionalId: 'prof4',
//     serviceId: 's4',
//     roomId: 'room4',
//     date: weekDates[2],
//     startTime: '09:00',
//     endTime: '10:00',
//     status: 'confirmed',
//     createdAt: '2024-01-13T08:00:00Z',
//     updatedAt: '2024-01-13T08:00:00Z',
//   },
//   {
//     id: 'apt5',
//     patientId: 'p5',
//     professionalId: 'prof1',
//     serviceId: 's5',
//     roomId: 'room1',
//     date: weekDates[1],
//     startTime: '14:00',
//     endTime: '14:20',
//     status: 'in-progress',
//     createdAt: '2024-01-14T08:00:00Z',
//     updatedAt: '2024-01-14T14:00:00Z',
//   },
//   {
//     id: 'apt6',
//     patientId: 'p1',
//     professionalId: 'prof2',
//     serviceId: 's6',
//     roomId: 'room2',
//     date: weekDates[3],
//     startTime: '11:00',
//     endTime: '12:30',
//     status: 'scheduled',
//     createdAt: '2024-01-15T08:00:00Z',
//     updatedAt: '2024-01-15T08:00:00Z',
//   },
//   {
//     id: 'apt7',
//     patientId: 'p2',
//     professionalId: 'prof3',
//     serviceId: 's3',
//     roomId: 'room3',
//     date: weekDates[4],
//     startTime: '15:00',
//     endTime: '16:00',
//     status: 'cancelled',
//     notes: 'Paciente cancelou por motivos pessoais',
//     createdAt: '2024-01-16T08:00:00Z',
//     updatedAt: '2024-01-17T10:00:00Z',
//   },
//   {
//     id: 'apt8',
//     patientId: 'p3',
//     professionalId: 'prof1',
//     serviceId: 's1',
//     roomId: 'room1',
//     date: weekDates[0],
//     startTime: '11:00',
//     endTime: '11:30',
//     status: 'confirmed',
//     createdAt: '2024-01-17T08:00:00Z',
//     updatedAt: '2024-01-17T08:00:00Z',
//   },
// ];

// // Chart data for dashboard
// export const monthlyAppointmentsData = [
//   { month: 'Jan', appointments: 145, revenue: 38500 },
//   { month: 'Fev', appointments: 132, revenue: 35200 },
//   { month: 'Mar', appointments: 168, revenue: 42800 },
//   { month: 'Abr', appointments: 155, revenue: 40100 },
//   { month: 'Mai', appointments: 178, revenue: 46200 },
//   { month: 'Jun', appointments: 189, revenue: 49500 },
// ];

// export const appointmentsBySpecialty = [
//   { specialty: 'Clínica Geral', count: 85, color: '#1e3a5f' },
//   { specialty: 'Dermatologia', count: 62, color: '#2a9d8f' },
//   { specialty: 'Fisioterapia', count: 94, color: '#e9c46a' },
//   { specialty: 'Nutrição', count: 48, color: '#f4a261' },
// ];
