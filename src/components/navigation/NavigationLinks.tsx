
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const NavigationLinks = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-1">
      <Link to="/query-assistant">
        <Button variant={window.location.pathname === '/query-assistant' ? "default" : "ghost"} 
                className="flex items-center h-10 px-4 py-2">
          <span className="mr-2">🔍</span>
          Query Assistant
        </Button>
      </Link>
      <Link to="/document-drafting">
        <Button variant={window.location.pathname === '/document-drafting' ? "default" : "ghost"} 
                className="flex items-center h-10 px-4 py-2">
          <span className="mr-2">📄</span>
          Document Drafting
        </Button>
      </Link>
      <Link to="/case-management">
        <Button variant={window.location.pathname === '/case-management' ? "default" : "ghost"} 
                className="flex items-center h-10 px-4 py-2">
          <span className="mr-2">📁</span>
          Case Management
        </Button>
      </Link>
    </div>
  );
};
