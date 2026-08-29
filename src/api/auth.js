import client from './client';

export const login = (email, senha) => client.post('/users/login', { email, senha }).then(r => r.data);
export const registro = (nome, email, senha) => client.post('/users/registro', { nome, email, senha }).then(r => r.data);
export const me = () => client.get('/users/me').then(r => r.data);