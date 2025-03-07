
import { Link } from "react-router-dom"

export const AppLogo = () => {
  return (
    <div className="mr-4 flex">
      <Link to="/" className="mr-2 flex items-center space-x-2">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/302e2cd3-1590-4b14-bb63-2a91d96145d9.png" 
            alt="Realix.ai Logo" 
            className="h-10 w-auto"
          />
        </div>
        <span className="font-bold text-lg sm:inline-block">
          Realix.ai
        </span>
      </Link>
    </div>
  );
};
