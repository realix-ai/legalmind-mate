
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { History, ArrowDownToLine, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentVersions } from '@/hooks/document/useDocumentVersions';
import { toast } from 'sonner';

interface VersionHistoryProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (content: string) => void;
}

const VersionHistory = ({ documentId, isOpen, onClose, onRestore }: VersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { versions, loadVersions } = useDocumentVersions(documentId);
  
  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, loadVersions]);
  
  const handleRestore = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    
    onRestore(version.content);
    toast.success('Document restored to previous version');
    onClose();
  };
  
  const handleDownload = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    
    // Create a blob and download it
    const blob = new Blob([version.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${version.name}_${format(new Date(version.timestamp), 'yyyy-MM-dd_HH-mm')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Version downloaded');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="border-l border-border h-full flex flex-col bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <h3 className="font-medium">Version History</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {versions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No previous versions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Versions are saved automatically as you edit
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map(version => (
              <div 
                key={version.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedVersion === version.id ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedVersion(
                  selectedVersion === version.id ? null : version.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">
                      {version.name}
                      {version.isCurrent && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary py-0.5 px-1.5 rounded-full">
                          Current
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(version.timestamp), 'MMM d, yyyy h:mm a')}
                      {version.author && ` • ${version.author.name}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(version.id);
                      }}
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                {selectedVersion === version.id && !version.isCurrent && (
                  <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVersion(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version.id);
                      }}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Restore this version
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
