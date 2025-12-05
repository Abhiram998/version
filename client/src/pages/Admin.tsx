import { useState, useEffect } from "react";
import { useParking, ParkingZone } from "@/lib/parking-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Bus, Truck, Car } from "lucide-react";

export default function Admin() {
  const { zones, totalCapacity, totalOccupied } = useParking();
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getVehicleIcon = (type: string) => {
    switch(type) {
      case 'heavy': return <Bus className="w-4 h-4" />;
      case 'medium': return <Truck className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  // Mock predicted occupancy
  const predictedOccupancy = Math.min(Math.round(totalOccupied * 1.2), totalCapacity);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      {/* Header */}
      <div className="mb-8 border-b border-white/20 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Nilakkal Parking – Live Admin Dashboard</h1>
        <div className="text-sm text-white/60">CONTROL ROOM • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}</div>
      </div>

      {/* Top Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-white p-4">
          <div className="text-xs uppercase tracking-widest mb-2 text-white/70">Total Vehicles Inside</div>
          <div className="text-4xl font-bold">{totalOccupied}</div>
        </div>
        <div className="border border-white p-4">
          <div className="text-xs uppercase tracking-widest mb-2 text-white/70">Total Capacity</div>
          <div className="text-4xl font-bold">{totalCapacity}</div>
        </div>
        <div className="border border-white p-4">
          <div className="text-xs uppercase tracking-widest mb-2 text-white/70">Tomorrow's Predicted Occupancy</div>
          <div className="text-4xl font-bold text-white">{predictedOccupancy}</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white">
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold">Zone Name</th>
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold text-right">Current Vehicles</th>
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold text-right">Total Capacity</th>
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold text-right">Vacant Slots</th>
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold text-center">Status</th>
              <th className="p-4 uppercase tracking-wider border-r border-white font-bold text-right">Last Updated</th>
              <th className="p-4 uppercase tracking-wider font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => {
              const vacant = zone.capacity - zone.occupied;
              const isFull = vacant === 0;
              
              return (
                <tr key={zone.id} className="border-b border-white/20 hover:bg-white/5 transition-colors">
                  <td className="p-4 border-r border-white/20 font-bold text-lg">{zone.name} ({zone.id})</td>
                  <td className="p-4 border-r border-white/20 text-right font-mono text-lg">{zone.occupied}</td>
                  <td className="p-4 border-r border-white/20 text-right font-mono text-lg">{zone.capacity}</td>
                  <td className="p-4 border-r border-white/20 text-right font-mono text-lg text-green-500">{vacant}</td>
                  <td className="p-4 border-r border-white/20 text-center">
                    <span className={`px-3 py-1 text-sm font-bold border ${
                      isFull 
                        ? "border-red-500 text-red-500" 
                        : "border-green-500 text-green-500"
                    }`}>
                      {isFull ? "FULL" : "FREE"}
                    </span>
                  </td>
                  <td className="p-4 border-r border-white/20 text-right font-mono text-sm">
                    {currentTime.toLocaleTimeString()}
                  </td>
                  <td className="p-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedZone(zone)}
                      className="h-8 w-8 p-0 text-white hover:text-black hover:bg-white rounded-none border border-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vehicle Details Dialog */}
      <Dialog open={!!selectedZone} onOpenChange={(open) => !open && setSelectedZone(null)}>
        <DialogContent className="bg-black border border-white text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl uppercase tracking-wider font-bold border-b border-white pb-4">
              Zone {selectedZone?.id} - Vehicle Manifest
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
             {selectedZone?.vehicles.length === 0 ? (
                <div className="text-center py-8 text-white/50 uppercase tracking-widest border border-white/20">
                  No vehicles currently parked
                </div>
             ) : (
               <div className="border border-white">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-white bg-white/10">
                       <th className="p-3 uppercase text-xs tracking-wider">Type</th>
                       <th className="p-3 uppercase text-xs tracking-wider">Vehicle No</th>
                       <th className="p-3 uppercase text-xs tracking-wider">Ticket ID</th>
                       <th className="p-3 uppercase text-xs tracking-wider text-right">Entry Time</th>
                     </tr>
                   </thead>
                   <tbody>
                     {selectedZone?.vehicles.map((v, i) => (
                       <tr key={i} className="border-b border-white/20 hover:bg-white/5">
                         <td className="p-3">
                           <div className="flex items-center gap-2">
                              {getVehicleIcon(v.type)}
                              <span className="uppercase text-xs">{v.type}</span>
                           </div>
                         </td>
                         <td className="p-3 font-mono font-bold">{v.number}</td>
                         <td className="p-3 font-mono text-sm opacity-70">{v.ticketId}</td>
                         <td className="p-3 font-mono text-sm text-right">
                            {v.entryTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
