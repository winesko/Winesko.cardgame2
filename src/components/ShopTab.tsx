import React from 'react';

interface ShopTabProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setRolls: React.Dispatch<React.SetStateAction<number>>;
}

export const ShopTab: React.FC<ShopTabProps> = ({ coins, setCoins, setRolls }) => {
  
  const buyRolls = (amount: number, price: number) => {
    if (coins < price) return alert("Недостаточно монет!");
    setCoins(prev => prev - price);
    setRolls(prev => prev + amount);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Магазин</h2>
        <div className="bg-[#1e1e1e] px-3 py-1 rounded-full border border-gray-700 font-bold text-[#c4f000]">
          🪙 {coins}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Пакет 1 */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <p className="text-white font-bold">1 Крутка</p>
              <p className="text-xs text-gray-400">Обычная попытка</p>
            </div>
          </div>
          <button onClick={() => buyRolls(1, 100)} className="bg-[#c4f000] text-black px-4 py-2 rounded-lg font-bold active:scale-95">
            100 🪙
          </button>
        </div>

        {/* Пакет 5 */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ВЫГОДНО</div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <p className="text-white font-bold">5 Круток</p>
              <p className="text-xs text-gray-400">Скидка 10%</p>
            </div>
          </div>
          <button onClick={() => buyRolls(5, 450)} className="bg-[#c4f000] text-black px-4 py-2 rounded-lg font-bold active:scale-95">
            450 🪙
          </button>
        </div>

        {/* Пакет 10 */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">СУПЕР ЦЕНА</div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <p className="text-white font-bold">10 Круток</p>
              <p className="text-xs text-gray-400">Скидка 20%</p>
            </div>
          </div>
          <button onClick={() => buyRolls(10, 800)} className="bg-[#c4f000] text-black px-4 py-2 rounded-lg font-bold active:scale-95">
            800 🪙
          </button>
        </div>
      </div>
    </div>
  );
};