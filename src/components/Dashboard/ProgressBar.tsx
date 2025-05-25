
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const ProgressBar: React.FC = () => {
  const progress = 76.5;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">ความคืบหน้าวันนี้</h3>
            <span className="text-orange font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />
          <p className="text-xs text-white/70 mt-2">23 จาก 30 งาน</p>
        </div>
      </Card>
    </motion.div>
  );
};
