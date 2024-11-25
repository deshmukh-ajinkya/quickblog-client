'use client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
import { axiosInstance } from '@/config';
import { RootState } from '@/store/store';

interface Comment {
  authorID: {
    name: string;
  };
  content: string;
}

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]); // Comment data (authorID, content)
  const blogData = useSelector((state: RootState) => state.blog.blogs);
  const blogID = useSelector((state: RootState) => state.blog.blogId);
  const userID = useSelector((state: RootState) => state.blog.userId);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const data = blogData.find((blog) => blog.title.toLowerCase().replace(/\s+/g, '-') === slug);

  // Fetch blog data and initialize like state
  useEffect(() => {
    if (data) {
      setLiked(data.author._id.includes(userID as string));
      setLikeCount(data.likesCount);
    }
  }, [data, userID]);

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async (): Promise<void> => {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.post(
        '/get_comment',
        { blogID },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments(response.data); // Update comments state
    };

    if (blogID) {
      fetchComments();
    }
  }, [blogID]);

  // Scroll to the latest comment when comments change
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  if (!data) {
    return <Typography variant="h4">Blog not found</Typography>;
  }

  // Handle like functionality
  const handleLike = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put(
      '/like_blog',
      { blogId: blogID, userId: userID },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setLiked(response.data.userLiked);
    setLikeCount(response.data.likeCount);
  };

  // Handle sending a new comment
  const handleSendComment = async (): Promise<void> => {
    if (comment.trim()) {
      const token = localStorage.getItem('token');

      await axiosInstance.post(
        '/add_comment',
        {
          blogID,
          authorID: userID,
          content: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments((prevComments) => [
        ...prevComments,
        { authorID: { name: 'You' }, content: comment }
      ]);
      setComment('');
    }
  };

  // Handle sending the comment on 'Enter' key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      handleSendComment();
    }
  };

  return (
    <Box className="blog-content-root-container">
      <Typography className="blog-content-title" variant="h6">
        {data.title}
        <Box className="blog-content-like" onClick={handleLike}>
          <Typography>{likeCount}</Typography>
          {liked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpAltIcon fontSize="small" />}
        </Box>
      </Typography>
      <Typography className="blog-content-description" variant="h6">
        {data.content}
      </Typography>
      <Box className="blog-content-comment">
        <Box className="comments">
          {comments.map((msg, index) => (
            <Box key={index} className="user-comment">
              <Box className="user-comment-info">
                <AccountCircleIcon color="secondary" fontSize="small" />
                <Typography className="user-name-text">{msg.authorID?.name}</Typography>
              </Box>
              <Typography className="user-text">{msg.content}</Typography>
            </Box>
          ))}
          <Box component={'div'} ref={commentsEndRef} />
        </Box>
        <TextField
          className="comment-input"
          placeholder="Add Your Comment Here"
          size="small"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QuickreplyIcon className="comment-icon" color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={handleSendComment}
                style={{ cursor: 'pointer' }}>
                <SendIcon className="comment-icon" color="primary" />
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  );
};

export default BlogDetail;
