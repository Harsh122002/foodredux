import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/loginSlice';
import { clearCart, selectTotalItems } from '../redux/cartSlice';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { toggleMode } from '../redux/lightDark';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const totalItems = useSelector(selectTotalItems);
  const cart = useSelector(s => s.cart);
  console.log(cart);
  console.log(totalItems);
  const mode = useSelector(state => state.mode.mode);
  console.log("mode: " + mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      dispatch(clearCart());
      navigate("/login");

      dispatch(logout());
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className={`flex fixed justify-between items-center p-4 lg:px-10 w-full text-white 
  ${mode === "dark" ? "bg-gray-500" : "bg-orange-500"}`}>
      <h1 className="text-2xl font-bold">Food App</h1>
      <div className="flex items-center gap-4">
        {isAuthenticated ? <Link to="/login" onClick={handleLogout} className="p-2 rounded-md">Logout</Link>
          : <Link to="/login" className="p-2 rounded-md">Login</Link>

        }
        <Link to="/cart" className="p-2 rounded-md relative">
          <FiShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1  -right-1 bg-red-600 p-1 rounded-lg text-xs text-white font-bold">{totalItems}</span>)}
        </Link>
        {mode === "light" ? < MdDarkMode className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => dispatch(toggleMode("dark"))} />
          : <CiLight className="w-5 h-5 cursor-pointer hover:scale-110" onClick={() => dispatch(toggleMode("light"))} />
        }


        <FaBars size={28} className="cursor-pointer" onClick={toggleDrawer} />
      </div>
      {isOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-orange-500 shadow-lg p-4">
          <button onClick={toggleDrawer} className="bg-red-800 p-2 rounded-xl hover:scale-110">
            <IoMdClose className="h-5 w-5 text-white" />
          </button>
          <ul className="mt-4 space-y-4">
            <li><Link to="/" className="text-black hover:text-white hover:scale-110"
              onClick={() => handleClose()}>Home</Link></li>
            <li><Link to="/cart" className="text-black hover:text-white hover:scale-110"
              onClick={() => handleClose()}>Cart</Link></li>
            <li><Link to="/profile" className="text-black hover:text-white hover:scale-110"
              onClick={() => handleClose()}>Profile</Link></li>
            <li><Link to="/orderStatus" className="text-black hover:text-white hover:scale-110"
              onClick={() => handleClose()}>Order-Status</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
