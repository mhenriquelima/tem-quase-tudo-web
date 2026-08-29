import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarProduto } from '../api/products';
import { adicionarItem } from '../api/carrinho';
import { useAuth } from '../context/AuthContext';

export default function ProdutoDetalhe() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [mensagem, setMensagem] = useState('');
    const [erroCarregamento, setErroCarregamento] = useState('');
    const { usuario } = useAuth();
    const navigate = useNavigate();

    function carregar() {
        setProduto(null);
        setErroCarregamento('');
        buscarProduto(id)
            .then(setProduto)
            .catch((err) => {
                if (err.response?.status === 404) return setProduto(false);
                setErroCarregamento(err.response?.data?.erro || 'Não foi possível carregar o produto');
            });
    }

    useEffect(() => { carregar(); }, [id]);

    async function handleAdicionar() {
        if (!usuario) return navigate('/login');
        await adicionarItem(produto.id, quantidade);
        setMensagem('Adicionado ao carrinho!');
        setTimeout(() => setMensagem(''), 2000);
    }

    if (erroCarregamento) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600 mb-3">{erroCarregamento}</p>
                <button onClick={carregar} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
            </div>
        );
    }

    if (produto === null) return <p className="text-center mt-16 text-gray-500">Carregando produto...</p>;
    if (produto === false) return <p className="text-center mt-16 text-gray-500">Produto não encontrado.</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-brand-dark">{produto.nome}</h1>
            <p className="text-gray-600 mt-2">{produto.descricao}</p>
            <p className="text-2xl font-bold mt-4">R$ {Number(produto.preco).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">
                {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}
            </p>

            {mensagem && <p className="text-green-600 text-sm mt-3">{mensagem}</p>}

            <div className="flex items-center gap-3 mt-6">
                <input type="number" min="1" max={produto.estoque} value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-20 border rounded p-2" />
                <button onClick={handleAdicionar} disabled={produto.estoque === 0}
                    className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-40">
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    );
}