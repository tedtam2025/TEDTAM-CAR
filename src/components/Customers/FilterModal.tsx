
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: {
    workGroup: string;
    branch: string;
    workStatus: string;
    team: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const branches = ['ขอนแก่น', 'อุดรธานี', 'พัทยา', 'นครราชสีมา', 'สระบุรี', 'อุบลราชธานี'];
  const workStatuses = ['ลงพื้นที่', 'นัดหมาย', 'ไม่จบ', 'จบ'];
  const teams = ['ทีม A', 'ทีม B', 'ทีม C', 'ทีม D'];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      workGroup: '',
      branch: '',
      workStatus: '',
      team: ''
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">ตัวกรองข้อมูล</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">กลุ่มงาน</label>
                <Select value={filters.workGroup} onValueChange={(value) => handleFilterChange('workGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกกลุ่มงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6090">6090</SelectItem>
                    <SelectItem value="NPL">NPL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">สาขา</label>
                <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">สถานะงาน</label>
                <Select value={filters.workStatus} onValueChange={(value) => handleFilterChange('workStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    {workStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ทีมงาน</label>
                <Select value={filters.team} onValueChange={(value) => handleFilterChange('team', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกทีมงาน" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                ล้างตัวกรอง
              </Button>
              <Button className="flex-1 bg-primary" onClick={onClose}>
                ใช้ตัวกรอง
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
