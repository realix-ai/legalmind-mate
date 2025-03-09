
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
            <rect width="48" height="48" rx="12" fill="#0EA5E9" fillOpacity="0.1"/>
            <path d="M12 14C12 12.8954 12.8954 12 14 12H34C35.1046 12 36 12.8954 36 14V34C36 35.1046 35.1046 36 34 36H14C12.8954 36 12 35.1046 12 34V14Z" fill="#0EA5E9" fillOpacity="0.08"/>
            
            {/* First W */}
            <path 
              d="M14 16L18 32L22 20L26 32L30 16" 
              stroke="#0EA5E9" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Second W - stylized and overlapping */}
            <path 
              d="M18 16L22 32L26 20L30 32L34 16" 
              stroke="#0EA5E9" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              opacity="0.7"
            />
            
            {/* Decorative element */}
            <circle cx="24" cy="24" r="16" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.4"/>
          </svg>
        </div>
        <span className="font-bold text-xl sm:inline-block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
          Workswise.ai
        </span>
      </Link>
    </div>
  );
};
