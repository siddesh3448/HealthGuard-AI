import { Camera, Cpu, ShieldAlert, BadgeInfo } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: Camera,
      title: 'Scan Label',
      description: 'Point your camera at a food or medicine list. Our engine reads clear details.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Analyze Ingredients',
      description: 'The label elements are extracted instantly by our cloud-powered intelligence model.',
    },
    {
      num: '03',
      icon: ShieldAlert,
      title: 'Trigger Conflicts',
      description: 'The app compares values with your active allergies, diet, and prescriptions.',
    },
    {
      num: '04',
      icon: BadgeInfo,
      title: 'Receive Tips',
      description: 'The AI companion drafts healthy alternatives, nutrition scores, and suggestions.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 dark:border-slate-850 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-primary-500">
            Four Steps to Security
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How HealthGuard Protects You
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            A frictionless workflow built directly for dynamic daily use.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[68px] left-[150px] right-[150px] h-0.5 bg-dashed bg-slate-200 dark:bg-slate-850 z-0"></div>
          
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                {/* Visual marker inside ring */}
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-50 dark:border-slate-900 group-hover:border-brand-primary-500 transition-colors duration-350 shadow-lg flex items-center justify-center text-brand-primary-500 mb-6">
                  <IconComponent size={28} />
                </div>
                
                {/* Index badge count */}
                <span className="text-xs font-extrabold text-brand-primary-500 bg-brand-primary-50 dark:bg-brand-primary-50/10 px-2.5 py-0.5 rounded-full mb-3">
                  ST.{step.num}
                </span>

                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-150 mb-1">
                  {step.title}
                </h4>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
