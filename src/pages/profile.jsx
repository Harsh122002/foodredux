import React from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { updateUserProfile } from "../redux/loginSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const mode = useSelector(state => state.mode.mode);
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      password: user?.password || "",
      phone: user?.phone || "",
      addresses: user?.addresses || [""],
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
      addresses: Yup.array().of(Yup.string().required("Address is required")),
    }),
    onSubmit: (values) => {
      dispatch(updateUserProfile({ ...user, ...values }));
      navigate("/");
    },
  });

  return (
    <div className={`flex flex-col h-lvh pt-26 ${mode === "dark" && "bg-black"}`}>
      <h1 className='text-center text-2xl font-bold text-orange-600 cursor-pointer'>Profile</h1>
      <form onSubmit={formik.handleSubmit} className={`space-y-4 w-[80%] lg:w-[30%] rounded-md p-6 text-white m-auto ${mode === "dark" ? "bg-gray-500" : "bg-orange-600/80"}`}>
        <div>
          <label className="block font-medium">Full Name:</label>
          <input type="text" name="fullName" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-2 border rounded-md" />
          {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-sm">{formik.errors.fullName}</p>}
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-2 border rounded-md" />
          {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
        </div>
        <div>
          <label className="block font-medium">Phone:</label>
          <input type="phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-2 border rounded-md" />
          {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-sm">{formik.errors.phone}</p>}
        </div>


        <div>
          <label className="block font-medium">Password:</label>
          <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-2 border rounded-md" />
          {formik.touched.password && formik.errors.password && <p className="text-red-500 text-sm">{formik.errors.password}</p>}
        </div>

        <FormikProvider value={formik}>
          <FieldArray name="addresses">
            {({ push, remove }) => (
              <div>
                <label className="block font-medium">Addresses:</label>
                {formik.values.addresses.map((address, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      name={`addresses.${index}`}
                      value={formik.values.addresses[index]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 border rounded-md"
                    />
                    <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white p-2 rounded">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => push("")} className="mt-2 bg-green-500 text-white p-2 rounded">Add Address</button>
              </div>
            )}
          </FieldArray>
        </FormikProvider>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Update Profile</button>
      </form>
    </div>
  );
}
