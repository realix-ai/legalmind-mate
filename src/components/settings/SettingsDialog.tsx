
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
import { CreditCard, Shield, Zap } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  tier: SubscriptionTier;
  badge?: string;
  icon: React.ReactNode;
  color: string;
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
    tier: 'free',
    icon: <Shield className="h-5 w-5 text-blue-400" />,
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
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
    tier: 'pro',
    badge: 'Popular',
    icon: <Zap className="h-5 w-5 text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
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
    tier: 'enterprise',
    icon: <CreditCard className="h-5 w-5 text-emerald-500" />,
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6" />
            <span>Subscription Plans</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose the perfect subscription plan to enhance your legal practice
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={cn(
                  "relative transition-all hover:shadow-md", 
                  currentSubscription === plan.tier 
                    ? "border-2 border-primary shadow-md" 
                    : "border"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-primary hover:bg-primary/90 px-3 py-1 rounded-full text-xs font-medium">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={cn("rounded-t-lg", plan.color)}>
                  <div className="flex justify-between items-center mb-2">
                    {plan.icon}
                    {currentSubscription === plan.tier && (
                      <Badge variant="outline" className="bg-white/80 dark:bg-black/20 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                  <div className="mt-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    {plan.tier !== 'free' && <span className="text-sm text-muted-foreground">/month</span>}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <CardDescription className="mb-4">{plan.description}</CardDescription>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 text-primary flex-shrink-0">
                          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full" 
                    variant={currentSubscription === plan.tier ? "outline" : "default"}
                    onClick={() => handleSubscribe(plan.tier)}
                  >
                    {currentSubscription === plan.tier ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 text-sm">
            <h3 className="font-medium mb-2">Need help choosing?</h3>
            <p className="text-muted-foreground">
              Contact our sales team at <span className="text-primary font-medium">sales@realix.ai</span> for a personalized consultation 
              or to discuss custom enterprise solutions for your organization.
            </p>
          </div>
        </div>
        
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
