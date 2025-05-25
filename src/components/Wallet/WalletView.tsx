
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, CreditCard, Calendar, Plus, History, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed';
  customerName?: string;
}

export const WalletView: React.FC = () => {
  const { customers, loading } = useCustomers();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Calculate financial metrics from customers
  const totalCommission = customers.reduce((sum, c) => sum + c.commission, 0);
  const completedCases = customers.filter(c => c.workStatus === 'จบ');
  const earnedCommission = completedCases.reduce((sum, c) => sum + c.commission, 0);
  const pendingCommission = totalCommission - earnedCommission;
  
  // Mock transaction data based on customers
  useEffect(() => {
    const mockTransactions: Transaction[] = customers
      .filter(c => c.workStatus === 'จบ')
      .slice(0, 10)
      .map((customer, index) => ({
        id: `tx-${customer.UID}`,
        type: 'income' as const,
        amount: customer.commission,
        description: `ค่าคอมมิชชั่นจากลูกค้า ${customer.name}`,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed' as const,
        customerName: customer.name
      }));
    
    setTransactions(mockTransactions);
  }, [customers]);

  // Calculate monthly income
  const currentMonth = new Date().getMonth();
  const monthlyIncome = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth && t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return transactionDate >= weekAgo && t.type === 'income' && t.status === 'completed';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">กำลังโหลดข้อมูลกระเป๋าเงิน...</h2>
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
            <Wallet className="w-8 h-8 text-orange" />
            กระเป๋าเงิน
          </h1>
          
          {/* Balance Display */}
          <div className="bg-gradient-to-r from-orange/20 to-yellow-500/20 rounded-2xl p-6 border border-orange/30">
            <div className="text-center">
              <p className="text-sm text-white/70 mb-2">ยอดเงินรวม</p>
              <p className="text-3xl font-bold text-orange mb-4">
                ฿{earnedCommission.toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/50">รายได้เดือนนี้</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    ฿{monthlyIncome.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/50">รายได้สัปดาห์นี้</p>
                  <p className="text-lg font-semibold text-blue-400">
                    ฿{weeklyIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-sm text-white/70">ค่าคอมที่ได้รับ</p>
              <p className="text-xl font-bold text-emerald-400">
                ฿{earnedCommission.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            จาก {completedCases.length} เคสที่เสร็จสิ้น
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-white/70">ค่าคอมรอรับ</p>
              <p className="text-xl font-bold text-yellow-400">
                ฿{pendingCommission.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-xs text-white/50">
            จากเคสที่ยังไม่เสร็จ
          </div>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange" />
          รายละเอียดค่าคอมมิชชั่น
        </h3>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">ความคืบหน้า</span>
              <span className="text-sm text-orange">
                {totalCommission > 0 ? ((earnedCommission / totalCommission) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange to-yellow-500 h-3 rounded-full" 
                style={{ width: `${totalCommission > 0 ? (earnedCommission / totalCommission) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>฿{earnedCommission.toLocaleString()}</span>
              <span>฿{totalCommission.toLocaleString()}</span>
            </div>
          </div>

          {/* Commission by Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-white/70">CURED</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">
                ฿{customers.filter(c => c.resus === 'CURED').reduce((sum, c) => sum + c.commission, 0).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-white/70">DR</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                ฿{customers.filter(c => c.resus === 'DR').reduce((sum, c) => sum + c.commission, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">เพิ่มรายได้</span>
        </Button>
        
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <History className="w-4 h-4" />
          <span className="text-xs">ประวัติ</span>
        </Button>
        
        <Button
          className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs">ส่งออก</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-orange" />
          รายการล่าสุด
        </h3>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-sm">{transaction.description}</span>
                  </div>
                  <p className="text-xs text-white/50">
                    {new Date(transaction.date).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}฿{transaction.amount.toLocaleString()}
                  </p>
                  <Badge 
                    className={`text-xs ${
                      transaction.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}
                  >
                    {transaction.status === 'completed' ? 'สำเร็จ' : 'รอดำเนินการ'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-white/30" />
            <p className="text-white/70">ยังไม่มีรายการธุรกรรม</p>
          </div>
        )}
      </Card>
    </div>
  );
};
