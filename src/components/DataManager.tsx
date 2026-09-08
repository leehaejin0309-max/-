import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CalculationResult, OrderItem, PackagingType } from '../types';
import { Download, Upload, Database, History, Trash2, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface DataManagerProps {
  user: any;
  result: CalculationResult;
  items: OrderItem[];
  onLoadItems: (items: OrderItem[]) => void;
  onOpenSetup: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({
  user,
  result,
  items,
  onLoadItems,
  onOpenSetup,
}) => {
  const [savedOrders, setSavedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const fetchSavedOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('container_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedOrders();
    }
  }, [user]);

  // Save current order to Supabase (Cumulative storage)
  const handleSaveToSupabase = async () => {
    if (!user) {
      setMessage({ type: 'error', text: '로그인 후 Supabase에 저장할 수 있습니다.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const orderTitle = `오더 (${new Date().toLocaleDateString()} - 총 ${result.totalOrderWeightKg.toLocaleString()}kg)`;
      const { error } = await supabase.from('container_orders').insert({
        user_id: user.id,
        title: orderTitle,
        items: items,
        total_weight_kg: result.totalWeightKg,
        total_cbm: result.totalCbm,
        total_pallets: result.totalPallets,
        status_20ft: result.container20ft.canFit ? 'OK' : 'EXCEEDED',
        status_40ft: result.container40ft.canFit ? 'OK' : 'EXCEEDED',
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Supabase에 오더 및 CSV 데이터가 누적 저장되었습니다!' });
      fetchSavedOrders();
    } catch (err: any) {
      setMessage({ type: 'error', text: `저장 실패: ${err.message}. SQL 테이블이 생성되어 있는지 확인하세요.` });
    } finally {
      setLoading(false);
    }
  };

  // Delete saved order
  const handleDeleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('container_orders').delete().eq('id', id);
      if (error) throw error;
      setSavedOrders(savedOrders.filter((o) => o.id !== id));
      setMessage({ type: 'success', text: '저장된 오더가 삭제되었습니다.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: `삭제 실패: ${err.message}` });
    }
  };

  // Export as CSV
  const handleExportCsv = () => {
    const headers = ['No', 'PackagingType', 'OrderWeightKg', 'UnitCount', 'GrossWeightKg', 'Pallets', 'CBM'];
    const rows = result.items.map((it, idx) => [
      idx + 1,
      it.packagingType,
      it.orderWeightKg,
      it.unitCount,
      it.grossWeightKg,
      it.requiredPallets,
      it.cbm.toFixed(2),
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `container_order_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessage({ type: 'success', text: 'CSV 파일이 성공적으로 다운로드되었습니다.' });
  };

  // Import CSV
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const newItems: OrderItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 3) {
            const pType = (cols[1] as PackagingType) || 'G1';
            const weight = parseFloat(cols[2]) || 1000;
            if (['G1', 'F1', 'F4', 'F5'].includes(pType)) {
              newItems.push({
                id: Math.random().toString(36).substring(2, 9),
                packagingType: pType,
                orderWeightKg: weight,
                hasPallet: true,
              });
            }
          }
        }

        if (newItems.length > 0) {
          onLoadItems(newItems);
          setMessage({ type: 'success', text: `CSV 파일로부터 ${newItems.length}개 품목을 성공적으로 불러왔습니다!` });
        } else {
          setMessage({ type: 'error', text: 'CSV 형식에서 올바른 품목 데이터를 찾지 못했습니다.' });
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: `CSV 파싱 오류: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <span>Supabase 누적 저장 및 CSV 관리</span>
          </h2>
          <p className="text-xs text-slate-500">계산 결과를 Supabase DB에 누적 저장하고 CSV 파일을 가져오거나 내보내세요.</p>
        </div>
        <button
          type="button"
          onClick={onOpenSetup}
          className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
        >
          Supabase SQL 설정 가이드
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Save to Supabase */}
        <button
          type="button"
          onClick={handleSaveToSupabase}
          disabled={loading || !user}
          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Database className="w-4 h-4" />
          <span>{user ? '현재 오더 Supabase 누적 저장' : '로그인 후 저장 가능'}</span>
        </button>

        {/* Export CSV */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="py-3 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>결과 CSV 내보내기</span>
        </button>

        {/* Import CSV */}
        <label className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>CSV 오더 불러오기</span>
          <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
        </label>
      </div>

      {/* Saved Orders History Accordion */}
      {user && (
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-500" />
              <span>Supabase 누적 저장 내역 보기 ({savedOrders.length}건)</span>
            </button>
          </div>

          {showHistory && (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {savedOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">저장된 오더 내역이 없습니다.</p>
              ) : (
                savedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800">{ord.title}</span>
                      <span className="text-slate-500">
                        총중량: {ord.total_weight_kg?.toLocaleString()}kg | CBM: {ord.total_cbm?.toFixed(2)} | 20ft: {ord.status_20ft} / 40ft: {ord.status_40ft}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (ord.items && Array.isArray(ord.items)) {
                            onLoadItems(ord.items);
                            setMessage({ type: 'success', text: '저장된 오더 데이터를 불러왔습니다.' });
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-xl font-semibold transition-all cursor-pointer"
                      >
                        불러오기
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
