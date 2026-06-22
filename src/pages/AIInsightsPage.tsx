import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Search, 
  Heart, 
  Brain, 
  Filter, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  Apple, 
  RefreshCw, 
  FileText, 
  Check, 
  ShieldCheck,
  Zap,
  Droplet,
  Settings
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

// Initial Health Insights list matching profile categories
interface HealthInsightItem {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'medication' | 'lifestyle';
  severity: 'info' | 'warning' | 'success';
  date: string;
  metric?: string;
  actionText?: string;
}

const INITIAL_INSIGHTS: HealthInsightItem[] = [
  {
    id: 'in-1',
    title: 'Citrus & Acetaminophen Interaction Warning',
    description: 'Scanning historical "Acetaminophen (Tylenol)" dosages. Avoid consuming raw grapefruit juice or heavy citrus extracts within 4 hours of ingestion. Grapefruit can interact with Tylenol, affecting medication absorption. Avoid grapefruits or citrus drinks near medication timings.',
    category: 'medication',
    severity: 'warning',
    date: 'Just now',
    metric: 'Potential Interaction Flagged',
    actionText: 'Review Safe Alternates'
  },
  {
    id: 'in-2',
    title: 'Peanut Allergy Risk in Pantry',
    description: 'We scanned "Chewy Choco Cookies (Premium Pack)" in your pantry. It carries a peanut allergen tag. As you have registered a Peanut allergy, steer clear of storing opened cookies adjacent to dry grain canisters.',
    category: 'nutrition',
    severity: 'warning',
    date: '10 Mins Ago',
    metric: 'Allergen Danger High',
    actionText: 'View Storage Advice'
  },
  {
    id: 'in-3',
    title: 'Sodium Impact on Hypertension',
    description: 'Pantry inventory matches "Rustic Marina Italian Linguine". Preparing this meal can push your daily sodium to 1420mg (94% of your restricted target). Consider scaling spices or substituting with potassium-rich herbs to support healthy blood pressure.',
    category: 'nutrition',
    severity: 'info',
    date: '2 Hours Ago',
    metric: 'High Sodium Risk Map',
    actionText: 'Low-Sodium Swaps'
  },
  {
    id: 'in-4',
    title: 'Healthy Blood Pressure with Almond Milk Potassium',
    description: 'Scanned "Silk Creamy Almond Milk" represents a superior dietary addition. Its high potassium density directly counterbalances sodium, helping support healthy blood pressure. Keep up the consistent replacement!',
    category: 'lifestyle',
    severity: 'success',
    date: '1 Day Ago',
    metric: '92% Nutritional Match',
    actionText: 'Meal Inspiration'
  },
  {
    id: 'in-5',
    title: 'Heart Health & Water Intake',
    description: 'Optimal daily hydration is healthy for your blood pressure. Drinking 2.4L of water daily helps keep you properly hydrated. You had 1.8L yesterday.',
    category: 'lifestyle',
    severity: 'info',
    date: '2 Days Ago',
    metric: 'Hydration Target: 75%',
    actionText: 'Log Fluid Intake'
  }
];

// Interactive mock data for custom check ingredient responses
const QUICK_INGREDIENT_DATABASE: Record<string, {
  verdict: 'safe' | 'warning' | 'avoid';
  title: string;
  explanation: string;
  confidence: number;
  tags: string[];
}> = {
  'Peanut Butter': {
    verdict: 'avoid',
    title: '🚫 Strict Allergy Warning (Peanut)',
    explanation: 'Contains peanuts. Instantly conflicts with your registered "Peanuts" allergy profile. High risk of anaphylactic response.',
    confidence: 99,
    tags: ['True Allergen', 'Anaphylactic Risk']
  },
  'Cashew Butter': {
    verdict: 'warning',
    title: '⚠️ Precautionary Alert (Nut Class)',
    explanation: 'Cashews are generally safe, but this item is processed on equipment shared with peanuts. Possible traces may exist.',
    confidence: 84,
    tags: ['Cross-Contamination', 'Nut Category']
  },
  'Organic Coconut Water': {
    verdict: 'safe',
    title: '❇️ Safe & Vascular Enhancing',
    explanation: 'Natural mineral carrier. High in natural potassium (450mg/serving) and exceptionally low in sodium. Supports systemic hydration and mild hypertension.',
    confidence: 96,
    tags: ['High Potassium', 'Vaso-Protective']
  },
  'Grapefruit Tonic Soda': {
    verdict: 'avoid',
    title: '🚫 Severe Medication Cross-Reaction',
    explanation: 'Active grapefruit extract inhibits hepatic cytochrome metabolizing enzymes. Strongly counter-indicated when taking Acetaminophen due to processing slowdowns.',
    confidence: 98,
    tags: ['Hepatic Risk', 'Drug Blockage']
  },
  'Spicy Garlic Ramen': {
    verdict: 'warning',
    title: '⚠️ Nutrition Limit Alert (Extreme Sodium)',
    explanation: 'Contains 1,840mg of sodium per pack. This single block exceeds your daily low-sodium hypertension threshold of 1,500mg. It is compatible with your allergy flags, but strongly non-aligned with cardiovascular fitness.',
    confidence: 95,
    tags: ['Sodium Excess', 'Vascular Tension']
  },
  'Plain Greek Yogurt': {
    verdict: 'safe',
    title: '❇️ Certified Healthy & High-Protein',
    explanation: 'Lactose levels are standard, and protein aligns with your hyper-muscular maintenance target. Calcium ions benefit muscle signaling without affecting your hypertension medicines.',
    confidence: 93,
    tags: ['Low Sodium', 'High Protein']
  }
};

const CHART_DATA_TIMELINE = [
  { day: 'Mon', riskScore: 88, activeAlerts: 1 },
  { day: 'Tue', riskScore: 82, activeAlerts: 2 },
  { day: 'Wed', riskScore: 91, activeAlerts: 1 },
  { day: 'Thu', riskScore: 89, activeAlerts: 0 },
  { day: 'Fri', riskScore: 74, activeAlerts: 3 },
  { day: 'Sat', riskScore: 95, activeAlerts: 0 },
  { day: 'Sun', riskScore: 93, activeAlerts: 0 }
];

export function AIInsightsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'nutrition' | 'medication' | 'lifestyle'>('all');
  const [insightsList, setInsightsList] = useState<HealthInsightItem[]>(INITIAL_INSIGHTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom checker simulator state
  const [checkerQuery, setCheckerQuery] = useState('');
  const [activeCheckerVerdict, setActiveCheckerVerdict] = useState<typeof QUICK_INGREDIENT_DATABASE['Peanut Butter'] | null>(null);
  const [checkerHistory, setCheckerHistory] = useState<string[]>([]);

  // Simulation processing engine state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Quick select items for Checker
  const quickSelectItems = ['Peanut Butter', 'Cashew Butter', 'Organic Coconut Water', 'Grapefruit Tonic Soda', 'Spicy Garlic Ramen', 'Plain Greek Yogurt'];

  // Handle custom ingredient test
  const handleVerifyIngredient = (name: string) => {
    const formatted = name.trim();
    if (!formatted) return;

    // Search exact or loose match in mock DB
    const foundKey = Object.keys(QUICK_INGREDIENT_DATABASE).find(
      key => key.toLowerCase().includes(formatted.toLowerCase())
    );

    if (foundKey) {
      setActiveCheckerVerdict(QUICK_INGREDIENT_DATABASE[foundKey]);
    } else {
      // Default safe but unverified output
      setActiveCheckerVerdict({
        verdict: 'warning',
        title: `⚠️ Unverified Product: ${formatted}`,
        explanation: `This substance is not on your direct allergic lists, but we lack barcode data for this exact brand. Check labels and try minimal amounts.`,
        confidence: 65,
        tags: ['Unknown Brand', 'Precautionary Check']
      });
    }

    if (!checkerHistory.includes(formatted)) {
      setCheckerHistory(prev => [formatted, ...prev].slice(0, 5));
    }
    setCheckerQuery(formatted);
  };

  // Perform Simulated AI Engine Sync Synthesis
  const runAISynthesis = () => {
    setIsSynthesizing(true);
    setSynthesisLogs([]);
    setActiveLogIndex(0);

    const stages = [
      '🔍 Querying health profile presets (Peanut Allergies, Hypertension, High Protein target)...',
      '🧬 Checking newly registered pantry foods against your health profile...',
      '🌾 Checking sodium content of recently logged foods...',
      '💬 Checking potential food & medication drug interactions...',
      '📊 Calculating personalized health targets and scores...',
      '✨ Health analysis completed! 5 fresh health insights loaded successfully.'
    ];

    stages.forEach((msg, i) => {
      setTimeout(() => {
        setSynthesisLogs(prev => [...prev, msg]);
        setActiveLogIndex(i);
        
        // Final complete step
        if (i === stages.length - 1) {
          setTimeout(() => {
            setIsSynthesizing(false);
            // Append a new custom insight matching current time
            const freshInsight: HealthInsightItem = {
              id: `in-${Date.now()}`,
              title: 'AI Health Insight: Potassium & Sodium Balance',
              description: 'Our latest analysis shows good nutrition and medication balance. By replacing dairy with Almond Milk, we recorded a 420mg sodium decrease this morning, helping support healthy blood pressure.',
              category: 'nutrition',
              severity: 'success',
              date: 'Just completed',
              metric: 'Good Balance Achieved',
              actionText: 'View Analysis Graphs'
            };
            setInsightsList(prev => [freshInsight, ...prev]);
          }, 1000);
        }
      }, (i + 1) * 800);
    });
  };

  // Filter insights list based on active category and keyword search
  const filteredInsights = useMemo(() => {
    return insightsList.filter(ins => {
      const matchCategory = activeCategoryFilter === 'all' || ins.category === activeCategoryFilter;
      const matchSearch = ins.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ins.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ins.metric?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [insightsList, activeCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. TOP PREMIUM GREETING BANNER & QUICK OVERVIEW */}
      <div className="bg-gradient-to-r from-brand-primary-500/10 via-indigo-500/5 to-transparent border border-brand-primary-500/10 dark:border-brand-primary-500/15 rounded-[2.5rem] p-6 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative overflow-hidden shadow-sm">
        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="currentColor" className="text-brand-primary-500" />
          </svg>
        </div>

        <div className="space-y-4 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-500/10 text-brand-primary-650 dark:text-brand-primary-400 text-3xs font-extrabold tracking-wider uppercase border border-brand-primary-500/10">
              💎 HEALTHGARD AI INSIGHTS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-3xs font-extrabold tracking-wider uppercase border border-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> PERSONALIZED ANALYSIS ACTIVE
            </span>
          </div>
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
              {t('header.aiInsights') || 'Personal AI Insights'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 font-medium max-w-xl mt-2 leading-relaxed">
              Real-time personalized analysis of your allergen profile, medications, and smart pantry foods using AI.
            </p>
          </div>
        </div>

        {/* Action Trigger Button */}
        <div className="shrink-0 relative z-10">
          <Button
            variant="primary"
            size="lg"
            isLoading={isSynthesizing}
            onClick={runAISynthesis}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-primary-500 to-indigo-650 text-white font-extrabold px-6 py-3.5 shadow-md hover:from-brand-primary-600 hover:to-indigo-700 transition-all rounded-[1.25rem]"
          >
            <Sparkles size={16} className="animate-spin text-brand-primary-100" />
            <span>Generate Analysis</span>
          </Button>
        </div>
      </div>

      {/* SYNTHESIS PROGRESS BLOCK */}
      <AnimatePresence>
        {isSynthesizing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border border-brand-primary-500/25 bg-slate-900 text-white dark:bg-slate-950 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw size={18} className="animate-spin text-brand-primary-450" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-350">
                    AI Health Analysis in Progress...
                  </span>
                </div>
                <span className="text-2xs font-mono font-bold text-slate-400">
                  Step {activeLogIndex + 1} of 6
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-brand-primary-500 to-indigo-500 h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeLogIndex + 1) / 6) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Dynamic Scrolling Logs */}
              <div className="bg-slate-950/80 rounded-xl p-4 font-mono text-xs text-brand-primary-150 border border-slate-800/65 flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                {synthesisLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-2 ${index === activeLogIndex ? 'text-white font-extrabold' : 'text-slate-500'}`}
                  >
                    <span>{index === activeLogIndex ? '⚡' : '✓'}</span>
                    <p>{log}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THREE-PANEL CORE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* COLUMN A: LEFT CONTROLS, DYNAMICAL CHECKER, STATS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          
          {/* CARD A-1: REAL-TIME INGREDIENT ALIGNMENT CHECKER */}
          <Card className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 shadow-3xs flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-500 dark:text-brand-primary-400 border border-brand-primary-150">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="text-md font-black text-slate-900 dark:text-white tracking-tight">
                  Instant Ingredient Checker
                </h3>
                <p className="text-3xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">
                  Check potential food or medicine concerns
                </p>
              </div>
            </div>

            {/* Input Search Block */}
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type product name (e.g. Cashew Butter...)"
                  value={checkerQuery}
                  onChange={(e) => setCheckerQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVerifyIngredient(checkerQuery);
                  }}
                  className="w-full pl-10 pr-24 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/25 select-text"
                />
                <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                <button
                  onClick={() => handleVerifyIngredient(checkerQuery)}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-lg px-3.5 text-3xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center"
                >
                  Verify
                </button>
              </div>

              {/* Quick Preset Selector Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Select common items to test:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {quickSelectItems.map(item => (
                    <button
                      key={item}
                      onClick={() => handleVerifyIngredient(item)}
                      className={`text-3xs font-extrabold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                        checkerQuery === item
                          ? 'bg-brand-primary-555 dark:bg-brand-primary-500 text-white border-transparent shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verdict Display Output Panel */}
            <AnimatePresence mode="wait">
              {activeCheckerVerdict ? (
                <motion.div
                  key={activeCheckerVerdict.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${
                    activeCheckerVerdict.verdict === 'avoid'
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-150'
                      : activeCheckerVerdict.verdict === 'warning'
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-150'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-150'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs tracking-tight">
                      {activeCheckerVerdict.title}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      activeCheckerVerdict.verdict === 'avoid'
                        ? 'bg-rose-100 text-rose-750 dark:bg-rose-950 dark:text-rose-400'
                        : activeCheckerVerdict.verdict === 'warning'
                        ? 'bg-amber-100 text-amber-750 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-750 dark:bg-emerald-950 dark:text-emerald-405'
                    }`}>
                      {activeCheckerVerdict.confidence}% Confidence
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350 font-semibold">
                    {activeCheckerVerdict.explanation}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeCheckerVerdict.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-4xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded"
                      >
                        🧬 {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-805 rounded-2xl text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <ShieldCheck size={28} className="mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-2xs font-semibold">
                    Input a food or medicine or choose a preset item above to execute a real-time safety analysis.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </Card>

          {/* CARD A-2: TELEMETRY ALIGNMENT STATS & GRAPHS */}
          <Card className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 shadow-3xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                  Cardiology & Safety Indices
                </h4>
                <p className="text-sm font-black text-slate-850 dark:text-slate-100">
                  Weekly Compatibility Score
                </p>
              </div>
              <TrendingUp size={16} className="text-indigo-500" />
            </div>

            {/* Recharts Area Chart Component */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA_TIMELINE} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[60, 100]} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <ChartTooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontFamily: 'Inter, sans-serif'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="riskScore" 
                    name="Alignment Score" 
                    stroke="#6366f1" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Clinical telemetry stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="block text-[9px] font-extrabold uppercase text-slate-400">Match Accuracy</span>
                <span className="block text-md font-black text-slate-900 dark:text-white">96.8%</span>
              </div>
              <div className="space-y-0.5 border-x border-slate-100 dark:border-slate-800">
                <span className="block text-[9px] font-extrabold uppercase text-slate-400">Allergen Flags</span>
                <span className="block text-md font-black text-rose-500">2 Active</span>
              </div>
              <div className="space-y-0.5">
                <span className="block text-[9px] font-extrabold uppercase text-slate-400">Vascular Risk</span>
                <span className="block text-md font-black text-emerald-500">Normal</span>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMN B: MASTER INSIGHTS LIST VIEW & FILTERS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* FILTER CONTROLS & CONTROLS HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-4 shadow-3xs">
            
            {/* Category Filter Buttons Row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-2xl uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-955 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                All ( {insightsList.length} )
              </button>
              <button
                onClick={() => setActiveCategoryFilter('medication')}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-2xl uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategoryFilter === 'medication'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-955 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-200/40 dark:border-slate-800'
                }`}
              >
                <Zap size={11} /> Medications
              </button>
              <button
                onClick={() => setActiveCategoryFilter('nutrition')}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-2xl uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategoryFilter === 'nutrition'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-955 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-emerald-200/40 dark:border-slate-800'
                }`}
              >
                <Apple size={11} /> Nutrition
              </button>
              <button
                onClick={() => setActiveCategoryFilter('lifestyle')}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-2xl uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategoryFilter === 'lifestyle'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-955 text-indigo-550 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 border border-indigo-200/40 dark:border-slate-800'
                }`}
              >
                <Droplet size={11} /> Lifestyle
              </button>
            </div>

            {/* Keyword search field inside filter row */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Search report details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl text-2xs font-extrabold text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-brand-primary-500"
              />
              <Search size={12} className="absolute left-2.5 top-3 text-slate-450" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-3xs text-slate-400 hover:text-slate-700 font-extrabold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* INSIGHTS ITEMS FEED SECTION */}
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredInsights.length > 0 ? (
                filteredInsights.map((insight, idx) => {
                  const isWarning = insight.severity === 'warning';
                  const isSuccess = insight.severity === 'success';

                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      layout
                    >
                      <Card className={`group relative p-6 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-[1.75rem] bg-white dark:bg-slate-900 flex flex-col gap-4 ${
                        isWarning 
                          ? 'border-l-[6px] border-l-rose-500 border-rose-100 dark:border-slate-800' 
                          : isSuccess 
                          ? 'border-l-[6px] border-l-emerald-500 border-emerald-100 dark:border-slate-800' 
                          : 'border-l-[6px] border-l-brand-primary-500 border-slate-150 dark:border-slate-800'
                      }`}>
                        
                        {/* Upper Section Title & Category Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-xl border shrink-0 ${
                              isWarning
                                ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border-rose-100'
                                : isSuccess
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border-emerald-100'
                                : 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 border-indigo-100'
                            }`}>
                              {insight.category === 'medication' ? (
                                <Zap size={14} className="animate-pulse" />
                              ) : insight.category === 'nutrition' ? (
                                <Apple size={14} />
                              ) : (
                                <Droplet size={14} />
                              )}
                            </span>
                            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-md leading-tight group-hover:text-brand-primary-555 dark:group-hover:text-brand-primary-400 transition-colors">
                              {insight.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            <span className="text-4xs font-black uppercase tracking-widest text-slate-400">
                              {insight.date}
                            </span>
                          </div>
                        </div>

                        {/* Middle Description */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
                          {insight.description}
                        </p>

                        {/* Lower Action Row Panel */}
                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          
                          {/* Left specific telemetry label */}
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              isWarning ? 'bg-rose-500' : isSuccess ? 'bg-emerald-555' : 'bg-brand-primary-500'
                            }`} />
                            <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-3xs">
                              {insight.metric || 'Status Active'}
                            </span>
                          </div>

                          {/* Action Button */}
                          <button 
                            onClick={() => alert(`This triggers safe health checks for: ${insight.title}`)}
                            className={`flex items-center gap-1 font-bold text-3xs uppercase tracking-wider hover:underline transition-all hover:scale-105 active:scale-95 px-3 py-1.5 rounded-lg border text-center whitespace-nowrap z-10 self-end sm:self-auto ${
                              isWarning
                                ? 'bg-rose-50/50 hover:bg-rose-100 dark:bg-rose-950/20 border-rose-150 text-rose-600 dark:text-rose-400'
                                : isSuccess
                                ? 'bg-emerald-50/50 hover:bg-emerald-100 dark:bg-emerald-950/20 border-emerald-150 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span>{insight.actionText || 'Manage Swaps'}</span>
                            <ChevronRight size={11} className="shrink-0" />
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center bg-white dark:bg-slate-900 space-y-4 shadow-3xs">
                  <AlertTriangle size={36} className="mx-auto text-slate-300 dark:text-slate-700 animate-bounce" />
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      No matching records found
                    </h3>
                    <p className="text-2xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">
                      Try typing a different search phrase, switching categories to &quot;All&quot;, or clicking &quot;Generate Analysis&quot; above to load fresh health insights.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default AIInsightsPage;
