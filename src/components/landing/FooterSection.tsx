import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useTheme } from "@/hooks/use-theme";

const FooterSection = () => {
  const { theme } = useTheme();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Query Assistant", path: "/query-assistant" },
        { name: "Document Drafting", path: "/document-drafting" },
        { name: "Case Management", path: "/case-management" },
        { name: "Pricing", path: "#" },
        { name: "Testimonials", path: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "#" },
        { name: "Blog", path: "#" },
        { name: "Careers", path: "#" },
        { name: "Press", path: "#" },
        { name: "Contact", path: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "#" },
        { name: "Support", path: "#" },
        { name: "FAQs", path: "#" },
        { name: "Legal", path: "#" },
        { name: "Privacy", path: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 pt-20 pb-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 48 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md"
                >
                  <rect width="48" height="48" rx="12" fill="#0EA5E9" fillOpacity="0.1"/>
                  
                  <path 
                    d="M12 16C12 16 15 32 16 32C17 32 20 20 20 20C20 20 23 32 24 32C25 32 28 16 28 16" 
                    stroke="#0EA5E9" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  
                  <path 
                    d="M20 16C20 16 23 32 24 32C25 32 28 20 28 20C28 20 31 32 32 32C33 32 36 16 36 16" 
                    stroke="#0EA5E9" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                </svg>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Workswise.ai</span>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Transforming legal practice with AI-powered tools for research, document drafting, and case management.
            </p>
            
            <div className="flex gap-4 mb-8">
              {socialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={index} 
                    href={item.href} 
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary/10 transition-colors"
                    aria-label={`Follow us on ${item.icon.name}`}
                  >
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Workswise.ai. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
