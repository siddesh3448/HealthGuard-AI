import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle, Apple, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { Button } from '../common/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24 transition-colors duration-200">
      {/* Background Dot Pattern/Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none">
        <svg width="100%" height="100%">
          <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-slate-900" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Promo Pill */}
            <div className="inline-flex items-center space-x-2 bg-brand-primary-50 dark:bg-brand-primary-50/10 text-brand-primary-700 dark:text-brand-primary-100 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm select-none border border-brand-primary-500/10">
              <Sparkles size={14} className="animate-pulse" />
              <span>Personalized AI Clinical-level Precision</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Protect Your Health with <span className="text-brand-primary-500 font-extrabold">HealthGuard AI</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Scan barcode or nutrition labels on food and medicine in real-time. Instantly identify allergen interactions, check chemical health triggers, and automate a smart pantry.
            </p>

            {/* List key points */}
            <div className="py-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-brand-primary-500" />
                <span>Immediate Interaction Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-brand-primary-500" />
                <span>Zero Ads or Data Trading</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto shadow-lg hover:shadow-brand-primary-500/20">
                  Get Started Free
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" icon={Play} iconPosition="left" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Right Graphical Column (High Fidelity CSS Mockup) */}
          <div className="lg:col-span-6 mt-12 lg:mt-0 relative flex justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-primary-100 to-brand-secondary-50 dark:from-brand-primary-500/5 dark:to-brand-secondary-500/5 rounded-[3rem] blur-2xl opacity-70 z-0"></div>

            {/* Main Mock Device Container */}
            <div className="relative w-full max-w-sm bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] p-3 shadow-2xl z-10 overflow-hidden select-none">
              <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-[2rem] p-4 space-y-4">
                
                {/* Simulated Header */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-primary-50 dark:bg-brand-primary-50/10 flex items-center justify-center text-brand-primary-500">
                      <Activity size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Health Status</h4>
                      <p className="text-[10px] text-slate-400">Monitoring Active</p>
                    </div>
                  </div>
                  <div className="bg-brand-primary-500 text-white text-[10px] px-2.5 py-1 rounded-full font-bold">
                    Score: 92/100
                  </div>
                </div>

                {/* Scan Simulator Widget */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800 relative space-y-2">
                  <span className="absolute top-2 right-2 text-[8px] bg-brand-danger-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Trigger Warning
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                      <Apple size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Crispy Oat Granola</h5>
                      <p className="text-[9px] text-slate-400">Barcode: 501234567890</p>
                    </div>
                  </div>

                  {/* Warning Alerts */}
                  <div className="bg-brand-danger-50 dark:bg-brand-danger-50/5 border border-brand-danger-500/10 rounded-lg p-2 flex items-start gap-2">
                    <ShieldAlert size={14} className="text-brand-danger-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-brand-danger-600 dark:text-brand-danger-500">Peanut Allergy Conflict</p>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">Contains traces of ground arachis nuts.</p>
                    </div>
                  </div>
                </div>

                {/* Simulated AI advice widget */}
                <div className="bg-brand-primary-50 dark:bg-brand-primary-50/10 rounded-xl p-3 border border-brand-primary-500/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-brand-primary-600 dark:text-brand-primary-400 text-[11px] font-bold">
                    <Sparkles size={12} />
                    <span>AI Assistant Recommendation</span>
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-450 leading-relaxed font-medium">
                    "Avoid this product. Based on your peanut allergen registry, this product poses high anaphylatoxin risk."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
