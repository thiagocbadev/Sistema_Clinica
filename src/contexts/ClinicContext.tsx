import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { sendProfessionalCredentialsEmail } from "@/services/email.service";
import { User } from "@supabase/supabase-js";
import type {
  Patient,
  Professional,
  Service,
  Appointment,
  Room,
} from "@/types/clinic";

// NOTE: Supabase table columns may be snake_case; we normalize rows to camelCase types used by the app.

function normalizePatient(row: any): Patient {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    birthDate: row.birth_date || row.birthDate || "",
    cpf: row.cpf || "",
    address: row.address || "",
    notes: row.notes || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  } as Patient;
}

function normalizeProfessional(row: any): Professional {
  return {
    id: row.id,
    name: row.name,
    email: row.email || row.mail,
    phone: row.phone || "",
    specialty: row.specialty || row.service || "",
    // registrationNumber removed
    color: row.color || "#3b82f6",
    avatar: row.avatar || undefined,
    workingHours: row.working_hours || row.workingHours || [],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  } as unknown as Professional;
}

function normalizeService(row: any): Service {
  // Debug log to check raw data
  return {
    id: row.id,
    name: row.name,
    description: row.description || row.desc || "",
    duration: row.duration || row.duration_minutes || 30,
    price: row.price || 0,
    category: row.category || "",
    // Try multiple possible column names for professional IDs
    professionalIds: row.profissionais_id || row.professional_ids || row.professionals_id || [],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  } as unknown as Service;
}

function normalizeAppointment(row: any): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id || row.patientId,
    professionalId: row.professional_id || row.professionalId,
    serviceId: row.service_id || row.serviceId,
    date: row.date,
    startTime: row.start_time || row.startTime || row.start || "",
    endTime: row.end_time || row.endTime || row.end || "",
    status: row.status || "agendado",
    notes: row.notes || "",
    totalValue: row.total_value || row.totalValue || 0,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  } as unknown as Appointment;
}

/* =====================
   CONTEXT
===================== */

interface ClinicContextData {
  user: User | null;
  currentUser: any | null;
  loading: boolean;

  patients: Patient[];
  professionals: Professional[];
  services: Service[];
  rooms: Room[];
  appointments: Appointment[];
  getAppointmentWithDetails(appointment: Appointment): Promise<any> | any;
  updateAppointmentStatus(id: string, status: string): Promise<void>;
  updateAppointment(id: string, data: Partial<Appointment>): Promise<void>;
  getServiceById(id: string): Service | undefined;
  addAppointment(data: any): Promise<boolean>;
  loadServices(): Promise<void>;
  loadAppointments(): Promise<void>;
  updateService(id: string, data: Partial<Service>): Promise<void>;
  deleteService(id: string): Promise<void>;

  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  logout(): Promise<void>;

  registerAdmin(email: string, password: string, name: string): Promise<void>;
  registerProfessionalUser(email: string, password: string, name: string, specialty?: string, phone?: string, color?: string, workingHours?: any[]): Promise<void>;

  // helper aliases used by UI components
  addPatient(data: Partial<Omit<Patient, "id">>): Promise<void>;
  updatePatient(id: string, data: Partial<Patient>): Promise<void>;
  deletePatient(id: string): Promise<void>;
  deletePatientWithAppointments(id: string): Promise<void>;
  addProfessional(data: any): Promise<void>;
  addService(data: Partial<Omit<Service, "id">>): Promise<void>;
  updateProfessional(id: string, data: Partial<Professional>): Promise<void>;
  deleteProfessional(id: string): Promise<void>;

  createPatient(data: Partial<Omit<Patient, "id">>): Promise<void>;
  createProfessional(data: Omit<Professional, "id">): Promise<void>;
  createService(data: Omit<Service, "id">): Promise<void>;
  createAppointment(data: Omit<Appointment, "id">): Promise<void>;
}

const ClinicContext = createContext({} as ClinicContextData);

/* =====================
   PROVIDER
===================== */

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);



  /* =====================
     AUTH
  ===================== */

  /* =====================
     AUTH & NOTIFICATIONS
  ===================== */

  async function sendProfessionalCredentials(email: string, password: string, name: string) {
    try {
      // Send email with credentials
      const emailResult = await sendProfessionalCredentialsEmail({
        email,
        password,
        name,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar credenciais:", error);
      return false;
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // If session returned, set user and load profile immediately
    if (data?.session?.user) {
      setUser(data.session.user);
      await loadCurrentUser(data.session.user);
    }
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // If signUp does not auto-login (depends on Supabase settings), try signing in
    if (!data?.session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Not fatal: user might need email confirmation. Still return.
        console.warn("Sign in after signUp failed:", signInError.message);
      } else if (signInData?.session?.user) {
        setUser(signInData.session.user);
        await loadCurrentUser(signInData.session.user);
      }
    } else if (data.session.user) {
      setUser(data.session.user);
      await loadCurrentUser(data.session.user);
    }
  }

  async function registerAdmin(email: string, password: string, name: string) {
    // Create auth user
    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    // Insert admin profile
    const { error: insertError } = await supabase.from("admin").insert({
      name,
      email,
      role: "admin",
      created_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;
  }

  async function registerProfessionalUser(
    email: string,
    password: string,
    name: string,
    specialty?: string,
    phone?: string,
    color?: string,
    workingHours?: any[]
  ) {
    setLoading(true);

    try {
      // 1. Verificar se o email já existe como profissional
      const { data: existingByEmail } = await supabase
        .from("professionals")
        .select("id, email")
        .eq("email", email);

      if (existingByEmail && existingByEmail.length > 0) {
        throw new Error("Este email já está registrado como profissional");
      }

      // 2. Verificar se o telefone já existe (se fornecido)
      if (phone) {
        const { data: existingByPhone } = await supabase
          .from("professionals")
          .select("id, phone")
          .eq("phone", phone);

        if (existingByPhone && existingByPhone.length > 0) {
          throw new Error("Este telefone já está registrado. Use um telefone diferente.");
        }
      }

      // 3. Criar o usuário profissional no Auth
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        // Se o usuário já existe no Auth, apenas continuar (o email já estava no Auth)
        if (!authError.message.includes('already registered')) {
          throw authError;
        }
      }

      // 4. Inserir perfil profissional
      const { error: insertError } = await supabase.from("professionals").insert({
        name,
        email,
        specialty: specialty || "",
        phone: phone || "",
        color: color || "#3b82f6",
        working_hours: workingHours || [],
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        // Tratamento específico de erros de duplicação
        if (insertError.code === '23505') {
          if (insertError.message.includes('email')) {
            throw new Error("Este email já está registrado como profissional");
          } else if (insertError.message.includes('phone') || insertError.message.includes('telephone')) {
            throw new Error("Este telefone já está registrado. Use um telefone diferente.");
          }
        }
        throw insertError;
      }

      // 5. Logout da sessão do novo profissional
      await supabase.auth.signOut({ scope: 'local' });

      // 6. Tentar restaurar a sessão original com refresh
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.warn('⚠️ Não conseguiu restaurar sessão automaticamente, fazendo reload...');
        // Se falhar, fazer reload da página para deixar o Supabase restaurar tudo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }

      // 7. Se conseguiu restaurar, atualizar o estado
      if (refreshedSession?.user) {
        setUser(refreshedSession.user);
        await loadCurrentUser(refreshedSession.user);
      }

      // 8. Atualizar dados
      await loadProfessionals();
      await sendProfessionalCredentials(email, password, name);

    } catch (err) {
      console.error("Erro ao registrar profissional:", err);

      // EM CASO DE ERRO: tentar fazer reload
      try {
        await supabase.auth.refreshSession();
      } catch (restoreErr) {
        console.error('❌ ERRO CRÍTICO: Não consegui restaurar sessão do admin');
        // Último recurso: recarregar página
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      throw err;

      throw err;
    } finally {
      // Garantir que o indicador de loading volte ao normal
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentUser(null);
  }

  async function loadCurrentUser(supabaseUser: User | null) {
    if (!supabaseUser || !supabaseUser.email) {
      setCurrentUser(null);
      return;
    }

    try {
      // Try admin first
      const { data: admin } = await supabase
        .from("admin")
        .select("*")
        .eq("email", supabaseUser.email)
        .maybeSingle();
      if (admin) {
        setCurrentUser({ ...admin, role: "admin" as const });
        return;
      }


      // Try professional
      const { data: professional } = await supabase
        .from("professionals")
        .select("*")
        .eq("email", supabaseUser.email)
        .maybeSingle();

      if (professional) {
        setCurrentUser({ ...professional, role: "professional" as const });
        return;
      }

      // Try patient
      const { data: patient } = await supabase
        .from("patients")
        .select("*")
        .eq("email", supabaseUser.email)
        .maybeSingle();

      if (patient) {
        setCurrentUser({ ...patient, role: "patient" as const });
        return;
      }

      // Fallback to basic supabase user
      setCurrentUser({ id: supabaseUser.id, email: supabaseUser.email });
    } catch (err) {
      console.error("Error loading profile:", err);
      setCurrentUser(null);
    }
  }

  /* =====================
     LOADERS
  ===================== */

  async function loadPatients() {
    const { data } = await supabase.from("patients").select("*");
    if (data) setPatients(data.map(normalizePatient));
  }

  async function loadProfessionals() {
    const { data } = await supabase.from("professionals").select("*");
    if (data) setProfessionals(data.map(normalizeProfessional));
  }

  async function loadServices() {
    const { data } = await supabase.from("services").select("*");
    if (data) setServices(data.map(normalizeService));
  }

  async function loadAppointments() {
    try {
      const { data, error } = await supabase.from("appointments").select("*");
      if (error) {
        console.error('Error loading appointments:', error);
        return;
      }
      if (data) {
        const normalized = data.map(normalizeAppointment);
        // Force new reference to trigger React re-render
        setAppointments([...normalized]);
      }
    } catch (error) {
      console.error('Error in loadAppointments:', error);
    }
  }

  /* =====================
     CREATE
  ===================== */

  async function createPatient(data: Partial<Omit<Patient, "id">>) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      created_at: (data as any).createdAt || new Date().toISOString(),
    };
    const { error } = await supabase.from("patients").insert(payload);
    if (error) throw error;
    await loadPatients();
  }

  async function createProfessional(data: Omit<Professional, "id">) {
    const payload = {
      ...data,
      // registration_number removed
      working_hours: (data as any).working_hours,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("professionals").insert(payload);
    if (error) throw error;
    await loadProfessionals();
  }

  // UI-friendly aliases (used by dialogs/pages) that match previous mock API
  async function addPatient(data: Omit<Patient, "id">) {
    await createPatient(data);
  }

  async function updatePatient(id: string, data: Partial<Patient>) {
    const { error } = await supabase.from("patients").update(data).eq("id", id);
    if (error) throw error;
    await loadPatients();
  }

  async function deletePatient(id: string) {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) throw error;
    await loadPatients();
  }

  async function deletePatientWithAppointments(id: string) {
    try {
      // First delete all appointments for this patient
      const { error: deleteAppointmentsError } = await supabase
        .from("appointments")
        .delete()
        .eq("patient_id", id);
      
      if (deleteAppointmentsError) throw deleteAppointmentsError;
      
      // Then delete the patient
      const { error: deletePatientError } = await supabase
        .from("patients")
        .delete()
        .eq("id", id);
      
      if (deletePatientError) throw deletePatientError;
      
      await loadPatients();
      await loadAppointments();
    } catch (error) {
      console.error('Error deleting patient with appointments:', error);
      throw error;
    }
  }

  async function addProfessional(data: any) {
    // If password is provided, create auth user and register professional
    if (data.password) {
      const { password, ...professionalData } = data;
      await registerProfessionalUser(
        data.email,
        password,
        data.name,
        data.specialty,
        data.phone,
        data.color,
        data.workingHours
      );
    } else {
      // Regular update without auth
      await createProfessional(data);
    }
  }

  async function addService(data: Omit<Service, "id">) {
    await createService(data);
  }

  async function updateProfessional(id: string, data: Partial<Professional>) {
    const { error } = await supabase.from("professionals").update(data).eq("id", id);
    if (error) throw error;
    await loadProfessionals();
  }

  async function deleteProfessional(id: string) {
    const { error } = await supabase.from("professionals").delete().eq("id", id);
    if (error) throw error;
    await loadProfessionals();
  }

  async function createService(data: Omit<Service, "id">) {
    const payload = {
      name: data.name,
      description: data.description,
      duration_minutes: (data as any).duration || (data as any).duration_minutes,
      price: data.price,
      category: data.category,
      profissionais_id: (data as any).professionalIds,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("services").insert(payload);
    if (error) throw error;
    await loadServices();
  }

  async function updateService(id: string, data: Partial<Service>) {
    const payload: any = {};
    if ((data as any).name) payload.name = data.name;
    if ((data as any).description) payload.description = data.description;
    if ((data as any).duration) payload.duration_minutes = (data as any).duration;
    if ((data as any).price !== undefined) payload.price = (data as any).price;
    if ((data as any).category) payload.category = data.category;
    if ((data as any).professionalIds) payload.profissionais_id = (data as any).professionalIds;

    const { error } = await supabase.from("services").update(payload).eq("id", id);
    if (error) throw error;
    await loadServices();
  }

  async function createAppointment(data: Omit<Appointment, "id">) {
    const payload = {
      patient_id: (data as any).patientId || (data as any).patient_id,
      professional_id: (data as any).professionalId || (data as any).professional_id,
      service_id: (data as any).serviceId || (data as any).service_id,
      date: (data as any).date,
      start_time: (data as any).startTime || (data as any).start_time,
      end_time: (data as any).endTime || (data as any).end_time,
      status: (data as any).status || 'agendado',
      notes: (data as any).notes || null,
      total_value: (data as any).totalValue || null,
    };

    const { error } = await supabase
      .from("appointments")
      .insert(payload);

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    } else {
      await loadAppointments();
    }
  }

  async function deleteService(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    await loadServices();
  }

  function getServiceById(id: string) {
    return services.find(s => s.id === id);
  }

  async function addAppointment(data: any) {
    try {
      await createAppointment({
        patientId: data.patientId,
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        status: data.status,
        totalValue: data.totalValue,
      } as any);
      return true;
    } catch (err) {
      console.error('Failed to add appointment', err);
      return false;
    }
  }

  // Return appointment with resolved relations
  function getAppointmentWithDetails(appointment: Appointment) {
    const patient = patients.find((p) => p.id === appointment.patientId) || { id: appointment.patientId, name: 'Paciente não encontrado' } as any;
    const professional = professionals.find((p) => p.id === appointment.professionalId) || { id: appointment.professionalId, name: 'Profissional não encontrado', color: '#ddd' } as any;
    const service = services.find((s) => s.id === appointment.serviceId) || { id: appointment.serviceId, name: 'Serviço não encontrado' } as any;

    return {
      ...appointment,
      patient,
      professional,
      service,
    } as any;
  }

  async function updateAppointmentStatus(id: string, status: string) {
    try {
      const { error, data: updateResult } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating appointment status', error);
        throw error;
      }
      
      // Force reload with small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  async function updateAppointment(id: string, data: Partial<Appointment>) {
    try {
      // First, get the current appointment to preserve all required fields
      const { data: currentData } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();

      if (!currentData) {
        throw new Error('Appointment not found');
      }

      // Build payload with all required fields, using new values where provided
      const payload: any = {
        patient_id: (data as any).patientId ? (data as any).patientId : currentData.patient_id,
        professional_id: (data as any).professionalId ? (data as any).professionalId : currentData.professional_id,
        service_id: (data as any).serviceId ? (data as any).serviceId : currentData.service_id,
        date: (data as any).date ? (data as any).date : currentData.date,
        start_time: (data as any).startTime ? (data as any).startTime : currentData.start_time,
        end_time: (data as any).endTime ? (data as any).endTime : currentData.end_time,
        status: (data as any).status ? (data as any).status : currentData.status,
        notes: (data as any).notes !== undefined ? (data as any).notes : currentData.notes,
      };

      // Only set room_id if it's explicitly provided
      if ((data as any).roomId !== undefined) {
        payload.room_id = (data as any).roomId || null;
      }

      const { error } = await supabase
        .from('appointments')
        .update(payload)
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      // Force reload with small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadAppointments();
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      throw error;
    }
  }

  /* =====================
     INIT
  ===================== */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      loadCurrentUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        loadCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadPatients();
      loadProfessionals();
      loadServices();
      loadAppointments();
    }
  }, [user]);

  /* =====================
     PROVIDER
  ===================== */

  return (
    <ClinicContext.Provider
      value={{
        user,
        currentUser,
        loading,
        patients,
        professionals,
        services,
        rooms,
        appointments,
        signIn,
        signUp,
        signOut,
        logout,
        registerAdmin,
        registerProfessionalUser,
        addPatient,
        updatePatient,
        deletePatient,
        deletePatientWithAppointments,
        addProfessional,
        addService,
        updateProfessional,
        deleteProfessional,
        createPatient,
        createProfessional,
        createService,
        updateService,
        deleteService,
        loadServices,
        loadAppointments,
        createAppointment,
        getAppointmentWithDetails,
        updateAppointmentStatus,
        updateAppointment,
        getServiceById,
        addAppointment,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

/* =====================
   HOOK
===================== */

export function useClinic() {
  return useContext(ClinicContext);
}
