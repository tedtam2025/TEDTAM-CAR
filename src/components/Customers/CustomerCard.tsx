
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Car, Edit, Trash2, Star, TrendingUp, Building, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/customer';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'จบ':
      case 'CURED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'DR':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ตบเด้ง':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'REPO':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getWorkStatusColor = (status: string) => {
    switch (status) {
      case 'จบ':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ลงพื้นที่':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'นัดหมาย':
        return 'bg-orange/20 text-orange border-orange/30';
      case 'ไม่จบ':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Calculate customer score based on principle amount and status
  const calculateScore = () => {
    let score = 0;
    if (customer.workStatus === 'จบ') score += 40;
    if (customer.resus === 'CURED') score += 30;
    if (customer.principle > 500000) score += 20;
    if (customer.commission > 10000) score += 10;
    return Math.min(score, 100);
  };

  const customerScore = calculateScore();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="p-5 relative">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-white">{customer.name}</h3>
                <div className="flex items-center gap-1 bg-orange/20 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-orange fill-orange" />
                  <span className="text-xs font-semibold text-orange">{customerScore}</span>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-1">{customer.registrationId}</p>
              <p className="text-xs text-white/50">#{customer.accountNumber}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={getStatusColor(customer.resus)}>
                {customer.resus}
              </Badge>
              <Badge className={getWorkStatusColor(customer.workStatus)}>
                {customer.workStatus}
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/50">เงินต้น</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                ฿{(customer.principle / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-orange" />
                <span className="text-xs text-white/50">ค่าคอม</span>
              </div>
              <p className="text-lg font-bold text-orange">
                ฿{customer.commission.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Team & Branch Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-white/50">ทีมงาน</p>
                <p className="text-sm font-medium text-blue-400">{customer.fieldTeam}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-white/50">สาขา</p>
                <p className="text-sm font-medium text-purple-400">{customer.branch}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-lg">
            <Car className="w-5 h-5 text-orange flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {customer.brand} {customer.model}
              </p>
              <p className="text-xs text-white/70">{customer.licensePlate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50">ราคาตามบุ๊ค</p>
              <p className="text-sm font-medium text-white">
                ฿{(customer.blueBookPrice / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/70 line-clamp-2 flex-1">{customer.address}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 rounded-lg h-9"
            >
              <Phone className="w-4 h-4 mr-1" />
              โทร
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20 rounded-lg h-9"
            >
              <MapPin className="w-4 h-4 mr-1" />
              นำทาง
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-orange/10 border-orange/20 text-orange hover:bg-orange/20 rounded-lg h-9"
            >
              <Edit className="w-4 h-4 mr-1" />
              แก้ไข
            </Button>
          </div>

          {/* Last Visit Result */}
          {customer.lastVisitResult && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange rounded-full"></div>
                <p className="text-xs text-white/50 font-medium">ผลการเยี่ยมล่าสุด</p>
              </div>
              <p className="text-xs text-white/80 bg-white/5 rounded-lg p-2">
                {customer.lastVisitResult}
              </p>
            </div>
          )}

          {/* Work Group Badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className={`text-xs ${customer.workGroup === '6090' 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}
            >
              {customer.workGroup}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
