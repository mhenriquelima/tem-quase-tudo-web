import client from './client';

export const listarCategorias = () => client.get('/categorias').then(r => r.data);
export const criarCategoria = (nome) => client.post('/categorias', { nome }).then(r => r.data);
export const excluirCategoria = (id) => client.delete(`/categorias/${id}`).then(r => r.data);