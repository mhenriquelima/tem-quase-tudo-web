import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem('usuario');
        if (!salvo || salvo === 'undefined') return null;
        try {
            return JSON.parse(salvo);
        } catch {
            return null;
        }
    });

    async function entrar(email, senha) {
        const { token, user } = await authApi.login(email, senha);
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(user));
        setUsuario(user);
    }

    function sair() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, entrar, sair }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);