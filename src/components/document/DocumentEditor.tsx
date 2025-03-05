
import { 
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentEditorProps {
  documentContent: string;
  setDocumentContent: (content: string) => void;
}

const DocumentEditor = ({ 
  documentContent, 
  setDocumentContent 
}: DocumentEditorProps) => {
  return (
    <div className="border rounded-xl overflow-hidden mb-6">
      <div className="border-t p-1 flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Underline className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <AlignRight className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="p-6">
        <textarea
          value={documentContent}
          onChange={(e) => setDocumentContent(e.target.value)}
          className="w-full min-h-[600px] p-0 border-none focus:ring-0 resize-none font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default DocumentEditor;
