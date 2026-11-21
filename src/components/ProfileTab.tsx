import React from 'react';

interface ProfileTabProps {
  coins: number;
  collectionCount: number;
  cups: number; // Добавили кубки
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ coins, collectionCount, cups }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-3xl">🧑‍🎤</div>
        <div>
          <h2 className="text-xl font-bold text-white">{window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'Игрок'}</h2>
          <p className="text-xs text-gray-400">ID: {window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '00000000'}</p>
        </div>
      </div>

      <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-800 text-white">
          <span>🪙 Монеты</span>
          <span className="text-[#c4f000] font-bold">{coins}</span>
        </div>
        <div className="flex justify-between items-center p-4 border-b border-gray-800 text-white">
          <span>🎴 Всего выбито</span>
          <span className="text-[#c4f000] font-bold">{collectionCount}</span>
        </div>
        <div className="flex justify-between items-center p-4 text-white">
          <span>🏆 Кубки арены</span>
          <span className="text-[#c4f000] font-bold">{cups}</span>
        </div>
      </div>
    </div>
  );
};
