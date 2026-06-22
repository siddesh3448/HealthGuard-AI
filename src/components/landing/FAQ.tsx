import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '../common/Card';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is my personal health data kept safe and confidential?',
      a: 'Absolutely. We do not sell, trade, or share your ingredients logs or scans with any insurance or advertising company. All records are strictly private to you.',
    },
    {
      q: 'How accurate is the label extraction algorithm?',
      a: 'We use high-precision neural OCR models trained on extensive nutrition catalogs. While highly accurate, we advise users to inspect ingredients ourselves in acute medical situations.',
    },
    {
      q: 'Does it support dietary restrictions like vegan, keto, or gluten-free?',
      a: 'Yes! Simply configure your health preferences under your Settings profile, and the scanner will dynamically highlight trigger chemicals and warnings customized to your daily dietary constraints.',
    },
    {
      q: 'Can I check cross-drug interactions with newly scanned prescriptions?',
      a: 'Yes, our medicine interaction engine allows you to save medications in a digital cabinet and run comprehensive multi-drug safety checks immediately upon scan capture.',
    },
    {
      q: 'Can I use HealthGuard AI in multiple languages?',
      a: 'Yes, full Spanish (Español) and French (Français) translations are fully available. You can toggle global app contexts securely in the Settings panel.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-50 border-t border-slate-100 dark:border-slate-850 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-primary-500">
            Common Inquiries
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
            Find immediate answers regarding accuracy, privacy policy, and features.
          </p>
        </div>

        {/* FAQs stack */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                padded={false}
                className="overflow-hidden border border-slate-100 dark:border-slate-850 cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center bg-white dark:bg-slate-950 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-200"
                >
                  <div className="flex gap-3 items-center mr-4">
                    <HelpCircle size={18} className="text-brand-primary-500 shrink-0" />
                    <span className="font-extrabold text-slate-800 dark:text-slate-150 text-sm sm:text-base">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-450 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary-500' : ''}`}
                  />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-950/40 border-t border-slate-50 dark:border-slate-900/40 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FAQ;
