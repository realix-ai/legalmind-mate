
import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  Copy, 
  Mail, 
  Printer, 
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  exportAsPdf, 
  exportAsDocx, 
  exportAsText, 
  exportAsHtml, 
  exportAsMarkdown,
  ExportOptions
} from '@/services/documentExportService';

interface ExportOptionsProps {
  documentTitle: string;
  documentContent: string;
}

const ExportOptions = ({ documentTitle, documentContent }: ExportOptionsProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includePageNumbers: true,
    includeDatetime: true,
    includeHeaders: false,
    headerText: documentTitle,
    footerText: '',
    margins: {
      top: 1,
      right: 1,
      bottom: 1,
      left: 1
    },
    fontSize: 12,
    fontFamily: 'Times New Roman'
  });

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(documentContent);
    toast.success('Document content copied to clipboard');
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions({
      ...exportOptions,
      [key]: value
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body {
                font-family: ${exportOptions.fontFamily}, serif;
                font-size: ${exportOptions.fontSize}pt;
                margin: ${exportOptions.margins?.top}in ${exportOptions.margins?.right}in ${exportOptions.margins?.bottom}in ${exportOptions.margins?.left}in;
              }
              .header, .footer {
                text-align: center;
                color: #666;
                font-size: 10pt;
              }
              .content {
                margin-top: 0.5in;
                margin-bottom: 0.5in;
              }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            ${exportOptions.includeHeaders && exportOptions.headerText ? `<div class="header">${exportOptions.headerText}</div>` : ''}
            <div class="content">${documentContent.replace(/\n/g, '<br>')}</div>
            ${exportOptions.includeDatetime ? `<div class="footer">Generated on ${new Date().toLocaleString()}</div>` : ''}
            ${exportOptions.includePageNumbers ? `<div class="footer">Page <span class="pageNumber"></span></div>` : ''}
            <button onclick="window.print(); window.close();" style="margin-top: 20px; padding: 10px 15px; background-color: #0f172a; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportEmail = () => {
    const subject = encodeURIComponent(documentTitle);
    const body = encodeURIComponent(documentContent);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success('Email client opened with document content');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExportEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => exportAsPdf(documentTitle, documentContent, exportOptions)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsDocx(documentTitle, documentContent, exportOptions)}>
            <File className="h-4 w-4 mr-2" />
            Export as DOCX
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsText(documentTitle, documentContent)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as TXT
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsHtml(documentTitle, documentContent, exportOptions)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsMarkdown(documentTitle, documentContent)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Share2 className="h-4 w-4 mr-2" />
                Advanced Options
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Options</DialogTitle>
                <DialogDescription>
                  Configure document export settings
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pageNumbers" 
                    checked={exportOptions.includePageNumbers}
                    onCheckedChange={(checked) => handleOptionChange('includePageNumbers', !!checked)}
                  />
                  <Label htmlFor="pageNumbers">Include page numbers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="datetime" 
                    checked={exportOptions.includeDatetime}
                    onCheckedChange={(checked) => handleOptionChange('includeDatetime', !!checked)}
                  />
                  <Label htmlFor="datetime">Include date and time</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="headers" 
                    checked={exportOptions.includeHeaders}
                    onCheckedChange={(checked) => handleOptionChange('includeHeaders', !!checked)}
                  />
                  <Label htmlFor="headers">Include headers/footers</Label>
                </div>
                
                {exportOptions.includeHeaders && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="headerText" className="text-right">Header:</Label>
                      <Input 
                        id="headerText" 
                        value={exportOptions.headerText || ''}
                        onChange={(e) => handleOptionChange('headerText', e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="footerText" className="text-right">Footer:</Label>
                      <Input 
                        id="footerText" 
                        value={exportOptions.footerText || ''}
                        onChange={(e) => handleOptionChange('footerText', e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="fontSize" className="text-right">Font Size:</Label>
                  <Input 
                    id="fontSize" 
                    type="number"
                    min="8"
                    max="24"
                    value={exportOptions.fontSize || 12}
                    onChange={(e) => handleOptionChange('fontSize', parseInt(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="fontFamily" className="text-right">Font:</Label>
                  <select
                    id="fontFamily"
                    value={exportOptions.fontFamily || 'Times New Roman'}
                    onChange={(e) => handleOptionChange('fontFamily', e.target.value)}
                    className="col-span-3 p-2 border rounded"
                  >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  onClick={() => exportAsPdf(documentTitle, documentContent, exportOptions)}
                >
                  Export as PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ExportOptions;
