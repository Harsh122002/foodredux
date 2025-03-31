import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/loginSlice';
import { selectTotalItems } from '../redux/cartSlice';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const totalItems = useSelector(selectTotalItems);
  const cart = useSelector(s => s.cart);
  console.log(cart);
  console.log(totalItems);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      navigate("/login");

      dispatch(logout());
    }
  };

  return (
    <header className="flex fixed justify-between items-center p-4 lg:px-10 w-full bg-orange-500 text-white">
      <h1 className="text-2xl font-bold">Food App</h1>
      <div className="flex items-center gap-4">
        {isAuthenticated ? <Link to="/login" onClick={handleLogout} className="p-2 rounded-md">Logout</Link>
          : <Link to="/login" className="p-2 rounded-md">Login</Link>

        }
        <Link to="#" className="p-2 rounded-md relative">
          <FiShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1  -right-1 bg-red-600 p-1 rounded-lg text-xs text-white font-bold">{totalItems}</span>)}
        </Link>
        <FaBars size={28} className="cursor-pointer" onClick={toggleDrawer} />
      </div>
      {isOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-orange-500 shadow-lg p-4">
          <button onClick={toggleDrawer} className="bg-red-800 p-2 rounded-xl hover:scale-110">
            <IoMdClose className="h-5 w-5 text-white" />
          </button>
          <ul className="mt-4 space-y-4">
            <li><Link to="/" className="text-black">Home</Link></li>
            <li><Link to="/about" className="text-black">About</Link></li>
            <li><Link to="/contact" className="text-black">Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
