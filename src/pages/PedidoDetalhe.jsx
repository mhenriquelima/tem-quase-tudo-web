import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { detalhePedido, cancelarPedido } from '../api/pedidos';

export default function PedidoDetalhe() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState('');

    function carregar() {
        setCarregando(true);
        setErroCarregamento('');
        detalhePedido(id)
            .then(setPedido)
            .catch((err) => setErroCarregamento(err.response?.data?.erro || 'Não foi possível carregar o pedido'))
            .finally(() => setCarregando(false));
    }

    useEffect(() => { carregar(); }, [id]);

    if (carregando) return <p className="text-center mt-16 text-gray-500">Carregando pedido...</p>;

    if (erroCarregamento) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600 mb-3">{erroCarregamento}</p>
                <button onClick={carregar} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
            </div>
        );
    }

    async function handleCancelar() {
        setErro('');
        try {
        await cancelarPedido(id);
        carregar();
        } catch (err) {
        setErro(err.response?.data?.erro || 'Não foi possível cancelar');
        }
    }

    if (!pedido) return null;

    const podeCancelar = !['enviado', 'cancelado'].includes(pedido.status);

    return (
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-brand-dark mb-1">Pedido #{pedido.id}</h1>
        <p className="text-sm text-gray-500 mb-6">Status: <span className="font-semibold">{pedido.status}</span></p>
        {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}

        <div className="flex flex-col gap-2">
            {pedido.itens.map((item) => (
            <div key={item.produto_id} className="flex justify-between border-b border-brand-light py-2">
                <span>{item.nome} x{item.quantidade}</span>
                <span className="font-semibold">R$ {Number(item.subtotal).toFixed(2)}</span>
            </div>
            ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4">
            <span className="text-lg font-bold">Total: R$ {Number(pedido.total).toFixed(2)}</span>
            {podeCancelar && (
            <button onClick={handleCancelar} className="text-red-600 border border-red-600 px-4 py-1.5 rounded hover:bg-red-50">
                Cancelar pedido
            </button>
            )}
        </div>
        </div>
    );
}