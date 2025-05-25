
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar, Users, BarChart3, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';

export const PerformanceView: React.FC = () => {
  const { customers, loading } = useCustomers();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate performance metrics
  const totalCustomers = customers.length;
  const completedCases = customers.filter(c => c.workStatus === 'จบ').length;
  const curedCases = customers.filter(c => c.resus === 'CURED').length;
  const repoCases = customers.filter(c => c.resus === 'REPO').length;
  const drCases = customers.filter(c => c.resus === 'DR').length;
  
  const totalPrinciple = customers.reduce((sum, c) => sum + c.principle, 0);
  const totalCommission = customers.reduce((sum, c) => sum + c.commission, 0);
  const completionRate = totalCustomers > 0 ? (completedCases / totalCustomers) * 100 : 0;
  const curedRate = totalCustomers > 0 ? (curedCases / totalCustomers) * 100 : 0;

  // Group by branch/team
  const branchStats = customers.reduce((acc, customer) => {
    const branch = customer.branch;
    if (!acc[branch]) {
      acc[branch] = { total: 0, completed: 0, principle: 0, commission: 0 };
    }
    acc[branch].total += 1;
    if (customer.workStatus === 'จบ') acc[branch].completed += 1;
    acc[branch].principle += customer.principle;
    acc[branch].commission += customer.commission;
    return acc;
  }, {} as Record<string, any>);

  const teamStats = customers.reduce((acc, customer) => {
    const team = customer.fieldTeam;
    if (!acc[team]) {
      acc[team] = { total: 0, completed: 0, principle: 0, commission: 0 };
    }
    acc[team].total += 1;
    if (customer.workStatus === 'จบ') acc[team].completed += 1;
    acc[team].principle += customer.principle;
    acc[team].commission += customer.commission;
    return acc;
  }, {} as Record<string, any>);

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">กำลังโหลดข้อมูลผลงาน...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        className="text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange" />
            ผลงานของฉัน
          </h1>
          
          {/* Period Selection */}
          <div className="flex gap-2 justify-center mb-6">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period 
                  ? "bg-orange hover:bg-orange/90 text-white" 
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              >
                {period === 'week' && 'สัปดาห์'}
                {period === 'month' && 'เดือน'}
                {period === 'quarter' && 'ไตรมาส'}
                {period === 'year' && 'ปี'}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-orange" />
            <div>
              <p className="text-sm text-white/70">อัตราความสำเร็จ</p>
              <p className="text-2xl font-bold text-orange">{completionRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            {completedCases} จาก {totalCustomers} เคส
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-sm text-white/70">อัตรา CURED</p>
              <p className="text-2xl font-bold text-emerald-400">{curedRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            {curedCases} เคสที่รักษาสำเร็จ
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-white/70">เงินต้นรวม</p>
              <p className="text-xl font-bold text-blue-400">
                ฿{(totalPrinciple / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            จากลูกค้า {totalCustomers} ราย
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <PieChart className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-white/70">ค่าคอมมิชชั่น</p>
              <p className="text-xl font-bold text-yellow-400">
                ฿{totalCommission.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            รายได้ประจำเดือน
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-orange" />
          สถานะลูกค้า
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">CURED</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                {curedCases}
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${curedRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">DR</span>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {drCases}
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${totalCustomers > 0 ? (drCases / totalCustomers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">REPO</span>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                {repoCases}
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${totalCustomers > 0 ? (repoCases / totalCustomers) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">จบแล้ว</span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                {completedCases}
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Performance */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange" />
          ผลงานตามทีม
        </h3>
        <div className="space-y-3">
          {Object.entries(teamStats).map(([team, stats]: [string, any]) => (
            <div key={team} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{team}</h4>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {stats.total} เคส
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-white/50">สำเร็จ</p>
                  <p className="font-semibold text-emerald-400">{stats.completed}</p>
                </div>
                <div>
                  <p className="text-white/50">เงินต้น</p>
                  <p className="font-semibold text-blue-400">
                    ฿{(stats.principle / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-white/50">คอมมิชชั่น</p>
                  <p className="font-semibold text-orange">
                    ฿{stats.commission.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Goals */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange" />
          เป้าหมายประจำเดือน
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">เป้าหมายเคส</span>
              <span className="text-sm text-orange">100 เคส</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-orange h-3 rounded-full" 
                style={{ width: `${Math.min((totalCustomers / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-white/50">
              ปัจจุบัน: {totalCustomers} เคส ({((totalCustomers / 100) * 100).toFixed(1)}%)
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">เป้าหมายรายได้</span>
              <span className="text-sm text-orange">฿50,000</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
              <div 
                className="bg-orange h-3 rounded-full" 
                style={{ width: `${Math.min((totalCommission / 50000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-white/50">
              ปัจจุบัน: ฿{totalCommission.toLocaleString()} ({((totalCommission / 50000) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
