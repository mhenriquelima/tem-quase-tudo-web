import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verCarrinho, atualizarItem, removerItem } from '../api/carrinho';
import { checkout } from '../api/pedidos';

export default function Carrinho() {
    const [itens, setItens] = useState([]);
    const [total, setTotal] = useState(0);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState('');
    const navigate = useNavigate();

    function carregar() {
        setCarregando(true);
        setErroCarregamento('');
        verCarrinho()
            .then((data) => {
                setItens(data.itens);
                setTotal(data.total);
            })
            .catch((err) => {
                setErroCarregamento(err.response?.data?.erro || 'Não foi possível carregar o carrinho');
            })
            .finally(() => setCarregando(false));
    }

    useEffect(() => { carregar(); }, []);

    if (carregando) return <p className="text-center mt-16 text-gray-500">Carregando carrinho...</p>;

    if (erroCarregamento) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600 mb-3">{erroCarregamento}</p>
                <button onClick={carregar} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
            </div>
        );
    }

    async function handleQuantidade(produtoId, quantidade) {
        if (quantidade < 1) return;
        await atualizarItem(produtoId, quantidade);
        carregar();
    }

    async function handleRemover(produtoId) {
        await removerItem(produtoId);
        carregar();
    }

    async function handleCheckout() {
        setErro('');
        try {
            const pedido = await checkout();
            navigate(`/pedidos/${pedido.id}`);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Não foi possível finalizar o pedido');
        }
    }

    if (itens.length === 0) {
        return <p className="text-center mt-16 text-gray-500">Seu carrinho está vazio.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Carrinho</h1>
        {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}
        <div className="flex flex-col gap-3">
            {itens.map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-brand-light rounded-lg p-3">
                <div>
                <p className="font-semibold">{item.nome}</p>
                <p className="text-sm text-gray-500">R$ {Number(item.preco).toFixed(2)} un.</p>
                </div>
                <div className="flex items-center gap-2">
                <button onClick={() => handleQuantidade(item.produto_id, item.quantidade - 1)}
                    className="w-7 h-7 border rounded">-</button>
                <span>{item.quantidade}</span>
                <button onClick={() => handleQuantidade(item.produto_id, item.quantidade + 1)}
                    className="w-7 h-7 border rounded">+</button>
                </div>
                <p className="font-bold w-20 text-right">R$ {Number(item.subtotal).toFixed(2)}</p>
                <button onClick={() => handleRemover(item.produto_id)} className="text-red-600 text-sm ml-2">Remover</button>
            </div>
            ))}
        </div>
        <div className="flex justify-between items-center mt-6 border-t border-brand-light pt-4">
            <span className="text-lg font-bold">Total: R$ {Number(total).toFixed(2)}</span>
            <button onClick={handleCheckout} className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark">
            Finalizar pedido
            </button>
        </div>
        </div>
    );
}