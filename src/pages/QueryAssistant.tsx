import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

const QueryAssistant = () => {
  const { theme } = useTheme();
  const [session, setSession] = useState<any>({ user: { name: 'User', email: 'user@example.com' } });
  const [status, setStatus] = useState('authenticated');
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSignOut = async () => {
    try {
      // Simulated sign out since we don't have next-auth
      setSession(null);
      setStatus('unauthenticated');
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setIsSettingsOpen(false);
      }, 10);
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  const handleOpenSettings = useCallback((tab: string) => {
    setActiveTab(tab);
    setIsSettingsOpen(true);
  }, []);

  const handleSaveSettings = useCallback((selectedTheme: string, selectedLanguage: string) => {
    // Here you would handle saving the settings
    console.log("Saving settings:", selectedTheme, selectedLanguage);
    setTimeout(() => {
      setIsSettingsOpen(false);
    }, 10);
  }, []);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: query,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuery("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        id: uuidv4(),
        role: "assistant",
        content: data.result,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (e: any) {
      console.error("Error sending message:", e);
      setError(e.message || "Failed to send message");
      toast.error(e.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="bg-background border-b">
        <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
          <p className="font-bold text-2xl">
            Acme <span className="text-primary">AI</span>
          </p>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Avatar"} />
                    <AvatarFallback>
                      {session?.user?.name ? session.user.name[0] : "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Badge variant="secondary" className="mr-2">
                    {session?.user?.email}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenSettings("appearance")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="container py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <Card
                  className={cn(
                    "w-full max-w-md rounded-lg shadow-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <CardHeader>
                    <p className="text-sm font-medium capitalize">{message.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm break-words">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <BeatLoader color={theme === "dark" ? "#fff" : "#000"} size={12} />
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center">Error: {error}</div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t">
        <div className="container py-4">
          <div className="flex items-center space-x-4">
            <Textarea
              placeholder="Type your message here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </div>
      </div>

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={handleOpenChange}
        activeTab={activeTab}
        theme={theme || "system"}
        language={"en"}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
};

export default QueryAssistant;
