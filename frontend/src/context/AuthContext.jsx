import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [onlineUsers, setOnlineUsers] = useState(new Set());

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('bridge_token');
                const userData = localStorage.getItem('bridge_user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error restoring auth session:', error);
                localStorage.removeItem('bridge_token');
                localStorage.removeItem('bridge_user');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Manage SignalR connection
    useEffect(() => {
        let isMounted = true;
        if (user) {
            import('../services/signalr').then(async (signalRService) => {
                if (!isMounted) return;
                try {
                    await signalRService.initializeSignalR();

                    signalRService.onUserStatusChanged((userId, isOnline) => {
                        setOnlineUsers(prev => {
                            const newSet = new Set(prev);
                            if (isOnline) newSet.add(userId);
                            else newSet.delete(userId);
                            return newSet;
                        });
                    });

                } catch (err) {
                    console.error("SignalR failed", err);
                }
            });
        }

        return () => {
            isMounted = false;
            // connection cleanup if needed, but usually persistent across nav is fine
        };
    }, [user]);

    const login = (token, userData) => {
        localStorage.setItem('bridge_token', token);
        localStorage.setItem('bridge_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('bridge_token');
        localStorage.removeItem('bridge_user');
        setUser(null);
        import('../services/signalr').then(s => s.disconnectSignalR());
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, onlineUsers }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
