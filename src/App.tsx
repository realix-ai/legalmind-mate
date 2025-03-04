
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import QueryAssistant from "./pages/QueryAssistant";
import DocumentDrafting from "./pages/DocumentDrafting";
import CaseManagement from "./pages/CaseManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/query-assistant" element={<QueryAssistant />} />
            <Route path="/document-drafting" element={<DocumentDrafting />} />
            <Route path="/case-management" element={<CaseManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
