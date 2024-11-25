'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '@/config';
import { setBlogId, setBlogs } from '@/store/slice/blogSlice';
import Like from '../../../../public/thumbs-up.svg';
import './style.css';

interface Blog {
  author: {
    _id: string;
    name: string;
  };
  title: string;
  content: string;
  bannerImg: string;
  likesCount: number;
  id: number;
}

function Dashboard(): React.ReactNode {
  const [blog, setBlog] = useState<Blog[]>([]);
  const dispatch = useDispatch();

  const handleGetBlog = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.post(
      '/get_all_blog',
      {
        limit: 5 // Add limit in the request body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setBlog(data);
    dispatch(setBlogs(data));
  }, [dispatch]);

  useEffect(() => {
    handleGetBlog();
  }, [handleGetBlog]);

  // Render the dashboard content
  return (
    <Box className="dashboard-root-container">
      {/* Container for blog posts */}
      <Box className="dashboard-blog-container">
        {/* blog posts */}
        {blog.map((blogData, index) => (
          <Link
            className="dashboard-blog-card-wrapper"
            key={index} // Set a unique key for each blog post
            href={`/dashboard/${encodeURIComponent(blogData.title.toLowerCase().replace(/\s+/g, '-'))}`}
            onClick={() => {
              dispatch(setBlogId(String(blogData.id)));
            }}>
            {/* Blog post image */}
            <Image
              src={blogData.bannerImg}
              alt="Banner"
              width={400}
              height={200}
              priority
              className="dashboard-blog-img"
            />

            {/* Blog post title */}
            <Typography className="dashboard-blog-title">{blogData.title}</Typography>

            {/* Blog post description */}
            <Typography className="dashboard-blog-description">{blogData.content}</Typography>

            {/* Container for blog post user information */}
            <Box className="dashboard-blog-user-info">
              {/* User icon */}
              <AccountCircleIcon color="secondary" className="dashboard-user-info-icon" />

              {/* User name */}
              <Typography className="dashboard-user-info-title">{blogData.author.name}</Typography>
            </Box>

            {/* Container for blog post likes */}
            <Box className="dashboard-blog-user-like">
              {/* Number of likes */}
              <Typography className="dashboard-user-info-title">{blogData.likesCount}</Typography>

              {/* Like icon */}
              <Image
                priority
                src={Like}
                alt="like"
                width={20}
                className="dashboard-user-like-icon"
              />
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;
