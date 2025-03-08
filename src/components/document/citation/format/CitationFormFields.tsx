
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CitationFormData {
  title: string;
  year: number;
  volume: string;
  reporter: string;
  court: string;
  pageNumber: string;
  pinpoint: string;
}

interface CitationFormFieldsProps {
  data: CitationFormData;
  onChange: (field: string, value: any) => void;
}

export function CitationFormFields({ data, onChange }: CitationFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="citation-title">Case Name/Title</Label>
        <Input
          id="citation-title"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g., Roe v. Wade"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="citation-year">Year</Label>
          <Input
            id="citation-year"
            type="number"
            value={data.year}
            onChange={(e) => onChange('year', parseInt(e.target.value) || data.year)}
            placeholder="e.g., 2023"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="citation-volume">Volume</Label>
          <Input
            id="citation-volume"
            value={data.volume}
            onChange={(e) => onChange('volume', e.target.value)}
            placeholder="e.g., 410"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="citation-reporter">Reporter</Label>
          <Input
            id="citation-reporter"
            value={data.reporter}
            onChange={(e) => onChange('reporter', e.target.value)}
            placeholder="e.g., U.S."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="citation-page">Page Number</Label>
          <Input
            id="citation-page"
            value={data.pageNumber}
            onChange={(e) => onChange('pageNumber', e.target.value)}
            placeholder="e.g., 113"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="citation-court">Court</Label>
        <Input
          id="citation-court"
          value={data.court}
          onChange={(e) => onChange('court', e.target.value)}
          placeholder="e.g., Supreme Court"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="citation-pinpoint">Pinpoint Citation</Label>
        <Input
          id="citation-pinpoint"
          value={data.pinpoint}
          onChange={(e) => onChange('pinpoint', e.target.value)}
          placeholder="e.g., 115-116"
        />
      </div>
    </>
  );
}
