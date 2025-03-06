
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('<p>Welcome to the <strong>Realix.ai</strong> rich text editor!</p><p><br></p><p>This is a <em>powerful</em> editor that supports:</p><ul><li>Rich formatting</li><li>Lists and bullets</li><li>Colors and highlighting</li><li>Links and more</li></ul>');
  
  // Log to check if the component is rendering
  useEffect(() => {
    console.log('Index component rendered');
  }, []);

  const handleSave = () => {
    toast.success('Content saved successfully!');
    console.log('Editor content:', editorContent);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-16">
        <HeroSection />
        
        {/* Rich Text Editor Demo */}
        <div className="container max-w-4xl mx-auto my-16 px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Try Our Rich Text Editor</h2>
            <p className="text-muted-foreground mb-6">
              Experience our powerful yet simple editing interface - perfect for legal documents
            </p>
            <Button 
              onClick={() => setShowEditor(!showEditor)}
              variant="outline"
              className="mb-8"
            >
              {showEditor ? 'Hide Editor' : 'Show Editor'}
            </Button>
          </div>
          
          {showEditor && (
            <div className="space-y-4">
              <RichTextEditor 
                initialValue={editorContent}
                onChange={setEditorContent}
                title="Document Editor"
              />
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Document</Button>
              </div>
            </div>
          )}
        </div>
        
        <FeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
