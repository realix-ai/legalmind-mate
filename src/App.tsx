
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import DocumentDrafting from './pages/DocumentDrafting';
import CaseManagement from './pages/CaseManagement';
import CaseChat from './pages/CaseChat';
import QueryAssistant from './pages/QueryAssistant';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/AuthRoutes';
import './App.css';

const queryClient = new QueryClient();

// Simple conditional auth wrapper
const ConditionalAuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useAuth();
  
  // If Clerk isn't loaded yet, render a loading state
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading auth...</div>;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            {/* Public routes accessible to everyone */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes - only accessible when not signed in */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            {/* Protected routes - wrapped in conditional auth */}
            <Route element={
              <ConditionalAuthWrapper>
                <ProtectedRoute />
              </ConditionalAuthWrapper>
            }>
              <Route path="/document-drafting" element={<DocumentDrafting />} />
              <Route path="/document-drafting/:templateId" element={<DocumentDrafting />} />
              <Route path="/document-drafting/edit/:documentId" element={<DocumentDrafting />} />
              <Route path="/case-management" element={<CaseManagement />} />
              <Route path="/case-chat/:caseId" element={<CaseChat />} />
              <Route path="/query-assistant" element={<QueryAssistant />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
