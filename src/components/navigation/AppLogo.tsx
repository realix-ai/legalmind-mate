
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
            <path d="M14 12L24 8L34 12V20C34 28.2 30 32 24 36C18 32 14 28.2 14 20V12Z" fill="#0EA5E9" fillOpacity="0.8"/>
            <path d="M24 30L32 22L28 18L24 22L20 18L16 22L24 30Z" fill="white"/>
          </svg>
        </div>
        <span className="font-bold text-xl sm:inline-block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
          Workswise.ai
        </span>
      </Link>
    </div>
  );
};
