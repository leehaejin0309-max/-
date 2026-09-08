import React, { useState } from 'react';
import { Database, Key, Check, Copy, AlertCircle, ExternalLink, X } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [urlInput, setUrlInput] = useState(localStorage.getItem('CUSTOM_SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL || '');
  const [keyInput, setKeyInput] = useState(localStorage.getItem('CUSTOM_SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- 1. 컨테이너 오더 및 CSV 데이터 누적 저장 테이블
create table if not exists public.container_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null default '컨테이너 오더',
  items jsonb not null,
  total_weight_kg numeric not null,
  total_cbm numeric not null,
  total_pallets integer not null,
  status_20ft text not null,
  status_40ft text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Row Level Security (RLS) 활성화
alter table public.container_orders enable row level security;

-- 3. 정책 생성 (로그인한 본인의 오더만 조회/저장/삭제 가능)
create policy "Users can view their own orders"
  on public.container_orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.container_orders for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own orders"
  on public.container_orders for delete
  using (auth.uid() = user_id);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('CUSTOM_SUPABASE_URL', urlInput.trim());
    localStorage.setItem('CUSTOM_SUPABASE_ANON_KEY', keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Supabase 설정 및 SQL 가이드</h3>
              <p className="text-xs text-slate-500">로그인 및 CSV 데이터 누적 저장을 위한 데이터베이스 설정</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-500" />
              <span>Supabase 프로젝트 연결 설정</span>
            </h4>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isSupabaseConfigured ? '연결됨' : '설정 필요'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Supabase Project URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Supabase Anon / Public Key</label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">설정 후 페이지가 새로고침됩니다.</p>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {saved ? '저장 완료!' : '설정 저장하기'}
            </button>
          </div>
        </form>

        {/* SQL Script Section */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700">Supabase SQL Editor 실행 스크립트</h4>
            <button
              type="button"
              onClick={handleCopySql}
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : 'SQL 복사'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Supabase 대시보드 ➔ <strong>SQL Editor</strong> ➔ <strong>New query</strong>에 아래 코드를 붙여넣고 Run을 실행해주세요.
          </p>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48">
            {sqlCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
