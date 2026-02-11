
import { Navigate, Outlet } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';

export function ProtectedAdminRoute() {
    const { currentUser, loading } = useClinic();

    // Wait for context to load
    if (loading) return null;

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
