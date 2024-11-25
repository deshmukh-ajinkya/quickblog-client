import { IBlog } from '@/interface/IBlog.interface';

export const initialState: {
  count: number;
  blogs: IBlog[];
  userId: string | null;
  userName: string;
  blogId: string | null;
} = {
  count: 0,
  blogs: [],
  userId: null,
  userName: '',
  blogId: null
};
