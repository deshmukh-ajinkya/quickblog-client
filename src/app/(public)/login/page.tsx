'use client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { SyntheticEvent, useState } from 'react';
import { axiosInstance } from '@/config';
import Logo from '../../../../public/icon.png';
import './style.css'; // Import plain CSS file

function Login(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };
  const handleLogin = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    await axiosInstance.post('/login', {
      email,
      password
    });
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
        <Typography className="validation-message">Validation message</Typography>
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
                <IconButton onClick={handleClickShowPassword} edge="end">
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
        <Typography className="validation-message">Validation Message</Typography>
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

export default Login;