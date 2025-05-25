
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers, Locate } from 'lucide-react';
import { Customer } from '@/types/customer';

interface SimpleMapProps {
  customers: Customer[];
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number } | null;
  onCustomerSelect?: (customer: Customer) => void;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  customers,
  center,
  userLocation,
  onCustomerSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [mapStyle, setMapStyle] = useState('satellite');

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    onCustomerSelect?.(customer);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'จบ':
      case 'CURED':
        return '#10b981'; // emerald-500
      case 'DR':
        return '#3b82f6'; // blue-500
      case 'ตบเด้ง':
        return '#f59e0b'; // amber-500
      case 'REPO':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const toggleMapStyle = () => {
    setMapStyle(current => current === 'satellite' ? 'street' : 'satellite');
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
      {/* Map Container with GPS-like styling */}
      <div ref={mapRef} className="absolute inset-0">
        {/* GPS Grid Background */}
        <div className="absolute inset-0">
          {mapStyle === 'satellite' ? (
            // Satellite view simulation
            <div 
              className="w-full h-full bg-gradient-to-br from-emerald-900/30 via-blue-900/40 to-slate-900/50"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px, 60px 60px, 20px 20px, 20px 20px'
              }}
            />
          ) : (
            // Street view simulation
            <div 
              className="w-full h-full bg-gradient-to-br from-amber-100/10 to-slate-200/10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '25px 25px'
              }}
            />
          )}
        </div>

        {/* GPS Coordinate Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Latitude lines */}
          {[20, 40, 60, 80].map(percentage => (
            <div
              key={`lat-${percentage}`}
              className="absolute w-full border-t border-emerald-400/20"
              style={{ top: `${percentage}%` }}
            />
          ))}
          {/* Longitude lines */}
          {[20, 40, 60, 80].map(percentage => (
            <div
              key={`lng-${percentage}`}
              className="absolute h-full border-l border-emerald-400/20"
              style={{ left: `${percentage}%` }}
            />
          ))}
        </div>

        {/* GPS Crosshair Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-emerald-400/60 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-emerald-400/60 transform -translate-y-1/2 -translate-x-full"></div>
            <div className="absolute top-1/2 right-0 w-4 h-0.5 bg-emerald-400/60 transform -translate-y-1/2 translate-x-full"></div>
            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-emerald-400/60 transform -translate-x-1/2 -translate-y-full"></div>
            <div className="absolute left-1/2 bottom-0 w-0.5 h-4 bg-emerald-400/60 transform -translate-x-1/2 translate-y-full"></div>
          </div>
        </div>

        {/* User Location with GPS styling */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <Locate className="w-3 h-3 text-white" />
              </div>
              <div className="absolute inset-0 w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
              <div className="absolute -inset-2 w-10 h-10 border border-blue-500/40 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Customer Markers with GPS styling */}
        {customers.map((customer, index) => {
          if (!customer.latitude || !customer.longitude) return null;
          
          // Enhanced positioning calculation
          const xOffset = (customer.longitude - center.lng) * 800;
          const yOffset = (center.lat - customer.latitude) * 800;
          
          return (
            <div
              key={customer.UID}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                left: `${Math.max(5, Math.min(95, 50 + (xOffset / 10)))}%`,
                top: `${Math.max(5, Math.min(95, 50 + (yOffset / 10)))}%`
              }}
              onClick={() => handleCustomerClick(customer)}
            >
              <div className="relative group">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ backgroundColor: getStatusColor(customer.resus) }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                
                {/* GPS Signal Animation */}
                <div className="absolute inset-0 w-8 h-8 border border-white/30 rounded-full animate-ping"></div>
                
                {/* Enhanced Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-white/80">{customer.resus}</div>
                    <div className="text-emerald-400">฿{customer.commission.toLocaleString()}</div>
                  </div>
                  <div className="w-2 h-2 bg-black/90 transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button 
          onClick={toggleMapStyle}
          className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/20"
        >
          <Layers className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/20">
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      {/* GPS Info Panel */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-lg border border-emerald-400/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-mono">GPS ACTIVE</span>
          </div>
          <div className="space-y-1">
            <div>ลูกค้า: {customers.length} ราย</div>
            <div className="font-mono">LAT: {center.lat.toFixed(4)}</div>
            <div className="font-mono">LNG: {center.lng.toFixed(4)}</div>
            <div className="text-emerald-400">สถานะ: {mapStyle.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2 border border-white/20">
          <div className="font-semibold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            สถานะลูกค้า
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
            <span className="text-white">CURED/จบ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
            <span className="text-white">DR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border border-white"></div>
            <span className="text-white">ตบเด้ง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span className="text-white">REPO</span>
          </div>
        </div>
      </div>

      {/* GPS Scanning Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};
