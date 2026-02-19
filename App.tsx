import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Ideas } from './pages/Ideas';
import { Feed } from './pages/Feed';
import { Skills } from './pages/Skills';
import { Quotes } from './pages/Quotes';
import { Suggestions } from './pages/Suggestions';
import { Content } from './pages/Content';
import { Philosophy } from './pages/Philosophy';
import { About } from './pages/About';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Members } from './pages/admin/Members';
import { AdminComments } from './pages/admin/AdminComments';
import { Messages } from './pages/admin/Messages';
import { AdminSettings } from './pages/admin/Settings';
import { Icons } from './components/Icons';

const AppLayout: React.FC = () => {
    const { currentUser, loading } = useAuth();
    const { loadingData } = useData();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Pages that need full width/height without standard padding
    const isFeedPage = location.pathname === '/feed';

    if (loading) return <div className="h-full flex items-center justify-center bg-[#0a0f1f]"><div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>;

    if (!currentUser) return <Login />;

    return (
        <div className={`h-full flex ${isFeedPage ? 'bg-[#0a0f1f]' : ''}`}>
            {/* Mobile Header / Menu Button */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-end">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all pointer-events-auto hover:bg-white/10"
                >
                    <Icons.Menu className="w-6 h-6 text-white" />
                </button>
            </div>

            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <main className={`flex-1 overflow-auto bg-[#0a0f1f] relative ${isFeedPage ? 'p-0 overflow-hidden' : 'p-3 md:p-8'} pt-16 md:pt-8`}>
                {loadingData ? (
                    <div className="flex items-center justify-center h-full">
                         <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto w-full">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/ideas" element={<Ideas />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/skills" element={<Skills />} />
                            <Route path="/quotes" element={<Quotes />} />
                            <Route path="/suggestions" element={<Suggestions />} />
                            <Route path="/content" element={<Content />} />
                            <Route path="/philosophy" element={<Philosophy />} />
                            <Route path="/about" element={<About />} />
                            
                            {/* Admin Routes */}
                            <Route path="/comments" element={currentUser.role === 'admin' ? <AdminComments /> : <Navigate to="/" />} />
                            <Route path="/admin" element={currentUser.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                            <Route path="/admin/members" element={currentUser.role === 'admin' ? <Members /> : <Navigate to="/" />} />
                            <Route path="/admin/messages" element={currentUser.role === 'admin' ? <Messages /> : <Navigate to="/" />} />
                            <Route path="/admin/settings" element={currentUser.role === 'admin' ? <AdminSettings /> : <Navigate to="/" />} />
                            
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                )}
            </main>
        </div>
    );
};

export default function App() {
    return (
        <HashRouter>
            <ToastProvider>
                <AuthProvider>
                    <DataProvider>
                        <AppLayout />
                    </DataProvider>
                </AuthProvider>
            </ToastProvider>
        </HashRouter>
    );
}