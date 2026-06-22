import { ScanBarcode, ShieldAlert, Layers, MessageSquareCode, BrainCircuit, HeartPulse } from 'lucide-react';
import { Card } from '../common/Card';

export function Features() {
  const featuresList = [
    {
      icon: ScanBarcode,
      iconColor: 'bg-brand-primary-50 text-brand-primary-500 dark:bg-brand-primary-50/10',
      title: 'Food Scan & Label Analyzer',
      description: 'Capture any food package, ingredient list, or nutrition facts label. Instantly decode complex additives, hidden sugars, high sodium, and chemical food colorings.',
    },
    {
      icon: ShieldAlert,
      iconColor: 'bg-brand-danger-50 text-brand-danger-500 dark:bg-brand-danger-50/10',
      title: 'Medicine Safety Interaction Engine',
      description: 'Check active chemical components against your current medications. Detect multi-drug or drug-food conflicts early, ensuring zero hazardous complications.',
    },
    {
      icon: Layers,
      iconColor: 'bg-brand-secondary-50 text-brand-secondary-500 dark:bg-brand-secondary-50/10',
      title: 'Smart Automated Pantry',
      description: 'Keep regular tabs on stock levels and expiration timelines. Filter recipes based on ingredients you already have, actively reducing household food waste.',
    },
    {
      icon: MessageSquareCode,
      iconColor: 'bg-brand-accent-50 text-brand-accent-500 dark:bg-brand-accent-50/10',
      title: '24/7 AI Clinical Assistant',
      description: 'Have a direct, personalized conversation. Receive friendly health recommendations, dietary tips, and medicine-schedule explanations immediately.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-primary-500">
            Intelligent Health Shield
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Clinical-Grade Protections
          </h3>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Trained and calibrated to parse ingredients and drug warning sheets, giving you absolute power over what enters your pantry and cabinet.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((item, index) => {
            const IconComp = item.icon;
            return (
              <Card
                key={index}
                className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl inline-flex self-start ${item.iconColor} mb-5`}>
                  <IconComp size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features;
