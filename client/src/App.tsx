import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { V0ChatDemo } from "@/components/v0-chat-demo";
import { BackgroundBeamsDemo } from "@/components/background-beams-demo";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={BackgroundBeamsDemo}/>
      <Route path="/~" component={V0ChatDemo}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
