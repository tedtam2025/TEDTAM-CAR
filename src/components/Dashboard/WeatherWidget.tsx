
import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const WeatherWidget: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange" />
              <span className="text-sm">ขอนแก่น</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="w-6 h-6 text-orange" />
              <span className="text-xl font-bold">32°C</span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-white/80">แจ่มใส เหมาะสำหรับการลงพื้นที่</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
