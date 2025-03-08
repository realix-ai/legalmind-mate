
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { X, Settings, User } from 'lucide-react';
import SettingsDialog from '../settings/SettingsDialog';
import UserProfileButton from '../profile/UserProfileButton';

type MobileMenuProps = {
  navItems: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
  onClose: () => void;
};

const MobileMenu = ({ navItems, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-xl">R</span>
            </div>
            <span className="font-medium text-xl">Realix.ai</span>
          </Link>
          <button 
            className="p-2 rounded-full hover:bg-secondary transition-all duration-200"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-3 rounded-lg flex items-center gap-3 transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t space-y-2">
          <div className="flex justify-center mb-2">
            <UserProfileButton />
          </div>
          <button 
            className="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-secondary transition-all duration-200"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};

export default MobileMenu;
