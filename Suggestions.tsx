
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Icons } from '../components/Icons';

export const Suggestions: React.FC = () => {
    const { currentUser } = useAuth();
    const { suggestions } = useData();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('اقتراح');

    // Only show user's own suggestions unless admin
    const mySuggestions = currentUser?.role === 'admin' 
        ? suggestions 
        : suggestions.filter(s => s.authorId === currentUser?.id || s.author === currentUser?.name);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !currentUser) return;
        
        await addDoc(collection(db, 'suggestions'), {
            title, content, type,
            suggestionType: type,
            author: currentUser.name,
            authorId: currentUser.id,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        setTitle(''); setContent('');
        alert("تم إرسال مقترحك بنجاح");
    };

    return (
        <div className="animate-fade-in pb-20 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold gradient-text mb-2">شاركنا رأيك</h2>
                <p className="text-gray-400">نحن نبني هذا المجتمع معاً. اقتراحاتكم تهمنا.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="glass-card p-6 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-2xl">📝</span> نموذج المقترحات
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">نوع الرسالة</label>
                            <div className="flex gap-2">
                                {['اقتراح', 'شكوى', 'فكرة تطوير'].map(t => (
                                    <button 
                                        type="button" 
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${type === t ? 'bg-pink-500 border-pink-500 text-white' : 'border-white/10 hover:bg-white/5'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            type="text" 
                            placeholder="الموضوع" 
                            className="input-style w-full px-4 py-3 rounded-xl" 
                        />
                        <textarea 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            placeholder="التفاصيل..." 
                            className="input-style w-full px-4 py-3 rounded-xl h-40 resize-none" 
                        ></textarea>
                        <button type="submit" className="btn-primary w-full py-3 rounded-xl font-bold shadow-lg">
                            إرسال
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">🗂️</span> مقترحاتي السابقة
                    </h3>
                    {mySuggestions.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 glass-card rounded-2xl border-dashed border-2 border-white/10">
                            <Icons.Message className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p>لم ترسل أي مقترحات بعد</p>
                        </div>
                    ) : (
                        mySuggestions.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(s => (
                            <div key={s.id} className="glass-card p-4 rounded-xl border-r-4 border-l-0 border-pink-500">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{s.suggestionType}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                        s.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                                        s.status === 'replied' ? 'bg-green-500/20 text-green-300' : 
                                        s.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20'
                                    }`}>
                                        {s.status === 'pending' ? 'قيد المراجعة' : s.status === 'replied' ? 'تم الرد' : s.status === 'rejected' ? 'مرفوض' : s.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-white mb-1">{s.title}</h4>
                                <p className="text-sm text-gray-400 line-clamp-2">{s.content}</p>
                                <div className="mt-2 text-[10px] text-gray-600">
                                    {new Date(s.createdAt).toLocaleDateString('ar-EG')}
                                </div>

                                {s.replyContent && (
                                    <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 animate-fade-in">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icons.User className="w-3 h-3 text-green-400" />
                                            <span className="text-xs font-bold text-green-400">رد الإدارة ({s.repliedBy || 'مشرف'})</span>
                                        </div>
                                        <p className="text-sm text-gray-200">{s.replyContent}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
