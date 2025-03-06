
import { useState } from "react"
import { Link } from "react-router-dom"
import { Scale, Moon, Sun, User, Settings } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navigation() {
  const { setTheme } = useTheme()
  const { userProfile } = useUserProfile()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const userInitials = getInitials(userProfile.name);

  console.log('Navigation component rendered');

  return (
    <header className="fixed w-full top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 flex">
          <Link to="/" className="mr-2 flex items-center space-x-2">
            <Scale className="h-6 w-6" />
            <span className="font-bold sm:inline-block">
              Realix.ai
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm">
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

        <nav className="ml-auto flex items-center space-x-4">
          {/* Theme Switcher */}
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

          {/* Settings Button */}
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open settings menu" className="p-2 rounded-full hover:bg-accent">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                App Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Button */}
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open profile menu" className="focus:outline-none">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
