import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { STATIC_CONTENT } from '../data/staticData';

export const Philosophy: React.FC = () => {
    const { ideas } = useData();
    const navigate = useNavigate();
    
    const philosophyIdeas = useMemo(() => {
        const allContent = [...ideas, ...STATIC_CONTENT];
        return allContent.filter(i => !i.deleted && i.category === 'فلسفة');
    }, [ideas]);

    return (
        <div className="h-full flex flex-col relative animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                 <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
            </div>

            <div className="relative rounded-2xl overflow-hidden mb-8 mx-2 md:mx-6 mt-2 h-64 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-indigo-950"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center z-10">
                        <i className="fas fa-brain text-5xl text-yellow-400 mb-4 animate-pulse"></i>
                        <h1 className="text-4xl md:text-5xl font-bold font-amiri mb-2 text-white neon-text">رواق الفلسفة</h1>
                        <p className="text-gray-300 font-amiri text-lg opacity-80">"الحكمة هي ضالة المؤمن، أنى وجدها فهو أحق بها"</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 md:p-6 pt-0 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto pb-20">
                    {philosophyIdeas.map(item => (
                        <div key={item.id} onClick={() => navigate('/feed')} className="glass p-6 rounded-2xl cursor-pointer card-hover border-r-4 border-l-0 border-yellow-500 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 text-9xl text-white/5 group-hover:text-white/10 transition-colors rotate-12">
                                <i className="fas fa-quote-right"></i>
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{item.author}</h3>
                                    <p className="text-xs text-gray-400">فيلسوف / مفكر</p>
                                </div>
                            </div>
                            
                            <h2 className="text-xl md:text-2xl font-bold font-amiri mb-3 text-white group-hover:text-yellow-400 transition-colors relative z-10">
                                {item.title}
                            </h2>
                            <p className="text-gray-300 leading-loose text-base md:text-lg font-amiri pl-4 border-l border-white/10 relative z-10 line-clamp-4">
                                {item.content}
                            </p>
                            
                            <div className="mt-4 flex justify-end gap-4 text-sm text-gray-500 relative z-10">
                                 <span className="flex items-center gap-2 hover:text-red-400 transition">
                                    <i className="far fa-heart"></i> {item.likes}
                                </span>
                                 <span className="flex items-center gap-2 hover:text-blue-400 transition">
                                    <i className="far fa-share-square"></i> مشاركة
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};