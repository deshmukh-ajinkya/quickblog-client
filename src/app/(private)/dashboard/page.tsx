'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/config';
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
}

function Dashboard(): React.ReactNode {
  // State variable to store the selected category (initially set to 1)
  const [category, setCategory] = React.useState<number>(1);
  const [blog, setBlog] = useState<Blog[]>([]);
  // Function to handle changes in the category selection dropdown
  const handleChange = (event: SelectChangeEvent): void => {
    setCategory(Number(event.target.value)); // Update state with the selected value converted to a number
  };

  const handleGetBlog = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.post(
      '/get_all_blog',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setBlog(data);
  };

  useEffect(() => {
    handleGetBlog();
  }, []);

  // Render the dashboard content
  return (
    <Box className="dashboard-root-container">
      {/* Category selection dropdown */}
      <Select
        name="select-category"
        className="dashboard-select-category"
        size="small"
        value={String(category)} // Set the selected value from state
        onChange={handleChange}>
        <MenuItem value={1}>All</MenuItem>
        <MenuItem value={2}>Technology</MenuItem>
      </Select>

      {/* Container for blog posts */}
      <Box className="dashboard-blog-container">
        {/* Loop through the first 10 blog posts from mock data */}
        {blog.map((blogData, index) => (
          <Link
            className="dashboard-blog-card-wrapper"
            key={index} // Set a unique key for each blog post
            href={`/dashboard/${encodeURIComponent(blogData.title.toLowerCase().replace(/\s+/g, '-'))}`} // Generate a dynamic URL based on blog title
          >
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
