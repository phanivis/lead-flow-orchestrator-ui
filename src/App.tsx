
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import UploadLeadsPage from "./pages/UploadLeadsPage";
import FieldMappingPage from "./pages/FieldMappingPage";
import ScoringRulesPage from "./pages/ScoringRulesPage";
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
            <Route index element={<Navigate to="/upload" replace />} />
            <Route path="upload" element={<UploadLeadsPage />} />
            <Route path="field-mapping" element={<FieldMappingPage />} />
            <Route path="scoring-rules" element={<ScoringRulesPage />} />
            {/* Lead Explorer page has been removed */}
            {/* Add routes for additional pages here */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
