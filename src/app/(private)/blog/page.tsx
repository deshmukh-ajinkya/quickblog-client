'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
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
  const [category, setCategory] = useState('select');

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const formData = {
      author: '67139348a0402eab8e8afe8c',
      title,
      content,
      bannerImg: bannerImgBase64,
      category
    };

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

  // Function to trigger the hidden file input when the AddBoxIcon is clicked
  const handleIconClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleDeleteBlog = async (): Promise<void> => {
    const formData = {
      author: '67139348a0402eab8e8afe8c',
      blogId: '6713990fa0402eab8e8afee5'
    };

    await axiosInstance.delete('/delete_blog', {
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  };

  return (
    <Box className="blog-root-container">
      <Box className="blog-grid-container">
        <Box className="blog-icon-container" onClick={handleIconClick}>
          {bannerImgBase64 ? (
            <Image
              src={bannerImgBase64}
              alt="Selected banner"
              className="blog-banner-preview"
              width={150}
              height={100}
            />
          ) : (
            <AddBoxIcon color="primary" />
          )}
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
              <MenuItem value="select">Select Category</MenuItem>
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="news">News</MenuItem>
            </Select>
          </Box>
          <Box className="validation-msg">
            <Typography color="primary">added successful</Typography>
          </Box>
          <Box className="blog-actions">
            <AddBoxIcon color="primary" onClick={handleCreateBlog} />
            <ChangeCircleIcon color="primary" />
            <DeleteIcon color="primary" onClick={handleDeleteBlog} />
          </Box>
        </Box>
      </Box>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="blog-heading"
      />
      <TextField
        fullWidth
        size="small"
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
                <OpenInNewIcon color="primary" fontSize="small" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // Hidden input
      />
    </Box>
  );
}

export default Blog;
