
import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ bypassAuth = false }: { bypassAuth?: boolean }) => {
  // If auth is bypassed, render content without checking
  if (bypassAuth) {
    return <Outlet />;
  }
  
  const { isSignedIn, isLoaded } = useAuth();

  // If Clerk isn't loaded yet, render the content
  if (!isLoaded) {
    return <Outlet />;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // If Clerk isn't loaded yet, render the content
  if (!isLoaded) {
    return <Outlet />;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
