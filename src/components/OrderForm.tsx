import React from 'react';
import { PackagingType, OrderItem } from '../types';
import { PACKAGING_CONFIGS } from '../utils/calculator';
import { Package, Layers, Scale, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface OrderFormProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ items, onChange }) => {
  const handleAddItem = (type: PackagingType = 'G1') => {
    const newItem: OrderItem = {
      id: Math.random().toString(36).substring(2, 9),
      packagingType: type,
      orderWeightKg: 1000,
      hasPallet: true,
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      // Keep at least one item
      return;
    }
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<OrderItem>) => {
    onChange(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" />
            <span>오더 정보 입력 (혼합 적재 지원)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">여러 포장단위(G1, F1 등)를 혼합하여 오더를 구성할 수 있습니다.</p>
        </div>
        <button
          type="button"
          onClick={() => handleAddItem('G1')}
          className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>품목 추가</span>
        </button>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => {
          const config = PACKAGING_CONFIGS[item.packagingType];
          return (
            <div
              key={item.id}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 relative transition-all hover:border-indigo-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">품목 #{index + 1}</span>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    title="품목 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Packaging Type Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">포장단위 종류</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(PACKAGING_CONFIGS) as PackagingType[]).map((type) => {
                    const cfg = PACKAGING_CONFIGS[type];
                    const isSelected = item.packagingType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleUpdateItem(item.id, { packagingType: type })}
                        className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-100/70 border-indigo-300 ring-1 ring-indigo-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {cfg.code}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5">{cfg.unitWeightKg}KG / 단위</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Input and Pallet Toggle row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                    <span>오더 중량 (KG)</span>
                    <span className="text-[11px] text-slate-400">
                      환산: 약 {Math.round(item.orderWeightKg / config.unitWeightKg).toLocaleString()}개
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.orderWeightKg}
                      onChange={(e) =>
                        handleUpdateItem(item.id, { orderWeightKg: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="중량(KG) 입력"
                    />
                    <span className="absolute right-3.5 text-xs text-slate-400 font-medium">KG</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">팔레트 적재 여부 (개당 10kg)</label>
                  <div className="grid grid-cols-2 gap-2 h-[42px]">
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { hasPallet: true })}
                      className={`rounded-xl border font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        item.hasPallet
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>팔레트 사용</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { hasPallet: false })}
                      className={`rounded-xl border font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        !item.hasPallet
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>벌크 (미사용)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick weight buttons for this item */}
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[11px] text-slate-400 mr-1">빠른 입력:</span>
                {[500, 1000, 3000, 5000, 10000].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleUpdateItem(item.id, { orderWeightKg: w })}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      item.orderWeightKg === w
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {w >= 10000 ? `${w / 10000}만 KG` : `${w.toLocaleString()} KG`}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item bottom button */}
      <button
        type="button"
        onClick={() => handleAddItem('G1')}
        className="w-full py-3.5 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 hover:bg-indigo-50/50 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>다른 포장단위 품목 추가하기 (혼합 적재)</span>
      </button>
    </div>
  );
};
