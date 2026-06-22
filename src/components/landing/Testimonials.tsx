import { Star, Quote } from 'lucide-react';
import { Card } from '../common/Card';

export function Testimonials() {
  const list = [
    {
      name: 'Sarah M.',
      role: 'Mother of two children with severe allergies',
      quote: 'HealthGuard AI completely removed the anxiety of grocery shopping. Scanning is lightning fast, and having allergen conflict alerts immediately prevents errors.',
      rating: 5,
    },
    {
      name: 'Robert K.',
      role: 'Beta User managing mild hypertension',
      quote: 'Excellent helper! I use the drug checker to confirm interactions with my daily medicine doses. The AI assistant gives simple explanations that are highly reassuring.',
      rating: 5,
    },
    {
      name: 'Elena G.',
      role: 'Nutrition advocate',
      quote: 'Keeping track of my pantry expiring dates and low-stock levels directly in one simple, sleek portal saved me plenty of grocery money. Strongly recommended!',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-primary-500">
            Real Reviews
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Health Conscious Families
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            Read stories from individuals who took control of their wellness journey.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((item, idx) => (
            <Card
              key={idx}
              className="flex flex-col justify-between bg-slate-55/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:shadow-xl transition-all duration-300 relative rounded-2xl"
            >
              {/* Floating quotes icon */}
              <div className="text-brand-primary-500/10 dark:text-brand-primary-500/5 absolute top-4 right-4">
                <Quote size={48} strokeWidth={4} />
              </div>

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex gap-0.5 text-brand-warning-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed relative z-10 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.name}
                  </h5>
                  <p className="text-3xs sm:text-[11px] text-slate-400 font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
