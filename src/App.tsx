
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from "./pages/Index"
import QueryAssistant from "./pages/QueryAssistant"
import DocumentDrafting from "./pages/DocumentDrafting"
import CaseManagement from "./pages/CaseManagement"
import CaseAnalytics from "./pages/CaseAnalytics"
import CaseChat from "./pages/CaseChat"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient();

function App() {
  console.log('App component rendered');
  
  return (
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
  );
}

export default App;
