
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, FileText, Briefcase, Settings } from 'lucide-react';
import NavBar from './navigation/NavBar';
import MobileMenu from './navigation/MobileMenu';

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLandingPage = location.pathname === '/';

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
      <NavBar 
        isScrolled={isScrolled}
        isLandingPage={isLandingPage}
        navItems={navItems}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />
      
      {isMobileMenuOpen && (
        <MobileMenu 
          navItems={navItems}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
