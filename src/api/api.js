import axios from "axios";

export const Register = async (values) => {
  try {
    const response = await axios.post("http://localhost:3001/users", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const GetProducts = async (category, page, limit ) => {
  console.log("Filter:", category, "Page:", page, "Limit:", limit);

  try {
    const response = await axios.get("http://localhost:3001/products");

    let filteredData = response.data;

    if (category && category.toLowerCase() !== "all") {
      filteredData = filteredData.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    const totalProducts = filteredData.length;
    const totalPages = Math.ceil(totalProducts / limit);

    // Apply pagination using slice
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      totalPages,
      totalProducts,
      currentPage: page,
    };

  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const fetchProducts =async () => {
  try {
    const response = await axios.get("http://localhost:3001/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  
} 


export const Categories = async () => {
  try {
    const response = await axios.get("http://localhost:3001/products");
    const categories = response.data.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || []).concat(curr);
      return acc;
    }, {});
    return Object.keys(categories); // Return only unique category names
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const AddFavorites = async (userId, productId) => {
  const cat = { productId, userId }; // Adding userId to the product

  try {
    await axios.post(
      "http://localhost:3001/favorites",
      cat,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Product added to favorites:", productId);
  } catch (error) {
    console.error("Error adding product to favorites:", error);
  }
};

export const RemoveFavorites = async ( productId) => {
  try {
    await axios.delete(`http://localhost:3001/favorites/${productId}`);
    console.log("Favorite removed successfully");
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

export const GetFavoriteProducts = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/favorites`);
    const favorites = response.data.filter((favorite) => favorite.userId === userId);
    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const OrderPlaces = async (values) => {
  try {
    const response = await axios.post("http://localhost:3001/orders", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Order placed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}