import { configureStore } from '@reduxjs/toolkit';
import { blogSlice } from './slice';
import counterSlice from './slice/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    blog: blogSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
