import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

export default function LogoutPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await logout();
            navigate('/login');
        })();
    }, [logout, navigate]);

    useEffect(() => {
        toast.success('You have been logged out successfully.');
    },[])

    return <div className="min-h-screen overflow-auto flex items-center justify-center">Signing out...</div>;
}
