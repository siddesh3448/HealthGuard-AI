import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Scale, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  Globe, 
  Volume2, 
  Bell, 
  Trash2, 
  LogOut, 
  CheckCircle, 
  Save,
  Lock,
  Smartphone,
  Eye,
  Settings,
  Heart,
  Undo2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Form states initialized from Auth context user parameters
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age || 32);
  const [weight, setWeight] = useState(user?.weight || 78);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user?.weightUnit || 'kg');
  const [height, setHeight] = useState(user?.height || 180);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(user?.heightUnit || 'cm');

  // Multi-select targets
  const [allergies, setAllergies] = useState<string[]>(user?.allergies || []);
  const [healthConditions, setHealthConditions] = useState<string[]>(user?.healthConditions || []);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(user?.dietaryPreferences || []);

  // System options
  const [audioPrompts, setAudioPrompts] = useState(true);
  const [pushReminders, setPushReminders] = useState(true);
  const [sodiumLimit, setSodiumLimit] = useState(1500); // sodium monitoring target mg

  // UI notifications
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'clinical' | 'system'>('profile');

  // List arrays
  const ALLERGENS_OPTIONS = [
    'Peanuts',
    'Tree Nuts',
    'Shellfish',
    'Dairy',
    'Gluten',
    'Soy',
    'Eggs',
    'Sesame'
  ];

  const CLINICAL_OPTIONS = [
    'Mild Hypertension',
    'Type 2 Diabetes',
    'High Cholesterol',
    'Asthma',
    'Acid Reflux (GERD)',
    'Chronic Kidney Disease'
  ];

  const DIETARY_OPTIONS = [
    'Low Sodium',
    'Low Glycemic',
    'High Protein',
    'Keto-Aligned',
    'Vegan',
    'Vegetarian',
    'Mediterranean'
  ];

  // Toggle helpers
  const handleToggleAllergy = (item: string) => {
    setAllergies(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleToggleCondition = (item: string) => {
    setHealthConditions(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleToggleDietary = (item: string) => {
    setDietaryPreferences(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  // Trigger main profile save
  const handleSaveChanges = () => {
    updateUser({
      name,
      email,
      age: Number(age),
      weight: Number(weight),
      weightUnit,
      height: Number(height),
      heightUnit,
      allergies,
      healthConditions,
      dietaryPreferences
    });

    // Save customized secondary metrics to local storage
    localStorage.setItem('hg_audio_prompts', String(audioPrompts));
    localStorage.setItem('hg_push_reminders', String(pushReminders));
    localStorage.setItem('hg_sodium_limit', String(sodiumLimit));

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2800);
  };

  // Factory reset simulator
  const handleFactoryReset = () => {
    if (window.confirm('WARNING: Resetting HealthGuard deletes pantry item logs, customized alerts, and chat threads. Proceed?')) {
      localStorage.removeItem('hg_assistant_chat');
      localStorage.removeItem('smart_pantry_items'); 
      localStorage.removeItem('scanned_foods_history');
      localStorage.removeItem('scanned_medicines_history');
      alert('Local workspace caches successfully flushed.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-primary-500/10 text-brand-primary-650 dark:text-brand-primary-400 text-3xs font-extrabold tracking-wider uppercase border border-brand-primary-500/20">
              ⚙️ Control Center
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('nav.settings') || 'System Settings'}
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Manage your personal biometrics, target allergen list, chronic health profile configurations, and interface preference metrics.
          </p>
        </div>

        {/* Sync Indicator */}
        <span className="inline-flex items-center gap-2 self-start sm:self-auto text-3xs font-black uppercase tracking-wider px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl shrink-0">
          <ShieldCheck size={11} className="text-brand-primary-500" />
          <span>Profile Fully Synced</span>
        </span>
      </div>

      {/* SUCCESS POPUP TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 outline outline-4 outline-emerald-600/20 text-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-emerald-500 text-xs font-black uppercase tracking-wider text-center"
          >
            <CheckCircle size={16} className="text-emerald-200 animate-pulse" />
            <span>HealthGuard Configuration Successfully Updated!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TOP HORIZONTAL NAVIGATION TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/65 dark:border-slate-800/80 pb-4">
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {[
            { id: 'profile', label: 'Profile Demographics', icon: User },
            { id: 'clinical', label: 'Allergies & Nutrition', icon: Activity },
            { id: 'system', label: 'Voice & App Settings', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-950 text-white dark:bg-white dark:border-transparent dark:text-slate-950 shadow-md transform scale-[1.01]' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`p-1.5 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/10 dark:bg-slate-100 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  <Icon size={14} />
                </div>
                <div>
                  <span className="block text-[8px] font-extrabold uppercase tracking-widest opacity-70 leading-none">
                    Category
                  </span>
                  <span className="block text-xs font-black tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visually separate logout action to the right */}
        <div className="shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 dark:bg-rose-950/25 dark:border-rose-900/40 dark:text-rose-450 hover:dark:bg-rose-950/35 rounded-2xl text-xs font-black uppercase tracking-wider h-[46px]"
          >
            <span>Log Out</span>
            <LogOut size={13} className="shrink-0 text-rose-600" />
          </Button>
        </div>
      </div>

      {/* 3. MAIN PRESTIGE CARD CONTENT AREA */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.5rem] shadow-3xs space-y-8">
            
            {/* Tab Header Detail Title */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary-500">
                {activeTab === 'profile' && 'Demographics Settings'}
                {activeTab === 'clinical' && 'Diet & Allergy Settings'}
                {activeTab === 'system' && 'Voice & App Settings'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {activeTab === 'profile' && 'Manage Personal Profile'}
                {activeTab === 'clinical' && 'Edit Diet and Allergen Constraints'}
                {activeTab === 'system' && 'System Language & Voice Assistant'}
              </h2>
            </div>

            {/* FORM BODY FOR ACTIVE TAB SELECTION */}
            <div className="space-y-6">
              
              {/* TAB 1: PROFILE DEMOGRAPHICS */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Primary Username / Patient Initials
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
                      />
                      <User size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Secure Account Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
                      />
                      <Mail size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Patient Age Count (Years)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
                      />
                      <Calendar size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Weight block with Units */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Total Body Mass (Weight)
                    </label>
                    <div className="flex gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
                        />
                        <Scale size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                      </div>
                      <select
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 px-3.5 rounded-2xl text-[10px] font-black uppercase text-slate-650 tracking-wider dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="kg">KG</option>
                        <option value="lbs">LBS</option>
                      </select>
                    </div>
                  </div>

                  {/* Height block with Units */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Vertical Height Dimension
                    </label>
                    <div className="flex gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
                        />
                        <Scale size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                      </div>
                      <select
                        value={heightUnit}
                        onChange={(e) => setHeightUnit(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 px-3.5 rounded-2xl text-[10px] font-black uppercase text-slate-650 tracking-wider dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="cm">CM</option>
                        <option value="ft">FT</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CLINICAL / ALLERGIES */}
              {activeTab === 'clinical' && (
                <div className="space-y-6">
                  
                  {/* Allergies list section */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                      <AlertTriangle size={12} className="animate-pulse" />
                      Filter Allergens (Peanuts trigger immediate safety alerts)
                    </span>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {ALLERGENS_OPTIONS.map(alg => {
                        const hasAlg = allergies.includes(alg);
                        return (
                          <button
                            key={alg}
                            type="button"
                            onClick={() => handleToggleAllergy(alg)}
                            className={`px-3 py-2.5 rounded-2xl border text-3xs font-extrabold uppercase tracking-widest transition-all cursor-pointer break-words whitespace-normal text-center leading-normal flex items-center justify-center min-h-[44px] ${
                              hasAlg 
                                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20' 
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                            }`}
                          >
                            <span>{alg}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditions List Section */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Activity size={12} />
                      Health Conditions (Helps flag warnings and drug compatibility)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {CLINICAL_OPTIONS.map(cond => {
                        const hasCond = healthConditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => handleToggleCondition(cond)}
                            className={`px-3 py-2.5 rounded-2xl border text-3xs font-extrabold uppercase tracking-widest transition-all text-left flex items-center justify-between cursor-pointer break-words whitespace-normal leading-normal gap-2 min-h-[44px] ${
                              hasCond 
                                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20' 
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                            }`}
                          >
                            <span>{cond}</span>
                            {hasCond && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dietary Target Selections */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary-500 flex items-center gap-1.5">
                      <ShieldCheck size={12} />
                      Target Nutritional Constraints
                    </span>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {DIETARY_OPTIONS.map(pref => {
                        const hasPref = dietaryPreferences.includes(pref);
                        return (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleToggleDietary(pref)}
                            className={`px-3 py-2.5 rounded-2xl border text-3xs font-extrabold uppercase tracking-widest transition-all cursor-pointer break-words whitespace-normal text-center leading-normal flex items-center justify-center min-h-[44px] ${
                              hasPref 
                                ? 'bg-brand-primary-50 text-brand-primary-600 border-brand-primary-200 dark:bg-brand-primary-950/20' 
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-505 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                            }`}
                          >
                            <span>{pref}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sodium Intake Limit slider */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-center text-3xs font-black uppercase tracking-wider">
                      <span className="text-slate-600 dark:text-slate-200">Daily Sodium Intake Threshold Limit</span>
                      <span className="text-brand-primary-500">{sodiumLimit} MG</span>
                    </div>
                    <input 
                      type="range"
                      min={500}
                      max={3500}
                      step={100}
                      value={sodiumLimit}
                      onChange={(e) => setSodiumLimit(Number(e.target.value))}
                      className="w-full accent-brand-primary-500 rounded-xl cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Note: High sodium limits can trigger arterial tension in hypertension configurations. Safe levels reside under 1,500mg.
                    </p>
                  </div>

                </div>
              )}

              {/* TAB 3: SYSTEM AUDIBLE CONFIG */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  
                  {/* Language selection Row */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Globe size={11} /> Application System Language
                    </span>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                      {[
                        { id: 'en', label: 'English (US)' },
                        { id: 'es', label: 'Español (ES)' },
                        { id: 'fr', label: 'Français (FR)' },
                        { id: 'hi', label: 'हिन्दी (Hindi)' },
                        { id: 'bn', label: 'বাংলা (Bengali)' },
                        { id: 'ta', label: 'தமிழ் (Tamil)' },
                        { id: 'te', label: 'తెలుగు (Telugu)' },
                        { id: 'mr', label: 'मराठी (Marathi)' },
                        { id: 'gu', label: 'ગુજરાતી (Gujarati)' },
                        { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                        { id: 'ml', label: 'മലയാളം (Malayalam)' },
                        { id: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
                        { id: 'ur', label: 'اردو (Urdu)' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setLanguage(item.id as any)}
                          className={`p-3 rounded-2xl border text-3xs font-extrabold tracking-wider transition-all cursor-pointer text-center break-words leading-tight flex items-center justify-center min-h-[44px] ${
                            language === item.id 
                              ? 'bg-slate-950 border-slate-950 text-white dark:bg-white dark:text-slate-950 dark:border-transparent font-black shadow-sm scale-[1.02]' 
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 shadow-2xs'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audible Feedback Checkbox toggles */}
                  <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Volume2 size={11} /> Audible Assistant Warnings
                    </span>

                    <div className="space-y-3.5">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={audioPrompts}
                          onChange={(e) => setAudioPrompts(e.target.checked)}
                          className="mt-1 accent-brand-primary-500 rounded cursor-pointer"
                        />
                        <div>
                          <span className="block text-3xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                            Text-to-Speech Voice Alerts
                          </span>
                          <span className="block text-[10px] text-slate-400 leading-relaxed font-semibold">
                            Enables spoken voice alerts for any allergen matches during scans.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pushReminders}
                          onChange={(e) => setPushReminders(e.target.checked)}
                          className="mt-1 accent-indigo-500 rounded cursor-pointer"
                        />
                        <div>
                          <span className="block text-3xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                            Daily Medication Notifications
                          </span>
                          <span className="block text-[10px] text-slate-400 leading-relaxed font-semibold">
                            Alerts you if a medication conflicts with citrus or grapefruit intake.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Danger zone diagnostics */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1">
                      <AlertTriangle size={11} /> Danger Zone Cache Management
                    </span>

                    <div className="bg-rose-50/20 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-950/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="block text-3xs font-black text-rose-600 uppercase tracking-widest">
                          Wipe Saved Data
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
                          Deletes the entire kitchen pantry inventory, scanned history, and voice logs.
                        </span>
                      </div>
                      <button
                        onClick={handleFactoryReset}
                        className="text-3xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        Reset Application
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* SAVE BUTTON BANNER */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-end gap-3.5">
              <button
                onClick={() => {
                  // reload state from auth context
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                  setAge(user?.age || 32);
                  setWeight(user?.weight || 78);
                  setWeightUnit(user?.weightUnit || 'kg');
                  setHeight(user?.height || 180);
                  setHeightUnit(user?.heightUnit || 'cm');
                  setAllergies(user?.allergies || []);
                  setHealthConditions(user?.healthConditions || []);
                  setDietaryPreferences(user?.dietaryPreferences || []);
                }}
                className="text-3xs font-black uppercase tracking-wider px-4 py-2 border border-slate-205 text-slate-600 hover:bg-slate-50 rounded-2xl flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Discard unsaved changes and reset input fields"
              >
                <Undo2 size={12} />
                <span>Reset Local</span>
              </button>

              <button
                onClick={handleSaveChanges}
                className="text-3xs font-black uppercase tracking-wider bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-2xl shadow-sm flex items-center gap-1.5 px-6 py-3 transition-colors cursor-pointer"
              >
                <Save size={12} />
                <span>Save Changes</span>
              </button>
            </div>

          </Card>

    </div>
  );
}

export default SettingsPage;
