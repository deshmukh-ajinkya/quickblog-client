// types.ts
export interface IBlog {
  author: {
    _id: string;
    name: string;
  };
  title: string;
  content: string;
  bannerImg: string;
  likesCount: number;
}
