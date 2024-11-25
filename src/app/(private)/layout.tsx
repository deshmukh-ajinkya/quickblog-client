'use client';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import WindowIcon from '@mui/icons-material/Window';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import withAuth from '@/components/auth/withAuth';
import { INavigationItem } from '@/interface';
import { RootState } from '@/store/store';
import Logo from '../../../public/icon.png';
import './style.css';

// Define the private navigation paths with their titles, icons, and URLs
const privatePaths = [
  { title: 'Blog', icon: WindowIcon, url: '/dashboard' },
  { title: 'Create', icon: NoteAltIcon, url: '/blog' },
  { title: 'Insight', icon: AssessmentIcon, url: '/insight' }
];

// Private component to render navigation and user profile menu
function Private({ children }: { children: React.ReactNode }): React.ReactNode {
  const router = useRouter(); // Hook to programmatically navigate
  const pathname = usePathname(); // Get the current pathname for navigation highlighting
  const [name, setName] = React.useState(''); // State for user name
  const [selectedItem, setSelectedItem] = React.useState(() => {
    // Determine the initially selected navigation item based on the current pathname
    const initialSelected = privatePaths.find((item) => item.url === pathname);
    return initialSelected?.title || 'Explore';
  });
  const userName = useSelector((state: RootState) => state.blog.userName);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    router.push('/login'); // Redirect to the login page or any other route
  };

  // Handle navigation item click
  const handleNavigation = React.useCallback(
    (item: INavigationItem): void => {
      setSelectedItem(item.title); // Set the selected item
      router.push(item.url); // Navigate to the selected URL
    },
    [router]
  );

  useEffect(() => {
    setName(userName as string);
  }, [userName]);

  return (
    <Box className="private-root-container">
      {/* Logo image */}
      <Image src={Logo} alt="logo" className="header-logo-image" />

      {/* Header icons including theme switcher and user profile icon */}
      <Box className="header-icons">
        <Typography variant="body2" component="span" fontWeight={600} color="primary">
          {name}
        </Typography>
        <ExitToAppIcon fontSize="small" onClick={handleLogout} color="primary" />
      </Box>

      {/* Main content area where children components are rendered */}
      <Box className="children-content">{children}</Box>

      {/* Navigation items */}
      <Box className="navigation">
        {privatePaths.map((item, index) => (
          <Box
            className={`navigation-item-wrapper ${selectedItem === item.title ? 'selected' : ''}`}
            key={index}
            onClick={() => handleNavigation(item)}>
            <item.icon fontSize="large" color="primary" className="navigation-item-icon" />
            <Typography color="primary" className="navigation-item-label">
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default withAuth(Private);
