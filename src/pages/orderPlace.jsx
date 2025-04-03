import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { IoAddOutline } from "react-icons/io5";
import { clearCart, TotalAmount } from "../redux/cartSlice";
import { OrderPlaces } from "../api/api";

export default function OrderPlace() {
     const mode = useSelector((state) => state.mode.mode);
     const user = useSelector((state) => state.auth.user);
     const totalAmount = useSelector(TotalAmount);
     const cart = useSelector((state) => state.cart.cart);

     const navigate = useNavigate();
     const dispatch = useDispatch();

     const [selectedAddress, setSelectedAddress] = useState("");

     const formik = useFormik({
          enableReinitialize: true,
          initialValues: {
               fullName: user?.fullName || "",
               email: user?.email || "",
               phone: user?.phone || "",
               addresses: user?.addresses || [""],
               selectedAddress: "", // Holds the selected address
               paymentType: "Cash",
          },
          validationSchema: Yup.object({
               fullName: Yup.string().required("Full Name is required"),
               email: Yup.string().email("Invalid email address").required("Email is required"),
               phone: Yup.string()
                    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
                    .required("Phone number is required"),
               selectedAddress: Yup.string().required("You must select an address"),
          }),
          onSubmit: async (values) => {
               const orderDetails = {
                    user: {
                         fullName: values.fullName,
                         email: values.email,
                         phone: values.phone,
                         addresses: values.addresses,
                    },
                    selectedAddress: values.selectedAddress,
                    cart: cart.map((item) => ({
                         id: item.id,
                         name: item.name,
                         quantity: item.qty,
                         price: Math.ceil(item.price * 10),
                    })),
                    status: "pending",
                    totalAmount: Math.ceil(totalAmount),
                    paymentType: values.paymentType,
               };
               const data = await OrderPlaces(orderDetails)
               dispatch(clearCart());
               formik.resetForm();
               console.log("Final Order Details:", data);
               navigate("/");
          },
     });

     // Function to handle single selection
     const handleCheckboxChange = (address) => {
          setSelectedAddress(address);
          formik.setFieldValue("selectedAddress", address);
     };

     return (
          <div className={`flex flex-col min-h-lvh pt-26 pb-10 ${mode === "dark" && "bg-black"}`}>
               <h1 className="text-center text-2xl font-bold text-orange-600 cursor-pointer">Order Place</h1>
               <Link to="/cart" className='text-center text-orange-600 hover:underline'>Back</Link>

               <form
                    onSubmit={formik.handleSubmit}
                    className={`space-y-4 w-[80%] lg:w-[30%] rounded-md p-6 text-white m-auto ${mode === "dark" ? "bg-gray-500" : "bg-orange-600/80"}`}
               >
                    {/* Full Name (Disabled) */}
                    <div>
                         <label className="block font-medium">Full Name:</label>
                         <input
                              type="text"
                              name="fullName"
                              value={formik.values.fullName}
                              disabled
                              className="w-full p-2 border rounded-md bg-gray-300 cursor-not-allowed"
                         />
                    </div>

                    {/* Email (Disabled) */}
                    <div>
                         <label className="block font-medium">Email:</label>
                         <input
                              type="email"
                              name="email"
                              value={formik.values.email}
                              disabled
                              className="w-full p-2 border rounded-md bg-gray-300 cursor-not-allowed"
                         />
                    </div>

                    {/* Phone (Disabled) */}
                    <div>
                         <label className="block font-medium">Phone:</label>
                         <input
                              type="phone"
                              name="phone"
                              value={formik.values.phone}
                              disabled
                              className="w-full p-2 border rounded-md bg-gray-300 cursor-not-allowed"
                         />
                    </div>

                    {/* Address List */}
                    {formik.values.addresses.map((address, index) => (
                         <div key={index} className="flex flex-col space-y-2">
                              <h2>Address {index + 1}</h2>
                              <div className="flex gap-3 items-center">
                                   <input
                                        type="radio"
                                        name="selectedAddress"
                                        value={address}
                                        checked={selectedAddress === address}
                                        onChange={() => handleCheckboxChange(address)}
                                   />
                                   <input
                                        type="text"
                                        name={`addresses[${index}]`}
                                        value={address}
                                        onChange={formik.handleChange}
                                        className="w-full p-2 border rounded-md"
                                   />
                              </div>
                         </div>
                    ))}

                    {/* Address Selection Error Message */}
                    {formik.errors.selectedAddress && formik.touched.selectedAddress && (
                         <p className="text-red-500 text-sm">{formik.errors.selectedAddress}</p>
                    )}
                    
<Link to="/address" className='p-2 m-auto bg-blue-600 text-center w-36 text-white cursor-pointer rounded-md hover:bg-blue-800'>Add Another Address</Link>

                    {/* Product Table */}
                    {cart.length > 0 ? (
                         <table className="w-full border-collapse border border-gray-500 mt-4">
                              <thead>
                                   <tr className="bg-gray-500">
                                        <th className="border p-2">Sr.</th>
                                        <th className="border p-2">Product Name</th>
                                        <th className="border p-2">Quantity</th>
                                        <th className="border p-2">Price</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {cart.map((cartItem, index) => (
                                        <tr key={cartItem.id} className="text-center">
                                             <td className="border p-2">{index + 1}</td>
                                             <td className="border p-2">{cartItem.name}</td>
                                             <td className="border p-2">{cartItem.qty}</td>
                                             <td className="border p-2">Rs.{Math.ceil(cartItem.price * 10)}</td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    ) : (
                         <p className="text-center text-red-500 mt-4">Your cart is empty.</p>
                    )}

                    {/* Total Amount */}
                    <p className="text-xl font-bold text-end mr-10 text-white">
                         Total Amount: Rs.{Math.ceil(totalAmount)}
                    </p>

                    {/* Payment Type */}
                    <p className="text-lg font-semibold text-center mt-4">
                         Payment Type: <span className="text-orange-300">Cash</span>
                    </p>

                    {/* Submit Button */}
                    <button type="submit" className="bg-green-500 text-white p-2 rounded w-full mt-4">
                         Place Order
                    </button>
               </form>
          </div>
     );
}
