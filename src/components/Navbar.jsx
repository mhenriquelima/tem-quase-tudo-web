import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { usuario, sair } = useAuth();

    return (
        <nav className="bg-brand text-white px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Tem Quase Tudo</Link>

        <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">Produtos</Link>
            <Link to="/como-fiz" className="hover:underline">Como fiz</Link>

            {usuario && (
            <>
                <Link to="/carrinho" className="hover:underline">Carrinho</Link>
                <Link to="/pedidos" className="hover:underline">Meus pedidos</Link>
            </>
            )}

            {usuario?.papel === 'admin' && (
            <Link to="/admin/produtos" className="hover:underline">Admin</Link>
            )}

            {usuario ? (
            <>
                <span className="opacity-90">Olá, {usuario.nome}</span>
                <button onClick={sair} className="bg-brand-dark px-3 py-1 rounded hover:bg-orange-800">Sair</button>
            </>
            ) : (
            <>
                <Link to="/login" className="hover:underline">Entrar</Link>
                <Link to="/registro" className="bg-white text-brand px-3 py-1 rounded font-medium">Cadastrar</Link>
            </>
            )}
        </div>
        </nav>
    );
}