import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { NavigationMenu } from "@/components/navigation/NavigationMenu";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

export const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger aria-label="Open settings">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explore options and manage your account
          </SheetDescription>
        </SheetHeader>

        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
        <NavigationMenu />
      </SheetContent>
    </Sheet>
  );
};
