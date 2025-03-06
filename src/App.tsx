
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import {
  createBrowserRouter,
  RouterProvider,
  Link
} from "react-router-dom";
import { Scale } from "lucide-react";

import Index from "./pages/Index"
import QueryAssistant from "./pages/QueryAssistant"
import DocumentDrafting from "./pages/DocumentDrafting"
import CaseManagement from "./pages/CaseManagement"
import CaseAnalytics from "./pages/CaseAnalytics"
import CaseChat from "./pages/CaseChat"
import NotFound from "./pages/NotFound"

// Use a default key for development if the environment variable isn't set
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder_key";

const queryClient = new QueryClient();

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <RouterProvider router={
            createBrowserRouter([
              {
                path: '/',
                element: <Index />
              },
              {
                path: '/query-assistant',
                element: <QueryAssistant />
              },
              {
                path: '/document-drafting',
                element: <DocumentDrafting />
              },
              {
                path: '/case-management',
                element: <CaseManagement />
              },
              {
                path: '/case-analytics',
                element: <CaseAnalytics />
              },
              {
                path: '/case-chat/:caseId',
                element: <CaseChat />
              },
              {
                path: '*',
                element: <NotFound />
              }
            ])
          } />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
