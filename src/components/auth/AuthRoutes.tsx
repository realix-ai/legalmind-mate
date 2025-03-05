
import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // If Clerk isn't loaded yet or there's no auth context,
  // render the content anyway for better user experience
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

  // If Clerk isn't loaded yet or there's no auth context,
  // render the content anyway for better user experience
  if (!isLoaded) {
    return <Outlet />;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
