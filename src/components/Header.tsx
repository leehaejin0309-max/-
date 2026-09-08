import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Ship, LogIn, LogOut, User, Database } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { SupabaseSetupModal } from './SupabaseSetupModal';

interface HeaderProps {
  user: any;
  onUserChange: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onUserChange }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      onUserChange(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      onUserChange(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [onUserChange]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onUserChange(null);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-200 to-sky-200 flex items-center justify-center text-indigo-700 shadow-xs">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              컨테이너 적재 계산기
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              20ft / 40ft 컨테이너 오더 수량, 중량, CBM 및 팔레트 적재 시뮬레이터
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Supabase Setup Guide button */}
          <button
            type="button"
            onClick={() => setIsSetupOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            title="Supabase 설정 및 SQL 가이드"
          >
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">DB 설정 가이드</span>
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-indigo-200 text-indigo-800 flex items-center justify-center text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 max-w-[120px] sm:max-w-[180px] truncate">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white transition-all cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인 / 회원가입</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => {}} />
      <SupabaseSetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
    </header>
  );
};
