import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, TotalAmount, updateQty } from '../redux/cartSlice';
import { Link } from 'react-router-dom';

export default function Cart() {
     const cart = useSelector((state) => state.cart.cart);
     const dispatch = useDispatch();
     const totalAmount = useSelector(TotalAmount)
     const handleCounter = (type, id) => {
          dispatch(updateQty({ id, type }));
     };
     const mode = useSelector(state => state.mode.mode);


     return (
          <div className={`flex flex-col min-h-lvh pt-26  ${mode === "dark" && "bg-black"}`}>
               <h1 className='text-center text-2xl font-bold text-orange-600 cursor-pointer'>Cart</h1>
               <Link to="/" className='text-center text-orange-600 hover:underline'>Back</Link>
               {cart.length > 0 && (
                    <p className='text-xl font-bold text-end mr-10 text-orange-600'>TotalAmount:Rs.{Math.ceil(totalAmount)}</p>)}
               <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-10'>
                    {cart.length === 0 ? (
                         <p className='text-center col-span-full'>Your cart is empty.</p>
                    ) : (
                         cart.map((product) => (
                              <div key={product.id} className={`border p-4 rounded-lg  shadow-md ${mode === "dark" && "bg-gray-300"}`}>
                                   <img
                                        src={`/images/${product.image}`}
                                        alt={product.name}
                                        className='w-full h-48 object-cover rounded-lg'
                                   />
                                   <h2 className='text-lg font-bold mt-2'>{product.name}</h2>
                                   <p className='text-gray-600'>{product.category}</p>
                                   <p className='text-green-600 font-bold'>Rs. {Math.ceil(product.price.toFixed(2) * 10)}</p>
                                   <p className='text-gray-500 mt-1'>{product.description}</p>

                                   <article className='flex flex-row justify-between mt-4'>
                                        <div>
                                             <button
                                                  className='p-2 bg-red-600 text-white cursor-pointer rounded-md hover:bg-red-800'
                                                  onClick={() => handleCounter('subtract', product.id)}
                                             >
                                                  -
                                             </button>
                                             <span className='p-2'>{product.qty}</span>
                                             <button
                                                  className='p-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-800'
                                                  onClick={() => handleCounter('add', product.id)}
                                             >
                                                  +
                                             </button>
                                        </div>
                                        <button
                                             className="p-2 bg-red-600 text-white cursor-pointer rounded-md hover:bg-red-800"
                                             onClick={() => dispatch(removeFromCart(product.id))}
                                        >
                                             Remove
                                        </button>

                                   </article>
                              </div>
                         ))
                    )}
               </div>
          </div>
     );
}
