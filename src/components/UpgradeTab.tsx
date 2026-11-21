import React, { useState } from 'react';

interface UpgradeTabProps {
  collection: any[];
  setCollection: React.Dispatch<React.SetStateAction<any[]>>;
  onBack: () => void;
}

export const UpgradeTab: React.FC<UpgradeTabProps> = ({ collection, setCollection, onBack }) => {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [activeChance, setActiveChance] = useState(50); // Для отображения шанса в центре

  const upgradableCards = collection.filter(c => c.rarity === 'Мифическая' || c.rarity === 'Легендарная');

  const handleUpgrade = (type: 'rarity' | 'passive' | 'promo') => {
    if (!selectedCard) return;
    setIsUpgrading(true);
    setResultMsg(null);

    let chance = type === 'rarity' ? 10 : type === 'passive' ? 25 : 50;
    setActiveChance(chance);

    // Крутим колесо
    const randomSpin = 360 * 5 + Math.floor(Math.random() * 360); // 5 полных оборотов
    setWheelRotation(prev => prev + randomSpin);

    setTimeout(() => {
      const roll = Math.random() * 100;
      const isSuccess = roll <= chance;
      const cardIndex = collection.findIndex(c => c === selectedCard);

      if (isSuccess) {
        const updatedCollection = [...collection];
        const cardToUpdate = { ...updatedCollection[cardIndex] };

        if (type === 'rarity') {
          cardToUpdate.rarity = 'Легендарная';
          cardToUpdate.color = 'border-yellow-500';
          cardToUpdate.text = 'text-yellow-500';
          cardToUpdate.atk = Math.floor(cardToUpdate.atk * 1.5);
          cardToUpdate.hp = Math.floor(cardToUpdate.hp * 1.5);
          setResultMsg(`УСПЕХ! ${cardToUpdate.name} стала Легендарной!`);
        } else if (type === 'passive') {
          const passives = ['Вампиризм', 'Ярость', 'Бастион', 'Казнь', 'Удача'];
          cardToUpdate.passive = passives[Math.floor(Math.random() * passives.length)];
          setResultMsg(`УСПЕХ! Пассивка: ${cardToUpdate.passive}`);
        } else if (type === 'promo') {
          cardToUpdate.atk = Math.floor(cardToUpdate.atk * 1.15);
          cardToUpdate.hp = Math.floor(cardToUpdate.hp * 1.15);
          setResultMsg(`УСПЕХ! Карта усилена на 15%!`);
        }

        updatedCollection[cardIndex] = cardToUpdate;
        setCollection(updatedCollection);
        setSelectedCard(cardToUpdate);
      } else {
        const updatedCollection = collection.filter(c => c !== selectedCard);
        setCollection(updatedCollection);
        setSelectedCard(null);
        setResultMsg(`ПРОВАЛ... Карта сгорела!`);
      }
      setIsUpgrading(false);
    }, 3000); // 3 секунды кручения
  };

  return (
    <div className="p-4 h-full flex flex-col flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <button onClick={onBack} className="text-gray-400 font-bold">← Назад</button>
        <h2 className="text-xl font-bold text-orange-500">Модернизация</h2>
        <div className="w-8"></div>
      </div>

      {!selectedCard && (
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-4 text-center">Выбери Мифическую или Легендарную карту.</p>
          <div className="grid grid-cols-3 gap-3">
            {upgradableCards.map((card, index) => (
              <div key={index} onClick={() => setSelectedCard(card)} className={`p-2 rounded-xl border-2 flex flex-col items-center cursor-pointer ${card.color} bg-[#1e1e1e]`}>
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-[10px] text-white text-center">{card.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCard && (
        <div className="flex-1 flex flex-col items-center">
          {/* Карта */}
          <div className={`w-28 h-40 border-4 rounded-xl bg-[#1e1e1e] flex flex-col items-center justify-center mb-6 ${selectedCard.color}`}>
            <span className="text-5xl mb-2">{selectedCard.emoji}</span>
            <span className="text-white font-bold text-sm">{selectedCard.name}</span>
          </div>

          {/* 🎡 КОЛЕСО УДАЧИ */}
          <div className="relative w-56 h-56 flex justify-center items-center mb-6">
            {/* Внешнее кольцо (фон) */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-[#2a2a2a]"
              style={{ 
                background: `conic-gradient(
                  #22c55e 0deg 180deg,   /* Зеленый сектор (50%) */
                  #f59e0b 180deg 270deg, /* Желтый сектор (25%) */
                  #ef4444 270deg 360deg  /* Красный сектор (10-25%) */
                )`
              }}
            ></div>
            
            {/* Центральный круг */}
            <div className="absolute w-36 h-36 bg-[#121212] rounded-full flex flex-col items-center justify-center border-4 border-[#1e1e1e] z-10">
               <span className="text-3xl mb-1">🎯</span>
               <span className="text-white font-bold text-xl">{activeChance}%</span>
               <span className="text-gray-500 text-xs">шанс</span>
            </div>

            {/* Стрелка (крутится) */}
            <div 
              className="absolute w-1.5 h-28 bg-white origin-bottom z-20 transition-transform duration-[3000ms] ease-out flex justify-center"
              style={{ 
                transform: `rotate(${wheelRotation}deg) translateY(-50%)`,
                bottom: '50%'
              }}
            >
              {/* Наконечник стрелки */}
              <div className="w-4 h-4 bg-white rotate-45 absolute -top-2"></div>
            </div>
          </div>

          {resultMsg && (
            <div className={`p-3 rounded-lg mb-4 text-center font-bold w-full ${resultMsg.includes('УСПЕХ') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {resultMsg}
            </div>
          )}

          {!resultMsg && (
            <div className="w-full flex flex-col gap-2">
              <p className="text-center text-gray-400 text-xs mb-1">При провале карта сгорает!</p>
              <button onClick={() => handleUpgrade('promo')} disabled={isUpgrading} className="bg-green-700 text-white font-bold py-2 rounded-lg flex justify-between px-4 text-sm disabled:opacity-50">
                <span>Промо-буст (+15%)</span><span>50%</span>
              </button>
              <button onClick={() => handleUpgrade('passive')} disabled={isUpgrading || selectedCard.passive} className="bg-purple-700 text-white font-bold py-2 rounded-lg flex justify-between px-4 text-sm disabled:opacity-50">
                <span>Открыть пассивку</span><span>25%</span>
              </button>
              <button onClick={() => handleUpgrade('rarity')} disabled={isUpgrading || selectedCard.rarity === 'Легендарная'} className="bg-yellow-600 text-black font-bold py-2 rounded-lg flex justify-between px-4 text-sm disabled:opacity-50">
                <span>Повысить редкость</span><span>10%</span>
              </button>
            </div>
          )}

          {isUpgrading && <div className="mt-4 text-orange-500 font-bold animate-pulse text-lg">Крутим колесо...</div>}

          {resultMsg && (
            <button onClick={() => { setResultMsg(null); if (resultMsg.includes('ПРОВАЛ')) setSelectedCard(null); }} className="mt-6 bg-[#c4f000] text-black font-bold py-2 px-8 rounded-lg">
              Продолжить
            </button>
          )}
        </div>
      )}
    </div>
  );
};