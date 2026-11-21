import React, { useState, useEffect } from 'react';

interface ArenaTabProps {
  collection: any[];
  cups: number;
  setCups: React.Dispatch<React.SetStateAction<number>>;
}

export const ArenaTab: React.FC<ArenaTabProps> = ({ collection, cups, setCups }) => {
  const uniqueCards = Array.from(new Set(collection.map(c => c.id))).map(id => collection.find(c => c.id === id));
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('arena_deck') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('arena_deck', JSON.stringify(selectedDeckIds)); }, [selectedDeckIds]);

  const [gameState, setGameState] = useState<'build' | 'fighting' | 'result'>('build');
  const [result, setResult] = useState<'win' | 'lose'>('win');
  
  // Стейты для анимации
  const [currentRound, setCurrentRound] = useState(0);
  const [roundResults, setRoundResults] = useState<('player' | 'enemy')[]>([]);
  const [pCurrentHp, setPCurrentHp] = useState(0);
  const [eCurrentHp, setECurrentHp] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showSlash, setShowSlash] = useState(false);

  const deck = uniqueCards.filter(c => selectedDeckIds.includes(c.id));
  
  const calcStats = (cards: any[]) => {
    let atk = 0; let hp = 0; let hasPassive = false;
    cards.forEach(card => {
      let cAtk = card.atk || 0; let cHp = card.hp || 0;
      if (card.passive) {
        hasPassive = true;
        if (card.passive === 'Ярость') { cAtk *= 1.15; cHp *= 0.9; }
        if (card.passive === 'Бастион') { cAtk *= 0.95; cHp *= 1.2; }
        if (card.passive === 'Вампиризм') { cHp += cAtk * 0.15; }
        if (card.passive === 'Казнь') { cAtk *= 1.2; }
        if (card.passive === 'Удача') { cHp *= 1.1; }
      }
      atk += cAtk; hp += cHp;
    });
    return { atk: Math.floor(atk), hp: Math.floor(hp), hasPassive };
  };

  const playerStats = calcStats(deck);
  const [enemy, setEnemy] = useState({ atk: 0, hp: 0, passive: false });

  const toggleCard = (id: number) => {
    setSelectedDeckIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 5 ? prev : [...prev, id]);
  };

  const autoAssemble = () => {
    setSelectedDeckIds([...uniqueCards].sort((a, b) => (b.atk + b.hp) - (a.atk + a.hp)).slice(0, 5).map(c => c.id));
  };

  const startBattle = () => {
    if (deck.length < 5) return alert("Собери колоду из 5 карт!");

    // 🛠️ БАЛАНС: Враг получает статы от 85% до 105% от твоих
    let enemyAtk = Math.floor(playerStats.atk * (0.85 + Math.random() * 0.2));
    let enemyHp = Math.floor(playerStats.hp * (0.85 + Math.random() * 0.2));
    
    let enemyHasPassive = false;
    const passiveChance = playerStats.hasPassive ? 0.2 : 0.1;
    
    if (Math.random() < passiveChance) {
      enemyHasPassive = true;
      const p = Math.random();
      if (p < 0.2) { enemyAtk *= 1.15; enemyHp *= 0.9; }
      else if (p < 0.4) { enemyAtk *= 0.95; enemyHp *= 1.2; }
      else if (p < 0.6) { enemyHp += enemyAtk * 0.15; }
      else if (p < 0.8) { enemyAtk *= 1.2; }
      else { enemyHp *= 1.1; }
    }

    setEnemy({ atk: Math.floor(enemyAtk), hp: Math.floor(enemyHp), passive: enemyHasPassive });
    
    // Просчет 5 раундов
    let pWins = 0; let eWins = 0;
    const fightRounds: ('player' | 'enemy')[] = [];
    
    for (let i = 0; i < 5; i++) {
      // ⚖️ СКРЫТЫЙ БОНУС: Игрок бьет с силой * 1.06 (это дает винрейт ~60%)
      const pDmg = (playerStats.atk / 5) * (0.8 + Math.random() * 0.4) * 1.06;
      const eDmg = (enemyAtk / 5) * (0.8 + Math.random() * 0.4);
      
      if (pDmg >= eDmg) { fightRounds.push('player'); pWins++; }
      else { fightRounds.push('enemy'); eWins++; }
    }
    
    const isWin = pWins > eWins;
    setRoundResults(fightRounds);
    setResult(isWin ? 'win' : 'lose');

    // ЛОГИКА ХП
    const startPlayerHp = playerStats.hp;
    const startEnemyHp = Math.floor(enemyHp);
    
    const finalPlayerHp = isWin ? Math.floor(startPlayerHp * (0.2 + Math.random() * 0.2)) : 0;
    const finalEnemyHp = isWin ? 0 : Math.floor(startEnemyHp * (0.2 + Math.random() * 0.2));

    const playerHpLossPerRound = (startPlayerHp - finalPlayerHp) / 5;
    const enemyHpLossPerRound = (startEnemyHp - finalEnemyHp) / 5;

    setPCurrentHp(startPlayerHp);
    setECurrentHp(startEnemyHp);
    
    setCurrentRound(0);
    setGameState('fighting');

    let round = 0;
    const interval = setInterval(() => {
      round++;
      setCurrentRound(round);
      
      // Эффекты
      setIsShaking(true);
      setShowSlash(true);
      setTimeout(() => { setIsShaking(false); setShowSlash(false); }, 300);

      // Урон ХП
      if (round >= 5) {
        setPCurrentHp(finalPlayerHp);
        setECurrentHp(finalEnemyHp);
      } else {
        setPCurrentHp(prev => Math.max(finalPlayerHp, prev - playerHpLossPerRound));
        setECurrentHp(prev => Math.max(finalEnemyHp, prev - enemyHpLossPerRound));
      }

      // Конец боя
      if (round >= 5) {
        clearInterval(interval);
        setIsShaking(false); // 🛑 ЖЕСТКО ОТКЛЮЧАЕМ ТРЯСКУ
        setShowSlash(false);
        
        if (isWin) setCups(prev => prev + 15);
        else setCups(prev => Math.max(0, prev - 10));
        
        setTimeout(() => setGameState('result'), 600);
      }
    }, 1000);
  };

  if (gameState === 'build') {
    return (
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Арена</h2>
          <div className="text-yellow-400 font-bold">🏆 {cups}</div>
        </div>
        <div className="bg-[#1e1e1e] p-3 rounded-xl border border-gray-800 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-sm">Колода ({deck.length}/5)</p>
            <button onClick={autoAssemble} className="text-[#c4f000] text-sm font-bold bg-[#2a2a2a] px-3 py-1 rounded">⚡ Автосбор</button>
          </div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => {
              const card = deck[i];
              return (
                <div key={i} onClick={() => card && toggleCard(card.id)} className={`w-14 h-20 rounded border flex flex-col items-center justify-center text-2xl cursor-pointer ${card ? card.color + ' bg-[#2a2a2a]' : 'border-gray-700 border-dashed'}`}>
                  {card ? <><span>{card.emoji}</span>{card.passive && <span className="text-[8px] text-purple-400">✨</span>}</> : '+'}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-white font-bold text-sm">
            <span className="text-red-400">⚔️ {playerStats.atk}</span>
            <span className="text-green-400">❤️ {playerStats.hp}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2 content-start">
          {uniqueCards.map(card => (
            <div key={card.id} onClick={() => toggleCard(card.id)} className={`aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center p-1 cursor-pointer ${selectedDeckIds.includes(card.id) ? 'border-[#c4f000] bg-[#2a2a2a] scale-95' : card.color + ' bg-[#1a1a1a]'}`}>
              <span className="text-2xl mb-1">{card.emoji}</span>
              <span className="text-[9px] text-white font-medium">{card.atk}⚔️ {card.hp}❤️</span>
            </div>
          ))}
        </div>
        <button onClick={startBattle} className="w-full mt-4 bg-[#c4f000] text-black font-bold text-xl py-3 rounded-2xl active:scale-95 shrink-0">В бой</button>
      </div>
    );
  }

  // --- ЭКРАН БОЯ ---
  return (
    <div className="relative w-full h-full">
      
      {/* Трясущийся контейнер */}
      <div className={`p-4 flex flex-col items-center h-full relative overflow-hidden ${isShaking && gameState === 'fighting' ? 'animate-shake' : ''}`}>
        
        {/* Эффект пореза */}
        {showSlash && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="w-[150%] h-2 bg-red-600 shadow-[0_0_20px_red] animate-slash transform -rotate-45"></div>
            <div className="absolute w-[150%] h-1 bg-white shadow-[0_0_10px_white] animate-slash transform rotate-45"></div>
          </div>
        )}

        {/* Противник */}
        <div className="w-full flex flex-col items-center mb-8 pt-4">
          <p className="text-gray-400 font-bold mb-2">Противник {enemy.passive && '✨'}</p>
          <div className="w-full max-w-xs bg-gray-800 h-5 rounded-full overflow-hidden border border-gray-600 relative">
            <div className="bg-red-600 h-full hp-bar" style={{ width: `${(eCurrentHp / enemy.hp) * 100}%` }}></div>
            <span className="absolute inset-0 flex justify-center items-center text-[10px] font-bold text-white drop-shadow-md">
              {Math.floor(eCurrentHp)} / {enemy.hp}
            </span>
          </div>
        </div>

        {/* Кружочки */}
        <div className="flex flex-col items-center my-auto">
          <h3 className="text-5xl font-black text-white italic mb-8 drop-shadow-xl">РАУНД {Math.min(currentRound, 5)}</h3>
          <div className="flex gap-3 mb-4">
            {[0, 1, 2, 3, 4].map((i) => {
              if (i >= currentRound) return <div key={i} className="w-10 h-3 bg-gray-700 rounded-full" />;
              return <div key={i} className={`w-10 h-3 rounded-full shadow-lg ${roundResults[i] === 'player' ? 'bg-white' : 'bg-red-500'}`} />;
            })}
          </div>
        </div>

        {/* Игрок */}
        <div className="w-full flex flex-col items-center mt-8 pb-4">
          <div className="w-full max-w-xs bg-gray-800 h-5 rounded-full overflow-hidden border border-gray-600 relative">
            <div className="bg-green-500 h-full hp-bar" style={{ width: `${(pCurrentHp / playerStats.hp) * 100}%` }}></div>
            <span className="absolute inset-0 flex justify-center items-center text-[10px] font-bold text-white drop-shadow-md">
              {Math.floor(pCurrentHp)} / {playerStats.hp}
            </span>
          </div>
          <p className="text-gray-400 font-bold mt-2">Ты {playerStats.hasPassive && '✨'}</p>
        </div>
      </div>

      {/* Экран победы (без тряски) */}
      {gameState === 'result' && (
        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-50 transition-opacity duration-300">
          <h2 className={`text-6xl font-black mb-4 ${result === 'win' ? 'text-yellow-400' : 'text-red-500'}`}>
            {result === 'win' ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}
          </h2>
          <div className="flex gap-4 text-2xl font-bold text-white mb-8">
            <span className={result === 'win' ? 'text-yellow-400' : 'text-red-500'}>
              🏆 {result === 'win' ? '+15' : '-10'}
            </span>
          </div>
          <button onClick={() => setGameState('build')} className="bg-[#c4f000] text-black font-bold text-xl py-3 px-8 rounded-2xl active:scale-95">
            На арену
          </button>
        </div>
      )}
    </div>
  );
};