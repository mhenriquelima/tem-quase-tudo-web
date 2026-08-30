import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Produtos from './pages/Produtos';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import Carrinho from './pages/Carrinho';
import Pedidos from './pages/Pedidos';
import PedidoDetalhe from './pages/PedidoDetalhe';
import ProdutosAdmin from './pages/admin/ProdutosAdmin';
import ComoFiz from './pages/ComoFiz';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrinho" element={<PrivateRoute><Carrinho /></PrivateRoute>} />
          <Route path="/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
          <Route path="/pedidos/:id" element={<PrivateRoute><PedidoDetalhe /></PrivateRoute>} />
          <Route path="/admin/produtos" element={<AdminRoute><ProdutosAdmin /></AdminRoute>} />
          <Route path="/como-fiz" element={<ComoFiz />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}