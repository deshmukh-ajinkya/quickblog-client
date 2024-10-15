import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getToken, verifyToken } from '@/utils';
import Loading from '../loading/loading';

type WithAuthProps = {
  [key: string]: unknown;
};

const publicRoutes = ['/login', '/register', '/reset'];
const privateRoutes = ['/dashboard', '/insight', '/blog'];

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => pathname === route);
};

const isPrivateRoute = (pathname: string): boolean => {
  return privateRoutes.some((route) => pathname === route) || pathname.startsWith('/dashboard/');
};

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
        if (isPrivateRoute(pathname)) {
          // Allow access to private routes
          setLoading(false);
        } else {
          // If trying to access public routes, redirect to dashboard
          router.push('/dashboard');
        }
      } else {
        if (isPublicRoute(pathname)) {
          // Allow access to public routes
          setLoading(false);
        } else {
          // If trying to access private routes, redirect to login
          router.push('/login');
        }
      }
    }, [router, pathname]);

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  HOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
};

export default withAuth;
