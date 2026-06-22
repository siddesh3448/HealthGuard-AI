<<<<<<< HEAD
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import { LanguageProvider } from './context/LanguageContext';
// import { useAuth } from './hooks/useAuth';

// // Import skeleton pages
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import DashboardPage from './pages/DashboardPage';
// import FoodScannerPage from './pages/FoodScannerPage';
// import MedicineScannerPage from './pages/MedicineScannerPage';
// import SmartPantryPage from './pages/SmartPantryPage';
// import AIInsightsPage from './pages/AIInsightsPage';
// import AIAssistantPage from './pages/AIAssistantPage';
// import SettingsPage from './pages/SettingsPage';
// import NotFoundPage from './pages/NotFoundPage';
// import AppShell from './components/layout/AppShell';

// // Simple Auth Guards
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated } = useAuth();
//   return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//       <LanguageProvider>
//         <AuthProvider>
//           <Router>
//             <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200">
//               <Routes>
//                 {/* Public General Routes */}
//                 <Route path="/" element={<Navigate to="/login" replace />} />
//                 <Route path="/landing" element={<LandingPage />} />
                
//                 {/* Auth Guest-Only Routes */}
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/signup" element={<SignupPage />} />

//                 {/* Authenticated Application Routes (loaded with App Shell) */}
//                 <Route 
//                   element={
//                     <ProtectedRoute>
//                       <AppShell />
//                     </ProtectedRoute>
//                   }
//                 >
//                   <Route path="/dashboard" element={<DashboardPage />} />
//                   <Route path="/food-scanner" element={<FoodScannerPage />} />
//                   <Route path="/medicine-scanner" element={<MedicineScannerPage />} />
//                   <Route path="/smart-pantry" element={<SmartPantryPage />} />
//                   <Route path="/ai-insights" element={<AIInsightsPage />} />
//                   <Route path="/ai-assistant" element={<AIAssistantPage />} />
//                   <Route path="/settings" element={<SettingsPage />} />
//                 </Route>

//                 {/* Catch All 404 */}
//                 <Route path="*" element={<NotFoundPage />} />
//               </Routes>
//             </div>
//           </Router>
//         </AuthProvider>
//       </LanguageProvider>
//     </ThemeProvider>
//   );
// }


=======
>>>>>>> 8617e76f91ec74e34cb3cf321e7df64f20e36e9a
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './hooks/useAuth';

// Import skeleton pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FoodScannerPage from './pages/FoodScannerPage';
import MedicineScannerPage from './pages/MedicineScannerPage';
import SmartPantryPage from './pages/SmartPantryPage';
import AIInsightsPage from './pages/AIInsightsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AppShell from './components/layout/AppShell';

// Simple Auth Guards
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200">
              <Routes>
<<<<<<< HEAD

                {/* Public General Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />

=======
                {/* Public General Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/landing" element={<LandingPage />} />
                
>>>>>>> 8617e76f91ec74e34cb3cf321e7df64f20e36e9a
                {/* Auth Guest-Only Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Authenticated Application Routes (loaded with App Shell) */}
<<<<<<< HEAD
                <Route
=======
                <Route 
>>>>>>> 8617e76f91ec74e34cb3cf321e7df64f20e36e9a
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/food-scanner" element={<FoodScannerPage />} />
                  <Route path="/medicine-scanner" element={<MedicineScannerPage />} />
                  <Route path="/smart-pantry" element={<SmartPantryPage />} />
                  <Route path="/ai-insights" element={<AIInsightsPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch All 404 */}
                <Route path="*" element={<NotFoundPage />} />
<<<<<<< HEAD

=======
>>>>>>> 8617e76f91ec74e34cb3cf321e7df64f20e36e9a
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8617e76f91ec74e34cb3cf321e7df64f20e36e9a
