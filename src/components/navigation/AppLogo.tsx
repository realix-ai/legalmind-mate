
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/use-theme"

export const AppLogo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="mr-4 flex">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            {/* Dynamic first W */}
            <path 
              d="M12 16C12 16 15 32 16 32C17 32 20 20 20 20C20 20 23 32 24 32C25 32 28 16 28 16" 
              stroke="#0EA5E9" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Dynamic second W */}
            <path 
              d="M20 16C20 16 23 32 24 32C25 32 28 20 28 20C28 20 31 32 32 32C33 32 36 16 36 16" 
              stroke="#0EA5E9" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </div>
        <span className="font-bold text-xl sm:inline-block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
          Workswise.ai
        </span>
      </Link>
    </div>
  );
};
