
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SavedDocument } from '@/utils/documents/types';

interface SearchResultsTableProps {
  results: SavedDocument[];
  isLoading: boolean;
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
}

const SearchResultsTable = ({ 
  results, 
  isLoading, 
  selectedDocumentId, 
  onDocumentSelect 
}: SearchResultsTableProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="text-left py-2 px-4 font-medium text-sm">Document</th>
              <th className="text-left py-2 px-4 font-medium text-sm">Category</th>
              <th className="text-left py-2 px-4 font-medium text-sm">Last Modified</th>
              <th className="text-right py-2 px-4 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="py-2 px-4">{doc.title}</td>
                <td className="py-2 px-4">{doc.category}</td>
                <td className="py-2 px-4">
                  {new Date(doc.lastModified).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 text-right">
                  <Button 
                    size="sm" 
                    onClick={() => onDocumentSelect(doc.id)}
                    disabled={isLoading && selectedDocumentId === doc.id}
                  >
                    {isLoading && selectedDocumentId === doc.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      'Select'
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchResultsTable;
