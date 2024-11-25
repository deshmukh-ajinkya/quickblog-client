'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, MenuItem, Select, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@/config';
import { IBlog } from '@/interface/IBlog.interface';
import { RootState } from '@/store/store';
import Like from '../../../../public/thumbs-up.png';
import './style.css';

function Blog(): React.ReactElement {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [, setBannerImg] = useState<File | null>(null);
  const [bannerImgBase64, setBannerImgBase64] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('select');
  const userId = useSelector((state: RootState) => state.blog.userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownBlogs, setOwnBlogs] = useState<IBlog[]>([]);
  const [blogId, setBlogId] = useState<string | null | undefined>(''); // Blog ID to be used for update/delete
  const [validation, setValidation] = useState<string | null>(null); // State for success message
  const router = useRouter();

  const getOwnBlogs = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.post<IBlog[]>(
      '/get_all_blog',
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setOwnBlogs(data);
  }, [userId]); // Add userId as a dependency to ensure it updates when userId changes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];

      // Check file type (only allow images)
      if (!file.type.startsWith('image/')) {
        setValidation('Please select a valid image file');
        fileInputRef.current!.value = ''; // Reset file input
        return;
      }

      // Check file size (limit to 2MB, for example)
      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidation(`File size should not exceed ${MAX_SIZE_MB}MB`);
        fileInputRef.current!.value = ''; // Reset file input
        return;
      }

      setBannerImg(file);

      const reader = new FileReader();
      reader.onloadend = (): void => {
        const base64String = reader.result as string;
        setBannerImgBase64(base64String);
      };
      reader.readAsDataURL(file);
      setValidation(null); // Clear any previous error
    }
  };

  const handleCreateBlog = async (): Promise<void> => {
    // Basic validation
    if (!title.trim()) {
      setValidation('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setValidation('Please enter content for the blog');
      return;
    }

    if (category === 'select') {
      setValidation('Please select a category');
      return;
    }

    if (fileInputRef) {
      setValidation('Please select banner Image');
    }

    const formData = {
      author: userId,
      title,
      content,
      bannerImg: bannerImgBase64,
      category
    };

    await axiosInstance.post('/create_blog', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setValidation('Blog added successfully');
    resetForm();
    getOwnBlogs(); // Refresh blogs after creation
    setTimeout(() => setValidation(null), 3000); // Hide message after 3 seconds
  };

  const handleUpdateBlog = async (): Promise<void> => {
    if (!blogId) {
      setValidation('No blog selected for update');
      return;
    }

    const formData = {
      blogId,
      title,
      content,
      bannerImg: bannerImgBase64,
      category
    };

    await axiosInstance.put('/update_blog', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    setValidation('Blog updated successfully');
    resetForm();
    getOwnBlogs(); // Refresh blogs after update
    setTimeout(() => setValidation(null), 3000); // Hide message after 3 seconds
  };

  const handleDeleteBlog = async (blog_id: string | null | undefined): Promise<void> => {
    if (!blog_id) {
      setValidation('No blog selected for deletion');
      return;
    }

    await axiosInstance.delete('/delete_blog', {
      data: { author: userId, blogId: blog_id },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setValidation('Blog deleted successfully');
    getOwnBlogs(); // Refresh blogs after deletion
    resetForm();
    setTimeout(() => setValidation(null), 3000); // Hide message after 3 seconds
  };

  const resetForm = (): void => {
    setTitle('');
    setContent('');
    setBannerImg(null);
    setBannerImgBase64(null);
    setCategory('select');
    setBlogId(null); // Reset blogId after form submission
  };

  const handleIconClick = (): void => {
    fileInputRef.current?.click();
  };

  // Handle clicking on a blog to prepopulate the form
  const handleBlogSelect = (blog: IBlog): void => {
    setBlogId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    setBannerImgBase64(blog.bannerImg);
    setCategory(blog.category);
  };

  useEffect(() => {
    getOwnBlogs();
  }, [getOwnBlogs]);

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
          <Box>
            {validation && (
              <Box className="validation-msg">
                <Typography color="primary">{validation}</Typography>
              </Box>
            )}
          </Box>
          <Box className="blog-actions">
            <AddBoxIcon color="primary" onClick={handleCreateBlog} />
            <ChangeCircleIcon color="primary" onClick={handleUpdateBlog} />
            <DeleteIcon color="primary" onClick={() => handleDeleteBlog(blogId)} />
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
        {ownBlogs.map((blog, id) => (
          <Box
            key={id}
            className={`blog-content-box ${blog.id === blogId ? 'highlighted' : ''}`}
            onClick={() => handleBlogSelect(blog)} // Prepopulate form with blog data
          >
            <Box component="img" src={blog.bannerImg} alt="Banner" className="blog-image" />
            <Typography color="primary" className="blog-user-info-text">
              {blog.title}
            </Typography>
            <Typography color="primary" className="blog-user-info-description">
              {blog.content}
            </Typography>
            <Box className="blog-info">
              <Box className="blog-user-info">
                <AccountCircleIcon color="secondary" className="blog-user-info-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.author.name}
                </Typography>
              </Box>
              <Box className="blog-like-info">
                <Box component="img" src={Like.src} alt="like" className="blog-user-like-icon" />
                <Typography color="primary" className="blog-user-info-text">
                  {blog.likesCount}
                </Typography>
                <OpenInNewIcon
                  color="primary"
                  fontSize="small"
                  onClick={() => {
                    router.push(
                      `/dashboard/${encodeURIComponent(blog.title.toLowerCase().replace(/\s+/g, '-'))}`
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        component="input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </Box>
  );
}

export default Blog;
