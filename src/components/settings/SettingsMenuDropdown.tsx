
import { Settings, CreditCard, KeyRound, MessageSquarePlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SettingsMenuDropdownProps {
  onOpenSettings: (tab: string) => void;
}

export const SettingsMenuDropdown = ({ onOpenSettings }: SettingsMenuDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open settings menu"
        className="p-1 rounded-full hover:bg-accent transition-colors"
      >
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onOpenSettings("appearance")}>
          <Settings className="mr-2 h-4 w-4" />
          Appearance
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenSettings("integrations")}>
          <KeyRound className="mr-2 h-4 w-4" />
          Integrations
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOpenSettings("feedback")}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Feedback
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
