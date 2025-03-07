import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { checkIManageConnection } from '@/services/imanage';

export function useIManageConnection(isDialogOpen: boolean) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      checkConnection();
    }
  }, [isDialogOpen]);

  const checkConnection = async () => {
    const connected = await checkIManageConnection();
    setIsConnected(connected);
    if (!connected) {
      toast.error("Not connected to iManage. Please configure your connection first.");
    }
  };

  return {
    isConnected,
    checkConnection
  };
}
