
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, QrCode, Camera, Mic, MapPin, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

const actions = [
  { icon: Plus, label: 'เพิ่มลูกค้า', color: 'bg-green-500' },
  { icon: QrCode, label: 'สแกน QR', color: 'bg-blue-500' },
  { icon: Camera, label: 'ถ่ายภาพ', color: 'bg-purple-500' },
  { icon: Mic, label: 'บันทึกเสียง', color: 'bg-red-500' },
  { icon: MapPin, label: 'ตำแหน่ง', color: 'bg-orange' },
  { icon: FileText, label: 'รายงาน', color: 'bg-indigo-500' },
];

export const QuickActions: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <div className="p-4">
          <h3 className="font-semibold text-white mb-3">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-3 gap-3">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className="flex flex-col items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className={`p-2 rounded-lg ${action.color} mb-2`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-center">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
