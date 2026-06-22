import { CheckCircle2, ShieldCheck, Heart, AlertOctagon } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      title: 'Hassle-Free Allergen & Lifestyle Filters',
      description: 'Configure your allergies (gluten, peanuts, dairy, soy) and dietary choices (Vegan, Keto, Halal, Low-Sodium) once. The scanner flags conflicts immediately.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'
    },
    {
      title: 'Clinically Decoded Additives',
      description: 'No more memorizing complex biochemical terms. Get clear, accessible explanations of chemical emulsifiers, synthetic dyes, and artificial sweeteners.',
      icon: ShieldCheck,
      color: 'text-brand-primary-500 bg-brand-primary-50 dark:bg-brand-primary-50/10'
    },
    {
      title: 'Prevent Polypharmacy Risk',
      description: 'Avoid cross-interactions in multi-drug therapy lines. The app compares dynamic schedules, alerting you when medicine intake overlaps unsafely.',
      icon: AlertOctagon,
      color: 'text-brand-warning-500 bg-brand-warning-50 dark:bg-brand-warning-50/10'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Visual Left Block representing Benefits metrics */}
          <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
            <h3 className="text-2xs uppercase tracking-widest font-extrabold text-brand-primary-500">
              Proven Outcomes
            </h3>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Absolute Safety For Your Household
            </h4>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              Medical label scans should not require medical school. We consolidate and process millions of drug conflict logs and ingredient registries, packaging immediate results into simplified alerts.
            </p>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-brand-primary-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
                  Personalized advice maps directly to your medical history, and can be adjusted anytime.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-brand-primary-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
                  Local smart storage checks food freshness, lowering grocery waste up to 40%.
                </p>
              </div>
            </div>
          </div>

          {/* Core Benefit Columns */}
          <div className="mt-12 lg:mt-0 space-y-6">
            {benefits.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <div 
                  key={index} 
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100/85 dark:border-slate-850 flex gap-4 items-start"
                >
                  <div className={`p-3 rounded-lg shrink-0 ${benefit.color}`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h5 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {benefit.title}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default Benefits;
