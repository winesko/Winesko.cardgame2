import React, { useState } from 'react';
import { MASTER_CARDS } from '../cardsData';

interface HomeTabProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  rolls: number;
  setRolls: React.Dispatch<React.SetStateAction<number>>;
  dust: number;
  setDust: React.Dispatch<React.SetStateAction<number>>;
  collection: any[];
  setCollection: React.Dispatch<React.SetStateAction<any[]>>;
  onOpenUpgrade: () => void; // Прокидываем открытие модернизации
}

export const HomeTab: React.FC<HomeTabProps> = ({ coins, setCoins, rolls, setRolls, dust, setDust, collection, setCollection, onOpenUpgrade }) => {
  const [view, setView] = useState<'main' | 'contracts'>('main');
  const [pulledCards, setPulledCards] = useState<any[] | null>(null);

  // Проверка контракта (1 раз в день)
  const today = new Date().toDateString();
  const lastClaimed = localStorage.getItem('last_contract');
  const canClaim = lastClaimed !== today;

  const handleRoll = (count: number) => {
    if (rolls < count) return alert("Недостаточно круток! Купи их в магазине.");
    setRolls(prev => prev - count);
    const newCards: any[] = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let currentChance = 0;
      let droppedCard = MASTER_CARDS[MASTER_CARDS.length - 1];
      for (const card of MASTER_CARDS) {
        currentChance += card.chance;
        if (roll <= currentChance) { droppedCard = card; break; }
      }
      newCards.push(droppedCard);
    }
    setCollection(prev => [...prev, ...newCards]);
    setPulledCards(newCards);
  };

  const handleClaim = () => {
    if (!canClaim) return;
    setCoins(prev => prev + 500);
    localStorage.setItem('last_contract', today);
    alert("Вы получили 500 монет!");
  };

  if (view === 'contracts') {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setView('main')} className="text-gray-400 font-bold">← Назад</button>
          <h2 className="text-xl font-bold text-white">Контракты</h2>
          <div className="w-8"></div>
        </div>
        
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 mb-3 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-white font-bold text-sm">Ежедневный вход</p>
            <span className="text-yellow-400 text-sm font-bold">+500 🪙</span>
          </div>
          <p className="text-gray-400 text-xs">Заходите в игру каждый день.</p>
          <button 
            onClick={handleClaim} 
            disabled={!canClaim}
            className={`font-bold py-2 rounded text-sm mt-1 ${canClaim ? 'bg-[#c4f000] text-black' : 'bg-gray-700 text-gray-400'}`}
          >
            {canClaim ? 'Забрать награду' : 'Уже получено'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-[#c4f000]">Крутки: 🎟️ {rolls}</div>
        <div className="text-sm text-gray-400">Монеты: 🪙 {coins}</div>
      </div>

      {pulledCards && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <h3 className="text-2xl font-bold text-white mb-6">Выпали карты:</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-h-[60vh] overflow-y-auto">
            {pulledCards.map((c, i) => (
              <div key={i} className={`w-20 h-28 border-2 rounded-lg flex flex-col items-center justify-center bg-[#1e1e1e] ${c.color} animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-[9px] text-white font-bold text-center mt-1">{c.name}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPulledCards(null)} className="bg-[#c4f000] text-black px-8 py-3 rounded-xl font-bold">Забрать</button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-40 h-56 border-4 border-dashed border-gray-600 rounded-2xl bg-[#1e1e1e] flex flex-col items-center justify-center mb-8">
          <span className="text-6xl text-gray-700">?</span>
        </div>
        <div className="flex gap-2 w-full max-w-xs">
          <button onClick={() => handleRoll(1)} disabled={rolls < 1} className="flex-1 bg-[#c4f000] text-black font-bold text-lg py-3 rounded-xl active:scale-95 disabled:opacity-50">x1</button>
          <button onClick={() => handleRoll(5)} disabled={rolls < 5} className="flex-1 bg-[#c4f000] text-black font-bold text-lg py-3 rounded-xl active:scale-95 disabled:opacity-50">x5</button>
          <button onClick={() => handleRoll(10)} disabled={rolls < 10} className="flex-1 bg-[#c4f000] text-black font-bold text-lg py-3 rounded-xl active:scale-95 disabled:opacity-50">x10</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
        <button onClick={onOpenUpgrade} className="bg-[#1e1e1e] border border-orange-800 p-3 rounded-xl flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl mb-1">🔥</span>
          <span className="text-orange-500 font-bold text-sm">Модернизация</span>
        </button>
        <button onClick={() => setView('contracts')} className="bg-[#1e1e1e] border border-gray-800 p-3 rounded-xl flex flex-col items-center active:scale-95 transition-transform">
          <span className="text-2xl mb-1">📜</span>
          <span className="text-white font-bold text-sm">Контракты</span>
          <span className="text-[10px] text-[#c4f000]">{canClaim ? 'Есть награда!' : 'Завтра'}</span>
        </button>
      </div>
    </div>
  );
};