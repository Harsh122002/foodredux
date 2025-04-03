import React, { useEffect, useState } from 'react';
import { Categories, fetchProducts, GetProducts } from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import ResponsivePaginationComponent from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { addFavorite, removeFavorite, setUserId } from '../redux/favoritesSlice';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorite, setFavorite] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector(state => state.mode.mode);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  console.log(favoriteProducts);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
    if (user?.id) {
      dispatch(setUserId(user.id));
      setFavorite(getUserFavoriteProducts(user.id));
      fetchAndSetFavoriteProducts();

    }
  }, [filter, currentPage, user?.id]); 
  const fetchCategories = async () => {
    try {
      const response = await Categories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await GetProducts(filter, currentPage, 8);
      setProducts(response.data);
      setTotalPages(response.totalPages);

      const initialQuantities = response.data.reduce((acc, product) => {
        acc[product.id] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getUserFavoriteProducts = (userId) => {
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    return [...new Set(data.filter(f => f.user === userId).map(f => f.product))];
  };

  const handleCounter = (type, id) => {
    setQuantities((prev) => {
      const updatedQty = { ...prev };
      updatedQty[id] = type === 'add' ? Math.min((updatedQty[id] || 0) + 1, 4) : Math.max((updatedQty[id] || 0) - 1, 0);
      return updatedQty;
    });
  };

  const getFavoriteProducts = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("favorites")) || [];
      const favoriteProductIds = data.map(fav => fav.product);

      const allProducts = await fetchProducts();

      return allProducts.filter(product =>
        favoriteProductIds.includes(product.id.toString())
      );
    } catch (error) {
      console.error("Error fetching favorite products:", error);
      return [];
    }
  };

  const fetchAndSetFavoriteProducts = async () => {
    const favoriteProducts = await getFavoriteProducts();
    setFavoriteProducts(favoriteProducts);
  };




  const handleAddCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({ ...product, qty: quantity }));
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const handleFav = (productId) => {
    if (favorite.includes(productId)) {
      console.log(productId);

      dispatch(removeFavorite({ productId: productId }));
    } else {
      dispatch(addFavorite({ userId: user?.id, productId }));
    }
    setFavorite(getUserFavoriteProducts(user?.id));
    fetchAndSetFavoriteProducts();
  };

  return (
    <div className={`flex flex-col min-h-lvh pt-26 pb-10 ${mode === "dark" && "bg-black"}`}>
      <h1 className='text-center text-2xl font-bold text-orange-600 cursor-pointer'>Products</h1>
      <div className='w-[98%] m-auto overflow-x-auto'>
        <h1 className='text-orange-600 text-2xl font-bold'>Favorite Products</h1>
        <div className='flex flex-row  gap-5 mt-5 items-center'>
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map(product => (
              <div className={`flex flex-row gap-3 items-center min-w-64 mb-5 p-2  border-2 rounded-md ${mode === "dark" ? "bg-gray-400" : "bg-white"}`}>
                <img src={`/images/${product.image}`} alt=""
                  className='w-12 h-15 rounded-md  ' />
                <article> 
                  <h2>
                    {product.name}
                  </h2>
                  <p className='text-green-600 font-bold'>Rs.{Math.ceil(product.price.toFixed(2) * 10)}</p>
                  <div className='flex flex-row justify-between gap-5'>
                    <div>
                      <button
                        className='p-1 bg-red-600 cursor-pointer rounded-md hover:bg-red-800'
                        onClick={() => handleCounter('subtract', product.id)}
                      >
                        -
                      </button>
                      <span className='p-1 cursor-pointer rounded-md hover:bg-gray-300'>{quantities[product.id]}</span>
                      <button
                        className='p-1 bg-blue-600 cursor-pointer rounded-md hover:bg-blue-800'
                        onClick={() => handleCounter('add', product.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className='p-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-800'
                      onClick={() => handleAddCart(product)}
                      disabled={quantities[product.id] === 0}
                    >
                      Add Cart
                    </button>
                  </div>
                </article>
              </div>


            ))
          ) : (
            <p>No favorite products found.</p>
          )}
        </div>
      </div>
      <div className='flex flex-row justify-end gap-2 mr-10'>
        <label htmlFor="category" className='font-bold text-orange-500'>Category</label>
        <select
          id="category"
          className='border-2 border-orange-500 text-orange-500 rounded'
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((item, index) => (
            <option key={index} value={item.toLowerCase()}>{item}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 pt-10">
        {products.map((product) => (
          <div key={product.id} className={`border p-4 rounded-lg shadow-md ${mode === "dark" && "bg-gray-300"}`}>
            <img
              src={`/images/${product.image}`} // Ensure correct path
              alt={product.name}
              className='w-full h-48 object-cover rounded-lg'
            />
            <h2 className='text-lg font-bold mt-2'>{product.name}</h2>
            <p className='text-gray-600'>{product.category}</p>
            <p className='text-green-600 font-bold'>Rs.{Math.ceil(product.price.toFixed(2) * 10)}</p>
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
              <div className='flex flex-row gap-2 items-center'>
                <button onClick={() => handleFav(product.id)}>
                  {favorite.includes(product.id) ? (
                    <MdFavorite className="h-7 w-7 text-red-600 cursor-pointer" />
                  ) : (
                    <MdFavoriteBorder className="h-7 w-7 cursor-pointer" />
                  )}
                </button>

                <button
                  className='p-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-800'
                  onClick={() => handleAddCart(product)}
                  disabled={quantities[product.id] === 0}
                >
                  Add Cart
                </button>
              </div>
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
