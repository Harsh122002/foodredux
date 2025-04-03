import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser } from '../redux/loginSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const mode = useSelector(state => state.mode.mode);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await dispatch(loginUser(values));

        if (res.meta?.requestStatus === 'fulfilled') {
          navigate('/');
        } else {
          console.error('Login failed:', res.error?.message);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    },

  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`w-full h-lvh flex justify-center items-center 
  ${mode === "dark" ? "bg-black" : "bg-green-400"}`}>
      <div className='w-[26rem] p-4 bg-orange-500/60 rounded-md shadow-lg flex flex-col gap-10'>
        <h1 className='text-3xl font-bold text-center text-white'>Login</h1>
        <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
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
            {formik.touched.email && formik.errors.email && (
              <p className='text-red-500 text-sm'>{formik.errors.email}</p>
            )}
          </div>

          <div className='relative'>
            <label className='block text-white font-medium mb-1' htmlFor='password'>Password</label>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              className='w-full p-2 border-2 border-orange-500 rounded-md'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <span onClick={togglePasswordVisibility} className='absolute right-3 top-10 cursor-pointer'>
              {showPassword ? <FaEye className='text-gray-600' /> : <FaEyeSlash className='text-gray-600' />}
            </span>
            {formik.touched.password && formik.errors.password && (
              <p className='text-red-500 text-sm'>{formik.errors.password}</p>
            )}
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <button type='submit' className='w-full p-2 mt-4 bg-orange-500 cursor-pointer text-white rounded-md hover:bg-orange-600'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-white'>Don't have an account? Please click <Link to='/register' className='text-blue-800 hover:underline'>Register</Link></p>
      </div>
    </div>
  );
}