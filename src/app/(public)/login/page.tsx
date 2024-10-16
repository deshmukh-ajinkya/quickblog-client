'use client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import { axiosInstance } from '@/config';
import Logo from '../../../../public/icon.png';
import './style.css';

function Login(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const route = useRouter();

  const handleLogin = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    const data = await axiosInstance.post('/login', {
      email,
      password
    });
    const storedToken = data.data.token;
    if (storedToken) {
      localStorage.setItem('token', data.data.token);
      route.push('/dashboard');
    }
  };

  return (
    <Box className="container" component="form" method="post" onSubmit={(e) => handleLogin(e)}>
      <Image src={Logo} alt="logo" className="logo" />

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <RemoveRedEyeIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Link href={'/reset'} className="link">
        Forget Password
      </Link>

      <Button variant="contained" color="primary" size="medium" className="button" type="submit">
        Login
      </Button>

      <Link href={'/register'} className="link">
        Dont have an account? Register
      </Link>
    </Box>
  );
}

export default withAuth(Login);
