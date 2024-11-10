import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBlog } from '@/interface/IBlog.interface';
import { initialState } from '../initialState';

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<IBlog[]>) => {
      state.blogs = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    }
  }
});

export const { setBlogs, setUserId } = blogSlice.actions;
export default blogSlice.reducer;