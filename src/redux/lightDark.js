import { createSlice } from "@reduxjs/toolkit";

// Load the mode from localStorage
const loadMode = () => {
  const mode = localStorage.getItem('mode');
  return mode === 'dark' ? 'dark' : 'light';
};

const initialState = {
  mode: loadMode(),
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    toggleMode: (state) => {
      // Toggle between 'dark' and 'light' modes
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mode', state.mode);  // Store the mode in localStorage
    },
  },
});

export const { toggleMode } = modeSlice.actions;
export default modeSlice.reducer;
