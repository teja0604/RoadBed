import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Listing from "./pages/Listing";
import Auth from "./pages/Auth";
import MapSearch from "./pages/MapSearch";
import RentAgreement from "./pages/RentAgreement";
import PropertyComparison from "./pages/PropertyComparison";
import RentPrediction from "./pages/RentPrediction";
import KYC from "./pages/KYC";
import ScheduleVisit from "./pages/ScheduleVisit";
import Profile from "./pages/Profile";
import HostDashboard from "./pages/HostDashboard";
import Favorites from "./pages/Favorites";
import Plans from "./pages/Plans";
import Payments from "./pages/Payments";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import HelpCenter from "./pages/HelpCenter";
import SafetyTips from "./pages/SafetyTips";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminKYCReview from "./pages/Admin/KYCReview";
import OwnerDashboard from "./pages/Owner/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/map-search" element={<MapSearch />} />
          <Route path="/rent-agreement" element={<RentAgreement />} />
          <Route path="/compare" element={<PropertyComparison />} />
          <Route path="/rent-prediction" element={<RentPrediction />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/schedule-visit" element={<ScheduleVisit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/kyc" element={<AdminKYCReview />} />
          {/* Owner Routes */}
          <Route path="/owner" element={<OwnerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;