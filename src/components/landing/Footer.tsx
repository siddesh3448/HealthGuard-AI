import { Logo } from '../common/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-100 dark:border-slate-850 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8">
          
          {/* Logo Brand Segment */}
          <div className="md:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
              An artificial-intelligence health advisor powered by neural label scans. Build custom diets and secure medicine routines easily.
            </p>
          </div>

          {/* Spacer / Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Product Column */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Product
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400">
                <li><a href="#features" className="hover:text-brand-primary-500 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-brand-primary-500 transition-colors">Process Workflows</a></li>
                <li><span className="text-slate-350 cursor-not-allowed">Enterprise Portal (Soon)</span></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Trust & Safety
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                <li><span className="hover:text-brand-primary-500 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-brand-primary-500 transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-brand-primary-500 transition-colors cursor-pointer">Disclaimer Notice</span></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="col-span-2 sm:col-span-1">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Support
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                For regulatory and medical accuracy audits, submit an official clinic review request.
              </p>
            </div>

          </div>
        </div>

        {/* Footer Base bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-center text-5xs sm:text-xs text-slate-400">
          <span>&copy; {currentYear} HealthGuard AI. All rights reserved. Registered trademark.</span>
          <div className="flex gap-4 mt-4 sm:mt-0 font-medium">
            <span>FDA & HIPAA Auditing Aligned</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
