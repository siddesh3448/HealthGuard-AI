import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Camera, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  ChevronRight, 
  TrendingUp, 
  UserCheck, 
  Smile, 
  Info, 
  X, 
  CheckCircle2, 
  Apple, 
  Heart,
  Droplet,
  Flame,
  UtensilsCrossed,
  BellRing
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

// Robust Mock Data in single module to power the dashboard's simulated components
const HEALTH_METRICS_DATA = [
  { day: 'Mon', allergenFlags: 0, safeScans: 4, scoreCount: 88 },
  { day: 'Tue', allergenFlags: 1, safeScans: 6, scoreCount: 82 },
  { day: 'Wed', allergenFlags: 0, safeScans: 5, scoreCount: 91 },
  { day: 'Thu', allergenFlags: 0, safeScans: 3, scoreCount: 89 },
  { day: 'Fri', allergenFlags: 2, safeScans: 7, scoreCount: 74 },
  { day: 'Sat', allergenFlags: 0, safeScans: 8, scoreCount: 95 },
  { day: 'Sun', allergenFlags: 0, safeScans: 4, scoreCount: 93 },
];

const SCAN_HISTORY = [
  {
    id: 's1',
    name: 'Silk Creamy Almond Milk',
    type: 'food',
    timestamp: 'Just now',
    score: 92,
    riskLevel: 'safe',
    allergensDetected: [] as string[],
    detailSummary: 'Clinically pure formulation. Low sugar and zero common allergen traces found.',
    infoTags: ['Lactose Free', 'Vegan', 'Keto Approved']
  },
  {
    id: 's2',
    name: 'Acetaminophen (Tylenol) Extra Strength',
    type: 'medicine',
    timestamp: '2 hours ago',
    score: 78,
    riskLevel: 'safe',
    allergensDetected: [] as string[],
    detailSummary: 'Mild hazard checker processed. Avoid heavy consumption with raw grapefruit juice.',
    infoTags: ['Pain Reliever', 'Fever Reducer']
  },
  {
    id: 's3',
    name: 'Chewy Choco Cookies (Premium Pack)',
    type: 'food',
    timestamp: '1 day ago',
    score: 34,
    riskLevel: 'avoid',
    allergensDetected: ['Peanut Trace Protein', 'Gluten', 'Soy Lecithin'],
    detailSummary: 'WARNING: Contains active allergen elements matching your profile conditions. Peanut warnings triggered.',
    infoTags: ['Contains Peanut', 'High Sugar', 'Wheat Allergen']
  },
  {
    id: 's4',
    name: 'Amoxicillin Trihydrate Capsule',
    type: 'medicine',
    timestamp: '2 days ago',
    score: 85,
    riskLevel: 'safe',
    allergensDetected: [] as string[],
    detailSummary: 'No common formulation conflicts detected on your active household medicine roster.',
    infoTags: ['Antibiotic', 'Requires Rx']
  }
];

export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [selectedScanDetail, setSelectedScanDetail] = useState<typeof SCAN_HISTORY[0] | null>(null);
  const [safetySearchQuery, setSafetySearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'pantry' | 'reports'>('profile');
  
  // Real reactive state for clinical allergen settings to show live dynamic behavior
  const [monitoredAllergens, setMonitoredAllergens] = useState([
    { name: 'Peanut Trace', active: true, critical: true },
    { name: 'Gluten Protein', active: true, critical: false },
    { name: 'Lactose / Dairy', active: true, critical: true },
    { name: 'Mono-sodium Glutamate (MSG)', active: false, critical: false },
    { name: 'Soy / Wheat Protein', active: true, critical: false }
  ]);

  // Handle live toggle of allergen monitoring
  const toggleAllergen = (index: number) => {
    setMonitoredAllergens(prev => prev.map((item, i) => 
      i === index ? { ...item, active: !item.active } : item
    ));
  };

  // Safe Filtered Scan List based on search field
  const filteredScans = useMemo(() => {
    if (!safetySearchQuery) return SCAN_HISTORY;
    return SCAN_HISTORY.filter(s => 
      s.name.toLowerCase().includes(safetySearchQuery.toLowerCase()) ||
      s.infoTags.some(tag => tag.toLowerCase().includes(safetySearchQuery.toLowerCase()))
    );
  }, [safetySearchQuery]);

  // Dynamically calculate dynamic greeting based on current local time hour
  const dynamicGreeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-sans animate-fade-in">
      
      {/* 1. TOP PREMIUM GREETING BANNER & QUICK OVERVIEW */}
      <div className="bg-gradient-to-r from-brand-primary-500/10 via-indigo-500/5 to-transparent border border-brand-primary-500/10 dark:border-brand-primary-500/15 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden shadow-sm">
        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="currentColor" className="text-brand-primary-500" />
          </svg>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-450 text-3xs font-extrabold tracking-wider uppercase border border-brand-primary-500/10">
              🛡️ MONITORING ACTIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {dynamicGreeting}, <span className="text-brand-primary-550 dark:text-brand-primary-400">{user?.name || 'John Doe'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 font-medium max-w-xl mt-1 leading-relaxed">
              Your customized allergen triggers are active. Any food scanning or medication checks will alert you immediately.
            </p>
          </div>
        </div>

        {/* Quick launch gateway trigger buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/food-scanner')}
            className="flex items-center gap-2 text-xs font-bold border-slate-205 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Camera size={15} className="text-emerald-500" />
            <span>Scan Raw Food</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/medicine-scanner')}
            className="flex items-center gap-2 text-xs font-extrabold py-2.5 shadow-sm bg-brand-primary-500 hover:bg-brand-primary-600 text-white"
          >
            <Activity size={15} className="text-rose-100 animate-pulse" />
            <span>Scan Prescription</span>
          </Button>
        </div>
      </div>

      {/* QUICK SCAN ACTIONS BLOCK */}
      <Card id="quick-scan-actions-card" className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-3xs bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-600 dark:text-brand-primary-400 flex items-center justify-center shrink-0 border border-brand-primary-100 dark:border-brand-primary-900/30">
              <Camera className="text-brand-primary-500" size={24} />
            </div>
            <div>
              <h3 className="text-sm sm:text-md font-black text-slate-900 dark:text-white tracking-tight">
                Quick Scan Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Instantly check bar codes, ingredient lists, or active pharmaceutical formulations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/food-scanner')}
              className="flex items-center justify-center gap-2 text-xs font-bold py-3 px-6 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Camera size={15} className="text-emerald-500" />
              <span>Scan Food</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/medicine-scanner')}
              className="flex items-center justify-center gap-2 text-xs font-extrabold py-3 px-6 bg-brand-primary-500 hover:bg-brand-primary-600 text-white shadow-xs"
            >
              <Activity size={15} className="text-rose-100 animate-pulse" />
              <span>Scan Medicine</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. DYNAMIC CLINICAL HIGHLIGHT METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Allergy Profile Security Status */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem]">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-120 dark:border-emerald-900/30">
              <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-3xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
              Active Secure
            </span>
          </div>
          <div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Saved Allergies
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {monitoredAllergens.filter(a => a.active).length}
              </span>
              <span className="text-xs text-slate-400 font-bold">triggers armed</span>
            </div>
            <div className="text-4xs text-slate-450 dark:text-slate-500 font-bold mt-2 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Live cross-referencing active
            </div>
          </div>
        </Card>

        {/* Metric 2: Formulation Warnings Blocked */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem]">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-120 dark:border-rose-900/30">
              <AlertTriangle size={20} className="text-rose-600 dark:text-rose-455" />
            </div>
            <span className="text-3xs font-extrabold text-rose-600 dark:text-rose-400 uppercase bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded">
              Prevention List
            </span>
          </div>
          <div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Warnings Blocked
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                4
              </span>
              <span className="text-xs text-rose-505 dark:text-rose-400 font-extrabold">critical flags</span>
            </div>
            <div className="text-4xs text-slate-455 dark:text-slate-500 font-bold mt-2 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-505 inline-block" /> Peanut trace and drug interaction
            </div>
          </div>
        </Card>

        {/* Metric 3: Active Household Medicine Checked */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem]">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-120 dark:border-indigo-900/30">
              <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-3xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded">
              Active Drugs
            </span>
          </div>
          <div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Clinically Monitored
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                3
              </span>
              <span className="text-xs text-slate-400 font-bold">active schedules</span>
            </div>
            <div className="text-4xs text-slate-455 dark:text-slate-500 font-bold mt-2 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" /> 94% Drug adherence consistency
            </div>
          </div>
        </Card>

        {/* Metric 4: Kitchen Pantry Ingredients Expiring */}
        <Card className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem]">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-955/20 border border-amber-120 dark:border-amber-900/30">
              <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-3xs font-extrabold text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-955/30 px-2 py-0.5 rounded font-sans">
              Safe Food Core
            </span>
          </div>
          <div>
            <span className="text-3xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
              Pantry Inventory
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                14
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold">2 expiring soon</span>
            </div>
            <div className="text-4xs text-slate-455 dark:text-slate-500 font-bold mt-2 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" /> Monitor unsalted butter & milk
            </div>
          </div>
        </Card>

      </div>

      {/* 3. CHART ANALYTICS TREND & SYSTEM TRIGGERS IN SPLIT COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Safety Trend & Exposure Graph */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="p-6 sm:p-8 flex-1 flex flex-col space-y-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-primary-500" />
                  <h3 className="text-md sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Weekly Preventive Screening Level
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Safe Ingredient Scans vs Stop-Allergen warnings triggered over the last 7 days.
                </p>
              </div>
              
              {/* Quick dynamic legend keys */}
              <div className="flex items-center gap-4 text-3xs font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-brand-primary-500" />
                  <span className="text-slate-500">Pure Food Scans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-500" />
                  <span className="text-slate-505">Allergen Stopped</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Flow Visualization */}
            <div className="h-64 sm:h-72 w-full pr-1.5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={HEALTH_METRICS_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWarn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
                      borderRadius: '12px', 
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="safeScans" 
                    name="Pure Food Scans" 
                    stroke="#0284c7" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorSafe)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="allergenFlags" 
                    name="Allergens Traced" 
                    stroke="#f43f5e" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorWarn)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro warning indicator */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-2xs font-sans text-slate-500 dark:text-slate-450 font-bold">
              <span className="flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-500" />
                No critical medical compound conflicts detected in other logged users.
              </span>
              <span className="hidden sm:inline">Updated automatically</span>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): User Trigger Settings & Live Configs */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="p-6 sm:p-7 flex-1 flex flex-col justify-between border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                  Live Allergen Filters
                </h3>
                <span className="text-[10px] bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-600 dark:text-brand-primary-450 font-black px-2 py-0.5 rounded-full border border-brand-primary-500/10">
                  Armed Triggers
                </span>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Click a filter below to change custom monitoring dynamically. Disabled filters ignore specific additive matches.
              </p>

              {/* Allergen triggers stack */}
              <div className="space-y-2.5">
                {monitoredAllergens.map((allergen, idx) => (
                  <div 
                    key={allergen.name}
                    onClick={() => toggleAllergen(idx)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      allergen.active 
                        ? 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/80 dark:border-slate-800 hover:border-slate-300' 
                        : 'bg-slate-100/30 dark:bg-slate-950/5 border-dashed border-slate-200/40 dark:border-slate-800/60 opacity-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        !allergen.active 
                          ? 'bg-slate-300' 
                          : allergen.critical 
                            ? 'bg-rose-500 animate-pulse' 
                            : 'bg-amber-400'
                      }`} />
                      <span className={`text-[11px] font-extrabold ${
                        allergen.active ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through font-bold'
                      }`}>
                        {allergen.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 select-none">
                      {allergen.critical && allergen.active && (
                        <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-955/20 px-1.5 py-0.5 rounded uppercase">
                          CRITICAL
                        </span>
                      )}
                      
                      <div className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                        allergen.active ? 'bg-brand-primary-500' : 'bg-slate-350 dark:bg-slate-750'
                      }`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          allergen.active ? 'translate-x-3' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic visual health summary rating */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-brand-primary-50/20 dark:bg-brand-primary-950/5 rounded-2xl p-4.5">
              <div className="flex justify-between items-center text-xs font-black text-slate-800 dark:text-slate-200">
                <span>Safe Intake Score</span>
                <span className="text-brand-primary-550 dark:text-brand-primary-400">84% Optimal</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="w-[84%] bg-gradient-to-r from-brand-primary-500 to-indigo-550 h-full rounded-full" />
              </div>
              <p className="text-[10px] text-slate-455 dark:text-slate-400 font-bold leading-relaxed">
                Excellent! Keep scanning ingredients to maintain your low exposure to toxic food additives.
              </p>
            </div>
          </Card>
        </div>

      </div>

      {/* 4. RECENT EXPOSURE SCANS & INTERACTIVE HISTORY FEED */}
      <Card className="p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <h3 className="text-md sm:text-lg font-black text-slate-905 dark:text-white tracking-tight">
              Clinical Scan & Interaction Register
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Review and click history items to analyze ingredients safety breakdown and clinical logs.
            </p>
          </div>

          {/* Integrated search filter bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search ingredient scans..."
              value={safetySearchQuery}
              onChange={(e) => setSafetySearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-150 bg-slate-50 dark:bg-slate-950 outline-none focus:border-brand-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-colors font-semibold"
            />
            {safetySearchQuery && (
              <button 
                onClick={() => setSafetySearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-655"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Scan History list results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScans.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
              <FileText size={36} className="mx-auto strength-100 text-slate-300 dark:text-slate-750" />
              <p className="text-xs font-bold uppercase tracking-wider">No matching active logs</p>
              <p className="text-2xs text-slate-500">Try searching "Milk", "Tylenol", or "Cookies"</p>
            </div>
          ) : (
            filteredScans.map((scan) => {
              const isDanger = scan.riskLevel === 'avoid' || scan.allergensDetected.length > 0;
              return (
                <div 
                  key={scan.id}
                  onClick={() => setSelectedScanDetail(scan)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 hover:shadow-xs group ${
                    isDanger 
                      ? 'bg-rose-50/20 dark:bg-rose-955/5 border-rose-200/50 dark:border-rose-900/30 hover:border-rose-300' 
                      : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Visual Category Icon wrapper */}
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                    isDanger 
                      ? 'bg-rose-50 dark:bg-rose-955/35 border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-455' 
                      : scan.type === 'food'
                        ? 'bg-emerald-50 dark:bg-emerald-955/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-indigo-50 dark:bg-indigo-955/30 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {scan.type === 'food' ? <Apple size={18} /> : <Activity size={18} />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-xs font-black text-slate-855 dark:text-slate-100 group-hover:text-brand-primary-555 dark:group-hover:text-brand-primary-400 transition-colors truncate">
                        {scan.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{scan.timestamp}</span>
                    </div>

                    <p className="text-3xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                      {scan.detailSummary}
                    </p>

                    {/* Badge Info Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {scan.allergensDetected.map(tag => (
                        <span key={tag} className="text-[8px] font-black text-rose-650 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-955/30 px-1.5 py-0.5 rounded uppercase">
                          {tag}
                        </span>
                      ))}
                      {scan.infoTags.filter(tag => !scan.allergensDetected.includes(tag)).slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}

                      {/* Display Score indicator */}
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ml-auto ${
                        scan.score >= 90 
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' 
                          : scan.score >= 70 
                            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                            : 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'
                      }`}>
                        Score {scan.score}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform self-center shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* 5. INTERACTIVE MODAL OVERLAY: Scan History Details */}
      {selectedScanDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xs" 
            onClick={() => setSelectedScanDetail(null)}
          />
          <Card className="relative bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 max-w-md w-full p-6 sm:p-7 rounded-[2rem] shadow-2xl space-y-5 overflow-hidden">
            
            <div className="flex justify-between items-start">
              <Badge variant={selectedScanDetail.riskLevel === 'safe' ? 'success' : 'danger'}>
                {selectedScanDetail.type.toUpperCase()} ANALYSIS
              </Badge>
              <button 
                onClick={() => setSelectedScanDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm sm:text-md font-black text-slate-900 dark:text-white leading-snug">
                {selectedScanDetail.name}
              </h2>
              <div className="flex gap-2 text-3xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Scanned {selectedScanDetail.timestamp}</span>
                <span>•</span>
                <span>Grade {selectedScanDetail.score}/100</span>
              </div>
            </div>

            <p className="text-2xs sm:text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
              {selectedScanDetail.detailSummary}
            </p>

            {/* In-depth parameters */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Clinical Health Evaluation
              </h4>
              
              <div className="space-y-2 text-2xs font-semibold">
                {selectedScanDetail.allergensDetected.length > 0 ? (
                  <div className="flex gap-2 items-start text-rose-700 dark:text-rose-400">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-[11px]">Allergen Match Alert!</p>
                      <p className="text-[10px] opacity-90 leading-tight">Match discovered: [{selectedScanDetail.allergensDetected.join(', ')}]. Do not ingest.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 items-start text-emerald-700 dark:text-emerald-450 font-sans">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-[11px]">Allergen Clean Stance Verified</p>
                      <p className="text-[10px] opacity-90 leading-tight">Formulation is safe against your monitored allergens list setup.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="secondary" 
                size="md" 
                className="flex-1 py-2 text-xs font-bold"
                onClick={() => setSelectedScanDetail(null)}
              >
                Close View
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 py-2 text-xs font-extrabold bg-brand-primary-500 hover:bg-brand-primary-600 text-white"
                onClick={() => {
                  setSelectedScanDetail(null);
                  navigate(selectedScanDetail.type === 'food' ? '/food-scanner' : '/medicine-scanner');
                }}
              >
                Launch Analyzer
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;
