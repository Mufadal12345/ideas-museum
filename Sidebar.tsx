import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'الرئيسية', icon: '🏠' },
        { path: '/ideas', label: 'الأفكار', icon: '💡' },
        { path: '/feed', label: 'تصفح الأفكار', icon: '📱' },
        { path: '/comments', label: 'التعليقات', icon: '💬', adminOnly: true },
        { path: '/content', label: 'المحتوى', icon: '📚' },
        { path: '/philosophy', label: 'الفلسفة', icon: '🧠' },
        { path: '/quotes', label: 'العبارات الملهمة', icon: '✨' },
        { path: '/skills', label: 'تطوير المهارات', icon: '🚀' },
        { path: '/suggestions', label: 'الاقتراحات', icon: '📝' },
        { path: '/about', label: 'عن المشروع', icon: 'ℹ️' },
    ];

    const adminItems = [
        { path: '/admin/members', label: 'الأعضاء', icon: '👥' },
        { path: '/admin/messages', label: 'الرسائل', icon: '📨' },
        { path: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
    ];

    const handleNav = (path: string) => {
        navigate(path);
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    if (!currentUser) return null;

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <aside className={`fixed md:relative top-0 right-0 h-full w-64 glass-sidebar z-50 transition-transform duration-300 transform 
                ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} flex flex-col`}>
                
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏛️</span>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">متحف الفكر</h1>
                            <p className="text-xs text-gray-400">{currentUser.role === 'admin' ? '👑 مدير' : '👤 زائر'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        if (item.adminOnly && currentUser.role !== 'admin') return null;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all
                                    ${isActive 
                                        ? 'bg-red-500/25 border-r-4 border-[#e94560]' 
                                        : 'hover:bg-[#e94560]/15 hover:-translate-x-1'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}

                    {currentUser.role === 'admin' && (
                        <>
                            <div className="border-t border-white/10 my-4 pt-4">
                                <p className="text-xs text-gray-500 px-4 mb-2">إدارة النظام</p>
                            </div>
                            {adminItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNav(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all
                                        ${location.pathname === item.path 
                                            ? 'bg-red-500/25 border-r-4 border-[#e94560]' 
                                            : 'hover:bg-[#e94560]/15 hover:-translate-x-1'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="glass-card rounded-xl p-3 mb-3">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-xl shadow-lg avatar-pulse">
                                {currentUser.role === 'admin' ? '👑' : '👤'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser.specialty}</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="btn-secondary w-full py-2 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white/20"
                    >
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
};