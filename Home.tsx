import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { CATEGORY_ICONS } from '../types';
import { useNavigate } from 'react-router-dom';
import { STATIC_CONTENT } from '../data/staticData';

export const Home: React.FC = () => {
    const { currentUser } = useAuth();
    const { ideas, users, comments } = useData();
    const navigate = useNavigate();

    const activeIdeas = ideas.filter(i => !i.deleted);
    const totalViews = activeIdeas.reduce((acc, curr) => acc + (curr.views || 0), 0);
    // Use .getTime() to ensure correct arithmetic
    const latest = useMemo(() => [...ideas, ...STATIC_CONTENT].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4), [ideas]);

    return (
        <div className="animate-fade-in p-2 md:p-8">
            <div className="glass rounded-3xl p-8 md:p-12 mb-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/10 to-transparent"></div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-amiri gradient-text">مرحباً، {currentUser?.name}</h2>
                <p className="text-gray-400 font-tajawal max-w-2xl mx-auto">أهلاً بك في فضاء جامعة زيان عاشور بالجلفة الفكري. هنا تُحفظ الأفكار وتُبنى العقول.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[{l:'الأفكار',v:STATIC_CONTENT.length + ideas.length,i:'💡'},{l:'المشاهدات',v:'125K',i:'👁️'},{l:'المشاركين',v:450,i:'👥'},{l:'تفاعل',v:'2.4K',i:'💬'}].map(s=>(
                    <div key={s.l} className="glass p-6 rounded-2xl border border-white/5 text-center card-hover">
                        <span className="text-3xl block mb-2">{s.i}</span>
                        <p className="text-gray-400 text-xs mb-1 font-tajawal">{s.l}</p>
                        <p className="text-2xl font-bold text-white">{s.v}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-amiri">أحدث المقالات</h3>
                <button onClick={()=>navigate('/ideas')} className="text-accent font-bold hover:underline">عرض الكل ←</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latest.map(l => (
                    <div key={l.id} onClick={()=>navigate('/feed')} className="glass rounded-2xl p-6 card-hover cursor-pointer border border-white/5 group h-full flex flex-col">
                        <div className="flex justify-between mb-3">
                            <span className="bg-white/10 text-accent text-[10px] font-bold px-2 py-1 rounded">{l.category}</span>
                            <span className="text-[10px] text-gray-500">{new Date(l.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <h4 className="font-bold font-amiri text-xl mb-3 group-hover:text-accent transition-colors line-clamp-2">{l.title}</h4>
                        <p className="text-gray-400 text-sm font-tajawal leading-relaxed line-clamp-3 mb-4 flex-grow">{l.content}</p>
                        <div className="flex items-center gap-2 border-t border-white/5 pt-4 mt-auto">
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[8px]">👤</div>
                            <span className="text-[10px] font-bold text-gray-400">{l.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};