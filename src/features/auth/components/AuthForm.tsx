import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Link } from 'react-router-dom';
import {
  Loader2, Heart, Stethoscope, Eye, EyeOff, Mail, Lock, User,
  FileText, ShieldCheck, ArrowRight, HelpCircle, CheckCircle2,
} from 'lucide-react';
import { authSchema, loginSchema, AuthFormData, LoginFormData } from '@/lib/validations';
import { GENOTYPES } from '@/lib/constants';

const AuthForm = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGenotype, setSelectedGenotype] = useState('');

  const schema = isLogin ? loginSchema : authSchema;
  const form = useForm<AuthFormData | LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', fullName: '', role: 'patient', genotype: '', bio: '' },
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const mx = (e.clientX - window.innerWidth / 2) * 0.008;
      const my = (e.clientY - window.innerHeight / 2) * 0.008;
      document.querySelectorAll<HTMLElement>('.auth-orb').forEach((orb, i) => {
        const d = (i + 1) * 0.6;
        orb.style.transform = `translate(${mx * d}px, ${my * d}px)`;
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  if (user) return <Navigate to="/community" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1326]">
        <Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" />
      </div>
    );
  }

  const onSubmit = async (data: AuthFormData | LoginFormData) => {
    if (isLogin) {
      const { error } = await signIn(data.email, data.password);
      if (error) toast({ title: 'Login Failed', description: error, variant: 'destructive' });
      else toast({ title: 'Welcome back!', description: "You've successfully logged in" });
    } else {
      const d = data as AuthFormData;
      if (d.role === 'patient' && !d.genotype) {
        toast({ title: 'Missing Genotype', description: 'Please select your genotype', variant: 'destructive' });
        return;
      }
      const { error } = await signUp({
        email: d.email, password: d.password, fullName: d.fullName,
        role: d.role, genotype: d.role === 'patient' ? d.genotype : undefined, bio: d.bio,
      });
      if (error) toast({ title: 'Registration Failed', description: error, variant: 'destructive' });
      else toast({ title: 'Welcome to SickleConnect!', description: 'Your account has been created' });
    }
  };

  const inputBase = 'w-full bg-[#222a3d] border border-[#484555] text-[#dae2fd] rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#cabeff] focus:border-[#cabeff] transition-all placeholder:text-[#938ea1]';
  const labelBase = 'block text-sm font-semibold text-[#c9c4d8] px-1 tracking-wide';
  const errorMsg = 'text-xs text-[#ffb4ab] mt-1 ml-1';

  const watchRole = form.watch('role');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1326] text-[#dae2fd] overflow-x-hidden relative">
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 60px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(202, 190, 255, 0.35); }
          70% { box-shadow: 0 0 0 14px rgba(202, 190, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(202, 190, 255, 0); }
        }
      `}</style>

      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="auth-orb absolute w-[400px] h-[400px] rounded-full bg-[#603de2] opacity-[0.35] blur-[80px] -top-[10%] -left-[10%]" style={{ animation: 'float 20s infinite alternate' }} />
        <div className="auth-orb absolute w-[300px] h-[300px] rounded-full bg-[#44e2cd] opacity-[0.35] blur-[80px] -bottom-[5%] -right-[5%]" style={{ animation: 'float 25s infinite alternate-reverse' }} />
        <div className="auth-orb absolute w-[250px] h-[250px] rounded-full bg-[#e364a7] opacity-[0.35] blur-[80px] top-[40%] right-[15%]" style={{ animation: 'float 18s infinite alternate' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#cabeff]/5 rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 py-4">
        <span className="text-2xl md:text-3xl font-bold text-[#cabeff] tracking-tight">
          SickleConnect
        </span>
        <Link to="/about" className="text-[#c9c4d8] hover:text-[#44e2cd] transition-colors">
          <HelpCircle className="h-5 w-5" />
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[540px]"
        >
          {/* Glass card */}
          <div
            className="rounded-2xl p-8 md:p-10 transition-all duration-500"
            style={{
              background: 'rgba(23, 31, 51, 0.6)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 80px -20px rgba(202, 190, 255, 0.15)',
            }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login-head' : 'signup-head'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {isLogin ? (
                    <>
                      <div className="flex items-center justify-center gap-2.5 mb-6">
                        <Heart className="h-9 w-9 text-[#cabeff] fill-[#cabeff]/20" />
                        <h1 className="text-3xl md:text-4xl font-bold text-[#cabeff] tracking-tight">SickleConnect</h1>
                      </div>
                      <h2 className="text-2xl font-semibold text-[#dae2fd] mb-1.5">Welcome Back</h2>
                      <p className="text-sm text-[#c9c4d8]">Your community is waiting for you.</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-[32px] font-semibold text-[#cabeff] mb-2 leading-tight">Join the Ecosystem</h2>
                      <p className="text-sm text-[#c9c4d8]">Create your profile to connect with warriors and experts.</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name (register) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label htmlFor="fullName" className={labelBase}>Full Name</label>
                    <input id="fullName" {...form.register('fullName')} placeholder="John Doe" className={inputBase} />
                    {form.formState.errors.fullName && <p className={errorMsg}>{form.formState.errors.fullName.message}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className={labelBase}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#938ea1]" />
                  <input id="email" type="email" {...form.register('email')} placeholder="warrior@connect.com" className={`${inputBase} pl-11`} />
                </div>
                {form.formState.errors.email && <p className={errorMsg}>{form.formState.errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className={labelBase}>Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => toast({ title: 'Coming Soon', description: 'Password reset will be available soon.' })}
                      className="text-xs font-semibold text-[#cabeff] hover:text-[#44e2cd] transition-colors px-1"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#938ea1]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...form.register('password')}
                    placeholder="••••••••"
                    className={`${inputBase} pl-11 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#938ea1] hover:text-[#dae2fd] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {form.formState.errors.password && <p className={errorMsg}>{form.formState.errors.password.message}</p>}
              </div>

              {/* Registration-only fields */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="register-extra"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {/* Role selector */}
                    <div className="space-y-3">
                      <label className={labelBase}>I am a...</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'patient', label: 'Patient', Icon: User, accent: '#cabeff' },
                          { value: 'doctor', label: 'Doctor', Icon: Stethoscope, accent: '#ffafd3' },
                        ].map(r => {
                          const active = watchRole === r.value;
                          return (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => form.setValue('role', r.value as 'patient' | 'doctor')}
                              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all group ${
                                active
                                  ? 'border-[' + r.accent + '] bg-[' + r.accent + ']/10'
                                  : 'border-[#484555] bg-[#131b2e] hover:border-[#cabeff]/50'
                              }`}
                              style={active ? { borderColor: r.accent, backgroundColor: r.accent + '1a' } : {}}
                            >
                              <r.Icon
                                className="h-6 w-6 transition-transform group-hover:scale-110"
                                style={{ color: r.accent }}
                              />
                              <span className="text-sm font-semibold">{r.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Genotype grid (patient only) */}
                    <AnimatePresence>
                      {watchRole === 'patient' && (
                        <motion.div
                          key="genotype-grid"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <label className={labelBase}>Genotype</label>
                          <div className="grid grid-cols-3 gap-2">
                            {GENOTYPES.map(g => {
                              const active = selectedGenotype === g.value;
                              return (
                                <button
                                  key={g.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedGenotype(g.value);
                                    form.setValue('genotype', g.value);
                                  }}
                                  className={`py-2.5 border rounded-lg text-sm font-semibold transition-all ${
                                    active
                                      ? 'border-[#44e2cd] bg-[#44e2cd]/10 text-[#44e2cd]'
                                      : 'border-[#484555] text-[#c9c4d8] hover:border-[#44e2cd]/50'
                                  }`}
                                >
                                  {g.value}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label htmlFor="bio" className={labelBase}>Bio (Optional)</label>
                      <input id="bio" {...form.register('bio')} placeholder="Tell us about yourself" className={inputBase} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember me (login) */}
              {isLogin && (
                <div className="flex items-center gap-3 px-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-[18px] h-[18px] rounded border-[#484555] bg-[#222a3d] text-[#cabeff] focus:ring-[#cabeff]/30 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-sm text-[#c9c4d8] cursor-pointer select-none">Keep me signed in</label>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full py-4 rounded-xl font-semibold text-lg text-[#0b1326] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #cabeff 0%, #44e2cd 100%)',
                  animation: isLogin ? 'pulse-glow 2s infinite' : 'none',
                }}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : null}
                {isLogin ? 'Sign In' : 'Create Account'}
                {!form.formState.isSubmitting && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            {/* Toggle + security badge */}
            <div className="mt-8 pt-8 border-t border-[#484555]/30 flex flex-col items-center gap-4">
              <p className="text-sm text-[#c9c4d8]">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setSelectedGenotype(''); form.reset(); }}
                  className="text-[#cabeff] font-bold hover:text-[#44e2cd] transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>

              <div className="flex items-center gap-2 bg-[#2d3449]/50 px-4 py-2 rounded-full border border-[#484555]/20">
                <ShieldCheck className="h-4 w-4 text-[#44e2cd]" />
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#c9c4d8]/80">Secure &amp; Private</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 flex flex-col md:flex-row justify-center items-center gap-6 bg-transparent">
        <span className="text-[#cabeff] text-xl font-semibold">SickleConnect</span>
        <div className="flex gap-6">
          <span className="text-xs font-semibold text-[#c9c4d8]/40">Privacy Policy</span>
          <span className="text-[#c9c4d8]/20">&bull;</span>
          <span className="text-xs font-semibold text-[#c9c4d8]/40">Terms of Service</span>
          <span className="text-[#c9c4d8]/20">&bull;</span>
          <span className="text-xs font-semibold text-[#c9c4d8]/40">Support</span>
        </div>
        <span className="text-xs font-semibold text-[#c9c4d8]/40">&copy; {new Date().getFullYear()} SickleConnect. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default AuthForm;
