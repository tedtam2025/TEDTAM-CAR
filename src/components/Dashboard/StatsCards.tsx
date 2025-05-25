
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCustomers } from '@/hooks/useCustomers';

export const StatsCards: React.FC = () => {
  const { customers, loading } = useCustomers();

  // Calculate real statistics from customer data
  const totalCustomers = customers.length;
  const completedCases = customers.filter(c => c.workStatus === 'จบ').length;
  const curedCases = customers.filter(c => c.resus === 'CURED').length;
  const urgentCases = customers.filter(c => c.workStatus === 'ลงพื้นที่' || c.workStatus === 'ไม่จบ').length;
  
  const curedPercent = totalCustomers > 0 ? Math.round((curedCases / totalCustomers) * 100) : 0;
  const completionRate = totalCustomers > 0 ? Math.round((completedCases / totalCustomers) * 100) : 0;

  const stats = [
    {
      title: 'ลูกค้าทั้งหมด',
      value: loading ? '...' : totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      change: loading ? '' : `${totalCustomers}`
    },
    {
      title: 'จบงาน (CURED)',
      value: loading ? '...' : `${curedPercent}%`,
      icon: Target,
      color: 'bg-green-500',
      change: loading ? '' : `${curedCases} เคส`
    },
    {
      title: 'ผลงานวันนี้',
      value: loading ? '...' : `${completedCases}/${totalCustomers}`,
      icon: TrendingUp,
      color: 'bg-orange',
      change: loading ? '' : `${completionRate}%`
    },
    {
      title: 'งานด่วน',
      value: loading ? '...' : urgentCases.toString(),
      icon: AlertCircle,
      color: 'bg-red-500',
      change: loading ? '' : 'รายการ'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">{stat.title}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
