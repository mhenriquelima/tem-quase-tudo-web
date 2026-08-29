import client from './client';

export const checkout = () => client.post('/pedido/checkout').then(r => r.data);
export const meusPedidos = () => client.get('/pedido').then(r => r.data);
export const detalhePedido = (id) => client.get(`/pedido/${id}`).then(r => r.data);
export const cancelarPedido = (id) => client.put(`/pedido/${id}/cancelar`).then(r => r.data);