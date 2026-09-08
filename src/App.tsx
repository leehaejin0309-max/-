import React, { useState, useMemo } from 'react';
import { OrderItem } from './types';
import { calculateMixedOrder } from './utils/calculator';
import { Header } from './components/Header';
import { OrderForm } from './components/OrderForm';
import { ResultSummary } from './components/ResultSummary';
import { ContainerComparison } from './components/ContainerComparison';
import { ReferenceGuide } from './components/ReferenceGuide';
import { DataManager } from './components/DataManager';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 'item-1',
      packagingType: 'G1',
      orderWeightKg: 5000,
      hasPallet: true,
    },
  ]);

  const calculationResult = useMemo(() => {
    return calculateMixedOrder(orderItems);
  }, [orderItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-sky-50/40 to-emerald-50/30 text-slate-800 flex flex-col font-sans">
      <Header user={user} onUserChange={setUser} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 flex flex-col gap-8">
        {/* Supabase Not Configured Notice */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Supabase 연결이 설정되지 않았습니다</h3>
                <p className="text-xs text-amber-700">
                  로그인 및 CSV 누적 저장 기능을 사용하려면 Supabase URL과 Anon Key를 설정해주세요.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSetupModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              Supabase 설정하기
            </button>
          </div>
        )}

        {/* Welcome banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/75 backdrop-blur-sm border border-indigo-100 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">수출입 혼합 컨테이너 적재 시뮬레이터 & Supabase 누적 저장</h2>
              <p className="text-xs text-slate-500">
                여러 포장단위(G1, F1, F4, F5) 혼합 적재, CBM(1,000kg당 1.6), 20ft/40ft 컨테이너 검증 및 CSV 누적 저장.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              {user ? `로그인됨 (${user.email})` : '로그인 필요 (비회원은 계산만 가능)'}
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Guide */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <OrderForm items={orderItems} onChange={setOrderItems} />
            <ReferenceGuide />
          </div>

          {/* Right Column: Results, Container Comparison & Data Manager */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <ResultSummary result={calculationResult} />
            <ContainerComparison result={calculationResult} />
            <DataManager
              user={user}
              result={calculationResult}
              items={orderItems}
              onLoadItems={setOrderItems}
              onOpenSetup={() => setIsSetupModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white/60 border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 컨테이너 적재 계산기 & Supabase 연동. All rights reserved.</p>
          <p className="text-slate-400">Supabase Auth & Database Cumulative CSV Storage</p>
        </div>
      </footer>

      <SupabaseSetupModal isOpen={isSetupModalOpen} onClose={() => setIsSetupModalOpen(false)} />
    </div>
  );
}
