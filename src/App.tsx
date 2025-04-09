
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import UploadLeadsPage from "./pages/UploadLeadsPage";
import ScoringRulesPage from "./pages/ScoringRulesPage";
import LeadExplorerPage from "./pages/LeadExplorerPage";
import IngestionHistoryPage from "./pages/IngestionHistoryPage";
import LeadAnalyticsPage from "./pages/LeadAnalyticsPage";
import LeadAssignmentPage from "./pages/LeadAssignmentPage";
import CdpAttributesPage from "./pages/CdpAttributesPage";
import AttributeVisibilityPage from "./pages/AttributeVisibilityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/lead-explorer" replace />} />
          <Route path="upload" element={<UploadLeadsPage />} />
          <Route path="scoring-rules" element={<ScoringRulesPage />} />
          <Route path="lead-explorer" element={<LeadExplorerPage />} />
          <Route path="ingestion-history" element={<IngestionHistoryPage />} />
          <Route path="lead-analytics" element={<LeadAnalyticsPage />} />
          <Route path="lead-assignment" element={<LeadAssignmentPage />} />
          <Route path="cdp-attributes" element={<CdpAttributesPage />} />
          <Route path="attribute-visibility" element={<AttributeVisibilityPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
