import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AllOrderRetrieval, DeleteOrderAboveId, UpdateOrderStatus } from '../api/api';

export default function OrderStatus() {
     const mode = useSelector(state => state.mode.mode);
     const [orders, setOrders] = useState([]);

     const fetchData = async () => {
          try {
               const data = await AllOrderRetrieval();
               setOrders(data);
          } catch (error) {
               console.error(error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     const handleDelete = async (id) => {
          try {
               await DeleteOrderAboveId(id);
               setOrders(orders.filter((order) => order.id !== id));
          } catch (error) {
               console.error("Error deleting order:", error);
          }
     };

     return (
          <div className={`flex flex-col min-h-lvh pt-26 px-4 ${mode === "dark" ? "bg-black text-white" : "bg-gray-100"}`}>
               <h1 className="text-center text-2xl font-bold text-orange-600 mb-4">Order Status</h1>
               <Link to="/" className="text-center text-orange-600 hover:underline mb-6">Back</Link>

               {orders.length > 0 ? (
                    orders.map((order) => (
                         <div
                              key={order.id}
                              className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 mb-6 rounded-xl shadow-md ${mode === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-300"}`}
                         >
                              <div>
                                   <h2 className="text-lg font-semibold mb-2 text-orange-500">Order Details</h2>
                                   <div className='border-1 p-2 rounded'>
                                        <p><strong >Order ID:</strong> {order.id}</p>
                                        <div className="flex items-center gap-2">
                                             <strong>Status:</strong>
                                             <select
                                                  value={order.status}
                                                  onChange={async (e) => {
                                                       const newStatus = e.target.value;
                                                       try {
                                                            await UpdateOrderStatus(order.id, newStatus);

                                                            fetchData();
                                                       } catch (err) {
                                                            console.error("Failed to update status:", err);
                                                       }
                                                  }}
                                                  className="border px-2 py-1 rounded"
                                             >
                                                  <option value="pending">Pending</option>
                                                  <option value="running">Running</option>
                                                  <option value="completed">Delivered</option>
                                                  <option value="declined">Declined</option>
                                             </select>
                                        </div>
                                        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                                        <p><strong>Payment Method:</strong> {order.paymentType}</p>
                                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                                   </div>
                              </div>

                              <div>
                                   <h2 className="text-lg font-semibold mb-2 text-orange-500">Product Info</h2>
                                   {order.cart.map((cartItem) => (
                                        <div key={cartItem.id} className="mb-4 border rounded p-2 bg-gray-50 dark:bg-gray-800">
                                             <p><strong>Name:</strong> {cartItem.name}</p>
                                             <p><strong>Price:</strong> ₹{cartItem.price}</p>
                                             <p><strong>Quantity:</strong> {cartItem.quantity}</p>
                                             <p><strong>Category:</strong> {cartItem.category}</p>
                                             <img
                                                  src={`/images/${cartItem.image}`}
                                                  alt={cartItem.name}
                                                  className="w-32 h-32 object-cover mt-2 rounded"
                                             />
                                        </div>
                                   ))}
                              </div>

                              <div className="md:col-span-2">
                                   <h2 className="text-lg font-semibold mb-2 text-orange-500">User Info</h2>
                                   <p><strong>Name:</strong> {order.user.fullName}</p>
                                   <p><strong>Email:</strong> {order.user.email}</p>
                                   <p><strong>Phone:</strong> {order.user.phone}</p>
                                   <p><strong>Address:</strong> {order.selectedAddress}</p>

                                   <div className="mt-4">
                                        {order.status === "pending" ? (
                                             <button
                                                  className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
                                                  onClick={() => handleDelete(order.id)}
                                             >
                                                  Cancel Order
                                             </button>
                                        ) : (
                                             <span
                                                  className={`px-4 py-2 rounded text-white font-semibold ${order.status === "running" ? "bg-blue-600" :
                                                            order.status === "completed" ? "bg-green-600" :
                                                                 order.status === "declined" ? "bg-gray-500" :
                                                                      "bg-yellow-500"
                                                       }`}
                                             >
                                                  {order.status === "running" && "Order Running"}
                                                  {order.status === "completed" && "Order Completed"}
                                                  {order.status === "declined" && "Order Cancelled"}
                                             </span>
                                        )}
                                   </div>

                              </div>
                         </div>
                    ))
               ) : (
                    <p className="text-center text-gray-500">No orders found.</p>
               )}
          </div>
     );
}
