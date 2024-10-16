'use client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import { axiosInstance } from '@/config';
import Logo from '../../../../public/icon.png';
import './style.css'; // Import the plain CSS file

function Register(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (): Promise<void> => {
    // Validate fields before sending data
    if (validateFields()) {
      await axiosInstance.post('/register', { name, email, password });
    }
  };

  const validateFields = (): boolean => {
    let valid = true;

    // Name validation
    if (!name) {
      setNameError('Full name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    // Email validation
    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };
  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="register-container">
      <Image src={Logo} alt="logo" className="register-logo" />

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Full Name"
          value={name}
          error={Boolean(nameError)}
          label={nameError}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Email"
          value={email}
          error={Boolean(emailError)}
          label={emailError}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
      </Box>

      <Box className="input-container">
        <TextField
          size="small"
          placeholder="Password"
          value={password}
          error={Boolean(passwordError)}
          label={passwordError}
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
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        className="register-button"
        onClick={handleRegister}>
        Register
      </Button>

      <Link href={'/login'} className="register-link">
        Already have an account? Login
      </Link>
    </Box>
  );
}

export default withAuth(Register);
