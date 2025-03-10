
import { User, UserCog, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export const ProfileMenu = () => {
  const { userProfile, updateUserProfile } = useUserProfile()
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [specialization, setSpecialization] = useState("")

  // Initialize form values when userProfile changes
  useEffect(() => {
    setName(userProfile.name || "")
    setRole(userProfile.role || "")
    setSpecialization(userProfile.specialization || "")
  }, [userProfile])

  // Get display name (from auth if available, otherwise from profile)
  const displayName = user?.name || userProfile.name;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const userInitials = getInitials(displayName);

  // Save profile changes
  const saveProfileChanges = () => {
    updateUserProfile({
      name,
      role,
      specialization
    });
    
    // Use setTimeout to ensure the dialog closes properly
    setTimeout(() => {
      setIsProfileOpen(false);
    }, 10);
  };

  // Handle dialog open state with proper timing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small delay to ensure animations complete before state changes
      setTimeout(() => {
        setIsProfileOpen(open);
      }, 10);
    } else {
      setIsProfileOpen(open);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If not authenticated, return nothing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
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
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleOpenChange(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={handleOpenChange}>
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="button" onClick={saveProfileChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
