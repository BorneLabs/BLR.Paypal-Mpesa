import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Handle GitHub Pages path redirects
function handleRedirects() {
  // Check if we have a redirect stored in sessionStorage
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    window.history.replaceState(null, '', redirect);
  }
  
  // Handle redirects from query parameter
  const query = window.location.search.substr(1);
  const params = query.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    if (key) acc[key] = value || '';
    return acc;
  }, {} as Record<string, string>);
  
  if (params.redirect) {
    window.history.replaceState(null, '', params.redirect);
  }
}

const App = () => {
  useEffect(() => {
    handleRedirects();
  }, []);

  // Get the base URL from the environment or use the repo name from location
  const getBaseUrl = () => {
    // If we're on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      const pathSegments = window.location.pathname.split('/');
      return pathSegments.length > 1 ? `/${pathSegments[1]}` : '/';
    }
    // Otherwise use the environment variable or default to "/"
    return import.meta.env.BASE_URL || "/";
  };

  const baseUrl = getBaseUrl();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={baseUrl}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
