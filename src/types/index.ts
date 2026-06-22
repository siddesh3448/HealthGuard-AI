export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  healthConditions?: string[];
  allergies?: string[];
  dietaryPreferences?: string[];
}

export type RiskLevel = 'safe' | 'low' | 'moderate' | 'high' | 'avoid';

export interface IngredientAnalysis {
  name: string;
  status: 'safe' | 'moderate' | 'avoid';
  reason: string;
}

export interface FoodScan {
  id: string;
  name: string;
  timestamp: string;
  calories: number;
  protein: number;
  sugar: number;
  sodium: number;
  score: number;
  ingredients: IngredientAnalysis[];
  recommendation: string;
}

export interface MedicineInteraction {
  medicineName: string;
  severity: 'low' | 'moderate' | 'high';
  effect: string;
}

export interface DoseReminder {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string;
  taken: boolean;
  dosage: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  instructions?: string;
  category: string;
  timestamp: string;
  score: number;
  riskLevel: 'safe' | 'warning' | 'danger';
  interactions: MedicineInteraction[];
  foodInteractions: string[];
  adherenceRate: number; // percentage
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiryDate: string;
  status: 'fresh' | 'expiring' | 'expired' | 'low-stock';
  isLowStock: boolean;
  stockLevel: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: 'image' | 'document';
    url: string;
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'warning' | 'info' | 'success';
}

export interface HealthInsight {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'medication' | 'lifestyle';
  severity: 'info' | 'warning' | 'success';
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
