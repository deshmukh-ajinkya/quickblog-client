// types.ts
export interface IBlog {
  id: string | null | undefined;
  author: {
    _id: string;
    name: string;
  };
  title: string;
  content: string;
  bannerImg: string;
  likesCount: number;
}
