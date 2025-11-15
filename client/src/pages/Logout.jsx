import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LogoutPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await logout();
            navigate('/login');
        })();
    }, [logout, navigate]);

    return <div className="min-h-screen flex items-center justify-center">Signing out...</div>;
}
