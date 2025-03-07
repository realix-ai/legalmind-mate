
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/use-theme"

export const AppLogo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="mr-4 flex">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/lovable-uploads/a6a6474a-8323-47ad-847f-a072100060b7.png" 
            alt="Realix.ai Logo" 
            className="h-14 w-auto"
            style={{ 
              filter: `drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))`
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
