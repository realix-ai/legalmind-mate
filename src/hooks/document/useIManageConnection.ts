
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { checkIManageConnection } from '@/services/imanage';

export function useIManageConnection(checkOnOpen: boolean = false) {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (checkOnOpen) {
      checkConnection();
    }
  }, [checkOnOpen]);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const connected = await checkIManageConnection();
      setIsConnected(connected);
      
      if (!connected) {
        toast.error("Not connected to iManage. Please configure your connection first.");
      }
      
      return connected;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    isConnected,
    isChecking,
    checkConnection
  };
}
