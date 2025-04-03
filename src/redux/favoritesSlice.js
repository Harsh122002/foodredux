import { createSlice } from "@reduxjs/toolkit";

const getUserFavoriteProducts = (userId) => {
    const data = JSON.parse(localStorage.getItem("favorite")) || []; // Ensure it's an array

    const favProducts = data
        .filter(f => f.user === userId) 
        .map(f => f.product); 

    return [...new Set(favProducts)];
};






const saveFavoritesToLocalStorage = (userId, favorites) => {
    const data = JSON.parse(localStorage.getItem("favorites")) || {};
    data[userId] = favorites;
    localStorage.setItem("favorites", JSON.stringify(data));
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        userId: null,
        favorites: [],
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
            state.favorites = getUserFavoriteProducts(action.payload);
        },
        addFavorite: (state, action) => {
            const { userId, productId } = action.payload;
            const cat = { "user": userId, "product": productId };
        
            const data = JSON.parse(localStorage.getItem("favorites")) || [];
        
            data.push(cat);
            localStorage.setItem("favorites", JSON.stringify(data));
        
            state.favorites = data;
        },
        
        removeFavorite: (state, action) => {
            const { productId } = action.payload;
            console.log("Removing productId:", productId.toString());
        
            const data = JSON.parse(localStorage.getItem("favorites")) || [];
        
            const updatedFavorites = data.filter(f => f.product !== productId.toString());
        
            console.log("Updated favorites:", updatedFavorites);
        
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        
            state.favorites = updatedFavorites;
        },
        
        
        clearFavorites: (state) => {
            state.favorites = [];
            saveFavoritesToLocalStorage(state.userId, []);
        },
    },
});

export const { setUserId, addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
