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
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setBlogId: (state, action: PayloadAction<string | null>) => {
      state.blogId = action.payload;
    }
  }
});

export const { setBlogs, setUserId, setUserName, setBlogId } = blogSlice.actions;
export default blogSlice.reducer;
