
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/customer';
import { useAuth } from './useAuth';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      
      // Try to fetch without user filter first to check if data exists
      const { data, error, count } = await supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Raw fetch result:', { data, error, count });

      let finalData = data;

      if (error) {
        console.error('Error fetching customers:', error);
        // If RLS blocks the query, try with user authentication
        if (error.code === 'PGRST301' || error.message.includes('RLS')) {
          console.log('RLS detected, trying authenticated fetch...');
          if (user) {
            const { data: authData, error: authError } = await supabase
              .from('customers')
              .select('*')
              .eq('created_by', user.id)
              .order('created_at', { ascending: false });
            
            if (authError) {
              console.error('Authenticated fetch error:', authError);
              setCustomers([]);
              return;
            }
            console.log('Authenticated fetch result:', authData);
            finalData = authData;
          }
        } else {
          setCustomers([]);
          return;
        }
      }

      console.log('Processing customer data:', finalData);

      // Transform database format to app format
      const transformedCustomers: Customer[] = (finalData || []).map(customer => ({
        UID: customer.uid || '',
        registrationId: customer.registration_id || '',
        fieldTeam: customer.field_team || '',
        workGroup: (customer.work_group as '6090' | 'NPL') || '6090',
        groupCode: customer.group_code || '',
        branch: customer.branch || '',
        accountNumber: customer.account_number || '',
        name: customer.name || '',
        principle: Number(customer.principle) || 0,
        installment: Number(customer.installment) || 0,
        currentBucket: customer.current_bucket || '',
        cycleDay: customer.cycle_day || '',
        blueBookPrice: Number(customer.blue_book_price) || 0,
        commission: Number(customer.commission) || 0,
        brand: customer.brand || '',
        model: customer.model || '',
        licensePlate: customer.license_plate || '',
        engineNumber: customer.engine_number || '',
        address: customer.address || '',
        latitude: Number(customer.latitude) || 0,
        longitude: Number(customer.longitude) || 0,
        workStatus: (customer.work_status as 'ลงพื้นที่' | 'นัดหมาย' | 'ไม่จบ' | 'จบ') || 'ลงพื้นที่',
        resus: (customer.resus as 'จบ' | 'CURED' | 'DR' | 'ตบเด้ง' | 'REPO') || 'CURED',
        lastVisitResult: customer.last_visit_result || '',
        authorizationDate: customer.authorization_date || '',
        phoneNumbers: customer.phone_numbers || [],
        notes: customer.notes || '',
        documents: customer.documents || [],
        photos: customer.photos || [],
        voiceNotes: customer.voice_notes || []
      }));

      console.log('Final transformed customers:', transformedCustomers);
      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error in fetchCustomers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Real-time customer change:', payload);
          fetchCustomers(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    customers,
    loading,
    refetch: fetchCustomers
  };
};
