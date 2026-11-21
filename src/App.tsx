import React, { useState, useEffect } from 'react';
import { HomeTab } from './components/HomeTab';
import { CollectionTab } from './components/CollectionTab';
import { ProfileTab } from './components/ProfileTab';
import { ArenaTab } from './components/ArenaTab';
import { ShopTab } from './components/ShopTab';
import { UpgradeTab } from './components/UpgradeTab'; // Новая вкладка
import { MASTER_CARDS } from './cardsData';

const tabs = ['home', 'collection', 'arena', 'shop', 'profile'] as const;
type Tab = typeof tabs[number];

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isUpgrading, setIsUpgrading] = useState(false); // Режим модернизации

  // Валюты
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('game_coins')) || 1000);
  const [rolls, setRolls] = useState<number>(() => Number(localStorage.getItem('game_rolls')) || 10);
  const [dust, setDust] = useState<number>(() => Number(localStorage.getItem('game_dust')) || 0);
  const [cups, setCups] = useState<number>(() => Number(localStorage.getItem('game_cups')) || 0);

  const [collection, setCollection] = useState<any[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('game_collection') || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.map(savedCard => {
        const masterCard = MASTER_CARDS.find(m => m.id === savedCard.id);
        return masterCard ? { ...masterCard, ...savedCard } : savedCard;
      });
    } catch (e) { return []; }
  });

  // Сохранение
  useEffect(() => {
    localStorage.setItem('game_coins', coins.toString());
    localStorage.setItem('game_rolls', rolls.toString());
    localStorage.setItem('game_dust', dust.toString());
    localStorage.setItem('game_cups', cups.toString());
    localStorage.setItem('game_collection', JSON.stringify(collection));
  }, [coins, rolls, dust, cups, collection]);

  // ⏱️ ТАЙМЕР ЗОЛОТА: +10 монет каждые 10 секунд
  useEffect(() => {
    const goldTimer = setInterval(() => {
      setCoins(prev => prev + 10);
    }, 10000);
    return () => clearInterval(goldTimer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#121212] text-white flex flex-col font-sans">
      <header className="p-4 text-center border-b border-gray-800 bg-[#1e1e1e] shrink-0">
        <h1 className="text-lg font-bold text-[#c4f000]">CARD GAME PROTOTYPE</h1>
      </header>

      {/* Если включена модернизация, показываем её на весь экран */}
      {isUpgrading ? (
        <UpgradeTab 
          collection={collection} 
          setCollection={setCollection} 
          onBack={() => setIsUpgrading(false)} 
        />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto pb-20">
            {currentTab === 'home' && (
              <HomeTab coins={coins} setCoins={setCoins} rolls={rolls} setRolls={setRolls} dust={dust} setDust={setDust} collection={collection} setCollection={setCollection} onOpenUpgrade={() => setIsUpgrading(true)} />
            )}
            {currentTab === 'collection' && <CollectionTab collection={collection} />}
            {currentTab === 'arena' && <ArenaTab collection={collection} cups={cups} setCups={setCups} />}
            {currentTab === 'shop' && <ShopTab coins={coins} setCoins={setCoins} setRolls={setRolls} />}
            {currentTab === 'profile' && <ProfileTab coins={coins} collectionCount={collection.length} cups={cups} />}
          </main>

          <nav className="w-full bg-[#1e1e1e] border-t border-gray-800 flex justify-around p-3 pb-6 shrink-0 z-50">
            <button onClick={() => setCurrentTab('home')} className={`flex flex-col items-center ${currentTab === 'home' ? 'text-[#c4f000]' : 'text-gray-500'}`}>
              <span className="text-xl">🏠</span><span className="text-[10px]">Дом</span>
            </button>
            <button onClick={() => setCurrentTab('collection')} className={`flex flex-col items-center ${currentTab === 'collection' ? 'text-[#c4f000]' : 'text-gray-500'}`}>
              <span className="text-xl">🎴</span><span className="text-[10px]">Коллекция</span>
            </button>
            <button onClick={() => setCurrentTab('arena')} className={`flex flex-col items-center ${currentTab === 'arena' ? 'text-[#c4f000]' : 'text-gray-500'}`}>
              <span className="text-xl">🏆</span><span className="text-[10px]">Арена</span>
            </button>
            <button onClick={() => setCurrentTab('shop')} className={`flex flex-col items-center ${currentTab === 'shop' ? 'text-[#c4f000]' : 'text-gray-500'}`}>
              <span className="text-xl">🛍️</span><span className="text-[10px]">Магазин</span>
            </button>
            <button onClick={() => setCurrentTab('profile')} className={`flex flex-col items-center ${currentTab === 'profile' ? 'text-[#c4f000]' : 'text-gray-500'}`}>
              <span className="text-xl">👤</span><span className="text-[10px]">Профиль</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}