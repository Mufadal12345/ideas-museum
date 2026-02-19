import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Icons } from '../../components/Icons';
import { useToast } from '../../contexts/ToastContext';
import { User } from '../../types';

export const Members: React.FC = () => {
    const { users } = useData();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleBan = async (user: User) => {
        if(user.role === 'admin') {
            showToast('لا يمكن حظر المشرفين', 'error');
            return;
        }
        if(window.confirm(`هل أنت متأكد من ${user.isBanned ? 'فك حظر' : 'حظر'} المستخدم ${user.name}؟`)) {
            try {
                await updateDoc(doc(db, 'users', user.id), { isBanned: !user.isBanned });
                showToast(`تم ${user.isBanned ? 'فك حظر' : 'حظر'} المستخدم بنجاح`, 'success');
            } catch (error) {
                showToast('حدث خطأ أثناء تحديث حالة المستخدم', 'error');
            }
        }
    };

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-amiri gradient-text">إدارة الأعضاء</h1>
                    <p className="text-gray-400">قائمة المستخدمين والتحكم في صلاحياتهم</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="بحث عن عضو..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-style pl-10 pr-4 py-2 rounded-xl w-full md:w-64"
                    />
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-white/5 text-gray-400 text-sm">
                            <tr>
                                <th className="p-4">العضو</th>
                                <th className="p-4">الدور</th>
                                <th className="p-4">تاريخ الانضمام</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {user.role === 'admin' ? 'مشرف' : 'عضو'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 text-xs ${user.isBanned ? 'text-red-400' : 'text-green-400'}`}>
                                            <span className={`w-2 h-2 rounded-full ${user.isBanned ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                            {user.isBanned ? 'محظور' : 'نشط'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleBan(user)}
                                            className={`p-2 rounded-lg transition-colors ${user.isBanned ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                            title={user.isBanned ? 'فك الحظر' : 'حظر المستخدم'}
                                        >
                                            {user.isBanned ? <Icons.Check className="w-4 h-4" /> : <Icons.Ban className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        لا توجد نتائج مطابقة
                    </div>
                )}
            </div>
        </div>
    );
};