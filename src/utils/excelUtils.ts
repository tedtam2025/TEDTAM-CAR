
import * as XLSX from 'xlsx';
import { Customer } from '@/types/customer';

export interface ExcelCustomer {
  'ชื่อ-นามสกุล': string;
  'เลขที่สัญญา': string;
  'Registration ID': string;
  'กลุ่มงาน': string;
  'รหัสกลุ่ม': string;
  'สาขา': string;
  'ทีมงาน': string;
  'เงินต้น': number;
  'ค่างวด': number;
  'Bucket ปัจจุบัน': string;
  'วันไซเคิล': string;
  'ราคาตำรา': number;
  'ค่าคอมมิชชั่น': number;
  'ยี่ห้อรถ': string;
  'รุ่นรถ': string;
  'ทะเบียนรถ': string;
  'หมายเลขเครื่องยนต์': string;
  'ที่อยู่': string;
  'ละติจูด': number;
  'ลองจิจูด': number;
  'สถานะงาน': string;
  'สถานะ RESUS': string;
  'ผลการเยี่ยมล่าสุด': string;
  'วันที่อนุมัติ': string;
  'เบอร์โทรศัพท์': string;
  'หมายเหตุ': string;
}

export const exportCustomersToExcel = (customers: Customer[], filename = 'customer-data.xlsx') => {
  const excelData: ExcelCustomer[] = customers.map(customer => ({
    'ชื่อ-นามสกุล': customer.name,
    'เลขที่สัญญา': customer.accountNumber,
    'Registration ID': customer.registrationId,
    'กลุ่มงาน': customer.workGroup,
    'รหัสกลุ่ม': customer.groupCode,
    'สาขา': customer.branch,
    'ทีมงาน': customer.fieldTeam,
    'เงินต้น': customer.principle,
    'ค่างวด': customer.installment,
    'Bucket ปัจจุบัน': customer.currentBucket,
    'วันไซเคิล': customer.cycleDay,
    'ราคาตำรา': customer.blueBookPrice,
    'ค่าคอมมิชชั่น': customer.commission,
    'ยี่ห้อรถ': customer.brand,
    'รุ่นรถ': customer.model,
    'ทะเบียนรถ': customer.licensePlate,
    'หมายเลขเครื่องยนต์': customer.engineNumber,
    'ที่อยู่': customer.address,
    'ละติจูด': customer.latitude,
    'ลองจิจูด': customer.longitude,
    'สถานะงาน': customer.workStatus,
    'สถานะ RESUS': customer.resus,
    'ผลการเยี่ยมล่าสุด': customer.lastVisitResult,
    'วันที่อนุมัติ': customer.authorizationDate,
    'เบอร์โทรศัพท์': customer.phoneNumbers?.join(', ') || '',
    'หมายเหตุ': customer.notes || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  // Set column widths
  const colWidths = [
    { wch: 20 }, // ชื่อ-นามสกุล
    { wch: 15 }, // เลขที่สัญญา
    { wch: 15 }, // Registration ID
    { wch: 10 }, // กลุ่มงาน
    { wch: 12 }, // รหัสกลุ่ม
    { wch: 15 }, // สาขา
    { wch: 12 }, // ทีมงาน
    { wch: 12 }, // เงินต้น
    { wch: 10 }, // ค่างวด
    { wch: 15 }, // Bucket ปัจจุบัน
    { wch: 10 }, // วันไซเคิล
    { wch: 12 }, // ราคาตำรา
    { wch: 12 }, // ค่าคอมมิชชั่น
    { wch: 12 }, // ยี่ห้อรถ
    { wch: 12 }, // รุ่นรถ
    { wch: 12 }, // ทะเบียนรถ
    { wch: 15 }, // หมายเลขเครื่องยนต์
    { wch: 30 }, // ที่อยู่
    { wch: 12 }, // ละติจูด
    { wch: 12 }, // ลองจิจูด
    { wch: 12 }, // สถานะงาน
    { wch: 12 }, // สถานะ RESUS
    { wch: 20 }, // ผลการเยี่ยมล่าสุด
    { wch: 12 }, // วันที่อนุมัติ
    { wch: 15 }, // เบอร์โทรศัพท์
    { wch: 20 }  // หมายเหตุ
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};

export const importCustomersFromExcel = (file: File): Promise<ExcelCustomer[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelCustomer[];
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const convertExcelToCustomer = (excelData: ExcelCustomer): Omit<Customer, 'UID'> => {
  return {
    registrationId: excelData['Registration ID'] || '',
    fieldTeam: excelData['ทีมงาน'] || '',
    workGroup: (excelData['กลุ่มงาน'] as '6090' | 'NPL') || '6090',
    groupCode: excelData['รหัสกลุ่ม'] || '',
    branch: excelData['สาขา'] || '',
    accountNumber: excelData['เลขที่สัญญา'] || '',
    name: excelData['ชื่อ-นามสกุล'] || '',
    principle: Number(excelData['เงินต้น']) || 0,
    installment: Number(excelData['ค่างวด']) || 0,
    currentBucket: excelData['Bucket ปัจจุบัน'] || '',
    cycleDay: excelData['วันไซเคิล'] || '',
    blueBookPrice: Number(excelData['ราคาตำรา']) || 0,
    commission: Number(excelData['ค่าคอมมิชชั่น']) || 0,
    brand: excelData['ยี่ห้อรถ'] || '',
    model: excelData['รุ่นรถ'] || '',
    licensePlate: excelData['ทะเบียนรถ'] || '',
    engineNumber: excelData['หมายเลขเครื่องยนต์'] || '',
    address: excelData['ที่อยู่'] || '',
    latitude: Number(excelData['ละติจูด']) || 0,
    longitude: Number(excelData['ลองจิจูด']) || 0,
    workStatus: (excelData['สถานะงาน'] as 'ลงพื้นที่' | 'นัดหมาย' | 'ไม่จบ' | 'จบ') || 'ลงพื้นที่',
    resus: (excelData['สถานะ RESUS'] as 'จบ' | 'CURED' | 'DR' | 'ตบเด้ง' | 'REPO') || 'CURED',
    lastVisitResult: excelData['ผลการเยี่ยมล่าสุด'] || '',
    authorizationDate: excelData['วันที่อนุมัติ'] || '',
    phoneNumbers: excelData['เบอร์โทรศัพท์'] ? excelData['เบอร์โทรศัพท์'].split(',').map(p => p.trim()) : [],
    notes: excelData['หมายเหตุ'] || ''
  };
};

export const downloadExcelTemplate = () => {
  const templateData: ExcelCustomer[] = [{
    'ชื่อ-นามสกุล': 'ตัวอย่าง ลูกค้า',
    'เลขที่สัญญา': '1234567890',
    'Registration ID': 'REG001',
    'กลุ่มงาน': '6090',
    'รหัสกลุ่ม': 'G1',
    'สาขา': 'สาขาสุขุมวิท',
    'ทีมงาน': 'ทีม A',
    'เงินต้น': 100000,
    'ค่างวด': 5000,
    'Bucket ปัจจุบัน': 'B1',
    'วันไซเคิล': '15',
    'ราคาตำรา': 800000,
    'ค่าคอมมิชชั่น': 5000,
    'ยี่ห้อรถ': 'Toyota',
    'รุ่นรถ': 'Camry',
    'ทะเบียนรถ': '1กท1234',
    'หมายเลขเครื่องยนต์': 'ABC123456',
    'ที่อยู่': '123 ถ.สุขุมวิท กรุงเทพฯ 10110',
    'ละติจูด': 13.7563,
    'ลองจิจูด': 100.5018,
    'สถานะงาน': 'ลงพื้นที่',
    'สถานะ RESUS': 'CURED',
    'ผลการเยี่ยมล่าสุด': 'พบลูกค้า นัดชำระ',
    'วันที่อนุมัติ': '2025-05-05',
    'เบอร์โทรศัพท์': '081-234-5678, 089-876-5432',
    'หมายเหตุ': 'ลูกค้าให้ความร่วมมือดี'
  }];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  XLSX.writeFile(workbook, 'customer-template.xlsx');
};
