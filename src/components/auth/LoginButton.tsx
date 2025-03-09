
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const LoginButton = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Don't show login button if user is already logged in
  }

  return (
    <Link to="/login">
      <Button variant="outline" size="sm" className="mr-2">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    </Link>
  );
};
