import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProdutos } from '../api/products';
import { listarCategorias } from '../api/categorias';
import { adicionarItem } from '../api/carrinho';
import { useAuth } from '../context/AuthContext';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [textoBusca, setTextoBusca] = useState('');
  const [busca, setBusca] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const { usuario } = useAuth();

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setBusca(textoBusca.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [textoBusca]);

  function carregar() {
    setCarregando(true);
    setErro('');
    listarProdutos(page, 12, { busca: busca || undefined, categoria_id: categoriaId || undefined })
      .then((data) => {
        setProdutos(data.itens ?? data.dados ?? data);
        setTotalPaginas(data.totalPaginas ?? 1);
      })
      .catch((err) => {
        setErro(err.response?.data?.erro || 'Não foi possível carregar os produtos');
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, [page, busca, categoriaId]);

  function handleCategoria(valor) {
    setPage(1);
    setCategoriaId(valor);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Produtos</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={textoBusca}
          onChange={(e) => setTextoBusca(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          value={categoriaId}
          onChange={(e) => handleCategoria(e.target.value)}
          className="border rounded p-2 sm:w-56"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>

      {carregando && <p className="text-center mt-16 text-gray-500">Carregando produtos...</p>}

      {!carregando && erro && (
        <div className="text-center mt-16">
          <p className="text-red-600 mb-3">{erro}</p>
          <button onClick={carregar} className="border rounded px-4 py-1.5 hover:bg-gray-50">Tentar novamente</button>
        </div>
      )}

      {!carregando && !erro && (
        <>
          {produtos.length === 0 && <p className="text-gray-500 mb-6">Nenhum produto encontrado.</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produtos.map((p) => (
              <div key={p.id} className="border border-brand-light rounded-lg p-4 flex flex-col">
                <Link to={`/produtos/${p.id}`} className="font-semibold hover:text-brand">{p.nome}</Link>
                <span className="text-brand-dark font-bold mt-1">R$ {Number(p.preco).toFixed(2)}</span>
                {usuario && (
                  <button
                    onClick={() => adicionarItem(p.id, 1)}
                    className="mt-3 bg-brand text-white rounded py-1.5 hover:bg-brand-dark"
                  >
                    Adicionar ao carrinho
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
            <span className="px-2">{page} / {totalPaginas}</span>
            <button disabled={page >= totalPaginas} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Próxima</button>
          </div>
        </>
      )}
    </div>
  );
}