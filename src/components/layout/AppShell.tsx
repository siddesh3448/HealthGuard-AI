import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Activity, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  ChevronRight, 
  User, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  Inbox,
  UserCheck,
  ChevronDown,
  Mic
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface SidebarItem {
  nameKey: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function AppShell() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Standalone simulated Voice Assistant states
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<{
    show: boolean;
    command: string;
    response: string;
  } | null>(null);

  // Pool of context-aware voice commands & replies
  const getSimulatedVoiceResponse = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      return {
        command: "Show my overall metabolic safety score",
        response: "Synthesizing bio-sync vitals... Your health safety index is currently 96% stable with zero active warnings."
      };
    } else if (path.includes('/food-scanner')) {
      return {
        command: "Scan this ingredients label for peanuts",
        response: "Initializing barcode parser... Quick inspection finished: No tree nuts or allergen traces identified."
      };
    } else if (path.includes('/medicine-scanner')) {
      return {
        command: "Is Acetaminophen safe with high blood pressure?",
        response: "Accessing clinical interaction logs... Mild Hypertension profile loaded: Acetaminophen is safe under 1,500mg daily."
      };
    } else if (path.includes('/smart-pantry')) {
      return {
        command: "Any high-sodium food items in my cabinet?",
        response: "Auditing smart kitchen pantry... Standard Greek Yogurt is safe, but canned tomato soup exceeds 800mg sodium limit."
      };
    } else if (path.includes('/ai-insights')) {
      return {
        command: "Summarize today's health highlights",
        response: "Your sodium intake is well within safe thresholds, and all active allergy flags have been resolved."
      };
    } else if (path.includes('/ai-assistant')) {
      return {
        command: "Draft a low-sodium breakfast menu for tomorrow",
        response: "Drafted! Suggested: Oatmeal with fresh berries and chia seeds, paired with unsalted poached eggs. (Menu prepped in chat)"
      };
    } else {
      return {
        command: "Check for pending clinical warnings",
        response: "System audit complete. No emergency flags found in your current prescription list."
      };
    }
  };

  const handleVoiceButtonClick = () => {
    if (isListening) return;
    setIsListening(true);
    setVoiceToast(null);

    // Simulate listening duration (2.4 seconds)
    setTimeout(() => {
      setIsListening(false);
      const { command, response } = getSimulatedVoiceResponse();
      setVoiceToast({
        show: true,
        command,
        response
      });

      // Automatically speak the response if speaker volume is on or via built-in speechSynthesis
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        }
      } catch (_) {}

      // NOTE: Removed the 7-second auto-hide timeout to keep the actual text string on screen 
      // until manually dismissed by the Close (X) button or until the next voice input is triggered.

    }, 2400);
  };
  
  // Real Notification State for interactive usage
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Active Allergen Flag',
      message: 'Peanut protein trace detected in your logged peanut oil scanning.',
      timestamp: '5 mins ago',
      read: false,
      type: 'warning'
    },
    {
      id: 'n2',
      title: 'Pantry Expiry Match',
      message: 'Unsalted Butter expiring tomorrow. Plan low-sodium substitution.',
      timestamp: '2 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Medication Adherence Rate',
      message: 'Excellent job! Weekly drug intake consistency reached 94%.',
      timestamp: '1 day ago',
      read: true,
      type: 'success'
    }
  ]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close overlays on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const menuItems: SidebarItem[] = [
    { nameKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { nameKey: 'nav.foodScanner', path: '/food-scanner', icon: Camera },
    { nameKey: 'nav.medicineScanner', path: '/medicine-scanner', icon: Activity },
    { nameKey: 'nav.smartPantry', path: '/smart-pantry', icon: Sparkles }, // Wait: we can customize or use standard Sparkles or Pantry-aligned icons
    { nameKey: 'nav.aiInsights', path: '/ai-insights', icon: Activity }, // Will replace manually with a clean list below
  ];

  // Map path to precise icons and matching descriptions
  const items: SidebarItem[] = [
    { nameKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
    { nameKey: 'nav.foodScanner', path: '/food-scanner', icon: Camera },
    { nameKey: 'nav.medicineScanner', path: '/medicine-scanner', icon: Activity },
    { nameKey: 'nav.smartPantry', path: '/smart-pantry', icon: Sparkles },
    { nameKey: 'nav.aiInsights', path: '/ai-insights', icon: Bell }, // Or another appropriate icon
    { nameKey: 'nav.aiAssistant', path: '/ai-assistant', icon: MessageSquare },
    { nameKey: 'nav.settings', path: '/settings', icon: Settings }
  ];

  const getPageTitle = () => {
    if (location.pathname === '/settings') {
      return '';
    }
    const activeItem = items.find(item => item.path === location.pathname);
    if (activeItem) {
      // Return beautiful header title matching translations
      const headerKey = activeItem.nameKey.replace('nav.', 'header.');
      return t(headerKey) || t(activeItem.nameKey);
    }
    return 'HealthGuard Premium';
  };

  const activePath = location.pathname;

  return (
    <div id="app-shell-container" className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        id="desktop-sidebar"
        className={`hidden lg:flex flex-col shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out relative z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header Container */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-slate-800 shrink-0 justify-between">
          <div className="flex items-center overflow-hidden transition-all duration-300">
            {sidebarCollapsed ? (
              <div className="mx-auto">
                <Logo size="sm" showText={false} />
              </div>
            ) : (
              <Logo size="sm" />
            )}
          </div>
          
          {/* Collapse/Expand Toggle arrow */}
          <button 
            id="sidebar-collapse-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden xl:flex items-center justify-center p-1.5 rounded-lg border border-slate-250/45 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-150 transition-all shadow-2xs"
          >
            <ChevronRight size={14} className={`transform transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Sidebar Nav Links list */}
        <nav className="flex-1 overflow-y-auto py-6 px-3.5 space-y-1.5">
          {items.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                id={`nav-link-${item.path.slice(1)}`}
                to={item.path}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-600 dark:text-brand-primary-400 font-extrabold shadow-3xs' 
                    : 'text-slate-550 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-xs sm:text-sm'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r bg-brand-primary-500" />
                )}

                <div className={`transition-colors shrink-0 ${
                  isActive 
                    ? 'text-brand-primary-500 dark:text-brand-primary-400' 
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-350'
                }`}>
                  <Icon size={18} />
                </div>
                
                {!sidebarCollapsed && (
                  <span className="truncate tracking-tight transition-opacity duration-300">
                    {t(item.nameKey)}
                  </span>
                )}

                {/* Collapsed Sidebar Tooltip */}
                {sidebarCollapsed && (
                  <div className="absolute left-16 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
                    {t(item.nameKey)}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Workspace details and Logout bottom container */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0">
          {!sidebarCollapsed && (
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-850 bg-brand-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-2xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'John Doe'}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{user?.email || 'demo@healthguard.ai'}</p>
              </div>
            </div>
          )}

          <button
            id="sidebar-logout-btn"
            onClick={handleLogoutClick}
            className={`w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-all font-bold text-xs sm:text-sm group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            {!sidebarCollapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER DRAWER SIDEBAR */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop glass overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="relative flex flex-col w-full max-w-xs bg-white dark:bg-slate-900 shadow-xl transition-all h-full z-10 p-5">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0">
              <Logo size="sm" />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-555"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-1 space-y-1.5">
              {items.map((item) => {
                const isActive = activePath === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-600 dark:text-brand-primary-400 font-extrabold shadow-3xs' 
                        : 'text-slate-550 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm'
                    }`}
                  >
                    <Icon size={18} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    <span>{t(item.nameKey)}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                <img 
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{user?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 p-3 font-bold rounded-xl text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/60"
              >
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        
        {/* TOP GLOSSY STICKY HEADER */}
        <header 
          id="app-shell-header"
          className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 sticky top-0 z-30 shrink-0"
        >
          {/* Header left: Mobile menu toggler and Page description */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-655 transition-colors shrink-0"
            >
              <Menu size={18} />
            </button>
            
            <div className="hidden sm:block min-w-0">
              <h1 id="header-page-title" className="text-md sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Header right: Language Toggle, Theme Mode, Notifications list panel and Profile Dropdown */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            
            {/* Quick Language switch select option wrapper */}
            <div className="relative group flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-855 rounded-xl px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold cursor-pointer transition-colors select-none">
              <Globe size={14} className="text-slate-400" />
              <select
                id="header-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none outline-none appearance-none pr-3 cursor-pointer text-2xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-350 focus:ring-0 min-w-[70px]"
              >
                <option value="en" className="text-slate-800 bg-white">EN - English</option>
                <option value="es" className="text-slate-800 bg-white">ES - Español</option>
                <option value="fr" className="text-slate-800 bg-white">FR - Français</option>
                <option value="hi" className="text-slate-800 bg-white">HI - हिन्दी (Hindi)</option>
                <option value="bn" className="text-slate-800 bg-white">BN - বাংলা (Bengali)</option>
                <option value="ta" className="text-slate-800 bg-white">TA - தமிழ் (Tamil)</option>
                <option value="te" className="text-slate-800 bg-white">TE - తెలుగు (Telugu)</option>
                <option value="mr" className="text-slate-800 bg-white">MR - मराठी (Marathi)</option>
                <option value="gu" className="text-slate-800 bg-white">GU - ગુજરાતી (Gujarati)</option>
                <option value="kn" className="text-slate-800 bg-white">KN - ಕನ್ನಡ (Kannada)</option>
                <option value="ml" className="text-slate-800 bg-white">ML - മലയാളം (Malayalam)</option>
                <option value="pa" className="text-slate-800 bg-white">PA - ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ur" className="text-slate-800 bg-white">UR - اردو (Urdu)</option>
              </select>
              <ChevronDown size={11} className="absolute right-1.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Notifications container with interactive Popover Card */}
            <div className="relative" ref={notificationsRef}>
              <button
                id="notification-bell-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-slate-200/65 dark:border-slate-700/65 bg-white dark:bg-slate-855 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-555 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-150 transition-all shadow-3xs"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Popover pane */}
              {notificationsOpen && (
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-2.5 w-80 sm:w-85 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden font-sans"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/40 dark:bg-slate-950/10">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Real-Time Screen Alerts
                    </h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-extrabold text-brand-primary-600 dark:text-brand-primary-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 space-y-2">
                        <Inbox size={28} className="mx-auto strength-100 text-slate-300 dark:text-slate-750" />
                        <p className="text-2xs font-semibold">No notifications ready.</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          className={`p-3.5 flex items-start gap-3 transition-colors ${
                            n.read ? 'bg-white dark:bg-slate-900' : 'bg-brand-primary-50/20 dark:bg-brand-primary-950/5'
                          }`}
                        >
                          <div className={`mt-0.5 w-2 h-2 shrink-0 rounded-full ${
                            n.type === 'warning' ? 'bg-rose-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`} />
                          
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                                {n.title}
                              </h4>
                              <span className="text-[9px] text-slate-400 whitespace-nowrap shrink-0">{n.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                              {n.message}
                            </p>
                          </div>

                          <button 
                            onClick={(e) => handleDismissNotification(n.id, e)}
                            className="text-slate-350 hover:text-slate-555 p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/10 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      SYSTEM MONITOR ACTIVE
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Profile button with quick status indicators */}
            <div className="relative" ref={profileRef}>
              <button
                id="header-profile-dropdown-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              >
                <div className="w-8 h-8 rounded-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden shrink-0 bg-slate-100 shadow-3xs">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
              </button>

              {/* Profile dropdown content menu */}
              {profileDropdownOpen && (
                <div 
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-850">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                      {user?.name || 'John Doe'}
                    </h4>
                    <p className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest truncate mt-0.5">
                      {user?.email || 'demo@healthguard.ai'}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={14} className="text-slate-400" />
                      <span>{t('settings.profile')}</span>
                    </Link>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-805 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {theme === 'dark' ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-500" />}
                        <span>Toggle Light / Dark</span>
                      </div>
                      <span className="text-4xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-black">
                        Theme
                      </span>
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/10">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* MAIN BODY: Dynamic content view with clean scrolling container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>

        {/* STANDALONE FLOATING VOICE ASSISTANT (BOTTOM-LEFT) */}
        <div className={`fixed bottom-6 z-50 flex items-end gap-3.5 pointer-events-none font-sans transition-all duration-300 ${sidebarCollapsed ? 'left-6 lg:left-24' : 'left-6 lg:left-[280px]'}`}>
          
          {/* Floating Action Microphone Circle Button */}
          <div className="relative pointer-events-auto shrink-0">
            {/* Ambient pulsing ring background when active */}
            {isListening && (
              <span className="absolute -inset-1.5 rounded-full bg-brand-primary-500/30 dark:bg-brand-primary-500/40 animate-ping z-0" />
            )}
            
            <button
              onClick={handleVoiceButtonClick}
              disabled={isListening}
              className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                  : 'bg-brand-primary-500 hover:bg-brand-primary-600 text-white dark:bg-brand-primary-500 dark:hover:bg-brand-primary-600 shadow-brand-primary-500/10'
              }`}
              title="Speak with HealthGuard Voice Assistant"
            >
              {isListening ? (
                <div className="flex items-center justify-center gap-0.5">
                  <span className="h-4 w-1 rounded-full bg-white animate-bounce [animation-duration:0.6s]"></span>
                  <span className="h-6 w-1 rounded-full bg-white animate-bounce [animation-duration:0.6s] [animation-delay:0.15s]"></span>
                  <span className="h-4 w-1 rounded-full bg-white animate-bounce [animation-duration:0.6s] [animation-delay:0.3s]"></span>
                </div>
              ) : (
                <Mic size={22} className="stroke-[2.5px]" />
              )}
            </button>
            
            {/* Compact sliding indicator banner */}
            {isListening && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-rose-500 text-white font-black uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap animate-pulse">
                <span>Listening...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
              </div>
            )}
          </div>

          {/* Voice Input Text Output Area (Docked directly next to the button) */}
          {voiceToast && voiceToast.show && (
            <div className="pointer-events-auto flex flex-col w-[260px] sm:w-[320px] bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-950 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-700/50 dark:border-slate-205/60 transform origin-bottom-left transition-all duration-300 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 dark:border-slate-200/20 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] uppercase font-black tracking-widest text-brand-primary-400 dark:text-brand-primary-600">
                    🎙️ Captured Voice input
                  </span>
                </div>
                <button 
                  onClick={() => setVoiceToast(null)}
                  className="text-white/40 dark:text-slate-400 hover:text-white dark:hover:text-slate-950 p-1 rounded-lg transition-colors cursor-pointer animate-fade-in"
                  title="Dismiss Output Panel"
                >
                  <X size={12} />
                </button>
              </div>
              
              <p className="text-xs font-bold leading-relaxed italic text-white/90 dark:text-slate-900 mb-2">
                "{voiceToast.command}"
              </p>
              
              <div className="bg-white/5 dark:bg-slate-50 p-2.5 rounded-xl border border-white/5 dark:border-slate-200/60">
                <div className="flex items-center gap-1 text-[8px] uppercase font-black text-brand-primary-400 dark:text-brand-primary-600 tracking-wider mb-1">
                  <ShieldCheck size={10} />
                  <span>Interactive System Response</span>
                </div>
                <p className="text-[10px] leading-relaxed text-slate-300 dark:text-slate-755 font-bold">
                  {voiceToast.response}
                </p>
              </div>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}

export default AppShell;
