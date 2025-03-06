import { useState } from "react"
import { Link } from "react-router-dom"
import { Scale, Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Update the navigation items to include the dashboard link
export default function Navigation() {
  const { setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 flex">
          <Link to="/" className="mr-2 flex items-center space-x-2">
            <Scale className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              LegalAI
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/query-assistant"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Query Assistant
          </Link>
          <Link
            to="/document-drafting"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Document Drafting
          </Link>
          <Link
            to="/case-management"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Case Management
          </Link>
          <Link
            to="/case-analytics"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Analytics
          </Link>
          <Link
            to="/usage-dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Usage Dashboard
          </Link>
        </div>

        <nav className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open user menu" className="bg-transparent border-none p-0 h-auto">
              <div className="relative">
                <button
                  type="button"
                  className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf49a45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
              <DropdownMenuItem onClick={() => setTheme("light")} role="menuitem" >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} role="menuitem" >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} role="menuitem" >
                <Scale className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
