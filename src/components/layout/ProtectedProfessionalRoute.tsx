import { Navigate, Outlet } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';

export function ProtectedProfessionalRoute() {
  const { currentUser, loading } = useClinic();

  if (loading) return null;

  if (!currentUser) return <Navigate to="/" replace />;

  if (currentUser.role !== 'professional') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
