import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { usuario } = useAuth();
    if (!usuario) {
        return <Navigate to="/login" />;
    };
    return usuario.papel === 'admin' ? children : <Navigate to="/" />;
}