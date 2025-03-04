
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Search, 
  FileText, 
  Briefcase, 
  Settings, 
  Menu, 
  X,
  Scale
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Query Assistant', path: '/query-assistant', icon: <Search className="h-5 w-5" /> },
    { name: 'Document Drafting', path: '/document-drafting', icon: <FileText className="h-5 w-5" /> },
    { name: 'Case Management', path: '/case-management', icon: <Briefcase className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" : "py-5 bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shadow-md">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-xl hidden sm:block">Realix.ai</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex items-center">
              <button className="p-2 rounded-full hover:bg-secondary transition-all duration-200">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <button 
              className="md:hidden p-2 rounded-full hover:bg-secondary transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shadow-md">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-xl">Realix.ai</span>
              </Link>
              <button 
                className="p-2 rounded-full hover:bg-secondary transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
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
            
            <div className="p-4 border-t">
              <button className="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-secondary transition-all duration-200">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
