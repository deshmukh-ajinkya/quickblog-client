'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { axiosInstance } from '@/config';
import { blogData } from '@/mock/blogData';
import ReactImg from '../../../../public/react.png';
import Like from '../../../../public/thumbs-up.svg';
import './style.css';

// Main Blog component
function Blog(): React.ReactElement {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [, setBannerImg] = useState<File | null>(null);
  const [bannerImgBase64, setBannerImgBase64] = useState<string | null>(null);
  const [category, setCategory] = useState('');

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      setBannerImg(file);

      // Convert the file to Base64
      const reader = new FileReader();
      reader.onloadend = (): void => {
        const base64String = reader.result as string;
        setBannerImgBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle blog creation
  const handleCreateBlog = async (): Promise<void> => {
    const formData = new FormData();
    formData.append('author', '671308f18e4ff2f76d09a05b');
    formData.append('title', title);
    formData.append('content', content);
    formData.append('bannerImg', bannerImgBase64 || ''); // Use Base64 string directly
    formData.append('category', category);

    await axiosInstance.post('/create_blog', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // Optionally, reset form fields after successful submission
    resetForm();
  };

  // Function to reset form fields
  const resetForm = (): void => {
    setTitle('');
    setContent('');
    setBannerImg(null);
    setBannerImgBase64(null);
    setCategory('');
  };

  return (
    <Box className="blog-root-container">
      <Box className="blog-grid-container">
        <Box className="blog-icon-container">
          <AddBoxIcon color="primary" />
        </Box>
        <Box className="blog-select-container">
          <Box>
            <Select
              name="select-category"
              size="small"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="blog-select"
              fullWidth>
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="lifestyle">Lifestyle</MenuItem>
            </Select>
          </Box>
          <Box className="blog-actions">
            <AddBoxIcon color="primary" onClick={handleCreateBlog} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: '16px' }}
            />
            <DeleteIcon color="primary" />
          </Box>
        </Box>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="blog-heading"
      />
      <TextField
        fullWidth
        variant="outlined"
        multiline
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="blog-textfield"
      />
      <Box className="blog-content-container">
        {blogData.map((blog, id) => (
          <Box key={id} className="blog-content-box">
            <Image src={ReactImg} alt="Banner" className="blog-image" />
            <Typography color="primary" className="blog-user-info-text">
              {blog.title}
            </Typography>
            <Typography color="primary" className="blog-user-info-description">
              {blog.description}
            </Typography>
            <Box className="blog-info">
              <Box className="blog-user-info">
                <AccountCircleIcon color="secondary" className="blog-user-info-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.user.name}
                </Typography>
              </Box>
              <Box className="blog-like-info">
                <Image src={Like} alt="like" width={20} className="blog-user-like-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.user.likes}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Blog;
