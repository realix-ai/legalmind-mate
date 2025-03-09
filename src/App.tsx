
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from "./pages/Index"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import QueryAssistant from "./pages/QueryAssistant"
import DocumentDrafting from "./pages/DocumentDrafting"
import CaseManagement from "./pages/CaseManagement"
import CaseAnalytics from "./pages/CaseAnalytics"
import CaseChat from "./pages/CaseChat"
import NotFound from "./pages/NotFound"
import { AiAssistantProvider } from "./contexts/AiAssistantContext";
import { AuthProvider } from "./contexts/AuthContext";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";

const queryClient = new QueryClient();

function App() {
  console.log('App component rendered');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <AiAssistantProvider>
            <TooltipProvider>
              <RouterProvider router={
                createBrowserRouter([
                  {
                    path: '/',
                    element: <Index />
                  },
                  {
                    path: '/login',
                    element: <Login />
                  },
                  {
                    path: '/signup',
                    element: <SignUp />
                  },
                  {
                    path: '/query-assistant',
                    element: <AuthenticatedRoute><QueryAssistant /></AuthenticatedRoute>
                  },
                  {
                    path: '/document-drafting',
                    element: <AuthenticatedRoute><DocumentDrafting /></AuthenticatedRoute>
                  },
                  {
                    path: '/document-drafting/:documentId',
                    element: <AuthenticatedRoute><DocumentDrafting /></AuthenticatedRoute>
                  },
                  {
                    path: '/case-management',
                    element: <AuthenticatedRoute><CaseManagement /></AuthenticatedRoute>
                  },
                  {
                    path: '/case-analytics',
                    element: <AuthenticatedRoute><CaseAnalytics /></AuthenticatedRoute>
                  },
                  {
                    path: '/case-chat/:caseId',
                    element: <AuthenticatedRoute><CaseChat /></AuthenticatedRoute>
                  },
                  {
                    path: '*',
                    element: <NotFound />
                  }
                ])
              } />
            </TooltipProvider>
          </AiAssistantProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
