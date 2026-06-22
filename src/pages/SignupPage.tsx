import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  AlertCircle,
  Camera,
  MessageSquare,
  FileText,
  Apple,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please set a password for your account');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!agree) {
      setError('You must agree to the data disclosure and privacy terms');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await signup(name.trim(), email.trim());
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = () => {
    // Fill credentials or just guide the user
    setName('John Doe');
    setEmail('demo@healthguard.ai');
    setPassword('Demo123');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans relative overflow-hidden">
      {/* Background Dot Pattern/Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none select-none">
        <svg width="100%" height="100%">
          <pattern id="signup-dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-slate-900 dark:text-slate-100" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#signup-dot-pattern)" />
        </svg>
      </div>

      <div className="w-full lg:grid lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: Marketing Panel with dual feature cards (cohesive with LoginPage) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-white dark:bg-slate-900 p-12 xl:p-16 flex-col justify-between overflow-y-auto border-r border-slate-100 dark:border-slate-800">
          
          <div className="space-y-6 my-auto max-w-2xl">
            {/* Tag / Badge */}
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary-100/60 dark:bg-brand-primary-950/20 text-brand-primary-700 dark:text-brand-primary-400 text-2xs font-extrabold tracking-wide uppercase border border-brand-primary-500/10">
                <Sparkles size={12} className="animate-pulse" />
                <span>MODERN HEALTH SCREENING</span>
              </span>
            </div>

            {/* Main Value Statement */}
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Designed for Safety, Engineered for Simplicity.
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 font-medium">
              Set up your personalized allergy and wellness profile in seconds. Map out your custom dietary parameters for dynamic safety warnings.
            </p>

            {/* Feature Grid: Exactly matching the features on Login Page for design coherence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              
              {/* Card 1: Food Scanner & AI Assistant */}
              <Card className="bg-slate-50 dark:bg-slate-955 border border-slate-100/75 dark:border-slate-800/80 p-5 rounded-[1.5rem] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
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
                        Scan ingredients instantly to detect custom allergens, allergen traces, or additives.
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
              <Card className="bg-slate-50 dark:bg-slate-955 border border-slate-100/75 dark:border-slate-800/80 p-5 rounded-[1.5rem] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
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
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-955/40 flex items-center justify-center shrink-0 border border-amber-200/20">
                      <FileText size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        Health Reports
                      </h4>
                      <p className="text-3xs sm:text-2xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Receive weekly visual reports summarizing logged ingredient exposure levels and clinical risk factors.
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

        {/* RIGHT COLUMN: Float Card with Sign Up Form details */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 bg-slate-50 dark:bg-slate-950 min-h-screen">
          
          {/* Elevated Floating Card Container */}
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] shadow-xl p-8 sm:p-10 space-y-6">
            
            {/* Logo and Greeting Header */}
            <div className="space-y-2">
              <Logo size="md" />
              <div className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Create Free Profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Receive instant clinical food safety scores and interact screening in minutes.
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-rose-50 dark:bg-rose-955/30 border border-rose-200/65 dark:border-rose-900/40 rounded-xl p-3 flex items-start gap-2.5 text-rose-700 dark:text-rose-450">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="text-xs font-semibold">{error}</span>
              </div>
            )}

            {/* Social Sign Up Options (matches login page style) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSocialClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24 shrink-0">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.466 0-6.277-2.81-6.277-6.277s2.81-6.277 6.277-6.277c1.5 0 2.87.532 3.94 1.417l3.056-3.056C18.99 1.954 15.82 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.847-.093-1.636-.264-2.395H12.24z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleSocialClick}
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
                  Or register with email
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>
            </div>

            {/* Signup Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/10 text-slate-800 dark:text-slate-150 text-sm transition-all font-medium bg-white dark:bg-slate-855"
                  />
                </div>
              </div>

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

              {/* Create Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-500/10 text-slate-800 dark:text-slate-150 text-sm transition-all font-medium bg-white dark:bg-slate-855"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Disclaimer Agreement box */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    if (error) setError('');
                  }}
                  className="rounded border-slate-300 dark:border-slate-700 text-brand-primary-550 h-4.5 w-4.5 mt-0.5 accent-brand-primary-500"
                />
                <label htmlFor="agree-checkbox" className="text-2xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed cursor-pointer select-none">
                  I agree to HealthGuard AI's allergy screening disclaimer, disclosure consent, and certify that credentials supplied are my own.
                </label>
              </div>

              {/* Action Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full py-3 shadow-md bg-brand-primary-500 hover:bg-brand-primary-600 active:bg-brand-primary-700 text-white font-bold mt-2"
                isLoading={isLoading}
                icon={ArrowRight}
                iconPosition="right"
              >
                Register & Initialize Coach
              </Button>
            </form>

            {/* Toggle Login Link Route link */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium font-sans">
              Already have a profile?{' '}
              <Link to="/login" className="text-brand-primary-500 hover:text-brand-primary-600 font-extrabold underline decoration-2 decoration-brand-primary-500/20">
                Log in here
              </Link>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}

export default SignupPage;
