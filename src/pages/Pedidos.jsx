import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { meusPedidos } from '../api/pedidos';

const STATUS_COR = {
    pendente: 'bg-yellow-100 text-yellow-700',
    pago: 'bg-green-100 text-green-700',
    enviado: 'bg-blue-100 text-blue-700',
    cancelado: 'bg-red-100 text-red-700',
};

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    function carregar() {
        setCarregando(true);
        setErro('');
        meusPedidos()
            .then(setPedidos)
            .catch((err) => setErro(err.response?.data?.erro || 'Não foi possível carregar os pedidos'))
            .finally(() => setCarregando(false));
    }

    useEffect(() => { carregar(); }, []);

    if (carregando) return <p className="text-center mt-16 text-gray-500">Carregando pedidos...</p>;

    if (erro) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600 mb-3">{erro}</p>
                <button onClick={carregar} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
            </div>
        );
    }

    if (pedidos.length === 0) {
        return <p className="text-center mt-16 text-gray-500">Você ainda não fez nenhum pedido.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Meus pedidos</h1>
        <div className="flex flex-col gap-3">
            {pedidos.map((p) => (
            <Link key={p.id} to={`/pedidos/${p.id}`}
                className="flex justify-between items-center border border-brand-light rounded-lg p-4 hover:border-brand">
                <div>
                <p className="font-semibold">Pedido #{p.id}</p>
                <p className="text-sm text-gray-500">{new Date(p.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COR[p.status]}`}>{p.status}</span>
                <p className="font-bold">R$ {Number(p.total).toFixed(2)}</p>
            </Link>
            ))}
        </div>
        </div>
    );
}