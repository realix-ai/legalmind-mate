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
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Shield, X, Zap } from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: {
    included: string[];
    excluded?: string[];
  };
  tier: SubscriptionTier;
  badge?: string;
  icon: React.ReactNode;
  color: string;
  highlighted?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free-plan',
    name: 'Free Plan',
    description: 'Basic features for legal professionals getting started',
    price: '$0',
    features: {
      included: [
        'Basic legal research',
        'Limited document drafting',
        'Single user only'
      ],
      excluded: [
        'Advanced research tools',
        'Unlimited documents',
        'Case management',
        'Team collaboration',
        'Priority support'
      ]
    },
    tier: 'free',
    icon: <Shield className="h-5 w-5 text-blue-400" />,
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  },
  {
    id: 'pro-plan',
    name: 'Professional',
    description: 'Advanced features for legal practitioners',
    price: '$29.99',
    features: {
      included: [
        'Advanced legal research',
        'Unlimited document drafting',
        'Case management',
        'Priority support'
      ],
      excluded: [
        'Team collaboration',
        'Custom templates',
        'Advanced analytics'
      ]
    },
    tier: 'pro',
    badge: 'Most Popular',
    icon: <Zap className="h-5 w-5 text-purple-500" />,
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    highlighted: true
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise',
    description: 'Full-featured solution for law firms',
    price: '$99.99',
    features: {
      included: [
        'All Professional features',
        'Team collaboration',
        'Custom templates',
        'Advanced analytics',
        'Dedicated support'
      ]
    },
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
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
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

  const priceMultiplier = viewMode === 'yearly' ? 10 : 1;
  const billingLabel = viewMode === 'yearly' ? '/year' : '/month';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <CreditCard className="h-6 w-6" />
            <span>Subscription Plans</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose the perfect subscription plan to enhance your legal practice
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'monthly' | 'yearly')}>
            <div className="flex justify-center mb-4">
              <TabsList className="grid w-[300px] grid-cols-2">
                <TabsTrigger value="monthly">
                  Monthly Billing
                </TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly Billing
                  <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Save 17%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={cn(
                  "relative transition-all hover:shadow-md", 
                  currentSubscription === plan.tier 
                    ? "border-2 border-primary shadow-md" 
                    : plan.highlighted
                      ? "border-2 border-purple-400 dark:border-purple-500 shadow-md"
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
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  
                  <div className="mt-3 flex items-baseline">
                    <span className="text-3xl font-extrabold">
                      {plan.tier === 'free' ? plan.price : `$${(parseFloat(plan.price.replace('$', '')) * priceMultiplier).toFixed(2)}`}
                    </span>
                    {plan.tier !== 'free' && (
                      <span className="ml-1 text-sm text-muted-foreground">{billingLabel}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <CardDescription className="mb-4 text-sm">{plan.description}</CardDescription>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">What's included:</h4>
                    <ul className="space-y-2.5 text-sm">
                      {plan.features.included.map((feature, index) => (
                        <li key={`included-${index}`} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.features.excluded && plan.features.excluded.length > 0 && (
                      <>
                        <h4 className="text-sm font-medium text-muted-foreground pt-2">Not included:</h4>
                        <ul className="space-y-2.5 text-sm">
                          {plan.features.excluded.map((feature, index) => (
                            <li key={`excluded-${index}`} className="flex items-start gap-2">
                              <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className={cn(
                      "w-full",
                      plan.highlighted && currentSubscription !== plan.tier 
                        ? "bg-purple-600 hover:bg-purple-700 text-white" 
                        : ""
                    )}
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
            <h3 className="font-medium mb-2">Need a custom plan for your organization?</h3>
            <p className="text-muted-foreground mb-3">
              Contact our sales team for a personalized consultation or to discuss custom enterprise solutions 
              tailored to your firm's specific requirements.
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">Contact Sales</Button>
              <span className="text-muted-foreground">or email us at</span>
              <span className="text-primary font-medium">sales@realix.ai</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
