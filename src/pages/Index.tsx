
import React, { useState } from 'react';
import { MobileLayout } from '@/components/Layout/MobileLayout';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CustomerList } from '@/components/Customers/CustomerList';
import { MapView } from '@/components/Map/MapView';
import { PerformanceView } from '@/components/Performance/PerformanceView';
import { WalletView } from '@/components/Wallet/WalletView';
import { ChatView } from '@/components/Chat/ChatView';

const Index = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerList />;
      case 'map':
        return <MapView />;
      case 'performance':
        return <PerformanceView />;
      case 'wallet':
        return <WalletView />;
      case 'chat':
        return <ChatView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MobileLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </MobileLayout>
  );
};

export default Index;
