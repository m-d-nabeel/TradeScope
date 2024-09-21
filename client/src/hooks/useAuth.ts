import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';
import { AuthService } from '../services/auth/auth.service';

export const useAuth = () => {
    const { isAuthenticated, user, setAuth, logout, login } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthed = await AuthService.checkAuthStatus();
            if (!isAuthed) {
                logout();
            }
        };
        checkAuth();
    }, [logout]);

    return { isAuthenticated, user, setAuth, logout, login };
};