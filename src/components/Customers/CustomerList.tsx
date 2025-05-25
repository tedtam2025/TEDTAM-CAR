import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Download, Upload, Users, Zap, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerCard } from './CustomerCard';
import { FilterModal } from './FilterModal';
import { ProgressiveCustomerForm } from './ProgressiveCustomerForm';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { exportCustomersToExcel, downloadExcelTemplate, importCustomersFromExcel, convertExcelToCustomer } from '@/utils/excelUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const CustomerList: React.FC = () => {
  const { customers, loading, refetch } = useCustomers();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    workGroup: '',
    branch: '',
    workStatus: '',
    team: ''
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.accountNumber.includes(searchTerm) ||
                         customer.registrationId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = (!filters.workGroup || customer.workGroup === filters.workGroup) &&
                          (!filters.branch || customer.branch === filters.branch) &&
                          (!filters.workStatus || customer.workStatus === filters.workStatus) &&
                          (!filters.team || customer.fieldTeam === filters.team);
    
    return matchesSearch && matchesFilters;
  });

  // Calculate summary stats
  const totalCustomers = filteredCustomers.length;
  const totalPrinciple = filteredCustomers.reduce((sum, customer) => sum + customer.principle, 0);
  const completedCases = filteredCustomers.filter(customer => customer.workStatus === 'จบ').length;
  const pendingCases = filteredCustomers.filter(customer => customer.workStatus === 'ลงพื้นที่' || customer.workStatus === 'นัดหมาย').length;

  if (!user) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <Users className="w-16 h-16 mx-auto mb-4 text-orange" />
          <h2 className="text-xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-white/80">เพื่อเข้าถึงรายการลูกค้า</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">กำลังโหลดข้อมูล...</h2>
          <p className="text-white/80">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  const handleExportExcel = () => {
    exportCustomersToExcel(filteredCustomers, `customers-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('ส่งออกข้อมูลสำเร็จ!');
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
    toast.success('ดาวน์โหลดแม่แบบสำเร็จ!');
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const excelData = await importCustomersFromExcel(file);
      const customersToInsert = excelData.map(data => ({
        uid: `F3574เอสดี${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...convertExcelToCustomer(data),
        created_by: user.id
      }));

      const { error } = await supabase
        .from('customers')
        .insert(customersToInsert.map(customer => ({
          uid: customer.uid,
          registration_id: customer.registrationId,
          field_team: customer.fieldTeam,
          work_group: customer.workGroup,
          group_code: customer.groupCode,
          branch: customer.branch,
          account_number: customer.accountNumber,
          name: customer.name,
          principle: customer.principle,
          installment: customer.installment,
          current_bucket: customer.currentBucket,
          cycle_day: customer.cycleDay,
          blue_book_price: customer.blueBookPrice,
          commission: customer.commission,
          brand: customer.brand,
          model: customer.model,
          license_plate: customer.licensePlate,
          engine_number: customer.engineNumber,
          address: customer.address,
          latitude: customer.latitude,
          longitude: customer.longitude,
          work_status: customer.workStatus,
          resus: customer.resus,
          last_visit_result: customer.lastVisitResult,
          authorization_date: customer.authorizationDate,
          phone_numbers: customer.phoneNumbers,
          notes: customer.notes,
          created_by: customer.created_by
        })));

      if (error) throw error;

      toast.success(`นำเข้าข้อมูล ${customersToInsert.length} รายสำเร็จ!`);
      refetch();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header with Stats */}
      <motion.div 
        className="text-center text-white space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-orange" />
            รายการลูกค้า
          </h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange">{totalCustomers}</div>
              <div className="text-sm text-white/70">ลูกค้าทั้งหมด</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{completedCases}</div>
              <div className="text-sm text-white/70">เคสสำเร็จ</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{pendingCases}</div>
              <div className="text-sm text-white/70">เคสดำเนินการ</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-lg font-bold text-blue-400">
                ฿{(totalPrinciple / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-white/70">เงินต้นรวม</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Actions */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            placeholder="ค้นหาชื่อ, เลขที่สัญญา, Hub Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50 rounded-xl text-base"
          />
          {searchTerm && (
            <motion.button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(true)}
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          >
            <Filter className="w-4 h-4" />
            <span className="text-xs">ตัวกรอง</span>
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="excel-import"
            />
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1 w-full"
              asChild
            >
              <label htmlFor="excel-import" className="cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-xs">นำเข้า</span>
              </label>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">ส่งออก</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-xs">แม่แบบ</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-orange/20 backdrop-blur-lg border-orange/30 text-orange hover:bg-orange/30 rounded-xl h-12 flex flex-col items-center justify-center gap-1"
          >
            <Zap className="w-4 h-4" />
            <span className="text-xs">รายงาน</span>
          </Button>
        </div>
      </motion.div>

      {/* Add Customer Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button 
          onClick={() => setShowAddForm(true)}
          className="w-full bg-gradient-to-r from-orange to-orange/80 hover:from-orange/90 hover:to-orange/70 text-white rounded-xl h-14 text-lg font-medium shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          เพิ่มลูกค้าใหม่
        </Button>
      </motion.div>

      {/* Active Filters Display */}
      {(filters.workGroup || filters.branch || filters.workStatus || filters.team) && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {filters.workGroup && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              กลุ่มงาน: {filters.workGroup}
            </Badge>
          )}
          {filters.branch && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              สาขา: {filters.branch}
            </Badge>
          )}
          {filters.workStatus && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              สถานะ: {filters.workStatus}
            </Badge>
          )}
          {filters.team && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              ทีม: {filters.team}
            </Badge>
          )}
        </motion.div>
      )}

      {/* Customer Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.UID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CustomerCard customer={customer} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h3 className="text-lg font-semibold text-white mb-2">ไม่พบข้อมูลลูกค้า</h3>
            <p className="text-white/70 mb-6">
              {searchTerm ? 'ลองเปลี่ยนคำค้นหาหรือปรับตัวกรอง' : 'เริ่มต้นด้วยการเพิ่มลูกค้าใหม่'}
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-orange hover:bg-orange/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มลูกค้าใหม่
            </Button>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <FilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <AnimatePresence>
        {showAddForm && (
          <ProgressiveCustomerForm
            onClose={() => setShowAddForm(false)}
            onCustomerAdded={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
