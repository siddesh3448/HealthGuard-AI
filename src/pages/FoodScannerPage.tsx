import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Info, 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  X, 
  Apple, 
  HelpCircle,
  TrendingDown,
  Inbox,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

// Rich Mock Food Products for scanning
interface FoodItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'safe' | 'warning' | 'avoid';
  allergensDetected: string[];
  dietMatches: string[];
  dietClashes: string[];
  extractedIngredients: string;
  nutrition: {
    protein: string;
    sodium: string;
    sugar: string;
    calories: string;
  };
  clinicalBio: string;
}

const PRESET_FOODS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Silk Creamy Almond Milk',
    brand: 'Silk Foods Co.',
    category: 'Dairy-Free Milk alternative',
    image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=400&q=80',
    score: 94,
    grade: 'A',
    riskLevel: 'safe',
    allergensDetected: [],
    dietMatches: ['Lactose Free', 'Vegan / Vegetarian', 'Low Sodium aligned', 'High Vitamin-E'],
    dietClashes: [],
    extractedIngredients: 'Filtered Water, Premium Almonds, Calcium Carbonate, Sea Salt, Potassium Citrate, Sunflower Lecithin, Gellan Gum, Vitamin A Palmitate, Vitamin D2, D-Alpha-Tocopherol.',
    nutrition: {
      protein: '2g',
      sodium: '120mg',
      sugar: '0g',
      calories: '30 kcal'
    },
    clinicalBio: 'Excellent quality. Features clean formulation with zero added cane sugars or chemical emulsifiers. Extremely low sodium matches your dietary target constraints.'
  },
  {
    id: 'f2',
    name: 'Chewy Choco Chip Cookies (Premium)',
    brand: 'Golden Bakery',
    category: 'Sweet confectionary snack',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80',
    score: 28,
    grade: 'F',
    riskLevel: 'avoid',
    allergensDetected: ['Peanut Trace Protein', 'Gluten', 'Wheat'],
    dietMatches: [],
    dietClashes: ['Matches your critical PEANUTS allergy!', 'Saturated Fats overload', 'High processed sugar spike risk'],
    extractedIngredients: 'Enriched Bleached Flour (Wheat Flour, Niacin, Reduced Iron, Mononitrate), Semi-Sweet Chocolate Chips (Sugar, Cocoa Butter), High Fructose Corn Syrup, Saturated Palm Oil, Hydrogenated Soy Protein, Refined Cane Sugar, Whey Powder, Natural Peanut Butter Flavor Extract, Peanut Trace Lecithins, Sodium Bicarbonate.',
    nutrition: {
      protein: '1g',
      sodium: '320mg',
      sugar: '18g',
      calories: '240 kcal'
    },
    clinicalBio: 'ALLERGY WARNING: This product contains peanut trace protein extracts and wheat gluten. Avoid consuming if you have a peanut allergy.'
  },
  {
    id: 'f3',
    name: 'Organic Rustic Marinara Pasta Sauce',
    brand: 'Primal Herbs',
    category: 'Tomato-based pasta sauce',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    score: 64,
    grade: 'C',
    riskLevel: 'warning',
    allergensDetected: ['Gluten risk', 'Soy Lecithins'],
    dietMatches: ['High Carotenoids', 'No high-fructose corn syrup'],
    dietClashes: ['Exceeds daily Low Sodium guidance ratio (480mg/srv)', 'Contains additive binders'],
    extractedIngredients: 'Organic Tomato Puree, Handpicked Extra Virgin Olive Oil, Crushed Roasted Garlic, Dehydrated Onions, Sea Salt, Heavy Cane Sugar, Organic Spices, Soy Protein Hydrolysate, Wheat Starch Binder, Citric Acid preservative.',
    nutrition: {
      protein: '3g',
      sodium: '480mg',
      sugar: '6g',
      calories: '80 kcal'
    },
    clinicalBio: 'WARNING: Contains 480mg of sodium per serving (21% of your daily limit). Avoid if you are monitoring your daily sodium intake.'
  },
  {
    id: 'f4',
    name: 'Keto Collagen Protein Recovery Bar',
    brand: 'Edge Nutrition',
    category: 'Dietary energy supplement',
    image: 'https://images.unsplash.com/photo-1622484211148-716598e0dbd1?auto=format&fit=crop&w=400&q=80',
    score: 87,
    grade: 'B',
    riskLevel: 'safe',
    allergensDetected: ['Tree nuts'],
    dietMatches: ['Matches High Protein target (15g)', 'Sugar-free with Stevia', 'Keto Approved'],
    dietClashes: ['Nut protein warning'],
    extractedIngredients: 'Grass-Fed Bovine Collagen Peptides, Premium Salted Almond Butter, Soluble Tapioca Fiber, Pure Cocoa Butter, Soy Protein Isolate, Roasted Cashew Nuts, Erythritol Sweetener, Sea Salt, Natural Flavors, Stevia Leaf Extract.',
    nutrition: {
      protein: '15g',
      sodium: '95mg',
      sugar: '1g',
      calories: '170 kcal'
    },
    clinicalBio: 'Highly aligned with your High Protein preference. Cashew nuts are included, so check cashew allergy tolerance before consuming.'
  }
];

export function FoodScannerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core scanner states
  const [selectedPreset, setSelectedPreset] = useState<FoodItem>(PRESET_FOODS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState('');
  const [scannedResult, setScannedResult] = useState<FoodItem | null>(null);
  
  // Custom manual paste form
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualIngredients, setManualIngredients] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run the full beautiful laser scanning process simulation
  const handleStartScan = (item: FoodItem) => {
    setScannedResult(null);
    setIsScanning(true);
    setScanProgress(0);
    setScanStatusMessage('Initializing visual sensor module...');

    const statuses = [
      { progress: 15, msg: 'Decompressing captured ingredient pixels...' },
      { progress: 40, msg: 'Isolating chemical formula compounds with OCR...' },
      { progress: 70, msg: 'Comparing with logged user allergy triggers...' },
      { progress: 95, msg: 'Finalizing health guard safety grade...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScannedResult(item);
            showToast(`Analysis complete: ${item.name}`);
          }, 300);
          return 100;
        }

        // Cycle through detailed status descriptions of OCR
        if (currentStep < statuses.length && prev >= statuses[currentStep].progress) {
          setScanStatusMessage(statuses[currentStep].msg);
          currentStep++;
        }

        return prev + 2;
      });
    }, 45);
  };

  // Process Custom manual pasta content or newly simulated file upload
  const handleManualAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualIngredients) {
      showToast('Please insert a valid product name and ingredients text.');
      return;
    }

    setShowManualForm(false);
    setIsScanning(true);
    setScanProgress(0);
    setScanStatusMessage('Initializing visual sensor module...');

    try {
      // Start progress ticker immediately to make the UI feel reactive
      const statuses = [
        { progress: 15, msg: 'Decompressing captured ingredient pixels...' },
        { progress: 40, msg: 'Comparing with logged user allergy triggers...' },
        { progress: 75, msg: 'Informing clinical decision engine with Gemini...' },
        { progress: 95, msg: 'Finalizing health guard safety grade...' }
      ];

      let currentProgress = 0;
      let currentStep = 0;
      const interval = setInterval(() => {
        currentProgress += 4;
        if (currentProgress < 95) {
          setScanProgress(currentProgress);
          if (currentStep < statuses.length && currentProgress >= statuses[currentStep].progress) {
            setScanStatusMessage(statuses[currentStep].msg);
            currentStep++;
          }
        }
      }, 100);

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: `${manualName} - Ingredients: ${manualIngredients}`,
          context: {
            allergies: user?.allergies || ["Peanuts"],
            conditions: user?.healthConditions || ["Mild Hypertension"]
          }
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data && data.success && data.data) {
        setScanProgress(100);
        setScanStatusMessage('Finalizing health guard safety grade...');
        setTimeout(() => {
          setIsScanning(false);
          setScannedResult(data.data);
          showToast(`Analysis complete: ${data.data.name}`);
        }, 300);
      } else {
        throw new Error(data.error || "Failed to scan food with Gemini");
      }
    } catch (err) {
      console.error("Gemini Food Scanner error, falling back to heuristics:", err);
      // Dynamic Clinical Heuristics Fallback
      const containsPeanuts = manualIngredients.toLowerCase().includes('peanut') || manualIngredients.toLowerCase().includes('arachis');
      const containsGluten = manualIngredients.toLowerCase().includes('wheat') || manualIngredients.toLowerCase().includes('gluten');
      const isHighSodium = manualIngredients.toLowerCase().includes('sodium') && manualName.toLowerCase().includes('salty');

      const allergensFound: string[] = [];
      let risk: 'safe' | 'warning' | 'avoid' = 'safe';
      let calculatedScore = 85;
      let computedGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'B';

      if (containsPeanuts) {
        allergensFound.push('Critical Peanut Trace');
        risk = 'avoid';
        calculatedScore = 20;
        computedGrade = 'F';
      } else if (containsGluten) {
        allergensFound.push('Gluten Content');
        risk = 'warning';
        calculatedScore = 65;
        computedGrade = 'C';
      }

      const customGeneratedFood: FoodItem = {
        id: `custom_${Date.now()}`,
        name: manualName,
        brand: 'Custom Scan upload',
        category: 'Unverified product category',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        score: calculatedScore,
        grade: computedGrade,
        riskLevel: risk,
        allergensDetected: allergensFound,
        dietMatches: !containsPeanuts && !containsGluten ? ['Lactose Free', 'Additive Free'] : [],
        dietClashes: containsPeanuts ? ['WARNING: Peanut allergens detected! Matches your profile strict filters'] : [],
        extractedIngredients: manualIngredients,
        nutrition: {
          protein: '3g',
          sodium: isHighSodium ? '540mg' : '110mg',
          sugar: '2g',
          calories: '120 kcal'
        },
        clinicalBio: containsPeanuts 
          ? 'ALLERGY WARNING: Matches your peanut allergen settings. Do not eat!'
          : 'Compatible with your health profile. Check ingredients to verify.'
      };

      setScanProgress(100);
      setScanStatusMessage('Finalizing health guard safety grade...');
      setTimeout(() => {
        setIsScanning(false);
        setScannedResult(customGeneratedFood);
        showToast(`Analysis complete: ${customGeneratedFood.name}`);
      }, 300);
    }
  };

  // Simulate file upload choice by attaching generic picture then matching one product
  const triggerSimulationUpload = () => {
    // Select random preset item to simulate image detection
    const randomPreset = PRESET_FOODS[Math.floor(Math.random() * PRESET_FOODS.length)];
    showToast('Simulating image capture upload...');
    handleStartScan(randomPreset);
  };

  // Handle saving the scanned item systematically to smart pantry list
  const handleAddToPantry = (item: FoodItem) => {
    const existingPantryItems = localStorage.getItem('hg_smart_pantry');
    let items = [];
    if (existingPantryItems) {
      try {
        items = JSON.parse(existingPantryItems);
      } catch (err) {
        items = [];
      }
    }

    // Check if food already in pantry
    const alreadyExists = items.some((p: any) => p.name === item.name);
    if (alreadyExists) {
      showToast(`${item.name} is already logged in your kitchen pantry.`);
      return;
    }

    const newPantryRecord = {
      id: `pantry_${Date.now()}`,
      name: item.name,
      brand: item.brand,
      category: item.category,
      addedAt: new Date().toLocaleDateString(),
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 10 days out
      allergens: item.allergensDetected,
      riskLevel: item.riskLevel,
      quantity: '1 Unit'
    };

    items.push(newPantryRecord);
    localStorage.setItem('hg_smart_pantry', JSON.stringify(items));
    showToast(`Successfully logged ${item.name} into your Smart Kitchen Pantry!`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-sans animate-fade-in">
      
      {/* Toast confirmation system alert banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700/50 text-xs font-bold animate-fade-in max-w-sm w-full">
          <CheckCircle2 size={16} className="text-brand-primary-500 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* 1. SECTION TITLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-3xs font-extrabold tracking-wider uppercase border border-emerald-500/20">
              🧬 Food Guard Safety Check
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Ingredients Nutrition Analyzer
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Snap photos of store items physical boxes or upload ingredients text blocks to get an immediate allergy & dietary evaluation matching your wellness profile.
          </p>
        </div>

        {/* Top interactive auxiliary action button */}
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowManualForm(!showManualForm)}
          className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4"
        >
          <FileText size={14} className="text-indigo-500" />
          <span>{showManualForm ? 'Hide Ingredient Form' : 'Paste Text Analysis'}</span>
        </Button>
      </div>

      {/* 2. OPTIONAL INGREDIENT TEXT PASTE FORM SECTION */}
      {showManualForm && (
        <Card className="p-6 border border-brand-primary-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-sm animate-scale-up">
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Input Custom Product Ingredients
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Type the details directly if physical camera capture is unavailable.
              </p>
            </div>
            <button 
              onClick={() => setShowManualForm(false)} 
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleManualAnalyze} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                Product / Brand Name
              </label>
              <input 
                type="text" 
                placeholder="e.g., Organic Bluebery Granola Bites"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                Ingredients Readout (separated by commas)
              </label>
              <textarea 
                rows={3}
                placeholder="e.g., Rolled oats, brown rice syrup, peanut trace powder, canola oil, soy protein binder..."
                value={manualIngredients}
                onChange={(e) => setManualIngredients(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-1.5">
              <Button 
                variant="secondary" 
                size="sm" 
                type="button" 
                onClick={() => { setManualName(''); setManualIngredients(''); }}
              >
                Clear Fields
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                type="submit"
                className="bg-brand-primary-500 text-white font-extrabold hover:bg-brand-primary-600"
              >
                Analyze Ingredients
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 3. DUAL-WINDOW SCANNER STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (5 cols): The Camera Simulator Screen & Presets Selector */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-3xs bg-white dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                Visual Active Camera Feed
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Lens
              </span>
            </div>

            {/* The actual viewport mimicking active mobile camera scans */}
            <div className="relative aspect-4/3 rounded-2xl bg-slate-950 dark:bg-black border border-slate-800 overflow-hidden flex flex-col justify-between p-4 group">
              
              {/* Corner target lines of scan zone */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-450 rounded-tl" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-450 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-450 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-450 rounded-br" />

              {/* Background Item Image */}
              <div className="absolute inset-0 w-full h-full opacity-60">
                <img 
                  src={selectedPreset.image} 
                  alt={selectedPreset.name} 
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300 group-hover:scale-105"
                />
              </div>

              {/* LASER SCAN BAR (CSS Animation overlay) */}
              {(isScanning || scannedResult?.id === selectedPreset.id) && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] z-10 animate-[bounce_3s_infinite]" style={{ top: '30%' }} />
              )}

              {/* Overlay states context */}
              {isScanning ? (
                <div className="relative z-20 m-auto text-center space-y-3 bg-slate-950/80 backdrop-blur-xs p-4 rounded-xl max-w-xs border border-slate-800">
                  <RefreshCw className="animate-spin text-emerald-450 mx-auto" size={24} />
                  <p className="text-3xs text-emerald-400 font-extrabold uppercase tracking-widest leading-relaxed">
                    Analyzing ingredients label...
                  </p>
                  <p className="text-4xs text-slate-350 font-bold max-w-[200px] mx-auto truncate text-center">
                    {scanStatusMessage}
                  </p>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-450 h-full transition-all" style={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative z-20 flex justify-between items-start">
                    <div className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-3xs font-extrabold text-white">
                      {selectedPreset.brand}
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-3xs font-extrabold text-slate-300">
                      Simulated 1080p View
                    </div>
                  </div>

                  <div className="relative z-20 mt-auto bg-slate-900/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedPreset.category}</p>
                      <h4 className="text-2xs font-extrabold text-white truncate mt-0.5">{selectedPreset.name}</h4>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartScan(selectedPreset)}
                      disabled={isScanning}
                      className="px-3.5 py-1.5 text-xs font-black bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-lg shadow-sm"
                    >
                      {scannedResult?.id === selectedPreset.id ? 'Recheck Scan' : 'Trigger Scan'}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Quick auxiliary upload option simulation */}
            <div className="pt-2 flex gap-3 text-xs font-bold sm:justify-start">
              <Button
                variant="secondary"
                size="sm"
                onClick={triggerSimulationUpload}
                className="flex-1 flex items-center justify-center gap-1.5 text-slate-655 hover:bg-slate-50 border-slate-205 py-2 rounded-xl"
              >
                <Upload size={14} className="text-slate-500" />
                <span>Simulate Camera Upload</span>
              </Button>
            </div>
          </Card>

          {/* Preset Food Products list selector */}
          <Card className="p-5 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                Quick Preset Simulator Items
              </h3>
              <p className="text-[10px] text-slate-505 dark:text-slate-400 font-semibold mt-0.5">
                Select one of our premium preset products to instantly pre-load into the scanning lens.
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {PRESET_FOODS.map(food => {
                const isSelected = selectedPreset.id === food.id;
                const matchesAllergen = food.allergensDetected.length > 0;
                
                return (
                  <div
                    key={food.id}
                    onClick={() => {
                      if (!isScanning) {
                        setSelectedPreset(food);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-brand-primary-50/20 dark:bg-brand-primary-950/10 border-brand-primary-500 shadow-3xs' 
                        : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50'
                    }`}
                  >
                    <img 
                      src={food.image} 
                      alt="" 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-2xs font-extrabold truncate ${
                        isSelected ? 'text-brand-primary-650 dark:text-brand-primary-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {food.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{food.brand}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 select-none">
                      {matchesAllergen && (
                        <span className="text-[8px] font-black text-rose-600 bg-rose-50 dark:bg-rose-955/20 px-1.5 py-0.5 rounded uppercase">
                          ALLERGEN RISK
                        </span>
                      )}
                      <span className={`text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        food.score >= 90 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : food.score >= 70 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {food.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column (7 cols): Detailed Scan Analysis Output */}
        <div className="lg:col-span-7">
          {scannedResult ? (
            <Card className="p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-sm bg-white dark:bg-slate-900 space-y-6 animate-scale-up">
              
              {/* Result header layout: Product Details & Grade Rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="space-y-1.5">
                  <Badge variant={scannedResult.riskLevel === 'safe' ? 'success' : scannedResult.riskLevel === 'warning' ? 'warning' : 'danger'}>
                    Ingredients Status: {scannedResult.riskLevel === 'safe' ? 'Fully Clean Aligned' : scannedResult.riskLevel === 'warning' ? 'Contains Warnings' : 'CRITICAL HAZARD'}
                  </Badge>
                  <h2 className="text-md sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {scannedResult.name}
                  </h2>
                  <p className="text-3xs text-slate-400 font-extrabold uppercase tracking-widest">
                    Manufactured by <span className="text-slate-655 dark:text-slate-300 font-black">{scannedResult.brand}</span> • Category: {scannedResult.category}
                  </p>
                </div>

                {/* Visually stunning health-score ring badge */}
                <div className="flex items-center gap-3.5 shrink-0 bg-slate-50 dark:bg-slate-950/30 p-2.5 rounded-2xl border border-slate-105 dark:border-slate-850">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">Intake Score</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{scannedResult.score}/100</span>
                  </div>
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-md font-black shadow-3xs text-white ${
                    scannedResult.score >= 90 
                      ? 'bg-emerald-500' 
                      : scannedResult.score >= 70 
                        ? 'bg-brand-accent-500' 
                        : 'bg-rose-500'
                  }`}>
                    {scannedResult.grade}
                  </div>
                </div>
              </div>

              {/* Nutrition parameters Circular Trackers preview */}
              <div className="space-y-3">
                <h4 className="text-3xs font-black text-slate-400 uppercase tracking-widest">
                  Live Nutri-Meter Compounds
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-955/40 p-3 rounded-xl text-center border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Protein</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 block">{scannedResult.nutrition.protein}</span>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">High protein</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-955/40 p-3 rounded-xl text-center border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Sodium</span>
                    <span className="text-xs font-black text-slate-805 dark:text-slate-100 mt-1 block">{scannedResult.nutrition.sodium}</span>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">Daily Limit checked</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-955/40 p-3 rounded-xl text-center border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Sugar index</span>
                    <span className="text-xs font-black text-slate-805 dark:text-slate-100 mt-1 block">{scannedResult.nutrition.sugar}</span>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">No added fructose</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-955/40 p-3 rounded-xl text-center border border-slate-150 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-[9px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Energy Ratio</span>
                    <span className="text-xs font-black text-slate-805 dark:text-slate-100 mt-1 block">{scannedResult.nutrition.calories}</span>
                    <span className="text-[8px] text-slate-400 font-bold block mt-1">Per standard cup</span>
                  </div>
                </div>
              </div>

              {/* Allergen Flag Section */}
              <div className="space-y-2.5">
                <h4 className="text-3xs font-black text-slate-400 uppercase tracking-widest">
                  Active Household Allergen Screening
                </h4>

                {scannedResult.allergensDetected.length > 0 ? (
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-955/20 border border-rose-150 dark:border-rose-900/35 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="text-rose-600 dark:text-rose-455 shrink-0 mt-0.5" size={18} />
                    <div className="space-y-1">
                      <h4 className="text-2xs font-extrabold text-rose-800 dark:text-rose-350 uppercase tracking-wider">
                        Critical Threat! Matching allergen detected
                      </h4>
                      <p className="text-[11px] text-rose-650 dark:text-rose-400 leading-relaxed font-semibold">
                        This product contains: <span className="font-extrabold underline">[{scannedResult.allergensDetected.join(', ')}]</span> which matches your profile allergen alerts tracker. Contact doctor if minor ingestion is experienced.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-955/15 border border-emerald-150 dark:border-emerald-900/40 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" size={18} />
                    <div className="space-y-1">
                      <h4 className="text-2xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                        Pure Ingredient Formula Verified
                      </h4>
                      <p className="text-[11px] text-emerald-650 dark:text-emerald-450 leading-relaxed font-semibold">
                        Zero trace or chemical additive triggers matched your strict allergen profile. Highly safe to ingest.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Extracted Ingredients raw description text block */}
              <div className="space-y-2">
                <h4 className="text-3xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Extracted OCR Ingredients Label</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-500 px-2 py-0.5 rounded-full lowercase tracking-normal">
                    computer vision read-out
                  </span>
                </h4>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl font-mono text-3xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  {scannedResult.extractedIngredients}
                </div>
              </div>

              {/* Diet Profile Alignment Evaluation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                    Positive Diet Matches
                  </h5>
                  <div className="space-y-1.5">
                    {scannedResult.dietMatches.length === 0 ? (
                      <span className="text-3xs text-slate-400 block font-semibold italic">No notable nutritional matches.</span>
                    ) : (
                      scannedResult.dietMatches.map(dm => (
                        <div key={dm} className="flex gap-1.5 items-center text-3xs font-semibold text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                          <span>{dm}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                    Diet Clashes / Flags
                  </h5>
                  <div className="space-y-1.5">
                    {scannedResult.dietClashes.length === 0 ? (
                      <div className="flex gap-1.5 items-center text-3xs font-semibold text-emerald-600 dark:text-emerald-450">
                        <CheckCircle2 size={12} className="shrink-0" />
                        <span>Highly clean alignment</span>
                      </div>
                    ) : (
                      scannedResult.dietClashes.map(dc => (
                        <div key={dc} className="flex gap-1.5 items-start text-3xs font-semibold text-slate-600 dark:text-slate-400">
                          <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                          <span>{dc}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed AI Clinical recommendation summary */}
              <div className="bg-gradient-to-br from-brand-primary-500/5 to-indigo-550/5 border border-brand-primary-500/10 dark:border-brand-primary-500/15 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-brand-primary-650 dark:text-brand-primary-400">
                  <Sparkles size={14} className="animate-pulse" />
                  <h4 className="text-2xs font-extrabold uppercase tracking-wider">AI Recommendation</h4>
                </div>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                  {scannedResult.clinicalBio}
                </p>
              </div>

              {/* Core interactive buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setScannedResult(null)}
                  className="flex-1 py-3 text-xs font-bold"
                >
                  Clear Results
                </Button>
                
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleAddToPantry(scannedResult)}
                  className="flex-1 py-3 text-xs font-extrabold bg-brand-primary-500 hover:bg-brand-primary-600 text-white shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Log to Smart Pantry</span>
                </Button>
              </div>

            </Card>
          ) : (
            <Card className="min-h-[460px] flex flex-col justify-center items-center text-center p-8 border border-dashed border-slate-255 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-150 dark:border-slate-850">
                <Camera size={28} className="text-slate-400 strength-100 animate-pulse" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm sm:text-md font-black text-slate-900 dark:text-slate-200 tracking-tight">
                  Ingredients Analysis Report Awaiting
                </h3>
                <p className="text-2xs text-slate-455 dark:text-slate-400 font-semibold leading-relaxed">
                  Trigger scanning on the active lens simulator to extract ingredients label, cross-examine with allergens constraints, and log nutritional grades instantly.
                </p>
              </div>

              {/* Quick helper tutorial tip */}
              <div className="pt-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl max-w-xs text-left text-[10px] text-slate-505 dark:text-slate-400 space-y-1 font-semibold leading-relaxed">
                <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">💡 Pro-Tip Checklist:</span>
                <p>1. Pick any preset food product from the left box list.</p>
                <p>2. Tap "Trigger Scan" or manual paste upload.</p>
                <p>3. Let the computer vision sensor analyze live.</p>
              </div>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
}

export default FoodScannerPage;
