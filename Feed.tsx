import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CATEGORY_ICONS, Idea } from '../types';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { STATIC_CONTENT } from '../data/staticData';

export const Feed: React.FC = () => {
    const { ideas, comments } = useData();
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    // State
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    
    // Refs
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Merge & Sort
    const feedIdeas = useMemo(() => {
        return [...ideas, ...STATIC_CONTENT]
            .filter(i => !i.deleted)
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [ideas]);

    useEffect(() => {
        if (selectedIdeaId && commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [comments, selectedIdeaId]);

    const handleSelectIdea = (id: string) => {
        setSelectedIdeaId(id);
        if (currentUser && !id.startsWith('static')) {
            const idea = ideas.find(i => i.id === id);
            if (idea) {
                const ref = doc(db, 'ideas', id);
                updateDoc(ref, { views: (idea.views || 0) + 1 }).catch(console.error);
            }
        }
    };

    const handleLike = async (e: React.MouseEvent, idea: Idea) => {
        e.stopPropagation();
        if(idea.id.startsWith('static')) {
             showToast('لا يمكن الإعجاب بالمحتوى الثابت حالياً', 'info');
             return;
        }
        if (!currentUser) return showToast('يجب تسجيل الدخول', 'info');
        
        const likedArray = idea.likedBy ? idea.likedBy.split(',') : [];
        const isLiked = likedArray.includes(currentUser.id);

        await updateDoc(doc(db, 'ideas', idea.id), { 
            likes: Math.max(0, idea.likes + (isLiked ? -1 : 1)), 
            likedBy: isLiked ? likedArray.filter(id => id !== currentUser.id).join(',') : [...likedArray, currentUser.id].join(',')
        });
    };

    const handleSendComment = async () => {
        if (!commentText.trim() || !selectedIdeaId || !currentUser) return;
        try {
            await addDoc(collection(db, 'comments'), {
                ideaId: selectedIdeaId,
                text: commentText,
                userId: currentUser.id,
                authorName: currentUser.name,
                authorRole: currentUser.role,
                likes: 0, likedBy: [], parentCommentId: null, replies: 0, deleted: false,
                createdAt: new Date().toISOString()
            });
            setCommentText('');
        } catch (e) {
            showToast('فشل إرسال التعليق', 'error');
        }
    };

    // Detail Modal Component
    const DetailView = () => {
        const idea = feedIdeas.find(i => i.id === selectedIdeaId);
        if (!idea) return null;
        const currentComments = comments.filter(c => c.ideaId === selectedIdeaId && !c.deleted);

        return (
            <div className="fixed inset-0 z-50 bg-[#0f1020] flex animate-fade-in font-tajawal">
                {/* Close Btn */}
                <button onClick={() => setSelectedIdeaId(null)} className="absolute top-4 left-4 z-50 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
                    <i className="fas fa-times"></i>
                </button>

                {/* Left: Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 relative">
                    <div className="max-w-3xl mx-auto pt-10">
                         <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold mb-4 border border-accent/20">
                            {CATEGORY_ICONS[idea.category]} {idea.category}
                        </span>
                        
                        <h1 className="text-3xl md:text-5xl font-bold font-amiri text-white mb-6 leading-tight neon-text">
                            {idea.title}
                        </h1>
                        
                        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                    {idea.authorRole === 'admin' ? <i className="fas fa-crown text-yellow-400"></i> : <i className="fas fa-user text-white"></i>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{idea.author}</h4>
                                <p className="text-sm text-gray-400">{new Date(idea.createdAt).toLocaleDateString('ar-EG', { dateStyle: 'long' })}</p>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none font-amiri leading-loose text-gray-200">
                             {idea.content.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
                        </div>

                        {/* Interaction Bar */}
                        <div className="mt-12 flex items-center gap-6 py-6 border-t border-b border-white/10">
                             <button onClick={(e) => handleLike(e, idea)} className={`flex items-center gap-2 text-lg font-bold ${currentUser && idea.likedBy?.includes(currentUser.id) ? 'text-red-500' : 'text-white hover:text-red-500'} transition`}>
                                <i className={`${currentUser && idea.likedBy?.includes(currentUser.id) ? 'fas' : 'far'} fa-heart`}></i>
                                <span>{idea.likes}</span>
                            </button>
                            <div className="flex items-center gap-2 text-lg text-white">
                                <i className="far fa-comment"></i>
                                <span>{currentComments.length}</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg text-white">
                                <i className="far fa-eye"></i>
                                <span>{idea.views}</span>
                            </div>
                        </div>
                        
                        {/* Mobile Comments (if needed) */}
                         <div className="md:hidden mt-8">
                            <h3 className="font-bold text-xl text-white mb-4">التعليقات</h3>
                            {/* Simple list for mobile */}
                            <div className="space-y-4">
                                {currentComments.map(c => (
                                    <div key={c.id} className="bg-white/5 p-3 rounded-xl">
                                        <div className="font-bold text-accent text-sm mb-1">{c.authorName}</div>
                                        <p className="text-sm text-gray-300">{c.text}</p>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-4 flex gap-2">
                                <input value={commentText} onChange={e => setCommentText(e.target.value)} className="input-style flex-1 rounded-full px-4 py-2" placeholder="اكتب تعليقاً..." />
                                <button onClick={handleSendComment} className="w-10 h-10 bg-accent rounded-full text-white flex items-center justify-center"><i className="fas fa-paper-plane"></i></button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right: Comments (Desktop) */}
                <div className="hidden md:flex w-[400px] border-r border-white/10 flex-col bg-black/20 backdrop-blur-xl">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="font-bold text-xl text-white">التعليقات ({currentComments.length})</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                         {currentComments.map(comment => (
                            <div key={comment.id} className="flex gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs">
                                    {comment.authorName[0]}
                                </div>
                                <div>
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tr-none">
                                        <span className="font-bold text-xs text-accent block mb-1">{comment.authorName}</span>
                                        <p className="text-sm text-gray-200">{comment.text}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-500 mr-2 mt-1 block">
                                        {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={commentsEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10 bg-[#0f1020]">
                        <div className="relative">
                            <input 
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                                placeholder="شارك برأيك..."
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent transition"
                            />
                            <button 
                                onClick={handleSendComment}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-full text-white flex items-center justify-center hover:scale-105 transition"
                            >
                                <i className="fas fa-paper-plane text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col relative animate-fade-in">
            <header className="p-2 md:p-6 pb-2 md:hidden">
                <h1 className="text-2xl font-bold text-white neon-text font-tajawal">آخر المنشورات</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-2 md:p-6 pt-0 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-2">
                    {feedIdeas.map((idea) => (
                        <div 
                            key={idea.id}
                            onClick={() => handleSelectIdea(idea.id)}
                            className="glass rounded-3xl overflow-hidden cursor-pointer card-hover group"
                        >
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                            {idea.authorRole === 'admin' ? <i className="fas fa-crown text-yellow-400"></i> : <i className="fas fa-user text-white"></i>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{idea.author}</h4>
                                        <p className="text-[10px] text-gray-400">منذ {Math.floor((new Date().getTime() - new Date(idea.createdAt).getTime()) / 3600000)} ساعة</p>
                                    </div>
                                </div>
                                <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-300 border border-white/10">
                                    {idea.category}
                                </span>
                            </div>

                            <div className="px-5 pb-4">
                                <h3 className="text-xl font-bold font-amiri text-white mb-2 leading-snug group-hover:text-accent transition-colors">{idea.title}</h3>
                                <p className="text-gray-300 font-amiri text-base leading-loose line-clamp-3">
                                    {idea.content}
                                </p>
                            </div>

                            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-6">
                                <button className={`flex items-center gap-2 ${currentUser && idea.likedBy?.includes(currentUser.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition`}>
                                    <i className={`${currentUser && idea.likedBy?.includes(currentUser.id) ? 'fas' : 'far'} fa-heart`}></i>
                                    <span className="text-sm font-bold">{idea.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition">
                                    <i className="far fa-comment"></i>
                                </button>
                                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition ml-auto">
                                    <i className="fas fa-share"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedIdeaId && <DetailView />}
        </div>
    );
};