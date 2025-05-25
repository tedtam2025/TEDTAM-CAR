
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, Phone, MapPin, Car, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  customerData?: any;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'customer' | 'team' | 'ai';
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  avatar?: string;
}

export const ChatView: React.FC = () => {
  const { customers, loading } = useCustomers();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat rooms
  useEffect(() => {
    const aiRoom: ChatRoom = {
      id: 'ai-assistant',
      name: 'ผู้ช่วย AI',
      type: 'ai',
      lastMessage: 'สวัสดีครับ! ผมพร้อมช่วยเหลือคุณเรื่องลูกค้า',
      lastMessageTime: new Date(),
      unreadCount: 0
    };

    const teamRoom: ChatRoom = {
      id: 'team-chat',
      name: 'แชททีมงาน',
      type: 'team',
      lastMessage: 'อัปเดตผลงานประจำวัน',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 2
    };

    const customerRooms: ChatRoom[] = customers.slice(0, 5).map(customer => ({
      id: `customer-${customer.UID}`,
      name: customer.name,
      type: 'customer' as const,
      lastMessage: `ติดต่อเรื่อง ${customer.brand} ${customer.model}`,
      lastMessageTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      unreadCount: Math.floor(Math.random() * 3)
    }));

    setChatRooms([aiRoom, teamRoom, ...customerRooms]);
  }, [customers]);

  // Initialize AI assistant messages
  useEffect(() => {
    if (selectedRoom === 'ai-assistant' && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: 'สวัสดีครับ! ผมคือผู้ช่วย AI ของ TEDTAM Car ผมสามารถช่วยคุณได้ในเรื่องต่างๆ เช่น:\n\n• ค้นหาข้อมูลลูกค้า\n• วิเคราะห์ผลงาน\n• แนะนำกลยุทธ์การทำงาน\n• ตอบคำถามเกี่ยวกับระบบ\n\nมีอะไรให้ผมช่วยครับ?',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedRoom, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response for AI assistant
    if (selectedRoom === 'ai-assistant') {
      setTimeout(() => {
        const aiResponse = generateAIResponse(newMessage);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          sender: 'assistant',
          timestamp: new Date(),
          customerData: aiResponse.customerData
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ลูกค้า') || input.includes('customer')) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      if (randomCustomer) {
        return {
          content: `ผมพบข้อมูลลูกค้าที่เกี่ยวข้อง:\n\n📋 **${randomCustomer.name}**\n🏢 สาขา: ${randomCustomer.branch}\n💰 เงินต้น: ฿${randomCustomer.principle.toLocaleString()}\n📊 สถานะ: ${randomCustomer.workStatus}\n🎯 RESUS: ${randomCustomer.resus}\n\nต้องการข้อมูลเพิ่มเติมหรือไม่ครับ?`,
          customerData: randomCustomer
        };
      }
    }
    
    if (input.includes('ผลงาน') || input.includes('performance')) {
      const totalCustomers = customers.length;
      const completedCases = customers.filter(c => c.workStatus === 'จบ').length;
      const successRate = totalCustomers > 0 ? ((completedCases / totalCustomers) * 100).toFixed(1) : '0';
      
      return {
        content: `📊 **สรุปผลงานของคุณ**\n\n👥 ลูกค้าทั้งหมด: ${totalCustomers} ราย\n✅ เคสที่เสร็จสิ้น: ${completedCases} ราย\n📈 อัตราความสำเร็จ: ${successRate}%\n\nผลงานของคุณดีมากครับ! มีอะไรให้ช่วยปรับปรุงอีกไหม?`,
        customerData: null
      };
    }
    
    if (input.includes('แนะนำ') || input.includes('กลยุทธ์')) {
      return {
        content: `💡 **แนะนำกลยุทธ์การทำงาน**\n\n1. 🎯 **มุ่งเน้นลูกค้าที่มีศักยภาพสูง**\n   - ลูกค้าที่มีเงินต้นมาก\n   - ลูกค้าที่ติดต่อได้ง่าย\n\n2. 📞 **เพิ่มความถี่ในการติดตาม**\n   - โทรทุกสัปดาห์\n   - ส่งข้อความเตือนความจำ\n\n3. 🗺️ **วางแผนเส้นทางอย่างมีประสิทธิภาพ**\n   - จัดกลุ่มลูกค้าตามพื้นที่\n   - ใช้แผนที่ในการวางแผน\n\nต้องการคำแนะนำเฉพาะเจาะจงมากกว่านี้ไหมครับ?`,
        customerData: null
      };
    }
    
    // Default responses
    const responses = [
      'ขอบคุณสำหรับคำถามครับ ผมพร้อมช่วยเหลือคุณเสมอ',
      'มีอะไรอื่นที่ผมสามารถช่วยได้บ้างครับ?',
      'ผมเข้าใจครับ มีข้อมูลอื่นที่ต้องการทราบไหม?',
      'ขอบคุณครับ ผมจะช่วยหาข้อมูลให้คุณ'
    ];
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      customerData: null
    };
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">กำลังโหลดแชท...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-screen flex flex-col">
      {/* Header */}
      <motion.div
        className="text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-orange" />
            แชท
          </h1>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col min-h-0">
        {!selectedRoom ? (
          /* Chat Room List */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">ห้องแชท</h3>
              <Button size="sm" className="bg-orange hover:bg-orange/90">
                <Plus className="w-4 h-4 mr-2" />
                สร้างแชทใหม่
              </Button>
            </div>
            
            {chatRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedRoom(room.id)}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4 cursor-pointer hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        room.type === 'ai' ? 'bg-orange/20' : 
                        room.type === 'team' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                      }`}>
                        {room.type === 'ai' ? <Bot className="w-6 h-6 text-orange" /> :
                         room.type === 'team' ? <MessageCircle className="w-6 h-6 text-blue-400" /> :
                         <User className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{room.name}</h4>
                        <p className="text-sm text-white/70 truncate">{room.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-xs text-white/50">
                        {room.lastMessageTime ? formatTime(room.lastMessageTime) : ''}
                      </p>
                      {room.unreadCount > 0 && (
                        <Badge className="bg-orange text-white text-xs px-2 py-1">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRoom(null)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    ←
                  </Button>
                  <h3 className="font-semibold">
                    {chatRooms.find(r => r.id === selectedRoom)?.name}
                  </h3>
                </div>
                
                {selectedRoom.startsWith('customer-') && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-orange text-white' 
                        : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
                    } rounded-2xl p-4`}>
                      <div className="flex items-start gap-2">
                        {message.sender === 'assistant' && (
                          <Bot className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Customer Data Card */}
                          {message.customerData && (
                            <Card className="bg-white/5 border-white/10 p-3 mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Car className="w-4 h-4 text-orange" />
                                <span className="text-sm font-medium">
                                  {message.customerData.brand} {message.customerData.model}
                                </span>
                              </div>
                              <div className="text-xs text-white/70 space-y-1">
                                <p>📞 {message.customerData.phoneNumbers?.[0] || 'ไม่มีข้อมูล'}</p>
                                <p>📍 {message.customerData.address || 'ไม่มีข้อมูล'}</p>
                              </div>
                            </Card>
                          )}
                        </div>
                      </div>
                      <p className="text-xs opacity-70 mt-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-orange hover:bg-orange/90 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
