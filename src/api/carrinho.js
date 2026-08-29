import client from './client';

export const verCarrinho = () => client.get('/carrinho').then(r => r.data);
export const adicionarItem = (produto_id, quantidade = 1) =>
    client.post('/carrinho/itens', { produto_id, quantidade }).then(r => r.data);
export const atualizarItem = (produtoId, quantidade) =>
    client.put(`/carrinho/itens/${produtoId}`, { quantidade }).then(r => r.data);
export const removerItem = (produtoId) => client.delete(`/carrinho/itens/${produtoId}`).then(r => r.data);