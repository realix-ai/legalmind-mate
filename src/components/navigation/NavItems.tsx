
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavItemsProps = {
  navItems: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
};

const NavItems = ({ navItems }: NavItemsProps) => {
  const location = useLocation();

  return (
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
  );
};

export default NavItems;
