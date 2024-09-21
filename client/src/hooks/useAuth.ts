import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';
import { AuthService } from '../services/auth/auth.service';

export const useAuth = () => {
    const { isAuthenticated, user, setAuth, logout: storeLogout, login } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthed = await AuthService.checkAuthStatus();
            if (!isAuthed) {
                storeLogout();
            }
        };
        checkAuth();
    }, [storeLogout]);

    const logout = async () => {
        const success = await AuthService.logout();
        if (!success) {
            console.log("Logout failed");
        } else {
            setAuth(false, null);
            window.location.reload();
            console.log("Logout successful");
        }
    };

    return { isAuthenticated, user, setAuth, logout, login };
};