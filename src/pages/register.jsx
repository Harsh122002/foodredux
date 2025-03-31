import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import{Register} from '../api/api'
export default function RegisterForm() {
     const [showPassword, setShowPassword] = useState(false);

     const togglePasswordVisibility = () => {
          setShowPassword((prev) => !prev);
     }; const navigate = useNavigate();


     const formik = useFormik({
          initialValues: {
               fullName: '',
               email: '',
               password: '',
          },
          validationSchema: Yup.object({
               fullName: Yup.string().required('Full Name is required'),
               email: Yup.string().email('Invalid email address').required('Email is required'),
               password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
          }),
          onSubmit: async (values) => {
               try {
                    console.log('Form Submitted', values);
                    const response = await Register(values);
                    console.log('Registration successful:', response);
                    navigate('/login');
                    formik.resetForm();
               } catch (error) {
                    console.error('Registration failed:', error);
               }
          }

     });

     return (
          <div className='w-full h-lvh bg-green-400 flex justify-center items-center'>
               <div className='w-[26rem] p-4 bg-orange-500/60 rounded-md shadow-lg flex flex-col gap-10'>
                    <h1 className='text-3xl font-bold text-center text-white'>Register</h1>
                    <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
                         <div>
                              <label className='block text-white font-medium mb-1' htmlFor='fullName'>Full Name</label>
                              <input
                                   id='fullName'
                                   name='fullName'
                                   type='text'
                                   placeholder='Enter your full name'
                                   className='w-full p-2 border-2 border-orange-500 rounded-md'
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   value={formik.values.fullName}
                              />
                              {formik.touched.fullName && formik.errors.fullName ? (
                                   <p className='text-red-500 text-sm'>{formik.errors.fullName}</p>
                              ) : null}
                         </div>
                         <div>
                              <label className='block text-white font-medium mb-1' htmlFor='email'>Email</label>
                              <input
                                   id='email'
                                   name='email'
                                   type='text'
                                   placeholder='Enter your email'
                                   className='w-full p-2 border-2 border-orange-500 rounded-md'
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   value={formik.values.email}
                              />
                              {formik.touched.email && formik.errors.email ? (
                                   <p className='text-red-500 text-sm'>{formik.errors.email}</p>
                              ) : null}
                         </div>
                         <div className='relative'>
                              <label className='block text-white font-medium mb-1' htmlFor='password'>Password</label>
                              <input
                                   id='password'
                                   name='password'
                                   type={showPassword ? 'text' : 'password'}
                                   placeholder='Enter your password'
                                   className='w-full p-2 border-2 border-orange-500 rounded-md pr-10'
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   value={formik.values.password}
                              />
                              <span onClick={togglePasswordVisibility} className='absolute right-3 top-10 cursor-pointer'>
                                   {!showPassword ? <FaEyeSlash className='text-gray-600' /> : <FaEye className='text-gray-600' />}
                              </span>
                              {formik.touched.password && formik.errors.password ? (
                                   <p className='text-red-500 text-sm'>{formik.errors.password}</p>
                              ) : null}
                         </div>
                         <button type='submit' className='w-full p-2 mt-4 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600'>Register</button>
                    </form>
                    <p className='text-white'>Already have an account? Please click <Link to='/login' className='text-blue-800 hover:underline'>Login</Link></p>
               </div>
          </div>
     );
}
