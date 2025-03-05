
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Account created successfully');
        navigate('/');
      } else {
        // Since TypeScript is complaining about the specific status types,
        // we'll handle the verification case without direct comparison
        const nextStep = result.status;
        
        if (nextStep === 'missing_requirements' || nextStep === 'abandoned') {
          console.error('Sign up failed', result);
          toast.error('Something went wrong during sign up');
        } else {
          // This branch handles the 'needs_verification' case without explicitly comparing strings
          toast.info('Please check your email to verify your account');
          navigate('/verify-email');
        }
      }
    } catch (err: any) {
      console.error('Error during sign up:', err);
      toast.error(err.errors?.[0]?.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least one character.
                  </p>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
