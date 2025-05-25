
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AddCustomerFormProps {
  onClose: () => void;
  onCustomerAdded: () => void;
}

export const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onClose, onCustomerAdded }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน
    uid: '',
    registrationId: '',
    fieldTeam: '',
    workGroup: '6090' as '6090' | 'NPL',
    groupCode: '',
    branch: '',
    accountNumber: '',
    name: '',
    principle: '',
    installment: '',
    currentBucket: '',
    cycleDay: '',
    blueBookPrice: '',
    commission: '',
    
    // ยานพาหนะ
    brand: '',
    model: '',
    licensePlate: '',
    engineNumber: '',
    
    // ที่อยู่และพิกัด
    address: '',
    latitude: '',
    longitude: '',
    
    // สถานะ
    workStatus: 'ลงพื้นที่' as 'ลงพื้นที่' | 'นัดหมาย' | 'ไม่จบ' | 'จบ',
    resus: 'CURED' as 'จบ' | 'CURED' | 'DR' | 'ตบเด้ง' | 'REPO',
    lastVisitResult: '',
    authorizationDate: '',
    
    // ติดต่อ
    phoneNumbers: [''],
    notes: ''
  });

  const branches = [
    'ขอนแก่น', 'อุดรธานี', 'พัทยา', 'นครราชสีมา', 'สระบุรี',
    'อุบลราชธานี', 'นครสวรรค์', 'ระยอง', 'ขอนแก่นรุ่งเรือง', 'อุดรธานีรุ่งเรือง'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData(prev => ({ ...prev, phoneNumbers: newPhones }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({ 
      ...prev, 
      phoneNumbers: [...prev.phoneNumbers, ''] 
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "ตำแหน่งอัปเดต",
            description: "ได้รับพิกัดปัจจุบันเรียบร้อย",
          });
        },
        (error) => {
          toast({
            title: "ไม่สามารถรับตำแหน่งได้",
            description: "กรุณาอนุญาตการเข้าถึงตำแหน่ง",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "ต้องเข้าสู่ระบบก่อนเพิ่มลูกค้า",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        uid: formData.uid,
        registration_id: formData.registrationId,
        field_team: formData.fieldTeam,
        work_group: formData.workGroup,
        group_code: formData.groupCode,
        branch: formData.branch,
        account_number: formData.accountNumber,
        name: formData.name,
        principle: parseFloat(formData.principle) || 0,
        installment: parseFloat(formData.installment) || 0,
        current_bucket: formData.currentBucket,
        cycle_day: formData.cycleDay,
        blue_book_price: parseFloat(formData.blueBookPrice) || null,
        commission: parseFloat(formData.commission) || null,
        brand: formData.brand,
        model: formData.model,
        license_plate: formData.licensePlate,
        engine_number: formData.engineNumber,
        address: formData.address,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        work_status: formData.workStatus,
        resus: formData.resus,
        last_visit_result: formData.lastVisitResult,
        authorization_date: formData.authorizationDate || null,
        phone_numbers: formData.phoneNumbers.filter(phone => phone.trim() !== ''),
        notes: formData.notes,
        created_by: user.id
      };

      const { error } = await supabase
        .from('customers')
        .insert([customerData]);

      if (error) throw error;

      toast({
        title: "เพิ่มลูกค้าสำเร็จ",
        description: "ข้อมูลลูกค้าถูกบันทึกเรียบร้อยแล้ว",
      });

      onCustomerAdded();
      onClose();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">ข้อมูลพื้นฐาน</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">UID</Label>
                <Input
                  value={formData.uid}
                  onChange={(e) => handleInputChange('uid', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="เช่น F3574เอสดี"
                />
              </div>
              <div>
                <Label className="text-white">Registration ID</Label>
                <Input
                  value={formData.registrationId}
                  onChange={(e) => handleInputChange('registrationId', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="F3574เอสดี"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">ชื่อลูกค้า</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="ชื่อ-นามสกุล"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">กลุ่มงาน</Label>
                <Select value={formData.workGroup} onValueChange={(value) => handleInputChange('workGroup', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6090">6090</SelectItem>
                    <SelectItem value="NPL">NPL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">สาขา</Label>
                <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">เงินต้น</Label>
                <Input
                  type="number"
                  value={formData.principle}
                  onChange={(e) => handleInputChange('principle', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-white">ค่างวด</Label>
                <Input
                  type="number"
                  value={formData.installment}
                  onChange={(e) => handleInputChange('installment', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">ที่อยู่และพิกัด</h3>
            
            <div>
              <Label className="text-white">ที่อยู่</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="ที่อยู่เต็ม"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">ละติจูด</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="13.7563"
                />
              </div>
              <div>
                <Label className="text-white">ลองจิจูด</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="100.5018"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-orange hover:bg-orange/90 text-white"
            >
              <MapPin className="w-4 h-4 mr-2" />
              รับตำแหน่งปัจจุบัน
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">ข้อมูลยานพาหนะ</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">ยี่ห้อ</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Toyota"
                />
              </div>
              <div>
                <Label className="text-white">รุ่น</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Camry"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">ทะเบียนรถ</Label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="1กท1234"
              />
            </div>

            <div>
              <Label className="text-white">เลขเครื่องยนต์</Label>
              <Input
                value={formData.engineNumber}
                onChange={(e) => handleInputChange('engineNumber', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="ABC123456"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white">สถานะงาน</Label>
                <Select value={formData.workStatus} onValueChange={(value) => handleInputChange('workStatus', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                <Label className="text-white">สถานะ RESUS</Label>
                <Select value={formData.resus} onValueChange={(value) => handleInputChange('resus', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">ข้อมูลติดต่อ</h3>
            
            <div>
              <Label className="text-white">เบอร์โทรศัพท์</Label>
              {formData.phoneNumbers.map((phone, index) => (
                <Input
                  key={index}
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  className="bg-white/10 border-white/20 text-white mb-2"
                  placeholder="08xxxxxxxx"
                />
              ))}
              <Button
                type="button"
                onClick={addPhoneNumber}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                เพิ่มเบอร์โทร
              </Button>
            </div>

            <div>
              <Label className="text-white">หมายเหตุ</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="หมายเหตุเพิ่มเติม"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={step > 1 ? () => setStep(step - 1) : onClose}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">เพิ่มลูกค้าใหม่</h2>
              <div className="text-sm text-white/70">{step}/4</div>
            </div>

            {/* Progress */}
            <div className="flex mb-6">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`flex-1 h-2 mx-1 rounded ${
                    num <= step ? 'bg-orange' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            {renderStepContent()}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 bg-orange hover:bg-orange/90 text-white"
                >
                  ถัดไป
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-orange hover:bg-orange/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
