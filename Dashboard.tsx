import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    const { users, ideas, comments, suggestions } = useData();
    const navigate = useNavigate();

    const stats = [
        { title: 'المستخدمين', value: users.length, color: 'from-blue-500 to-cyan-400', link: '/admin/members' },
        { title: 'الأفكار المنشورة', value: ideas.length, color: 'from-pink-500 to-rose-400', link: '/feed' },
        { title: 'التعليقات', value: comments.length, color: 'from-purple-500 to-violet-400', link: '/comments' },
        { title: 'الرسائل والمقترحات', value: suggestions.length, color: 'from-orange-500 to-yellow-400', link: '/admin/messages' },
    ];

    return (
        <div className="animate-fade-in pb-20">
            <h1 className="text-3xl font-bold font-amiri mb-6 gradient-text">لوحة التحكم</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => navigate(stat.link)}
                        className="glass-card p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                    >
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                        <h3 className="text-gray-400 text-sm font-bold mb-2">{stat.title}</h3>
                        <p className="text-4xl font-bold text-white font-amiri">{stat.value}</p>
                        <div className={`h-1 w-full bg-gradient-to-r ${stat.color} mt-4 rounded-full opacity-50`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">👥</span> أحدث الأعضاء
                    </h3>
                    <div className="space-y-4">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/admin/members')} className="w-full mt-4 py-2 text-sm text-center text-pink-400 hover:text-pink-300 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                        عرض جميع الأعضاء
                    </button>
                </div>

                {/* Recent Suggestions */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">📩</span> أحدث الرسائل
                    </h3>
                    <div className="space-y-4">
                        {suggestions.slice(0, 5).map(msg => (
                            <div key={msg.id} className="p-3 bg-white/5 rounded-xl border-r-4 border-yellow-500">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm">{msg.title}</h4>
                                    <span className={`text-[10px] px-2 rounded-full ${msg.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {msg.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 truncate mt-1">{msg.content}</p>
                            </div>
                        ))}
                        {suggestions.length === 0 && <p className="text-gray-500 text-center py-4">لا توجد رسائل جديدة</p>}
                    </div>
                    <button onClick={() => navigate('/admin/messages')} className="w-full mt-4 py-2 text-sm text-center text-pink-400 hover:text-pink-300 border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                        إدارة الرسائل
                    </button>
                </div>
            </div>
        </div>
    );
};