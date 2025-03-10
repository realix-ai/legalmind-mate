
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Settings, User, LogOut } from 'lucide-react';

// Type for user profile data
interface UserProfile {
  name: string;
  role: string;
  specialization: string;
}

// Load profile from localStorage with better error handling
const loadProfile = (): UserProfile => {
  try {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile && typeof profile === 'object' && 'name' in profile) {
        return profile as UserProfile;
      }
    }
  } catch (e) {
    console.error('Error parsing profile data:', e);
  }
  
  // Default profile
  return {
    name: 'John Doe',
    role: 'attorney',
    specialization: 'corporate'
  };
};

// Save profile to localStorage
const saveProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Broadcast the change
    const event = new CustomEvent('profileUpdated', { detail: profile });
    window.dispatchEvent(event);
    console.log('Profile saved and event dispatched:', profile);
  } catch (e) {
    console.error('Error saving profile:', e);
    toast.error('Failed to save profile');
  }
};

const UserProfileButton = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Initialize state from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const { name, role, specialization } = profile;
  
  // Re-load profile when component mounts to ensure consistency
  useEffect(() => {
    const savedProfile = loadProfile();
    setProfile(savedProfile);
    
    // Listen for profile updates from other components
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated event received in UserProfileButton:', event.detail);
      if (event.detail && typeof event.detail === 'object' && 'name' in event.detail) {
        setProfile(event.detail as UserProfile);
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);
  
  const handleSaveProfile = () => {
    // Validate profile data
    if (!profile.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    // Save to localStorage and broadcast event
    saveProfile(profile);
    
    console.log('Saving profile:', profile);
    toast.success('Profile settings saved');
    setProfileOpen(false);
  };
  
  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={role} onValueChange={(value) => updateProfile('role', value)}>
                <SelectTrigger className="col-span-3" id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="paralegal">Paralegal</SelectItem>
                  <SelectItem value="legal-assistant">Legal Assistant</SelectItem>
                  <SelectItem value="law-student">Law Student</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Select value={specialization} onValueChange={(value) => updateProfile('specialization', value)}>
                <SelectTrigger className="col-span-3" id="specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate Law</SelectItem>
                  <SelectItem value="criminal">Criminal Law</SelectItem>
                  <SelectItem value="family">Family Law</SelectItem>
                  <SelectItem value="immigration">Immigration Law</SelectItem>
                  <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                  <SelectItem value="real-estate">Real Estate Law</SelectItem>
                  <SelectItem value="tax">Tax Law</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileButton;
