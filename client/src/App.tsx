import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ParkingProvider, useParking } from "@/lib/parking-context";
import ThemeWrapper from "@/components/shared/ThemeWrapper";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Report from "@/pages/Report";
import Backup from "@/pages/Backup";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import AdminProfile from "@/pages/AdminProfile";
import AreaDetails from "@/pages/AreaDetails";
import Predictions from "@/pages/Predictions";
import Ticket from "@/pages/Ticket";
import Profile from "@/pages/Profile";
import QRCode from "@/pages/QRCode";
import NotFound from "@/pages/not-found";
import PoliceBackup, { VehicleRecord } from "@/components/PoliceBackup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/report" component={Report} />
      <Route path="/backup" component={Backup} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/profile" component={AdminProfile} />
      <Route path="/zone/:id" component={AreaDetails} />
      <Route path="/predictions" component={Predictions} />
      <Route path="/ticket" component={Ticket} />
      <Route path="/qr-code" component={QRCode} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Integration Example Component
function PoliceBackupDemo() {
  const { zones, restoreData } = useParking();

  // Convert app state to VehicleRecord[]
  const getRecords = (): VehicleRecord[] => {
    return zones.flatMap(zone => 
      zone.vehicles.map(v => ({
        plate: v.number,
        zone: zone.name,
        timeIn: v.entryTime.toISOString(),
        timeOut: null
      }))
    );
  };

  return (
    <div className="mt-8 border-t border-border pt-8 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Admin: Offline Backup System</h3>
        <PoliceBackup 
          getRecords={getRecords} 
          onRestore={restoreData} 
          appName="nilakkal-police" 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ParkingProvider>
          <Toaster />
          <ThemeWrapper>
            <Layout>
              <Router />
              {/* Render PoliceBackup integration example at the bottom of the main UI */}
              <PoliceBackupDemo />
            </Layout>
          </ThemeWrapper>
        </ParkingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;