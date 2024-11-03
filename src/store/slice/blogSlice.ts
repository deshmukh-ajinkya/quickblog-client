import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../initialState';

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState.blogs, // Assume initialState.blogs is an empty array or initial value
  reducers: {
    setBlogs: (state, action: PayloadAction) => {
      return action.payload; // Replace the current state with the new blog data
    }
  }
});

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
