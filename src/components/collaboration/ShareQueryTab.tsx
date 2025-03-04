
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Trash } from 'lucide-react';
import { 
  shareQuery,
  generateShareLink,
  deleteSharedQuery,
  SharedQuery
} from '@/services/collaborationService';
import { formatRelativeTime } from './utils';

interface ShareQueryTabProps {
  sharedQueries: SharedQuery[];
  setSharedQueries: React.Dispatch<React.SetStateAction<SharedQuery[]>>;
}

const ShareQueryTab = ({ sharedQueries, setSharedQueries }: ShareQueryTabProps) => {
  const [shareURL, setShareURL] = useState('');
  const [queryToShare, setQueryToShare] = useState('');
  const [queryType, setQueryType] = useState('legal-research');
  
  const handleGenerateShareLink = () => {
    if (!queryToShare.trim()) {
      toast.error('Please enter a query to share');
      return;
    }
    
    const newLink = generateShareLink(queryToShare);
    setShareURL(newLink);
    
    // Create shared query in storage
    const newQuery = shareQuery(queryToShare, queryType);
    setSharedQueries([newQuery, ...sharedQueries]);
    
    toast.success('Share link generated successfully');
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareURL);
    toast.success('Link copied to clipboard');
  };
  
  const handleDeleteQuery = (id: string) => {
    if (deleteSharedQuery(id)) {
      setSharedQueries(sharedQueries.filter(query => query.id !== id));
      toast.success('Query deleted successfully');
    }
  };
  
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Share your current query with the team</p>
        
        <div className="space-y-3">
          <Input
            value={queryToShare}
            onChange={(e) => setQueryToShare(e.target.value)}
            placeholder="Enter a query to share"
          />
          
          <div className="flex space-x-2">
            <select 
              className="px-3 py-2 border rounded-md text-sm bg-background"
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
            >
              <option value="legal-research">Legal Research</option>
              <option value="risk-analysis">Risk Analysis</option>
              <option value="case-summary">Case Summary</option>
              <option value="document-analysis">Document Analysis</option>
            </select>
            
            <Button onClick={handleGenerateShareLink}>
              Generate Link
            </Button>
          </div>
        </div>
        
        {shareURL && (
          <div className="flex gap-2 mt-4">
            <Input
              value={shareURL}
              readOnly
              className="font-mono text-xs"
            />
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <h4 className="text-sm font-medium mb-3">Recently Shared Queries</h4>
        {sharedQueries.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No shared queries yet</p>
        ) : (
          <div className="space-y-2">
            {sharedQueries.map(item => (
              <SharedQueryItem 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteQuery} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface SharedQueryItemProps {
  item: SharedQuery;
  onDelete: (id: string) => void;
}

const SharedQueryItem = ({ item, onDelete }: SharedQueryItemProps) => {
  return (
    <div className="p-3 border rounded-md mb-2 text-sm group">
      <div className="flex justify-between">
        <span className="font-medium">{item.query}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{formatRelativeTime(item.date)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(item.id)}
          >
            <Trash className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
        <span>Shared by: {item.sharedBy}</span>
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5">
          {item.type.replace('-', ' ')}
        </span>
      </div>
      {item.url && (
        <div className="mt-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => {
              navigator.clipboard.writeText(item.url!);
              toast.success('Share link copied to clipboard');
            }}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareQueryTab;
