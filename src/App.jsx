import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Header from './component/header';
import Login from './pages/login';
import RegisterForm from './pages/register';
import Cart from './pages/cart';
import { useSelector } from 'react-redux';
import Profile from './pages/profile';
import OrderPlace from './pages/orderPlace';
import AddressForm from './component/addresses';
import OrderStatus from './pages/orderStatus';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div className='flex justify-center items-center'><h1>Page not found</h1></div>} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm />} />
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/orderPlace" element={isAuthenticated ? <OrderPlace /> : <Navigate to="/login" />} />
        <Route path="/address" element={isAuthenticated ? <AddressForm /> : <Navigate to="/login" />} />
        <Route path="/orderStatus" element={isAuthenticated ? <OrderStatus /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;