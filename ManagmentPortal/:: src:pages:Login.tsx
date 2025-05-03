// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/client/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      
      // If remember me is checked, set a longer session persistence
      // This would be implemented in the auth context
      
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-rise-dark-green py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/085c276e-2ff2-4122-8590-8c48682c78c8.png" 
            alt="Logo R.I.S.E" 
            className="h-24 w-24"
          />
        </div>
        
        <Card className="bg-white/5 backdrop-blur-sm border-rise-gold/30">
          <CardHeader>
            <CardTitle className="text-center font-alta text-rise-gold text-3xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-white">
              Sign in to access your R.I.S.E. portal
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-rise-gold/30 text-white placeholder:text-white/50"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-rise-gold hover:text-rise-gold/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-rise-gold/30 text-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-white text-sm">
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-rise-gold hover:bg-rise-gold/90 text-rise-dark-green font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;