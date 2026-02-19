import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
    const { adminLogin } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isAdminMode, setIsAdminMode] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleEmailAuth = async () => {
        setError('');
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                if (password.length < 6) throw new Error('Password must be at least 6 characters');
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCred.user);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminSubmit = async () => {
        setError('');
        setIsLoading(true);
        const success = await adminLogin(adminName, adminCode);
        if (!success) {
            setError('بيانات المدير غير صحيحة');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-md animate-fade-in relative z-10 my-auto">
                <div className="text-center mb-8">
                    <div className="mb-6 flex justify-center scale-75 md:scale-100">
                        <Logo />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text font-amiri mb-3">متحف الفكر</h1>
                    <p className="text-base font-bold text-yellow-300 mb-1">🎓 جامعة زيان عاشور بالجلفة</p>
                    <p className="text-gray-400 text-sm mb-4">بوابة الإبداع الفكرية الرقمية</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                {!isAdminMode ? (
                    <>
                         <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center">
                            <p className="text-yellow-300 font-bold mb-1 text-sm">⚠️ تنبيه</p>
                            <p className="text-xs text-gray-300">التسجيل إجباري للمشاركة في المنصة</p>
                        </div>

                        <div className="space-y-4">
                            {mode === 'register' && (
                                <>
                                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="اسم المستخدم" className="input-style w-full px-4 py-3 rounded-xl" />
                                    <input value={specialty} onChange={e => setSpecialty(e.target.value)} type="text" placeholder="التخصص (اختياري)" className="input-style w-full px-4 py-3 rounded-xl" />
                                </>
                            )}
                            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="البريد الإلكتروني" className="input-style w-full px-4 py-3 rounded-xl" />
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="كلمة المرور" className="input-style w-full px-4 py-3 rounded-xl" />
                            
                            <div className="text-right">
                                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-pink-400 hover:text-pink-300 text-sm font-medium p-2">
                                    {mode === 'login' ? 'إنشاء حساب جديد' : 'لديك حساب بالفعل؟'}
                                </button>
                            </div>

                            <button onClick={handleEmailAuth} disabled={isLoading} className="btn-primary w-full py-3.5 rounded-xl text-lg">
                                {isLoading ? 'جاري التحميل...' : (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب')}
                            </button>
                        </div>

                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="px-3 text-sm text-gray-500">أو</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        <button onClick={handleGoogleLogin} className="w-full bg-white text-gray-800 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                            دخول بحساب جوجل
                        </button>
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center mb-2"><p className="text-sm text-gray-400">🔐 الدخول كمدير</p></div>
                        <input value={adminName} onChange={e => setAdminName(e.target.value)} type="text" placeholder="اسم المدير" className="input-style w-full px-4 py-3 rounded-xl" />
                        <input value={adminCode} onChange={e => setAdminCode(e.target.value)} type="password" placeholder="كود المدير" className="input-style w-full px-4 py-3 rounded-xl" />
                        <button onClick={handleAdminSubmit} disabled={isLoading} className="btn-primary w-full py-3 rounded-xl">
                            {isLoading ? 'جاري التحقق...' : '👑 دخول كمدير'}
                        </button>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button onClick={() => setIsAdminMode(!isAdminMode)} className="text-gray-500 hover:text-gray-300 text-sm p-2">
                        {isAdminMode ? '← العودة للمستخدمين' : '👑 أنا مدير'}
                    </button>
                </div>
            </div>
        </div>
    );
};