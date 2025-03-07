
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/use-theme"

export const AppLogo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="mr-4 flex">
      <Link to="/" className="mr-2 flex items-center space-x-2 group">
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <div 
            className={`h-14 w-14 flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            style={{ 
              backgroundImage: `url('/lovable-uploads/302e2cd3-1590-4b14-bb63-2a91d96145d9.png')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: `brightness(${theme === 'dark' ? 1.5 : 1}) contrast(${theme === 'dark' ? 1.5 : 1}) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))`
            }}
          />
        </div>
        <span className="font-bold text-xl sm:inline-block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
          Realix.ai
        </span>
      </Link>
    </div>
  );
};
