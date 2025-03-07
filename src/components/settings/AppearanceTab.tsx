
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Español (Spanish)" },
  { value: "fr", label: "Français (French)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ar", label: "العربية (Arabic)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ru", label: "Русский (Russian)" },
];

interface AppearanceTabProps {
  initialTheme: string;
  initialLanguage: string;
  onSave: (theme: string, language: string) => void;
}

export const AppearanceTab = ({
  initialTheme,
  initialLanguage,
  onSave,
}: AppearanceTabProps) => {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  const handleSave = () => {
    onSave(selectedTheme, selectedLanguage);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="theme">Theme</Label>
        <select
          id="theme"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </DialogFooter>
    </div>
  );
};
