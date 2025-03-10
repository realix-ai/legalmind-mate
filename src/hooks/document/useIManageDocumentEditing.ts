
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  checkIManageConnection, 
  getDocumentFromIManage,
  saveDocumentToIManage,
  lockDocumentInIManage,
  unlockDocumentInIManage
} from '@/services/imanage';

interface UseIManageDocumentEditingProps {
  documentId?: string;
  externalId?: string;
  onSaveComplete?: (success: boolean) => void;
}

export function useIManageDocumentEditing({
  documentId,
  externalId,
  onSaveComplete
}: UseIManageDocumentEditingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(120000); // 2 minutes
  
  // Load document from iManage
  const loadDocument = useCallback(async () => {
    if (!externalId) return false;
    
    setIsLoading(true);
    try {
      const connected = await checkIManageConnection();
      if (!connected) {
        toast.error("Not connected to iManage");
        return false;
      }
      
      const result = await getDocumentFromIManage(externalId);
      if (result.success && result.document) {
        setContent(result.document.content);
        setTitle(result.document.title);
        setCategory(result.document.category || 'general');
        setLastSaved(new Date());
        return true;
      } else {
        toast.error("Failed to load document from iManage");
        return false;
      }
    } catch (error) {
      console.error("Error loading document from iManage:", error);
      toast.error("Error loading document from iManage");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [externalId]);
  
  // Start editing session
  const startEditing = useCallback(async () => {
    if (!externalId) {
      toast.error("No iManage document ID provided");
      return false;
    }
    
    try {
      // First load the document
      const loaded = await loadDocument();
      if (!loaded) return false;
      
      // Then try to lock it
      const lockResult = await lockDocumentInIManage(externalId);
      if (lockResult.success) {
        setIsLocked(true);
        setIsEditing(true);
        toast.success("Document locked for editing");
        return true;
      } else {
        toast.error(lockResult.message || "Could not lock document for editing");
        return false;
      }
    } catch (error) {
      console.error("Error starting edit session:", error);
      toast.error("Failed to start edit session");
      return false;
    }
  }, [externalId, loadDocument]);
  
  // Save document to iManage
  const saveDocument = useCallback(async (newContent?: string) => {
    if (!externalId || !isEditing) return false;
    
    setIsSaving(true);
    try {
      const contentToSave = newContent || content;
      
      const result = await saveDocumentToIManage(
        title,
        contentToSave,
        category,
        externalId // Pass the external ID to update existing document
      );
      
      if (result.success) {
        setLastSaved(new Date());
        toast.success("Document saved to iManage");
        if (onSaveComplete) onSaveComplete(true);
        return true;
      } else {
        toast.error("Failed to save to iManage");
        if (onSaveComplete) onSaveComplete(false);
        return false;
      }
    } catch (error) {
      console.error("Error saving to iManage:", error);
      toast.error("Error saving document to iManage");
      if (onSaveComplete) onSaveComplete(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [externalId, isEditing, content, title, category, onSaveComplete]);
  
  // End editing session
  const endEditing = useCallback(async (saveFinal: boolean = true) => {
    if (!externalId || !isEditing) return;
    
    try {
      // Final save if requested
      if (saveFinal) {
        await saveDocument();
      }
      
      // Unlock document
      if (isLocked) {
        const unlockResult = await unlockDocumentInIManage(externalId);
        if (unlockResult.success) {
          toast.success("Document unlocked");
        } else {
          toast.error("Could not unlock document");
        }
      }
    } catch (error) {
      console.error("Error ending edit session:", error);
      toast.error("Error while ending edit session");
    } finally {
      setIsLocked(false);
      setIsEditing(false);
    }
  }, [externalId, isEditing, isLocked, saveDocument]);
  
  // Auto-save effect
  useEffect(() => {
    if (!isEditing || !autoSaveEnabled || !externalId) return;
    
    const intervalId = setInterval(() => {
      if (isEditing && !isSaving) {
        console.log("Auto-saving document to iManage...");
        saveDocument();
      }
    }, autoSaveInterval);
    
    return () => clearInterval(intervalId);
  }, [isEditing, autoSaveEnabled, externalId, autoSaveInterval, isSaving, saveDocument]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isEditing && isLocked && externalId) {
        console.log("Component unmounting, unlocking document...");
        unlockDocumentInIManage(externalId).catch(err => {
          console.error("Error unlocking document on unmount:", err);
        });
      }
    };
  }, [isEditing, isLocked, externalId]);
  
  return {
    isEditing,
    isLoading,
    isSaving,
    content,
    title,
    category,
    lastSaved,
    autoSaveEnabled,
    autoSaveInterval,
    setContent,
    setTitle,
    setCategory,
    setAutoSaveEnabled,
    setAutoSaveInterval,
    startEditing,
    saveDocument,
    endEditing,
    loadDocument
  };
}
