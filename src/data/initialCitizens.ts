import { CitizenUser } from '../types';

export const INITIAL_CITIZENS: CitizenUser[] = [
  {
    id: 'ctz_001',
    fullName: 'سامر أحمد القاري',
    email: 'samer.qara@gmail.com',
    password: 'Qara2026@Pass!', // Valid password (10+ chars, upper, lower, digit, special)
    phone: '0933123456',
    address: 'قارة - الحي الشمالي - الحارة الشرقية',
    nationalId: '03010045621',
    familyMembersCount: 5,
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLogin: '2026-07-28T09:30:00.000Z'
  },
  {
    id: 'ctz_002',
    fullName: 'فاطمة محمود الجابي',
    email: 'fatima.jabi@yahoo.com',
    password: 'Secure#2026Qara',
    phone: '0944987654',
    address: 'قارة - وسط البلدة قرب الجامع الكبير',
    nationalId: '03010078912',
    familyMembersCount: 4,
    status: 'active',
    createdAt: '2026-02-20T14:20:00.000Z',
    lastLogin: '2026-07-25T18:12:00.000Z'
  },
  {
    id: 'ctz_003',
    fullName: 'خالد عمر الشامي',
    email: 'khaled.shami@hotmail.com',
    password: 'Khaled!9922Qara',
    phone: '0955333222',
    address: 'قارة - طريق الدير - حي الكروم',
    nationalId: '03010011223',
    familyMembersCount: 6,
    status: 'active',
    createdAt: '2026-03-10T11:15:00.000Z',
    lastLogin: '2026-07-20T12:00:00.000Z'
  }
];
