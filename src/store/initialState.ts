import { IBlog } from '@/interface/IBlog.interface';

export const initialState: {
  count: number;
  blogs: IBlog[];
  userId: string | null;
  blogId: string | null;
} = {
  count: 0,
  blogs: [],
  userId: null,
  blogId: null
};
