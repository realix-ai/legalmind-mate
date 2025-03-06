
import { AppLogo } from "./navigation/AppLogo"
import { NavigationLinks } from "./navigation/NavigationLinks"
import { ThemeToggle } from "./navigation/ThemeToggle"
import { SettingsMenu } from "./navigation/SettingsMenu"
import { ProfileMenu } from "./navigation/ProfileMenu"

export default function Navigation() {
  return (
    <header className="fixed w-full top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <AppLogo />
        <NavigationLinks />
        <nav className="ml-auto flex items-center space-x-6">
          <ThemeToggle />
          <SettingsMenu />
          <ProfileMenu />
        </nav>
      </div>
    </header>
  );
}
