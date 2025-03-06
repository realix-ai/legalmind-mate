
import { Link } from "react-router-dom"
import { Scale, User, Settings, UserCog, LogOut, CreditCard } from "lucide-react"
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
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function Navigation() {
  const { userProfile, updateUserProfile } = useUserProfile()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [name, setName] = useState(userProfile.name)
  const [role, setRole] = useState(userProfile.role)
  const [specialization, setSpecialization] = useState(userProfile.specialization)

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const userInitials = getInitials(userProfile.name);

  // Save profile changes
  const saveProfileChanges = () => {
    updateUserProfile({
      name,
      role,
      specialization
    });
    setIsProfileOpen(false);
  };

  return (
    <>
      <header className="fixed w-full top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
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

          <nav className="ml-auto flex items-center space-x-6">
            {/* Settings Button */}
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open settings menu" className="p-1 rounded-full hover:bg-accent transition-colors">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  App Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Button */}
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open profile menu" className="focus:outline-none">
                <Avatar className="h-10 w-10 cursor-pointer bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userProfile.role} Attorney</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Application Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <select id="theme" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <select id="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="attorney">Attorney</option>
                <option value="paralegal">Paralegal</option>
                <option value="partner">Partner</option>
                <option value="associate">Associate</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialization">Specialization</Label>
              <select 
                id="specialization" 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="corporate">Corporate</option>
                <option value="criminal">Criminal</option>
                <option value="family">Family</option>
                <option value="tax">Tax</option>
                <option value="intellectual-property">Intellectual Property</option>
                <option value="litigation">Litigation</option>
                <option value="real-estate">Real Estate</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
            <Button onClick={saveProfileChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
