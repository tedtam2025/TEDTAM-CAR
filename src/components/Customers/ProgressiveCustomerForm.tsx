
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Car, Phone, QrCode, Camera, Mic, 
  Navigation, ArrowLeft, ArrowRight, Check, X 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProgressiveCustomerFormProps {
  onClose: () => void;
  onCustomerAdded: () => void;
}

interface CustomerFormData {
  // Basic Info
  name: string;
  accountNumber: string;
  registrationId: string;
  principle: number;
  installment: number;
  workGroup: '6090' | 'NPL';
  groupCode: string;
  branch: string;
  fieldTeam: string;
  
  // Address & Location
  address: string;
  latitude: number;
  longitude: number;
  
  // Vehicle Info
  brand: string;
  model: string;
  licensePlate: string;
  engineNumber: string;
  blueBookPrice: number;
  
  // Contact & Status
  phoneNumbers: string[];
  workStatus: 'ลงพื้นที่' | 'นัดหมาย' | 'ไม่จบ' | 'จบ';
  resus: 'จบ' | 'CURED' | 'DR' | 'ตบเด้ง' | 'REPO';
  currentBucket: string;
  cycleDay: string;
  commission: number;
  notes: string;
}

const initialFormData: CustomerFormData = {
  name: '',
  accountNumber: '',
  registrationId: '',
  principle: 0,
  installment: 0,
  workGroup: '6090',
  groupCode: '',
  branch: '',
  fieldTeam: '',
  address: '',
  latitude: 0,
  longitude: 0,
  brand: '',
  model: '',
  licensePlate: '',
  engineNumber: '',
  blueBookPrice: 0,
  phoneNumbers: [''],
  workStatus: 'ลงพื้นที่',
  resus: 'CURED',
  currentBucket: '',
  cycleDay: '',
  commission: 0,
  notes: ''
};

export const ProgressiveCustomerForm: React.FC<ProgressiveCustomerFormProps> = ({
  onClose,
  onCustomerAdded
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'ข้อมูลพื้นฐาน', icon: User },
    { id: 2, title: 'ที่อยู่และพิกัด', icon: MapPin },
    { id: 3, title: 'ข้อมูลยานพาหนะ', icon: Car },
    { id: 4, title: 'ติดต่อและสถานะ', icon: Phone }
  ];

  const updateFormData = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, '']
    }));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => i === index ? value : phone)
    }));
  };

  const removePhoneNumber = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData('latitude', position.coords.latitude);
          updateFormData('longitude', position.coords.longitude);
          toast.success('ได้พิกัดปัจจุบันแล้ว');
        },
        (error) => {
          toast.error('ไม่สามารถรับพิกัดได้');
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        uid: `F3574เอสดี${Date.now()}`,
        registration_id: formData.registrationId,
        field_team: formData.fieldTeam,
        work_group: formData.workGroup,
        group_code: formData.groupCode,
        branch: formData.branch,
        account_number: formData.accountNumber,
        name: formData.name,
        principle: formData.principle,
        installment: formData.installment,
        current_bucket: formData.currentBucket,
        cycle_day: formData.cycleDay,
        blue_book_price: formData.blueBookPrice,
        commission: formData.commission,
        brand: formData.brand,
        model: formData.model,
        license_plate: formData.licensePlate,
        engine_number: formData.engineNumber,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        work_status: formData.workStatus,
        resus: formData.resus,
        phone_numbers: formData.phoneNumbers.filter(phone => phone.trim() !== ''),
        notes: formData.notes,
        created_by: user.id
      };

      const { error } = await supabase
        .from('customers')
        .insert(customerData);

      if (error) throw error;

      toast.success('เพิ่มลูกค้าสำเร็จ!');
      onCustomerAdded();
      onClose();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('เกิดข้อผิดพลาดในการเพิ่มลูกค้า');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="ชื่อลูกค้า"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">เลขที่สัญญา *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => updateFormData('accountNumber', e.target.value)}
                  placeholder="เลขที่สัญญา"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationId">Registration ID *</Label>
                <Input
                  id="registrationId"
                  value={formData.registrationId}
                  onChange={(e) => updateFormData('registrationId', e.target.value)}
                  placeholder="REG001"
                />
              </div>
              <div>
                <Label htmlFor="workGroup">กลุ่มงาน</Label>
                <Select value={formData.workGroup} onValueChange={(value: '6090' | 'NPL') => updateFormData('workGroup', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6090">6090</SelectItem>
                    <SelectItem value="NPL">NPL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="principle">เงินต้น (บาท) *</Label>
                <Input
                  id="principle"
                  type="number"
                  value={formData.principle}
                  onChange={(e) => updateFormData('principle', parseInt(e.target.value) || 0)}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label htmlFor="installment">ค่างวด (บาท) *</Label>
                <Input
                  id="installment"
                  type="number"
                  value={formData.installment}
                  onChange={(e) => updateFormData('installment', parseInt(e.target.value) || 0)}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="branch">สาขา</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => updateFormData('branch', e.target.value)}
                  placeholder="สาขาสุขุมวิท"
                />
              </div>
              <div>
                <Label htmlFor="fieldTeam">ทีมงาน</Label>
                <Input
                  id="fieldTeam"
                  value={formData.fieldTeam}
                  onChange={(e) => updateFormData('fieldTeam', e.target.value)}
                  placeholder="ทีม A"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">ที่อยู่ *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="123 ถ.สุขุมวิท กรุงเทพฯ 10110"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">ละติจูด</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => updateFormData('latitude', parseFloat(e.target.value) || 0)}
                  placeholder="13.7563"
                />
              </div>
              <div>
                <Label htmlFor="longitude">ลองจิจูด</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => updateFormData('longitude', parseFloat(e.target.value) || 0)}
                  placeholder="100.5018"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={getCurrentLocation}
                className="bg-blue-500 hover:bg-blue-600 flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                ใช้พิกัดปัจจุบัน
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <MapPin className="w-4 h-4 mr-2" />
                เลือกจากแผนที่
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">ยี่ห้อรถ</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => updateFormData('brand', e.target.value)}
                  placeholder="Toyota"
                />
              </div>
              <div>
                <Label htmlFor="model">รุ่นรถ</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => updateFormData('model', e.target.value)}
                  placeholder="Camry"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licensePlate">ทะเบียนรถ</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => updateFormData('licensePlate', e.target.value)}
                  placeholder="1กท1234"
                />
              </div>
              <div>
                <Label htmlFor="engineNumber">หมายเลขเครื่องยนต์</Label>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber}
                  onChange={(e) => updateFormData('engineNumber', e.target.value)}
                  placeholder="ABC123456"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blueBookPrice">ราคาตามตำรา (บาท)</Label>
              <Input
                id="blueBookPrice"
                type="number"
                value={formData.blueBookPrice}
                onChange={(e) => updateFormData('blueBookPrice', parseInt(e.target.value) || 0)}
                placeholder="800000"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <QrCode className="w-4 h-4 mr-2" />
                สแกน QR
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Camera className="w-4 h-4 mr-2" />
                ถ่ายภาพ
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>เบอร์โทรศัพท์</Label>
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhoneNumber(index, e.target.value)}
                    placeholder="08xxxxxxxx"
                  />
                  {formData.phoneNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhoneNumber(index)}
                      className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPhoneNumber}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                + เพิ่มเบอร์โทร
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workStatus">สถานะงาน</Label>
                <Select value={formData.workStatus} onValueChange={(value: any) => updateFormData('workStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ลงพื้นที่">ลงพื้นที่</SelectItem>
                    <SelectItem value="นัดหมาย">นัดหมาย</SelectItem>
                    <SelectItem value="ไม่จบ">ไม่จบ</SelectItem>
                    <SelectItem value="จบ">จบ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resus">สถานะ RESUS</Label>
                <Select value={formData.resus} onValueChange={(value: any) => updateFormData('resus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="จบ">จบ</SelectItem>
                    <SelectItem value="CURED">CURED</SelectItem>
                    <SelectItem value="DR">DR</SelectItem>
                    <SelectItem value="ตบเด้ง">ตบเด้ง</SelectItem>
                    <SelectItem value="REPO">REPO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission">ค่าคอมมิชชั่น (บาท)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={formData.commission}
                  onChange={(e) => updateFormData('commission', parseInt(e.target.value) || 0)}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="cycleDay">วันไซเคิล</Label>
                <Input
                  id="cycleDay"
                  value={formData.cycleDay}
                  onChange={(e) => updateFormData('cycleDay', e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">หมายเหตุ</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="บันทึกเพิ่มเติม..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Mic className="w-4 h-4 mr-2" />
                บันทึกเสียง
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Camera className="w-4 h-4 mr-2" />
                ถ่ายเอกสาร
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">เพิ่มลูกค้าใหม่</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${currentStep >= step.id 
                    ? 'bg-orange border-orange text-white' 
                    : 'border-white/30 text-white/50'
                  }
                `}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-2 transition-colors
                    ${currentStep > step.id ? 'bg-orange' : 'bg-white/20'}
                  `} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 text-center">
            <h3 className="text-lg font-medium text-white">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-sm text-white/70">
              ขั้นตอนที่ {currentStep} จาก {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
              </Button>
            )}
            
            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-orange hover:bg-orange/90 text-white flex-1"
              >
                ถัดไป
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-orange hover:bg-orange/90 text-white flex-1"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
