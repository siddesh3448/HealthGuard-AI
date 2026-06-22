import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  AlertCircle, 
  Camera, 
  MessageSquare, 
  FileText, 
  Apple
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, email === 'demo@healthguard.ai' ? 'John Doe' : undefined);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your qualifications and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchDemo = () => {
    setEmail('demo@healthguard.ai');
    setPassword('Demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans relative overflow-hidden">
      {/* Background Dot Pattern/Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none">
        <svg width="100%" height="100%">
          <pattern id="login-dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-slate-900 dark:text-slate-100" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#login-dot-pattern)" />
        </svg>
      </div>

      <div className="w-full lg:grid lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: Marketing Panel with the split feature cards (no quote) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-white dark:bg-slate-900 p-12 xl:p-16 flex-col justify-between overflow-y-auto border-r border-slate-100 dark:border-slate-800">
          
          <div className="space-y-6 my-auto max-w-2xl">
            {/* Tag / Badge */}
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary-100/60 dark:bg-brand-primary-950/20 text-brand-primary-700 dark:text-brand-primary-400 text-2xs font-extrabold tracking-wide uppercase border border-brand-primary-500/10">
                <Sparkles size={12} className="animate-pulse" />
                <span>YOUR HEALTH COMPANION</span>
              </span>
            </div>

            {/* Main Value Statement */}
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              One Scan Away From Perfect Peace of Mind.
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 font-medium">
              Protect yourself and your home with simplified food scans, allergen warnings, and ingredient analysis.
            </p>

            {/* Feature Grid: Split into exactly two combined cards sitting directly below headline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              
              {/* Card 1: Food Scanner & AI Assistant */}
              <Card className="bg-slate-50 dark:bg-slate-950 border border-slate-100/70 dark:border-slate-800/80 p-5 rounded-[1.5rem] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                    Food & Diet Guard
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* Food Scanner Unit */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 border border-emerald-200/20">
                      <Camera size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        Food Scanner
                      </h4>
                      <p className="text-3xs sm:text-2xs text-slate-550 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Scan ingredients instantly to detect custom allergens, hidden sugars, or additives.
                      </p>
                    </div>
                  </div>

                  {/* AI Assistant Unit */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-indigo-200/20">
                      <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        AI Health Assistant
                      </h4>
                      <p className="text-3xs sm:text-2xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Chat with clinical-grade AI for quick nutrition advice, recipes, and lifestyle recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card 2: Medicine Scanner & Reports */}
              <Card className="bg-slate-50 dark:bg-slate-950 border border-slate-100/70 dark:border-slate-800/80 p-5 rounded-[1.5rem] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-full">
                    Medicine & Analytics
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Medicine Scanner Unit */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0 border border-rose-200/20">
                      <Activity size={16} className="text-rose-600 dark:text-rose-450" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        Medicine Scanner
                      </h4>
                      <p className="text-3xs sm:text-2xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Cross-examine medicine formulations against diet components to avoid severe active interaction conflicts.
                      </p>
                    </div>
                  </div>

                  {/* Health Reports Unit */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0 border border-amber-200/20">
                      <FileText size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        Health Reports
                      </h4>
                      <p className="text-3xs sm:text-2xs text-slate-550 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Receive weekly updates summarizing logged ingredients and potential allergy risks.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* Bottom Footnote line */}
          <div className="text-4xs text-slate-400 dark:text-slate-500 font-bold flex justify-between pt-6 border-t border-slate-200/40 dark:border-slate-800/40 mt-6 shrink-0">
            <span>&copy; {new Date().getFullYear()} HealthGuard AI Inc.</span>
            <span>FDA & HIPAA Auditing Standards Aligned</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Float Card with Login Form details */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 bg-slate-50 dark:bg-slate-950 min-h-screen">
          
          {/* Main Elevated Card Container Floating on Page */}
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] shadow-xl p-8 sm:p-10 space-y-6">
            
            {/* Logo and Greeting Header */}
            <div className="space-y-2">
              <Logo size="md" />
              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Log in to check safe ingredients, examine medication interactions, and consult your health helper.
                </p>
              </div>
            </div>

            {/* Error Message Alert container */}
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/65 dark:border-rose-900/40 rounded-xl p-3 flex items-start gap-2.5 text-rose-700 dark:text-rose-400">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="text-xs font-semibold">{error}</span>
              </div>
            )}

            {/* Demo Evaluation Access Card */}
            <div className="bg-brand-primary-50/40 dark:bg-brand-primary-950/10 border border-brand-primary-500/10 dark:border-brand-primary-500/20 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} strokeWidth={2.5} className="text-brand-primary-500" />
                <h3 className="text-2xs font-extrabold text-slate-900 dark:text-emerald-400 uppercase tracking-wider">
                  Demo Evaluation Access
                </h3>
              </div>
              <p className="text-3xs text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
                Click below to auto-populate credentials and launch the demo instantly.
              </p>
              
              <div className="bg-white dark:bg-slate-950/45 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2.5 space-y-1 font-mono text-[10px] text-slate-650 dark:text-slate-350 shadow-2xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400 uppercase text-[8px]">Email:</span>
                  <span>demo@healthguard.ai</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400 uppercase text-[8px]">Password:</span>
                  <span>Demo123</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full text-3xs py-2 bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white font-bold"
                onClick={handleLaunchDemo}
              >
                Launch 1-Click Demo
              </Button>
            </div>

            {/* Google / Apple Social Login Section */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 animate-pulse-slow" viewBox="0 0 24 24 shrink-0">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.81-6.277-6.277s2.81-6.277 6.277-6.277c1.5 0 2.87.532 3.94 1.417l3.056-3.056C18.99 1.954 15.82 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.847-.093-1.636-.264-2.395H12.24z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-755 transition-colors shadow-2xs"
                >
                  <Apple size={14} className="text-slate-900 dark:text-slate-100 shrink-0 fill-current" />
                  <span>Apple</span>
                </button>
              </div>

              {/* Visual Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-400 uppercase tracking-widest text-[9px] font-extrabold">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>
            </div>

            {/* Credential input form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/10 text-slate-800 dark:text-slate-150 text-sm transition-all font-medium bg-white dark:bg-slate-855"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <span className="text-xs font-bold text-brand-primary-600 dark:text-brand-primary-500 hover:underline cursor-pointer select-none">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/10 text-slate-800 dark:text-slate-150 text-sm transition-all font-medium bg-white dark:bg-slate-855"
                  />
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-brand-primary-550 h-4.5 w-4.5 accent-brand-primary-500"
                  />
                  <label htmlFor="remember-me" className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>
              </div>

              {/* Log In Submission Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full py-3 shadow-md bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white font-bold"
                isLoading={isLoading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Log In to Cabinet
              </Button>
            </form>

            {/* Quick Profile Creation Toggle */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              New to HealthGuard?{' '}
              <Link to="/signup" className="text-brand-primary-500 hover:text-brand-primary-600 font-extrabold underline decoration-2 decoration-brand-primary-500/20">
                Create a free profile
              </Link>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
