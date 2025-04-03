import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/loginSlice";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AddressForm = () => {
     const [newAddress, setNewAddress] = useState("");
     const user = useSelector((state) => state.auth.user);
     const dispatch = useDispatch();
     const navigate = useNavigate()

     const formik = useFormik({
          enableReinitialize: true,
          initialValues: {
               addresses: user?.addresses || [""],
          },
          onSubmit: (values) => {
               if (newAddress.trim()) {
                    const updatedAddresses = [...values.addresses, newAddress.trim()];
                    dispatch(updateUserProfile({ ...user, addresses: updatedAddresses }));
                    formik.setFieldValue("addresses", updatedAddresses);
                    setNewAddress("");
                    navigate("/orderPlace")
               }
          },
     });

     return (<>
          <form onSubmit={formik.handleSubmit} className=" flex flex-row gap-3">
               <div className="flex gap-2 pt-20 w-96 m-auto">
                    <input
                         type="text"
                         placeholder="Add new address"
                         value={newAddress}
                         onChange={(e) => setNewAddress(e.target.value)}
                         className="w-full p-2 border rounded-md"
                    />

                    <button type="submit" className="  text-blue-900 rounded-md">
                         <IoAddOutline className="h-6 w-6 cursor-pointer hover:scale-125" />
                    </button>
               </div>

          </form>
          <Link to="/orderPlace" className='text-center text-orange-600 hover:underline'>Back</Link>
     </>

     );
};

export default AddressForm;
