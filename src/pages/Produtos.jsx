import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarProdutos } from '../api/produtos';
import { adicionarItem } from '../api/carrinho';
import { useAuth } from '../context/AuthContext';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const { usuario } = useAuth();

  useEffect(() => {
    listarProdutos(page).then((data) => {
      setProdutos(data.produtos ?? data.dados ?? data);
      setTotalPaginas(data.totalPaginas ?? 1);
    });
  }, [page]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Produtos</h1>
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
    </div>
  );
}