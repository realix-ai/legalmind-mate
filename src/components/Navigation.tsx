
import { Link } from "react-router-dom"
import { Scale, User, Settings } from "lucide-react"
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
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const { userProfile } = useUserProfile()

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
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 text-white">
              <span className="text-xl font-bold">R</span>
            </div>
            <span className="font-bold sm:inline-block">
              Realix.ai
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/query-assistant">
            <Button variant="secondary" className="flex items-center rounded-full">
              <span className="mr-2">🔍</span>
              Query Assistant
            </Button>
          </Link>
          <Link to="/document-drafting" className="ml-4">
            <Button variant="ghost" className="flex items-center">
              <span className="mr-2">📄</span>
              Document Drafting
            </Button>
          </Link>
          <Link to="/case-management" className="ml-4">
            <Button variant="ghost" className="flex items-center">
              <span className="mr-2">📁</span>
              Case Management
            </Button>
          </Link>
        </div>

        <nav className="ml-auto flex items-center space-x-4">
          {/* Settings Button */}
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open settings menu">
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
              <DropdownMenuItem>
                Subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Button */}
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open profile menu" className="focus:outline-none">
              <Avatar className="h-10 w-10 cursor-pointer bg-blue-100 text-blue-800">
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
                <span>Personal Information</span>
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
