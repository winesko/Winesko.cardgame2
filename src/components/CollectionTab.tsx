import React from 'react';
import { MASTER_CARDS } from '../cardsData';

interface CollectionTabProps {
  collection: any[];
}

export const CollectionTab: React.FC<CollectionTabProps> = ({ collection }) => {
  // ЗАЩИТА ОТ ОШИБКИ: Если collection пустая (undefined), используем пустой массив []
  const safeCollection = collection || [];
  const ownedIds = new Set(safeCollection.map(c => c.id));

  const renderGroup = (title: string, rarityName: string, titleColor: string) => {
    const cardsInGroup = MASTER_CARDS.filter(c => c.rarity === rarityName);
    const ownedInGroup = cardsInGroup.filter(c => ownedIds.has(c.id)).length;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className={`font-bold text-lg ${titleColor}`}>{title}</h3>
          <span className="text-gray-500 text-sm">{ownedInGroup} / {cardsInGroup.length}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {cardsInGroup.map(card => {
            const isOwned = ownedIds.has(card.id);
            return (
              <div 
                key={card.id} 
                className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center p-1
                  ${isOwned ? `${card.color} bg-[#2a2a2a]` : 'border-gray-800 bg-[#151515] opacity-60'}
                `}
              >
                {isOwned ? (
                  <>
                    <span className="text-2xl mb-1">{card.emoji}</span>
                    <span className="text-[9px] text-white text-center font-medium leading-tight">{card.name}</span>
                  </>
                ) : (
                  <span className="text-2xl text-gray-700 font-bold">?</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6">
        Коллекция <span className="text-sm text-gray-400">({ownedIds.size} / 25)</span>
      </h2>
      {renderGroup('👑 Легендарные', 'Легендарная', 'text-yellow-500')}
      {renderGroup('🩸 Мифические', 'Мифическая', 'text-red-500')}
      {renderGroup('🟣 Эпические', 'Эпическая', 'text-purple-500')}
      {renderGroup('🔵 Редкие', 'Редкая', 'text-blue-500')}
      {renderGroup('⚪ Обычные', 'Обычная', 'text-gray-400')}
    </div>
  );
};