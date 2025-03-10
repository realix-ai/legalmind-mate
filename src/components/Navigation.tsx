
import { AppLogo } from "./navigation/AppLogo"
import { NavigationLinks } from "./navigation/NavigationLinks"
import { SettingsMenu } from "./navigation/SettingsMenu"
import { ProfileMenu } from "./navigation/ProfileMenu"
import { LoginButton } from "./auth/LoginButton"
import { useAuth } from "@/contexts/AuthContext"
import { NotificationBell } from "@/components/notifications/NotificationBell"

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed w-full top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <AppLogo />
        <NavigationLinks />
        <nav className="ml-auto flex items-center space-x-2">
          <LoginButton />
          {isAuthenticated && <NotificationBell />}
          <SettingsMenu />
          {isAuthenticated && <ProfileMenu />}
        </nav>
      </div>
    </header>
  );
}
