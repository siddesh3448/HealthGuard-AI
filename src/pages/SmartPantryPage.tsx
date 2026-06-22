import React, { useState, useEffect, useMemo } from 'react';
import { 
  Apple, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Info, 
  ChevronRight, 
  Sparkles, 
  X, 
  Edit3, 
  Layers, 
  FileText,
  Egg,
  TrendingDown,
  Clock,
  ThumbsUp,
  Inbox,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

// Interface for rich pantry inventory items
interface PantryInventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  addedAt: string;
  expiryDate: string; // MM/DD/YYYY or YYYY-MM-DD
  allergens: string[];
  riskLevel: 'safe' | 'warning' | 'avoid';
  quantity: string; // e.g. "2 Units", "1 Liter", "500g"
  score?: number;
  grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  clinicalBio?: string;
  image?: string;
}

const DEFAULT_PANTRY_PRESETS: PantryInventoryItem[] = [
  {
    id: 'p1',
    name: 'Silk Creamy Almond Milk',
    brand: 'Silk Foods Co.',
    category: 'Dairy Alternative',
    addedAt: '06/15/2026',
    expiryDate: '07/12/2026',
    allergens: [],
    riskLevel: 'safe',
    quantity: '2 Units',
    score: 94,
    grade: 'A',
    image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=400&q=80',
    clinicalBio: 'Clean formulation with zero added cane sugars or chemical emulsifiers.'
  },
  {
    id: 'p2',
    name: 'Chewy Choco Chip Cookies',
    brand: 'Golden Bakery',
    category: 'Snacks & Confectionery',
    addedAt: '06/20/2026',
    expiryDate: '06/25/2026', // Imminent expiration
    allergens: ['Peanuts', 'Gluten', 'Wheat'],
    riskLevel: 'avoid',
    quantity: '1 Unit',
    score: 28,
    grade: 'F',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80',
    clinicalBio: 'ALLERGY WARNING: Contains active peanut traces matching your profile guidelines.'
  },
  {
    id: 'p3',
    name: 'Organic Rustic Marinara Pasta Sauce',
    brand: 'Primal Herbs',
    category: 'Condiments & Sauces',
    addedAt: '06/18/2026',
    expiryDate: '07/04/2026',
    allergens: ['Gluten risk'],
    riskLevel: 'warning',
    quantity: '1 Unit',
    score: 64,
    grade: 'C',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    clinicalBio: 'High sodium content (480mg/srv). Recommended to restrict if monitoring blood pressure.'
  },
  {
    id: 'p4',
    name: 'Keto Collagen Protein Recovery Bar',
    brand: 'Edge Nutrition',
    category: 'Protein Supplements',
    addedAt: '06/21/2026',
    expiryDate: '08/30/2026',
    allergens: ['Tree nuts'],
    riskLevel: 'safe',
    quantity: '5 Units',
    score: 87,
    grade: 'B',
    image: 'https://images.unsplash.com/photo-1622484211148-716598e0dbd1?auto=format&fit=crop&w=400&q=80',
    clinicalBio: 'Nutrient dense high protein item. Supports muscle recovery.'
  }
];

// Curated list of Unsplash thumbnail placeholders based on category to render when custom items added
const CATEGORY_IMAGES: Record<string, string> = {
  'Dairy Alternative': 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=150&q=80',
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=150&q=80',
  'Condiments & Sauces': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80',
  'Protein Supplements': 'https://images.unsplash.com/photo-1622484211148-716598e0dbd1?auto=format&fit=crop&w=150&q=80',
  'Fruts & Veggies': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=150&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1622484211148-716598e0dbd1?auto=format&fit=crop&w=150&q=80',
  'Other': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'
};

export function SmartPantryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Load state or seed default inventory
  const [pantryItems, setPantryItems] = useState<PantryInventoryItem[]>(() => {
    const localStr = localStorage.getItem('hg_smart_pantry');
    if (localStr) {
      try {
        const parsed = JSON.parse(localStr);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fall back to presets below
      }
    }
    // Seed and persist presets
    localStorage.setItem('hg_smart_pantry', JSON.stringify(DEFAULT_PANTRY_PRESETS));
    return DEFAULT_PANTRY_PRESETS;
  });

  // UI state management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');

  // Form management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryInventoryItem | null>(null);

  // Form Field states (Add)
  const [newItemName, setNewItemName] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Dairy Alternative');
  const [newItemQtyVal, setNewItemQtyVal] = useState(1);
  const [newItemQtyUnit, setNewItemQtyUnit] = useState('Units');
  const [newItemExpiry, setNewItemExpiry] = useState('');
  const [newItemGrade, setNewItemGrade] = useState<'A' | 'B' | 'C' | 'D' | 'F'>('A');
  const [newItemAllergensList, setNewItemAllergensList] = useState<string[]>([]);
  const [allergenInput, setAllergenInput] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist pantry list on changes
  const updatePantryState = (updatedList: PantryInventoryItem[]) => {
    setPantryItems(updatedList);
    localStorage.setItem('hg_smart_pantry', JSON.stringify(updatedList));
  };

  // Helper calculation for expiration statuses
  const getExpirationParams = (exprDateStr: string) => {
    try {
      const expr = new Date(exprDateStr);
      const today = new Date();
      // Reset hours to compare dates cleanly
      expr.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffMs = expr.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { label: `Expired ${Math.abs(diffDays)}d ago`, classes: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30', level: 'expired' };
      } else if (diffDays === 0) {
        return { label: 'Expires Today (!)', classes: 'text-amber-600 bg-amber-50 dark:bg-amber-955/20 border-amber-200 dark:border-amber-900/30 font-black animate-pulse', level: 'today' };
      } else if (diffDays <= 3) {
        return { label: `Expires in ${diffDays} days`, classes: 'text-amber-505 bg-amber-50/50 dark:bg-amber-950/15 border-amber-150 dark:border-amber-900/20', level: 'soon' };
      } else {
        return { label: `Expires in ${diffDays} days`, classes: 'text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800', level: 'fresh' };
      }
    } catch (e) {
      return { label: 'Expiration: Unvetted', classes: 'text-slate-400 bg-slate-50 border-slate-100', level: 'unknown' };
    }
  };

  // Dynamic user allergy cross matching
  const hasUserAllergyConflict = (itemAllergens: string[]) => {
    if (!user || !user.allergies) return { conflict: false, allergenMatched: '' };
    for (const alg of itemAllergens) {
      const foundMatch = user.allergies.some(userAlg => 
        alg.toLowerCase().includes(userAlg.toLowerCase()) || 
        userAlg.toLowerCase().includes(alg.toLowerCase())
      );
      if (foundMatch) {
        return { conflict: true, allergenMatched: alg };
      }
    }
    return { conflict: false, allergenMatched: '' };
  };

  // Handle Incrementation of values
  const handleQuantityIncrement = (id: string) => {
    const updated = pantryItems.map(item => {
      if (item.id === id) {
        const match = item.quantity.match(/^(\d+)\s*(.*)$/);
        if (match) {
          const num = parseInt(match[1]);
          const unit = match[2] || 'Units';
          return { ...item, quantity: `${num + 1} ${unit}` };
        }
        return { ...item, quantity: '2 Units' };
      }
      return item;
    });
    updatePantryState(updated);
    showToast('Quantity updated successfully.');
  };

  // Handle Decrementation of values
  const handleQuantityDecrement = (id: string) => {
    const target = pantryItems.find(item => item.id === id);
    if (!target) return;

    const match = target.quantity.match(/^(\d+)\s*(.*)$/);
    let num = 0;
    let unit = 'Units';
    if (match) {
      num = parseInt(match[1]);
      unit = match[2] || 'Units';
    }

    if (num <= 1) {
      // Prompt deletion if reaches 0
      if (window.confirm(`Would you like to consume and completely clear ${target.name} from your pantry cabinet?`)) {
        handleDeleteItem(id);
      }
      return;
    }

    const updated = pantryItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: `${num - 1} ${unit}` };
      }
      return item;
    });
    updatePantryState(updated);
    showToast('Quantity updated successfully.');
  };

  // Delete pantry record
  const handleDeleteItem = (id: string) => {
    const updated = pantryItems.filter(item => item.id !== id);
    updatePantryState(updated);
    showToast('Item deleted from cooking inventory.');
  };

  // Handle manual addition submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) {
      showToast('Kindly insert the product name.');
      return;
    }

    // Set score based on Nutri-Grade selection
    const scoreMap = { 'A': 95, 'B': 82, 'C': 65, 'D': 48, 'F': 25 };
    const scoreVal = scoreMap[newItemGrade] || 85;

    // Determine risk level based on allergies
    const allergyTest = hasUserAllergyConflict(newItemAllergensList);
    let autoRiskLevel: 'safe' | 'warning' | 'avoid' = 'safe';
    if (allergyTest.conflict) {
      autoRiskLevel = 'avoid';
    } else if (newItemGrade === 'C' || newItemGrade === 'D') {
      autoRiskLevel = 'warning';
    } else if (newItemGrade === 'F') {
      autoRiskLevel = 'avoid';
    }

    // Capture standard sample image if category matches
    const defaultImage = CATEGORY_IMAGES[newItemCategory] || CATEGORY_IMAGES['Other'];

    const newPantryItem: PantryInventoryItem = {
      id: `pantry_${Date.now()}`,
      name: newItemName,
      brand: newItemBrand || 'Domestic / Store Brand',
      category: newItemCategory,
      addedAt: new Date().toLocaleDateString(),
      expiryDate: newItemExpiry ? new Date(newItemExpiry).toLocaleDateString() : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      allergens: newItemAllergensList,
      riskLevel: autoRiskLevel,
      quantity: `${newItemQtyVal} ${newItemQtyUnit}`,
      score: scoreVal,
      grade: newItemGrade,
      image: defaultImage,
      clinicalBio: allergyTest.conflict 
        ? `ALLERGY WARNING: Contains [${allergyTest.allergenMatched}]. Do not eat.`
        : `Compatible with your allergen profile.`
    };

    updatePantryState([newPantryItem, ...pantryItems]);
    setShowAddModal(false);
    
    // Reset form states
    setNewItemName('');
    setNewItemBrand('');
    setNewItemCategory('Dairy Alternative');
    setNewItemQtyVal(1);
    setNewItemQtyUnit('Units');
    setNewItemExpiry('');
    setNewItemGrade('A');
    setNewItemAllergensList([]);
    setAllergenInput('');

    showToast(`Added ${newItemName} to Smart Pantry!`);
  };

  // Edit item initial loading
  const openEditDialog = (item: PantryInventoryItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // Action submit for edit parameters
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Cross-match allergy triggers
    const allergyTest = hasUserAllergyConflict(editingItem.allergens);
    let autoRiskLevel = editingItem.riskLevel;
    if (allergyTest.conflict) {
      autoRiskLevel = 'avoid';
    }

    const updated = pantryItems.map(item => {
      if (item.id === editingItem.id) {
        return { 
          ...editingItem, 
          riskLevel: autoRiskLevel,
          clinicalBio: allergyTest.conflict 
            ? `ALLERGY WARNING: Matches your profile for ${allergyTest.allergenMatched}!`
            : item.clinicalBio
        };
      }
      return item;
    });

    updatePantryState(updated);
    setShowEditModal(false);
    setEditingItem(null);
    showToast('Pantry item parameters updated successfully.');
  };

  // Add allergen chip to input
  const addAllergenChip = () => {
    if (allergenInput.trim()) {
      if (!newItemAllergensList.includes(allergenInput.trim())) {
        setNewItemAllergensList([...newItemAllergensList, allergenInput.trim()]);
      }
      setAllergenInput('');
    }
  };

  const removeAllergenChip = (index: number) => {
    setNewItemAllergensList(newItemAllergensList.filter((_, i) => i !== index));
  };

  // Filter Categories uniquely derived from active list
  const uniqueCategories = useMemo(() => {
    const list = new Set(pantryItems.map(i => i.category));
    return ['All', ...Array.from(list)];
  }, [pantryItems]);

  // Compute stats modules
  const statsOverview = useMemo(() => {
    let total = pantryItems.length;
    let expiredSoon = 0;
    let allergenConflicts = 0;
    let cleanGrade = 0;

    pantryItems.forEach(item => {
      const exp = getExpirationParams(item.expiryDate);
      if (exp.level === 'soon' || exp.level === 'today' || exp.level === 'expired') {
        expiredSoon++;
      }

      const allergyTest = hasUserAllergyConflict(item.allergens);
      if (allergyTest.conflict || item.riskLevel === 'avoid') {
        allergenConflicts++;
      }

      if (item.grade === 'A' || item.grade === 'B') {
        cleanGrade++;
      }
    });

    return { total, expiredSoon, allergenConflicts, cleanGrade };
  }, [pantryItems, user]);

  // Handle final list filtering based on search text and pills
  const filteredPantry = useMemo(() => {
    return pantryItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;

      const allergyTest = hasUserAllergyConflict(item.allergens);
      const matchRisk = selectedRiskFilter === 'All' || 
                        (selectedRiskFilter === 'safe' && !allergyTest.conflict && item.riskLevel !== 'avoid') ||
                        (selectedRiskFilter === 'conflict' && (allergyTest.conflict || item.riskLevel === 'avoid')) ||
                        (selectedRiskFilter === 'warning' && item.riskLevel === 'warning');

      return matchSearch && matchCategory && matchRisk;
    });
  }, [pantryItems, searchQuery, selectedCategory, selectedRiskFilter, user]);

  // Simple automated menu suggestions recipes matching inventory items
  const pantryRecipes = [
    {
      title: 'Silk Cream Almond Oats Bowl',
      ingredients: 'Almond Milk, oats, blueberries, walnuts',
      needed: 'Almond Milk (In Pantry ✓)',
      prepTime: '5 mins',
      benefit: 'Low sodium, heart-rate stabilizer'
    },
    {
      title: 'Rustic Marina Italian Linguine',
      ingredients: 'Marinara Pasta Sauce, whole wheat spaghetti, garlic cloves',
      needed: 'Marinara Sauce (In Pantry ✓)',
      prepTime: '15 mins',
      benefit: 'Filled with natural lycopenes and raw antioxidants'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-sans animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Toast Alert popups */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-750 text-xs font-bold animate-fade-in max-w-sm w-full">
          <CheckCircle2 size={16} className="text-brand-primary-500 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Header and top banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-3xs font-extrabold tracking-wider uppercase border border-teal-500/20">
              🍳 Smart Food Inventory
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-550 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Kitchen Pantry & Allergen Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Monitor nutritional metrics, log active units, flag allergen collisions organically, and avoid double shopping. Logged food camera scans flow into this cabinet automatically.
          </p>
        </div>

        {/* Create manual add item trigger button */}
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 text-xs font-extrabold py-3 px-5 bg-brand-primary-500 hover:bg-brand-primary-600 text-white shadow-xs self-start sm:self-auto rounded-xl"
        >
          <Plus size={15} />
          <span>Add Food Item Manually</span>
        </Button>
      </div>

      {/* DYNAMIC METRIC OVERVIEWS WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total stats */}
        <Card className="p-4 border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-650 flex items-center justify-center border border-teal-100 dark:border-teal-900/10 shrink-0">
            <Layers size={20} className="text-teal-500" />
          </div>
          <div>
            <span className="text-3xs text-slate-400 font-extrabold uppercase tracking-widest block">Total Products</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5 block">{statsOverview.total} Items</span>
          </div>
        </Card>

        {/* Allergen danger conflicts alerts */}
        <Card className="p-4 border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-955/20 text-rose-600 flex items-center justify-center border border-rose-100 dark:border-rose-900/10 shrink-0">
            <AlertTriangle size={20} className="text-rose-500 shrink-0" />
          </div>
          <div>
            <span className="text-3xs text-slate-400 font-extrabold uppercase tracking-widest block">Allergy Clashes</span>
            <span className={`text-lg font-black mt-0.5 leading-tight block ${statsOverview.allergenConflicts > 0 ? 'text-rose-600 dark:text-rose-450 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
              {statsOverview.allergenConflicts} Hazard{statsOverview.allergenConflicts !== 1 ? 's' : ''}
            </span>
          </div>
        </Card>

        {/* Expiring item flags */}
        <Card className="p-4 border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-955/20 text-amber-600 flex items-center justify-center border border-amber-100 dark:border-amber-900/10 shrink-0">
            <Clock size={20} className="text-amber-500" />
          </div>
          <div>
            <span className="text-3xs text-slate-400 font-extrabold uppercase tracking-widest block">Soon Expiring</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5 block">
              {statsOverview.expiredSoon} Product{statsOverview.expiredSoon !== 1 ? 's' : ''}
            </span>
          </div>
        </Card>

        {/* Healthy grade items count */}
        <Card className="p-4 border border-slate-200/60 dark:border-slate-800/80 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/10 shrink-0">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div>
            <span className="text-3xs text-slate-400 font-extrabold uppercase tracking-widest block font-sans">Premium Grades</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5 block">
              {statsOverview.cleanGrade} Clean Items
            </span>
          </div>
        </Card>

      </div>

      {/* FILTER CONTROLS BAR SECTION */}
      <Card className="p-5 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 space-y-4">
        
        {/* Search Input and Category filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, brand category, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none text-xs font-semibold focus:bg-white focus:border-brand-primary-500 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-450 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 select-none w-full md:w-auto">
            <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider shrink-0 whitespace-nowrap">Allergy Safety Filters:</span>
            <button 
              onClick={() => setSelectedRiskFilter('All')}
              className={`px-3 py-1.5 text-3xs font-extrabold rounded-lg uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                selectedRiskFilter === 'All' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100'
              }`}
            >
              All Items
            </button>
            <button 
              onClick={() => setSelectedRiskFilter('safe')}
              className={`px-3 py-1.5 text-3xs font-extrabold rounded-lg uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                selectedRiskFilter === 'safe' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100'
              }`}
            >
              ✓ Safe / Compatible
            </button>
            <button 
              onClick={() => setSelectedRiskFilter('warning')}
              className={`px-3 py-1.5 text-3xs font-extrabold rounded-lg uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                selectedRiskFilter === 'warning' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100'
              }`}
            >
              ⚠️ Precautions Alert
            </button>
            <button 
              onClick={() => setSelectedRiskFilter('conflict')}
              className={`px-3 py-1.5 text-3xs font-extrabold rounded-lg uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                selectedRiskFilter === 'conflict' 
                  ? 'bg-rose-500 text-white shadow-xs animate-pulse' 
                  : 'bg-slate-50 dark:bg-slate-955 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100'
              }`}
            >
              🔥 Allergen Warnings
            </button>
          </div>
        </div>

        {/* Category Pills Slider Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider shrink-0">Category:</span>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-3xs font-black uppercase tracking-wider rounded-full transition-all shrink-0 border ${
                selectedCategory === cat 
                  ? 'bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 border-brand-primary-500/20' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-200/50 dark:border-slate-850/60 hover:bg-slate-100/50'
              }`}
            >
              {cat === 'All' ? 'All Pantry' : cat}
            </button>
          ))}
        </div>

      </Card>

      {/* CORE INVENTORY DISPLAY ELEMENT */}
      {filteredPantry.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900 flex flex-col justify-center items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <Inbox size={24} className="text-slate-400" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">No Kitchen Supplies Found</h3>
            <p className="text-[11px] text-slate-455 dark:text-slate-400 font-semibold leading-relaxed">
              No pantry records match your dynamic search, category selection, or allergen hazard filter triggers. Adjust the search metrics!
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRiskFilter('All'); }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPantry.map(item => {
            const exp = getExpirationParams(item.expiryDate);
            const userConflict = hasUserAllergyConflict(item.allergens);
            const matchesCriticalRisk = userConflict.conflict || item.riskLevel === 'avoid';

            return (
              <Card 
                key={item.id} 
                id={`pantry-card-${item.id}`}
                className={`flex flex-col border rounded-[2rem] shadow-3xs overflow-hidden bg-white dark:bg-slate-900 transition-all hover:translate-y-[-2px] ${
                  matchesCriticalRisk 
                    ? 'border-rose-300 dark:border-rose-900/40 hover:shadow-xs' 
                    : 'border-slate-200/60 dark:border-slate-800/85'
                }`}
              >
                
                {/* Thumbnail header area */}
                <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={item.image || CATEGORY_IMAGES['Other']} 
                    alt={item.name}
                    className="w-full h-full object-cover opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
                  
                  {/* Category badging */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[9px] font-extrabold text-white uppercase tracking-wider border border-slate-700/50">
                      {item.category}
                    </span>
                  </div>

                  {/* Nutri-Grade Circle label overlay */}
                  <div className="absolute top-3.5 right-3.5 flex items-center bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded-lg border border-slate-700/50 gap-1.5">
                    <span className="text-[8px] font-extrabold text-slate-305 uppercase">Score: {item.score || 85}</span>
                    <span className={`text-[10px] w-5 h-5 rounded-md flex items-center justify-center font-black text-white ${
                      (item.grade === 'A' || item.grade === 'B') 
                        ? 'bg-emerald-500' 
                        : item.grade === 'C' 
                          ? 'bg-amber-500' 
                          : 'bg-rose-500'
                    }`}>
                      {item.grade || 'A'}
                    </span>
                  </div>

                  {/* Subtitled Name on picture overlay bottom */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 min-w-0">
                    <p className="text-[10px] text-teal-400 font-extrabold uppercase tracking-widest">{item.brand}</p>
                    <h3 className="text-2xs font-extrabold text-white truncate mt-0.5 leading-tight">{item.name}</h3>
                  </div>
                </div>

                {/* Card Body details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5 font-sans">
                  
                  {/* 1. Status Rows info (Expiration vs Allergens) */}
                  <div className="space-y-5">
                    
                    {/* Expiration row badge */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400 text-3xs font-extrabold uppercase tracking-widest">Product Expiry:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg border text-3xs font-black uppercase tracking-wider ${exp.classes}`}>
                        {exp.label}
                      </span>
                    </div>

                    {/* Household Allergies conflicts check */}
                    {userConflict.conflict ? (
                      <div className="p-3 bg-rose-50/70 dark:bg-rose-955/25 border border-rose-150 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-400 font-semibold text-3xs leading-relaxed uppercase">
                        <AlertTriangle size={14} className="text-rose-650 shrink-0 mt-0.5" />
                        <span>
                          ALLERGY WARNING: Contains <span className="font-extrabold underline">{userConflict.allergenMatched}</span> matching your allergen triggers!
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50/40 dark:bg-emerald-955/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-center gap-1.5 text-emerald-800 dark:text-emerald-450 font-semibold text-3xs uppercase tracking-wider leading-none">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span>Profile Allergen Compatible</span>
                      </div>
                    )}

                    {/* Simple clinical detail bullet if warning category applies */}
                    {item.clinicalBio && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/50">
                        {item.clinicalBio}
                      </p>
                    )}
                  </div>

                  {/* 2. Interactive Quantity adjust states & Actions */}
                  <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                    
                    {/* Quantity Selector clicker controls */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs shrink-0 font-extrabold gap-3">
                      <button 
                        onClick={() => handleQuantityDecrement(item.id)}
                        className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 active:scale-95 transition-all outline-none"
                      >
                        -
                      </button>
                      <span className="text-slate-800 dark:text-slate-105 min-w-[36px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityIncrement(item.id)}
                        className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 active:scale-95 transition-all outline-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Interactive parameters modifications */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDialog(item)}
                        className="p-2 border border-slate-200/70 dark:border-slate-800 rounded-xl text-slate-450 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                        title="Edit Item Details"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you consumed or want to clear ${item.name}?`)) {
                            handleDeleteItem(item.id);
                          }
                        }}
                        className="p-2 border border-rose-100 dark:border-rose-950 rounded-xl text-rose-550 hover:bg-rose-50 dark:hover:bg-rose-955/20 transition-all"
                        title="Delete from Inventory"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>

                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* AUXILIARY PANEL: AI KITCHEN RECIPES SUGGESTIONS */}
      {pantryItems.length > 0 && (
        <Card className="p-6 border border-brand-primary-100/60 dark:border-slate-800 bg-gradient-to-br from-brand-primary-500/[0.02] to-indigo-500/[0.03] rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-primary-500 animate-pulse" size={18} />
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Inventory-Matched Quick Meal Ideas
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Dynamic recipes you can craft right now with items stocked in your kitchen pantry cabinet.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {pantryRecipes.map(rec => (
              <div 
                key={rec.title} 
                className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between min-h-[290px] shadow-xs"
              >
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base leading-snug">{rec.title}</span>
                    <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-tight whitespace-nowrap self-start sm:self-auto">{rec.prepTime} Preparation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 font-medium leading-relaxed">
                    Ingredients: <span className="italic font-normal text-slate-750 dark:text-slate-400">{rec.ingredients}</span>
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 uppercase flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>In Stock: {rec.needed}</span>
                  </p>
                </div>
                
                <div className="pt-5 border-t border-slate-150 dark:border-slate-800/50 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 flex-wrap">🧬 Alignment: <strong className="text-slate-700 dark:text-slate-300 font-extrabold">{rec.benefit}</strong></span>
                  <span className="text-brand-primary-600 dark:text-brand-primary-400 hover:underline cursor-pointer flex items-center gap-1 font-bold uppercase text-[10px] whitespace-nowrap self-end sm:self-auto">
                    Draft Recipe <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL 1: ADD FOOD DIALOG PANEL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-3xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 rounded-[2rem] shadow-2xl relative animate-scale-up space-y-5">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-md sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Log New Kitchen Stock
              </h2>
              <p className="text-2xs text-slate-455 dark:text-slate-400 font-semibold mt-0.5 leading-relaxed">
                Add food items manually to synchronize shelf quantities with your allergen checks profile.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                    Product / Item Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Organic Strawberries"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                    required
                  />
                </div>

                {/* Brand name */}
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                    Product Brand / Maker
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Driscoll's Berries"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                  />
                </div>

                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                    Food Category Selection
                  </label>
                  <select 
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-brand-primary-500"
                  >
                    <option value="Dairy Alternative">Dairy Alternative</option>
                    <option value="Snacks & Confectionery">Snacks & Confectionery</option>
                    <option value="Condiments & Sauces">Condiments & Sauces</option>
                    <option value="Protein Supplements">Protein Supplements</option>
                    <option value="Fruts & Veggies">Fruts & Veggies</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                {/* Quantity and unit form */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                      Quantity
                    </label>
                    <input 
                      type="number" 
                      min={1}
                      value={newItemQtyVal}
                      onChange={(e) => setNewItemQtyVal(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                      Measurement
                    </label>
                    <input 
                      type="text" 
                      placeholder="Units / Liters / g"
                      value={newItemQtyUnit}
                      onChange={(e) => setNewItemQtyUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Nutri Grade and Expiry date */}
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                    Expiry Date
                  </label>
                  <input 
                    type="date" 
                    value={newItemExpiry}
                    onChange={(e) => setNewItemExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:border-brand-primary-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
                    Product Nutri-Grade
                  </label>
                  <select 
                    value={newItemGrade}
                    onChange={(e) => setNewItemGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-brand-primary-500"
                  >
                    <option value="A">Grade A (Clean, pure)</option>
                    <option value="B">Grade B (Healthy nutrient)</option>
                    <option value="C">Grade C (Slight preservatives / high sodium)</option>
                    <option value="D">Grade D (Processed / warning constraints)</option>
                    <option value="F">Grade F (Heavily toxic / triggers)</option>
                  </select>
                </div>

              </div>

              {/* Allergens triggers builder */}
              <div className="space-y-2">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Ingredients Allergen Flags
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g., Peanuts, Wheat, Dairy (press space or key to add)"
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAllergenChip();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none focus:bg-white"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addAllergenChip}
                  >
                    Add
                  </Button>
                </div>

                {newItemAllergensList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {newItemAllergensList.map((alg, idx) => (
                      <span 
                        key={`${alg}_${idx}`} 
                        className="flex items-center gap-1 text-[9px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-0.5 uppercase tracking-wide"
                      >
                        <span>{alg}</span>
                        <button type="button" onClick={() => removeAllergenChip(idx)} className="text-rose-550 font-black text-2xs">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer action buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3.5">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-extrabold"
                >
                  Confirm Log
                </Button>
              </div>

            </form>

          </Card>
        </div>
      )}

      {/* MODAL 2: EDIT PARAMETERS PANEL */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-3xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 rounded-[2rem] shadow-2xl relative animate-scale-up space-y-4">
            <button 
              onClick={() => { setShowEditModal(false); setEditingItem(null); }}
              className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-slate-650 transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-md font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Modify Pantry Specifications
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Adjust quantity stock and expiry information.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Product / Item Name
                </label>
                <input 
                  type="text" 
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Shelf Inventory Stock (Quantity)
                </label>
                <input 
                  type="text" 
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none"
                  placeholder="e.g. 2 Units / 1 Liter"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Item Expiration Date (Date Picker)
                </label>
                <input 
                  type="text" 
                  value={editingItem.expiryDate}
                  onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                  placeholder="MM/DD/YYYY or YYYY-MM-DD"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                >
                  Discard Changes
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-extrabold"
                >
                  Save Specification
                </Button>
              </div>

            </form>

          </Card>
        </div>
      )}

    </div>
  );
}

export default SmartPantryPage;
