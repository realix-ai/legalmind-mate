
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
            <rect width="48" height="48" rx="10" fill="#0EA5E9" fillOpacity="0.1"/>
            <path d="M14 11L24 8L34 11V20C34 28.2 30 34 24 40C18 34 14 28.2 14 20V11Z" fill="#0EA5E9" fillOpacity="0.2"/>
            <path 
              d="M14 18L19 24L14 30M34 18L29 24L34 30" 
              stroke="#0EA5E9" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M19 24H29M19 18L29 30M29 18L19 30" 
              stroke="#0EA5E9" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
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
