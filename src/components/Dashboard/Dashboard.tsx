
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherWidget } from './WeatherWidget';
import { StatsCards } from './StatsCards';
import { ProgressBar } from './ProgressBar';
import { QuickActions } from './QuickActions';
import { NotificationPanel } from './NotificationPanel';
import { TodoList } from './TodoList';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2">TEDTAM Car</h1>
        <p className="text-white/80">ระบบจัดการทีมงานภาคสนาม</p>
      </motion.div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Stats Cards */}
      <StatsCards />

      {/* Progress Bar */}
      <ProgressBar />

      {/* Quick Actions */}
      <QuickActions />

      {/* Notifications */}
      <NotificationPanel />

      {/* Todo List */}
      <TodoList />
    </div>
  );
};
