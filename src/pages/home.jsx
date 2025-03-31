import React, { useEffect, useState } from 'react';
import { Categories, GetProducts } from '../api/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import ResponsivePaginationComponent from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 8;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filter,currentPage]);
  const fetchCategories = async () => {
    try {
      const response = await Categories();
      setCategory(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await GetProducts(filter, currentPage, limit);
  
      setProducts(response.data);
      setTotalPages(response.totalPages);
  
      // Use response.data for reduce instead of response directly
      const initialQuantities = response.data.reduce((acc, product) => {
        acc[product.id] = 0;
        return acc;
      }, {});
  
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  

  const handleCounter = (type, id) => {
    setQuantities((prev) => {
      const updatedQty = { ...prev };
      if (type === 'add') {
        updatedQty[id] = Math.min(updatedQty[id] + 1, 4);
      } else if (type === 'subtract') {
        updatedQty[id] = Math.max(updatedQty[id] - 1, 0);
      }
      return updatedQty;
    });
  };

  const handleAddCart = (product) => {
    console.log('Added to cart:', product.id, 'Quantity:', quantities[product.id] || 1);
    dispatch(addToCart({ ...product, qty: quantities[product.id] || 1 }));
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };
console.log("total",currentPage);


  return (
    <div className='flex flex-col pt-26'>
      <h1 className='text-center text-2xl font-bold text-orange-600 cursor-pointer'>Products</h1>
      <div className='flex flex-row justify-end gap-2 mr-10'>
        <label htmlFor="category" className='font-bold'>Category</label>
        <select
          id="category"
          name="category"
          className='border-2 border-orange-500 rounded'
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          {(Array.isArray(category) ? category : []).map((item, index) => (
            <option key={index} value={item.toLowerCase()}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-10'>
        {products.map((product) => (
          <div key={product.id} className='border p-4 rounded-lg shadow-md'>
            <img
              src={`/images/${product.image}`}
              alt={product.name}
              className='w-full h-48 object-cover rounded-lg'
            />
            <h2 className='text-lg font-bold mt-2'>{product.name}</h2>
            <p className='text-gray-600'>{product.category}</p>
            <p className='text-green-600 font-bold'>Rs.{product.price.toFixed(2)}</p>
            <p className='text-gray-500 mt-1'>{product.description}</p>
            <article className='flex flex-row justify-between'>
              <div>
                <button
                  className='p-2 bg-red-600 cursor-pointer rounded-md hover:bg-red-800'
                  onClick={() => handleCounter('subtract', product.id)}
                >
                  -
                </button>
                <span className='p-2 cursor-pointer rounded-md hover:bg-gray-300'>{quantities[product.id]}</span>
                <button
                  className='p-2 bg-blue-600 cursor-pointer rounded-md hover:bg-blue-800'
                  onClick={() => handleCounter('add', product.id)}
                >
                  +
                </button>
              </div>
              <button
                className='p-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-800'
                onClick={() => handleAddCart(product)}
              >
                Add Cart
              </button>
            </article>
          </div>
        ))}
      </div>
      <ResponsivePaginationComponent
      current={currentPage}
      total={totalPages}
        onPageChange={setCurrentPage}
    />
    </div>
  );
}
