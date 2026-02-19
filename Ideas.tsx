import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { CATEGORY_ICONS } from '../types';
import { Modal } from '../components/Modal';
import { addDoc, collection, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { STATIC_CONTENT } from '../data/staticData';
import { Icons } from '../components/Icons';

export const Ideas: React.FC = () => {
    const { currentUser } = useAuth();
    const { ideas, comments } = useData();
    const { showToast } = useToast();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('فلسفة');
    const [content, setContent] = useState('');
    
    // Pagination State
    const [displayCount, setDisplayCount] = useState(20);
    const navigate = useNavigate();

    // Reset pagination when filter or search changes
    useEffect(() => {
        setDisplayCount(20);
    }, [filter, searchTerm]);

    // Merge Static Content with DB Ideas & Apply Filters
    const filteredIdeas = useMemo(() => {
        // Create a Set of IDs existing in DB to filter them out from Static Content
        // This prevents duplication when a static idea is promoted to DB
        const dbIdeaIds = new Set(ideas.map(i => i.id));
        
        const activeStatic = STATIC_CONTENT.filter(staticIdea => !dbIdeaIds.has(staticIdea.id));
        
        let all = [...ideas, ...activeStatic];
        
        // 1. Remove deleted
        all = all.filter(i => !i.deleted);
        
        // 2. Sort by Date
        all.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 3. Apply Category Filter
        if (filter !== 'all') {
            all = all.filter(i => i.category === filter);
        }

        // 4. Apply Search Filter
        if (searchTerm.trim()) {
            const lowerTerm = searchTerm.toLowerCase();
            all = all.filter(i => 
                i.title.toLowerCase().includes(lowerTerm) || 
                i.content.toLowerCase().includes(lowerTerm) ||
                i.author.toLowerCase().includes(lowerTerm)
            );
        }

        return all;
    }, [ideas, filter, searchTerm]);

    // Slice for performance (Pagination)
    const visibleIdeas = filteredIdeas.slice(0, displayCount);

    const handleSubmit = async () => {
        if (!title || !content || !currentUser) return;
        try {
            await addDoc(collection(db, 'ideas'), {
                title, category, content,
                author: currentUser.name,
                authorId: currentUser.id,
                authorRole: currentUser.role,
                views: 0, likes: 0, likedBy: '',
                featured: false, deleted: false,
                createdAt: new Date().toISOString()
            });
            setIsModalOpen(false);
            setTitle(''); setContent('');
            showToast('تم إضافة الفكرة بنجاح', 'success');
        } catch (e) {
            console.error(e);
            showToast('حدث خطأ أثناء النشر', 'error');
        }
    };

    const handleLike = async (e: React.MouseEvent, idea: any) => {
        e.stopPropagation();
        if (!currentUser) {
            showToast('يجب تسجيل الدخول للإعجاب', 'info');
            return;
        }

        const currentLikes = idea.likes || 0;
        const likedByString = idea.likedBy || '';
        const likedArray = likedByString ? likedByString.split(',') : [];
        const isLiked = likedArray.includes(currentUser.id);

        try {
            // Check if it's a static idea that hasn't been saved to DB yet
            if (idea.id.startsWith('static')) {
                // Promote to DB
                const newLikedBy = [currentUser.id].join(',');
                const newLikes = 1;

                // Create document in Firestore with specific ID
                await setDoc(doc(db, 'ideas', idea.id), {
                    ...idea,
                    likes: newLikes,
                    likedBy: newLikedBy,
                    views: (idea.views || 0) + 1, // Increment view too
                    promotedFromStatic: true
                });
                showToast('تم حفظ تفاعلك', 'success');
            } else {
                // Regular DB update
                let newLikedArray;
                let newLikes;

                if (isLiked) {
                    newLikedArray = likedArray.filter((id: string) => id !== currentUser.id);
                    newLikes = Math.max(0, currentLikes - 1);
                } else {
                    newLikedArray = [...likedArray, currentUser.id];
                    newLikes = currentLikes + 1;
                }

                await updateDoc(doc(db, 'ideas', idea.id), { 
                    likes: newLikes, 
                    likedBy: newLikedArray.join(',') 
                });
            }
        } catch (error) {
            console.error("Error liking:", error);
            showToast('حدث خطأ', 'error');
        }
    };

    return (
        <div className="h-full flex flex-col relative animate-fade-in">
            <header className="p-2 md:p-6 pb-2">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-2 md:px-0 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white neon-text font-tajawal">معرض الأفكار</h1>
                        <p className="text-gray-400 text-sm mt-1">اكتشف وشارك أفكاراً تغير العالم</p>
                    </div>
                    
                    <div className="flex w-full md:w-auto gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:w-64">
                            <input 
                                type="text" 
                                placeholder="بحث عن فكرة..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-style w-full pl-10 pr-4 py-2 rounded-full border border-white/10 focus:border-accent"
                            />
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-accent hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-pink-500/30 transition transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Icons.Plus className="w-4 h-4" /> <span className="hidden md:inline">إضافة فكرة</span>
                        </button>
                    </div>
                </div>
                
                <nav className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2 md:px-0">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full transition flex items-center gap-2 whitespace-nowrap ${filter === 'all' ? 'active-tab font-bold' : 'glass hover:bg-white/10'}`}
                    >
                        <i className="fas fa-layer-group"></i> الكل
                    </button>
                    {Object.keys(CATEGORY_ICONS).map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full transition flex items-center gap-2 whitespace-nowrap ${filter === cat ? 'active-tab font-bold' : 'glass hover:bg-white/10'}`}
                        >
                            <span>{CATEGORY_ICONS[cat]}</span> {cat}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="flex-1 overflow-y-auto p-2 md:p-6 pt-0 custom-scrollbar">
                {/* Standard Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                    {visibleIdeas.map(idea => {
                        const isLiked = currentUser && idea.likedBy && idea.likedBy.includes(currentUser.id);
                        const commentsCount = comments.filter(c => c.ideaId === idea.id && !c.deleted).length;

                        return (
                            <div 
                                key={idea.id} 
                                onClick={() => navigate('/feed')} 
                                className="glass rounded-2xl p-5 card-hover group relative cursor-pointer flex flex-col border border-white/5 bg-white/5 hover:bg-white/10 transition-all h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                            {idea.authorRole === 'admin' ? <Icons.Crown className="w-3 h-3 text-yellow-300" /> : <Icons.User className="w-3 h-3" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-200">{idea.author}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(idea.createdAt).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-accent border border-white/5 font-tajawal">
                                        {idea.category}
                                    </span>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg font-amiri leading-tight mb-3 group-hover:text-accent transition-colors">
                                        {idea.title}
                                    </h3>
                                    <p className="text-sm text-gray-300 mb-4 font-tajawal leading-relaxed line-clamp-4">
                                        {idea.content}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={(e) => handleLike(e, idea)}
                                            className={`flex items-center gap-1.5 transition text-xs ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                        >
                                            <Icons.Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} fill={isLiked} />
                                            <span className="font-bold">{idea.likes}</span>
                                        </button>
                                        
                                        <div className="text-gray-400 text-xs flex items-center gap-1.5">
                                            <Icons.Message className="w-3.5 h-3.5 rotate-90" />
                                            <span className="font-bold">{commentsCount}</span>
                                        </div>
                                    </div>

                                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <Icons.Eye className="w-3 h-3" />
                                        <span>{idea.views}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Pagination Button */}
                {displayCount < filteredIdeas.length && (
                    <div className="text-center pb-24">
                        <button 
                            onClick={() => setDisplayCount(prev => prev + 20)}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all text-white"
                        >
                            عرض المزيد ({filteredIdeas.length - displayCount} متبقي)
                        </button>
                    </div>
                )}
                
                {filteredIdeas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Icons.Search className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-xl font-tajawal">لا توجد نتائج تطابق بحثك</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة فكرة جديدة">
                <div className="space-y-4 font-tajawal">
                    <div>
                         <label className="block text-gray-400 text-xs font-bold mb-2">العنوان</label>
                         <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="اكتب عنواناً جذاباً..." className="input-style w-full px-4 py-3 rounded-xl font-bold" />
                    </div>
                   <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">التصنيف</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="input-style w-full px-4 py-3 rounded-xl appearance-none bg-[#0f172a]">
                            {Object.keys(CATEGORY_ICONS).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                   </div>
                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-2">المحتوى</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="أطلق العنان لأفكارك..." className="input-style w-full px-4 py-3 rounded-xl h-48 resize-none leading-relaxed"></textarea>
                    </div>
                    <button onClick={handleSubmit} className="btn-primary w-full py-3 rounded-xl font-bold text-lg shadow-lg mt-2 transition-all active:scale-95">
                        نشر الفكرة ✨
                    </button>
                </div>
            </Modal>
        </div>
    );
};