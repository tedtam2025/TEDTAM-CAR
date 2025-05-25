
export interface Customer {
  UID: string;
  registrationId: string;
  fieldTeam: string;
  workGroup: '6090' | 'NPL';
  groupCode: string;
  branch: string;
  accountNumber: string;
  name: string;
  principle: number;
  installment: number;
  currentBucket: string;
  cycleDay: string;
  blueBookPrice: number;
  commission: number;
  brand: string;
  model: string;
  licensePlate: string;
  engineNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  workStatus: 'ลงพื้นที่' | 'นัดหมาย' | 'ไม่จบ' | 'จบ';
  resus: 'จบ' | 'CURED' | 'DR' | 'ตบเด้ง' | 'REPO';
  lastVisitResult: string;
  authorizationDate: string;
  phoneNumbers?: string[];
  notes?: string;
  documents?: string[];
  photos?: string[];
  voiceNotes?: string[];
}

export interface Performance {
  team: string;
  branch: string;
  workGroup: '6090' | 'NPL';
  totalCases: number;
  remainingCases: number;
  target: number;
  curedPercent: number;
  drPercent: number;
  repoPercent: number;
  bouncePercent: number;
  reportCount: number;
}

export interface Commission {
  id: string;
  employeeId: string;
  customerId: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  team: string;
  workGroup: '6090' | 'NPL';
}
