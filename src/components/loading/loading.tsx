import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import NotFoundIcon from '../../../public/blog-post.gif';

export default function Loading(): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'center'
      }}>
      <Image src={NotFoundIcon} alt="not-found-icon" width={100} height={100} />
    </Box>
  );
}
