
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const initialTodos = [
  { id: 1, text: 'ติดตามลูกค้า B3 จำนวน 5 ราย', completed: false },
  { id: 2, text: 'อัพเดทผลงานประจำวัน', completed: true },
  { id: 3, text: 'ส่งรายงานสาขาขอนแก่น', completed: false },
  { id: 4, text: 'นัดหมายลูกค้าใหม่ 3 ราย', completed: false },
];

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <div className="p-4">
          <h3 className="font-semibold text-white mb-3">งานที่ต้องทำวันนี้</h3>
          <div className="space-y-2">
            {todos.map((todo, index) => (
              <motion.div
                key={todo.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => toggleTodo(todo.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                {todo.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-white/50" />
                )}
                <span className={`text-sm ${todo.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                  {todo.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
