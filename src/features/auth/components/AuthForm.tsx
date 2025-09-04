import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Loader2, Heart, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { authSchema, loginSchema, AuthFormData, LoginFormData } from '@/lib/validations';
import { GENOTYPES, USER_ROLES } from '@/lib/constants';

const AuthForm = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const schema = isLogin ? loginSchema : authSchema;
  const form = useForm<AuthFormData | LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      role: 'patient',
      genotype: '',
      bio: '',
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/community" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const onSubmit = async (data: AuthFormData | LoginFormData) => {
    if (isLogin) {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in",
        });
      }
    } else {
      const authData = data as AuthFormData;
      if (authData.role === 'patient' && !authData.genotype) {
        toast({
          title: "Missing Genotype",
          description: "Please select your genotype",
          variant: "destructive"
        });
        return;
      }

      const { error } = await signUp({
        email: authData.email,
        password: authData.password,
        fullName: authData.fullName,
        role: authData.role,
        genotype: authData.role === 'patient' ? authData.genotype : undefined,
        bio: authData.bio,
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome to SickleConnect!",
          description: "Your account has been created successfully",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SickleConnect</h1>
          </div>
          <CardTitle>{isLogin ? 'Welcome Back' : 'Join Our Community'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...form.register('fullName')}
                  placeholder="Enter your full name"
                  aria-describedby={form.formState.errors.fullName ? 'fullName-error' : undefined}
                />
                {form.formState.errors.fullName && (
                  <p id="fullName-error" className="text-sm text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Enter your email"
                aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
              />
              {form.formState.errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register('password')}
                  placeholder="Enter your password"
                  aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={`${showPassword ? 'Hide' : 'Show'} password`}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a:</Label>
                  <Select onValueChange={(value) => form.setValue('role', value as 'patient' | 'doctor')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            {role.icon === 'Heart' ? (
                              <Heart className="h-4 w-4" />
                            ) : (
                              <Stethoscope className="h-4 w-4" />
                            )}
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {form.watch('role') === 'patient' && (
                  <div className="space-y-2">
                    <Label htmlFor="genotype">Genotype</Label>
                    <Select onValueChange={(value) => form.setValue('genotype', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your genotype" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENOTYPES.map((genotype) => (
                          <SelectItem key={genotype.value} value={genotype.value}>
                            {genotype.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Input
                    id="bio"
                    {...form.register('bio')}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                form.reset();
              }}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
