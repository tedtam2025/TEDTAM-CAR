import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Search, Filter, Car, Phone, Route } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types/customer';
import { SimpleMap } from './SimpleMap';

export const MapView: React.FC = () => {
  const { customers, loading } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 13.7563, lng: 100.5018 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const customersWithLocation = customers.filter(
    customer => customer.latitude && customer.longitude && customer.latitude !== 0 && customer.longitude !== 0
  );

  const filteredCustomers = customersWithLocation.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.accountNumber.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'จบ':
      case 'CURED':
        return 'bg-emerald-500';
      case 'DR':
        return 'bg-blue-500';
      case 'ตบเด้ง':
        return 'bg-yellow-500';
      case 'REPO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getWorkStatusBadge = (status: string) => {
    const colors = {
      'ลงพื้นที่': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'นัดหมาย': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'ไม่จบ': 'bg-red-500/20 text-red-300 border-red-500/30',
      'จบ': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const openNavigation = (customer: Customer) => {
    const url = `https://www.google.com/maps/dir/${userLocation?.lat || ''},${userLocation?.lng || ''}/${customer.latitude},${customer.longitude}`;
    window.open(url, '_blank');
  };

  const callCustomer = (phoneNumbers: string[] | undefined) => {
    if (phoneNumbers && phoneNumbers.length > 0) {
      window.open(`tel:${phoneNumbers[0]}`, '_self');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">กำลังโหลดแผนที่...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <motion.div
        className="text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <MapPin className="w-8 h-8 text-orange" />
            แผนที่ลูกค้า
          </h1>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-orange">{customersWithLocation.length}</div>
              <div className="text-xs text-white/70">มีพิกัด</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-green-400">
                {customersWithLocation.filter(c => c.workStatus === 'จบ').length}
              </div>
              <div className="text-xs text-white/70">จบแล้ว</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-blue-400">
                {customersWithLocation.filter(c => c.workStatus === 'ลงพื้นที่').length}
              </div>
              <div className="text-xs text-white/70">ลงพื้นที่</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-lg font-bold text-yellow-400">
                {customersWithLocation.filter(c => c.workStatus === 'นัดหมาย').length}
              </div>
              <div className="text-xs text-white/70">นัดหมาย</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
        <Input
          placeholder="ค้นหาลูกค้า, ที่อยู่, เลขสัญญา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50 rounded-xl"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <Button
          onClick={getCurrentLocation}
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-xs">ตำแหน่งฉัน</span>
        </Button>
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Route className="w-4 h-4" />
          <span className="text-xs">วางแผน</span>
        </Button>
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs">เลเยอร์</span>
        </Button>
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Filter className="w-4 h-4" />
          <span className="text-xs">ตัวกรอง</span>
        </Button>
      </div>

      {/* Interactive Map */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6 h-80">
        <SimpleMap
          customers={filteredCustomers}
          center={mapCenter}
          userLocation={userLocation}
          onCustomerSelect={setSelectedCustomer}
        />
      </Card>

      {/* Customer List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">ลูกค้าในพื้นที่</h3>
          <Badge className="bg-orange/20 text-orange border-orange/30">
            {filteredCustomers.length} รายการ
          </Badge>
        </div>
        
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.UID}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedCustomer(customer)}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4 cursor-pointer hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{customer.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(customer.resus)}`}></div>
                    <Badge className={getWorkStatusBadge(customer.workStatus)}>
                      {customer.workStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/70 mb-1">{customer.address}</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{customer.accountNumber}</span>
                    <span>{customer.branch}</span>
                    <span>฿{customer.principle.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openNavigation(customer);
                    }}
                    className="bg-orange hover:bg-orange/90"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    นำทาง
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ข้อมูลลูกค้า</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCustomer(null)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ปิด
            </Button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-white/50">ชื่อ-นามสกุล</p>
                <p className="font-medium">{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="text-sm text-white/50">เลขที่สัญญา</p>
                <p className="font-medium">{selectedCustomer.accountNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-orange" />
              <div>
                <p className="font-medium">{selectedCustomer.brand} {selectedCustomer.model}</p>
                <p className="text-sm text-white/70">{selectedCustomer.licensePlate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-white/50">เงินต้น</p>
                <p className="font-semibold text-emerald-400">
                  ฿{selectedCustomer.principle.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50">ค่าคอม</p>
                <p className="font-semibold text-orange">
                  ฿{selectedCustomer.commission.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-white/50">สถานะงาน</p>
                <Badge className={getWorkStatusBadge(selectedCustomer.workStatus)}>
                  {selectedCustomer.workStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-white/50">สถานะ RESUS</p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {selectedCustomer.resus}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => callCustomer(selectedCustomer.phoneNumbers)}
                className="bg-emerald-500 hover:bg-emerald-600 flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                โทร
              </Button>
              <Button 
                size="sm" 
                onClick={() => openNavigation(selectedCustomer)}
                className="bg-orange hover:bg-orange/90 flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                นำทาง
              </Button>
            </div>
          </div>
        </Card>
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <h3 className="text-lg font-semibold text-white mb-2">ไม่พบลูกค้าในพื้นที่</h3>
            <p className="text-white/70">
              {searchTerm ? 'ลองเปลี่ยนคำค้นหา' : 'ยังไม่มีลูกค้าที่มีข้อมูลพิกัด'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
