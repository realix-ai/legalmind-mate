
import { Link } from "react-router-dom"

export const AppLogo = () => {
  return (
    <div className="mr-4 flex">
      <Link to="/" className="mr-2 flex items-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-white">
          <span className="text-xl font-bold">R</span>
        </div>
        <span className="font-bold text-lg sm:inline-block">
          Realix.ai
        </span>
      </Link>
    </div>
  );
};
