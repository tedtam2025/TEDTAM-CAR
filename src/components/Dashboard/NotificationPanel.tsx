
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const notifications = [
  {
    icon: AlertTriangle,
    title: 'งานด่วน',
    message: 'มี 3 ลูกค้า B3 ต้องติดตามด่วน',
    time: '10 นาทีที่แล้ว',
    color: 'text-red-500'
  },
  {
    icon: Calendar,
    title: 'นัดหมาย',
    message: 'นัดคุณสมชาย ใจดี วันนี้ 14:00',
    time: '30 นาทีที่แล้ว',
    color: 'text-blue-500'
  },
  {
    icon: Bell,
    title: 'อัพเดท',
    message: 'ระบบมีการอัพเดทใหม่',
    time: '1 ชั่วโมงที่แล้ว',
    color: 'text-green-500'
  }
];

export const NotificationPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <div className="p-4">
          <h3 className="font-semibold text-white mb-3">การแจ้งเตือน</h3>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div className={`p-1 rounded ${notif.color}`}>
                  <notif.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{notif.title}</p>
                  <p className="text-xs text-white/70 truncate">{notif.message}</p>
                  <p className="text-xs text-white/50 mt-1">{notif.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
