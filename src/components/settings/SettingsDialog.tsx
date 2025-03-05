
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CreditCard, UserCircle } from 'lucide-react';
import { toast } from "sonner";

type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  tier: SubscriptionTier;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free-plan',
    name: 'Free Plan',
    description: 'Basic features for legal professionals getting started',
    price: '$0',
    features: [
      'Basic legal research',
      'Limited document drafting',
      'Single user only'
    ],
    tier: 'free'
  },
  {
    id: 'pro-plan',
    name: 'Professional',
    description: 'Advanced features for legal practitioners',
    price: '$29.99/month',
    features: [
      'Advanced legal research',
      'Unlimited document drafting',
      'Case management',
      'Priority support'
    ],
    tier: 'pro'
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise',
    description: 'Full-featured solution for law firms',
    price: '$99.99/month',
    features: [
      'All Professional features',
      'Team collaboration',
      'Custom templates',
      'Advanced analytics',
      'Dedicated support'
    ],
    tier: 'enterprise'
  }
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionTier>('free');
  
  const handleSubscribe = (planTier: SubscriptionTier) => {
    // In a real app, this would open a payment form or redirect to payment processor
    if (planTier === currentSubscription) {
      toast.info("You are already subscribed to this plan");
      return;
    }
    
    // Simulate subscription change
    toast.success(`Successfully subscribed to ${planTier} plan!`);
    setCurrentSubscription(planTier);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and subscription
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="subscription">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="space-y-4 py-4">
            <h3 className="text-lg font-medium">Choose your subscription plan</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${
                    currentSubscription === plan.tier ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                  }`}
                >
                  {currentSubscription === plan.tier && (
                    <div className="absolute -top-2 -right-2 rounded-full bg-primary px-2 py-1 text-xs text-white">
                      Current
                    </div>
                  )}
                  <h4 className="text-base font-semibold">{plan.name}</h4>
                  <p className="text-2xl font-bold py-2">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={currentSubscription === plan.tier ? "outline" : "default"}
                    onClick={() => handleSubscribe(plan.tier)}
                  >
                    {currentSubscription === plan.tier ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-muted/50">
                  John Doe (from user profile)
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-muted/50">
                  Attorney (from user profile)
                </div>
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <div className="flex items-center gap-2 mt-1 p-2 border rounded-md bg-muted/50">
                  Corporate (from user profile)
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
