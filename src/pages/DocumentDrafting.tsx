
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import DocumentTemplate from '@/components/DocumentTemplate';
import { 
  Save, 
  Download, 
  Share2,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ListOrdered,
  List
} from 'lucide-react';

const DocumentDrafting = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [documentContent, setDocumentContent] = useState('');
  
  const templates = [
    {
      id: 'contract-service',
      title: 'Service Agreement',
      description: 'Standard contract for professional services',
      category: 'Contract'
    },
    {
      id: 'contract-nda',
      title: 'Non-Disclosure Agreement',
      description: 'Confidentiality agreement between parties',
      category: 'Contract'
    },
    {
      id: 'litigation-complaint',
      title: 'Complaint',
      description: 'Initial pleading to start a lawsuit',
      category: 'Litigation'
    },
    {
      id: 'litigation-motion',
      title: 'Motion for Summary Judgment',
      description: 'Request for judgment without full trial',
      category: 'Litigation'
    },
    {
      id: 'corporate-bylaws',
      title: 'Corporate Bylaws',
      description: 'Rules governing a corporation',
      category: 'Corporate'
    },
    {
      id: 'ip-trademark',
      title: 'Trademark Application',
      description: 'Application for trademark registration',
      category: 'IP'
    }
  ];
  
  const getTemplateContent = (id: string) => {
    const templateContents: Record<string, string> = {
      'contract-service': `SERVICE AGREEMENT

THIS SERVICE AGREEMENT (the "Agreement") is made and entered into as of [DATE], by and between [CLIENT NAME], a [STATE] [entity type] ("Client") and [SERVICE PROVIDER NAME], a [STATE] [entity type] ("Service Provider").

1. SERVICES
   Service Provider shall perform the following services for Client (the "Services"):
   [DESCRIBE SERVICES IN DETAIL]

2. TERM
   This Agreement shall commence on [START DATE] and continue until [END DATE], unless earlier terminated in accordance with Section 7.

3. COMPENSATION
   In consideration for the Services, Client shall pay Service Provider as follows:
   [PAYMENT TERMS]

4. INTELLECTUAL PROPERTY
   All intellectual property rights in any materials produced under this Agreement shall be the property of [OWNER].

5. CONFIDENTIALITY
   Each party agrees to keep confidential all non-public information disclosed by the other party.

6. REPRESENTATIONS AND WARRANTIES
   Service Provider represents and warrants that:
   (a) It has the right and authority to enter into and perform its obligations under this Agreement.
   (b) The Services will be performed in a professional manner consistent with industry standards.

7. TERMINATION
   This Agreement may be terminated:
   (a) By either party upon [NOTICE PERIOD] written notice to the other party.
   (b) Immediately by either party in the event of a material breach by the other party.

8. LIMITATION OF LIABILITY
   NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of the State of [STATE].

10. MISCELLANEOUS
    (a) This Agreement constitutes the entire agreement between the parties.
    (b) This Agreement may only be modified by a written amendment signed by both parties.
    (c) If any provision of this Agreement is found to be invalid, the remaining provisions shall remain in effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

CLIENT:
[CLIENT NAME]

By: ________________________
Name: 
Title:

SERVICE PROVIDER:
[SERVICE PROVIDER NAME]

By: ________________________
Name:
Title:`,

      'litigation-complaint': `IN THE [COURT NAME]
[JURISDICTION]

[PLAINTIFF NAME],            )
                             )
          Plaintiff,         )
                             )    Case No. _______________
     v.                      )
                             )    COMPLAINT
[DEFENDANT NAME],            )
                             )    JURY TRIAL DEMANDED
          Defendant.         )

COMPLAINT

Plaintiff [PLAINTIFF NAME] ("Plaintiff"), by and through its undersigned counsel, hereby brings this Complaint against Defendant [DEFENDANT NAME] ("Defendant"), and alleges as follows:

NATURE OF THE ACTION

1. This is an action for [CAUSE OF ACTION] arising from Defendant's [GENERAL DESCRIPTION OF WRONGFUL CONDUCT].

PARTIES

2. Plaintiff [PLAINTIFF NAME] is a [INDIVIDUAL/ENTITY TYPE] with its principal place of [RESIDENCE/BUSINESS] at [ADDRESS].

3. Upon information and belief, Defendant [DEFENDANT NAME] is a [INDIVIDUAL/ENTITY TYPE] with its principal place of [RESIDENCE/BUSINESS] at [ADDRESS].

JURISDICTION AND VENUE

4. This Court has [SUBJECT MATTER] jurisdiction over this action pursuant to [JURISDICTION STATUTE/RULE].

5. Venue is proper in this Court pursuant to [VENUE STATUTE/RULE].

FACTUAL ALLEGATIONS

6. [DETAILED FACTUAL ALLEGATIONS]

7. [CONTINUE WITH NUMBERED PARAGRAPHS]

COUNT I: [FIRST CAUSE OF ACTION]

8. Plaintiff repeats and realleges each and every allegation contained in paragraphs 1 through [LAST PARAGRAPH OF FACTUAL ALLEGATIONS] above as if fully set forth herein.

9. [ELEMENTS OF FIRST CAUSE OF ACTION]

10. As a direct and proximate result of Defendant's conduct, Plaintiff has suffered damages in an amount to be determined at trial.

COUNT II: [SECOND CAUSE OF ACTION]

11. Plaintiff repeats and realleges each and every allegation contained in paragraphs 1 through [LAST PARAGRAPH OF FACTUAL ALLEGATIONS] above as if fully set forth herein.

12. [ELEMENTS OF SECOND CAUSE OF ACTION]

13. As a direct and proximate result of Defendant's conduct, Plaintiff has suffered damages in an amount to be determined at trial.

PRAYER FOR RELIEF

WHEREFORE, Plaintiff respectfully requests that this Court enter judgment in favor of Plaintiff and against Defendant as follows:

a. [REQUESTED RELIEF]

b. [ADDITIONAL REQUESTED RELIEF]

c. Such other and further relief as the Court deems just and proper.

JURY DEMAND

Plaintiff hereby demands a trial by jury on all issues so triable.

Dated: [DATE]                   Respectfully submitted,

                                [LAW FIRM NAME]

                                By: __________________________
                                [ATTORNEY NAME]
                                [ADDRESS]
                                [PHONE]
                                [EMAIL]
                                Attorney for Plaintiff`
    };
    
    return templateContents[id] || `[Template content for ${id}]`;
  };
  
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setDocumentContent(getTemplateContent(id));
  };
  
  const handleNewDocument = () => {
    setSelectedTemplate(null);
    setDocumentTitle('Untitled Document');
    setDocumentContent('');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        {!selectedTemplate ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-semibold mb-4 text-center"
            >
              Document Drafting
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground text-center mb-10"
            >
              Create a new document or select from our professional templates.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mb-10">
              <Button 
                size="lg" 
                onClick={() => handleSelectTemplate('new')}
                className="mx-auto block"
              >
                Create Blank Document
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-medium mb-6">Templates</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {templates.map((template) => (
                  <DocumentTemplate
                    key={template.id}
                    title={template.title}
                    description={template.description}
                    category={template.category}
                    onClick={() => handleSelectTemplate(template.id)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleNewDocument}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Templates
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="border rounded-xl overflow-hidden mb-6">
              <div className="bg-muted p-4 flex items-center">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 font-medium text-lg w-full"
                />
              </div>
              
              <div className="border-t p-2 flex items-center gap-1 flex-wrap">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ListOrdered className="h-4 w-4" />
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
            
            <div className="text-center text-sm text-muted-foreground">
              All changes are automatically saved as you type.
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DocumentDrafting;
