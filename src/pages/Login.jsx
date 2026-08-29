import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { entrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await entrar(email, senha);
      navigate('/');
    } catch {
      setErro('E-mail ou senha inválidos');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 border border-brand-light rounded-lg">
      <h1 className="text-xl font-bold text-brand-dark mb-4">Entrar</h1>
      {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2 mb-3" required />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}
        className="w-full border rounded p-2 mb-3" required />
      <button type="submit" className="w-full bg-brand text-white rounded py-2 hover:bg-brand-dark">Entrar</button>
      <p className="text-sm mt-3 text-center">Não tem conta? <Link to="/registro" className="text-brand">Cadastre-se</Link></p>
    </form>
  );
}