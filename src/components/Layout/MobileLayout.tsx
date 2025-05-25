
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, MapPin, TrendingUp, Wallet, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', icon: Home, label: 'แดชบอร์ด' },
  { id: 'customers', icon: Users, label: 'ลูกค้า' },
  { id: 'map', icon: MapPin, label: 'แผนที่' },
  { id: 'performance', icon: TrendingUp, label: 'ผลงาน' },
  { id: 'wallet', icon: Wallet, label: 'กระเป๋าเงิน' },
  { id: 'chat', icon: MessageCircle, label: 'แชท' },
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentTab, 
  onTabChange 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-navy/90 flex flex-col">
      {/* Status bar spacer */}
      <div className="h-safe-top bg-transparent" />
      
      {/* Main content */}
      <main className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-y-auto pb-20">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/20 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-around items-center px-2 py-2 pb-safe-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-100"
                )}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive && "text-white")} />
                <span className="text-xs font-medium">{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute -top-1 left-1/2 w-1 h-1 bg-orange rounded-full"
                    layoutId="activeTab"
                    initial={false}
                    style={{ x: '-50%' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};
