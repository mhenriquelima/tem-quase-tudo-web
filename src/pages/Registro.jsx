import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registro } from '../api/auth';

export default function Registro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
        await registro(nome, email, senha);
        navigate('/login');
        } catch (err) {
        const msg = err.response?.data?.erros?.[0]?.msg || 'Não foi possível criar a conta';
        setErro(msg);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 border border-brand-light rounded-lg">
        <h1 className="text-xl font-bold text-brand-dark mb-4">Criar conta</h1>
        {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded p-2 mb-3" required />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2 mb-3" required />
        <input type="password" placeholder="Senha (mín. 6 caracteres)" value={senha} onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded p-2 mb-3" minLength={6} required />
        <button type="submit" className="w-full bg-brand text-white rounded py-2 hover:bg-brand-dark">Cadastrar</button>
        <p className="text-sm mt-3 text-center">Já tem conta? <Link to="/login" className="text-brand">Entrar</Link></p>
        </form>
    );
}