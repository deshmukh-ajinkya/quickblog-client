import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getToken, verifyToken } from '@/utils';

// Define props for the HOC; adjust as necessary for your application
type WithAuthProps = {
  // Add any specific props that the wrapped component might need
  [key: string]: unknown; // Allow for any additional props
};

const publicRoutes = ['/login', '/register', '/reset'];
const privateRoutes = ['/dashboard', '/insight', '/blog'];

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> => {
  const HOC: React.FC<Omit<P, keyof WithAuthProps>> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
      const token = getToken();
      const isTokenValid = token && verifyToken(token);

      // Check if the token is valid
      if (isTokenValid) {
        // If token is valid
        if (privateRoutes.includes(pathname)) {
          // Allow access to private routes
          setLoading(false);
        } else {
          // If trying to access public routes, redirect to dashboard
          router.replace('/dashboard');
          router.refresh();
        }
      } else {
        // If token is invalid
        if (publicRoutes.includes(pathname)) {
          // Allow access to public routes
          setLoading(false);
        } else {
          // If trying to access private routes, redirect to login
          router.replace('/login');
          router.refresh();
        }
      }
    }, [router, pathname]);

    if (loading) {
      // You can return a loading spinner here while validating the token
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  HOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`; // Add display name

  return HOC;
};

export default withAuth;
