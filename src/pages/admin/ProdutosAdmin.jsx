import { useEffect, useState } from 'react';
import { listarProdutos, criarProduto, atualizarProduto, excluirProduto } from '../../api/products';
import { listarCategorias } from '../../api/categorias';

const VAZIO = { nome: '', descricao: '', preco: '', estoque: '', categoria_id: '' };

export default function ProdutosAdmin() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState(VAZIO);
    const [editandoId, setEditandoId] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState('');

    function carregarInicial() {
        setCarregando(true);
        setErroCarregamento('');
        Promise.all([listarProdutos(1, 100), listarCategorias()])
            .then(([produtosData, categoriasData]) => {
                setProdutos(produtosData.itens);
                setCategorias(categoriasData);
            })
            .catch((err) => {
                setErroCarregamento(err.response?.data?.erro || 'Não foi possível carregar os dados');
            })
            .finally(() => setCarregando(false));
    }

    function recarregarProdutos() {
        return listarProdutos(1, 100)
            .then((data) => setProdutos(data.itens))
            .catch((err) => {
                setErro(err.response?.data?.erro || 'Salvo, mas não foi possível atualizar a lista');
            });
    }

    useEffect(() => { carregarInicial(); }, []);

    if (carregando) return <p className="text-center mt-16 text-gray-500">Carregando...</p>;

    if (erroCarregamento) {
        return (
            <div className="text-center mt-16">
                <p className="text-red-600 mb-3">{erroCarregamento}</p>
                <button onClick={carregarInicial} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
            </div>
        );
    }

    function editar(produto) {
        setEditandoId(produto.id);
        setForm({
        nome: produto.nome,
        descricao: produto.descricao ?? '',
        preco: produto.preco,
        estoque: produto.estoque,
        categoria_id: produto.categoria_id ?? '',
        });
    }

    function cancelarEdicao() {
        setEditandoId(null);
        setForm(VAZIO);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        const dados = {
            ...form,
            preco: Number(form.preco),
            estoque: Number(form.estoque),
            categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        };
        try {
            if (editandoId) {
                await atualizarProduto(editandoId, dados);
        } else {
            await criarProduto(dados);
        }
        cancelarEdicao();
        await recarregarProdutos();
        } catch (err) {
            const msg = err.response?.data?.erros?.[0]?.msg || err.response?.data?.erro || 'Erro ao salvar produto';
            setErro(msg);
        }
    }

    async function handleExcluir(id) {
        if (!confirm('Excluir este produto?')) return;
        setErro('');
        try {
            await excluirProduto(id);
            await recarregarProdutos();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Não foi possível excluir o produto');
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Administrar produtos</h1>

        <form onSubmit={handleSubmit} className="border border-brand-light rounded-lg p-4 mb-8 grid grid-cols-2 gap-3">
            {erro && <p className="text-red-600 text-sm col-span-2">{erro}</p>}
            <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="border rounded p-2" required />
            <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
            className="border rounded p-2">
            <option value="">Sem categoria</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Preço" value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })} className="border rounded p-2" required />
            <input type="number" placeholder="Estoque" value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: e.target.value })} className="border rounded p-2" required />
            <textarea placeholder="Descrição" value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="border rounded p-2 col-span-2" />
            <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">
                {editandoId ? 'Salvar alterações' : 'Criar produto'}
            </button>
            {editandoId && (
                <button type="button" onClick={cancelarEdicao} className="border px-4 py-2 rounded">Cancelar</button>
            )}
            </div>
        </form>

        <div className="flex flex-col gap-2">
            {produtos.map((p) => (
            <div key={p.id} className="flex justify-between items-center border border-brand-light rounded p-3">
                <div>
                <p className="font-semibold">{p.nome}</p>
                <p className="text-sm text-gray-500">R$ {Number(p.preco).toFixed(2)} · estoque: {p.estoque}</p>
                </div>
                <div className="flex gap-2">
                <button onClick={() => editar(p)} className="text-brand text-sm">Editar</button>
                <button onClick={() => handleExcluir(p.id)} className="text-red-600 text-sm">Excluir</button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}