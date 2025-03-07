
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/use-theme"

export const AppLogo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="mr-4 flex">
      <Link to="/" className="mr-2 flex items-center space-x-2 group">
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/lovable-uploads/302e2cd3-1590-4b14-bb63-2a91d96145d9.png" 
            alt="Realix.ai Logo" 
            className={`h-12 w-auto ${theme === 'dark' ? 'filter brightness-110' : ''} drop-shadow-md`}
          />
        </div>
        <span className="font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
          Realix.ai
        </span>
      </Link>
    </div>
  );
};
