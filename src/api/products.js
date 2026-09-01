import client from './client';

export const listarProdutos = (page = 1, limit = 12, { busca, categoria_id } = {}) =>
    client.get('/produtos', { params: { page, limit, busca, categoria_id } }).then(r => r.data);

export const buscarProduto = (id) => client.get(`/produtos/${id}`).then(r => r.data);
export const criarProduto = (dados) => client.post('/produtos', dados).then(r => r.data);
export const atualizarProduto = (id, dados) => client.patch(`/produtos/${id}`, dados).then(r => r.data);
export const excluirProduto = (id) => client.delete(`/produtos/${id}`).then(r => r.data);