
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, Settings } from 'lucide-react';
import NavItems from './NavItems';
import SettingsDialog from '../settings/SettingsDialog';
import { Button } from '@/components/ui/button';
import UserProfileButton from '../profile/UserProfileButton';

type NavBarProps = {
  isScrolled: boolean;
  isLandingPage: boolean;
  navItems: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
  onOpenMobileMenu: () => void;
};

const NavBar = ({ 
  isScrolled, 
  isLandingPage, 
  navItems, 
  onOpenMobileMenu
}: NavBarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" 
          : isLandingPage 
            ? "py-5 bg-transparent" 
            : "py-5 bg-white dark:bg-gray-900"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-xl">R</span>
            </div>
            <span className="font-medium text-xl hidden sm:block">Realix.ai</span>
          </Link>
          
          {!isLandingPage && (
            <NavItems navItems={navItems} />
          )}
          
          <div className="hidden md:flex items-center space-x-2">
            {!isLandingPage && (
              <>
                <UserProfileButton />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-muted-foreground"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-all duration-200"
            onClick={onOpenMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </nav>
  );
};

export default NavBar;
