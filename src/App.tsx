
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import UploadLeadsPage from "./pages/UploadLeadsPage";
import ScoringRulesPage from "./pages/ScoringRulesPage";
import LeadExplorerPage from "./pages/LeadExplorerPage";
import IngestionHistoryPage from "./pages/IngestionHistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/lead-explorer" replace />} />
            <Route path="upload" element={<UploadLeadsPage />} />
            <Route path="scoring-rules" element={<ScoringRulesPage />} />
            <Route path="lead-explorer" element={<LeadExplorerPage />} />
            <Route path="ingestion-history" element={<IngestionHistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
