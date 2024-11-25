/* eslint-disable complexity */
'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import withAuth from '@/components/auth/withAuth';
import { axiosInstance } from '@/config';
import Logo from '../../../../public/icon.png';
import './style.css';

const steps = ['Enter Email', 'Enter OTP', 'Set New Password'];

function Reset(): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStepChange = (direction: 'next' | 'back'): void => {
    setActiveStep((prevStep) => prevStep + (direction === 'next' ? 1 : -1));
  };

  const handleReset = (): void => {
    setActiveStep(0);
    setEmail('');
    setOtp('');
    setPassword('');
    setValidationMessage('');
  };

  const handleSubmit = async (): Promise<void> => {
    setValidationMessage('');
    setIsLoading(true);

    try {
      if (activeStep === 0) {
        // Call API to send OTP
        const response = await axiosInstance.post('/get_otp', { email });
        setValidationMessage(response.data.message || 'OTP sent to your email.');
        handleStepChange('next');
      } else if (activeStep === 1) {
        // Optionally validate OTP (backend should handle this in the reset-password call)
        if (!otp) throw new Error('OTP is required.');
        handleStepChange('next');
      } else if (activeStep === 2) {
        // Call API to reset password
        const response = await axiosInstance.post('/reset', {
          email,
          otp,
          newPassword: password
        });
        setValidationMessage(response.data.message || 'Password changed successfully.');
        handleReset();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setValidationMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (): React.ReactElement | null => {
    if (activeStep === 0) {
      return (
        <TextField
          size="small"
          placeholder="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      );
    } else if (activeStep === 1) {
      return (
        <TextField
          size="small"
          placeholder="Enter OTP"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      );
    } else if (activeStep === 2) {
      return (
        <TextField
          size="small"
          placeholder="Enter New Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Box className="reset-container">
      <Image src={Logo} alt="logo" className="reset-logo" />

      <Box className="input-container">
        {renderStepContent()}
        {validationMessage && (
          <Typography className="validation-message" color="error">
            {validationMessage}
          </Typography>
        )}
      </Box>

      <Box className="button-container">
        {activeStep > 0 && (
          <Button
            variant="contained"
            size="small"
            className="reset-button"
            onClick={() => handleStepChange('back')}
            disabled={isLoading}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="reset-button"
          onClick={handleSubmit}
          disabled={isLoading}>
          {isLoading ? 'Loading...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>

      <Link href="/login" className="reset-link">
        Back to login
      </Link>
    </Box>
  );
}

export default withAuth(Reset);
