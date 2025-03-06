
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

export default function Navigation() {
  const { setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  console.log('Navigation component rendered');

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
        </div>

        <nav className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open theme menu" className="p-2 rounded-full hover:bg-accent">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
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
