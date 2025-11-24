import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import InstructionsModal from './components/InstructionsModal';
import { useGameState } from './hooks/useGameState';

function App() {
  const [showInstructions, setShowInstructions] = useState(false);

  const {
    board,
    rowCounts,
    colCounts,
    depth,
    gameState,
    message,
    minesLeft,
    handleReveal,
    handleFlag,
    nextLevel,
    retry
  } = useGameState();

  return (
    <div className="app-container">
      <h1>Logic Dungeon</h1>

      <HUD
        depth={depth}
        minesLeft={minesLeft}
        message={message}
        onShowInstructions={() => setShowInstructions(true)}
      />

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      <div className="game-area">
        <GameBoard
          board={board}
          rowCounts={rowCounts}
          colCounts={colCounts}
          onCellClick={handleReveal}
          onCellRightClick={handleFlag}
        />

        {gameState !== 'playing' && gameState !== 'loading' && (
          <div className="game-overlay">
            <div className="game-result">
              <h2>{gameState === 'won' ? 'SECTOR CLEARED' : 'CRITICAL FAILURE'}</h2>
              <p>{gameState === 'won' ? 'Proceeding to next depth...' : 'Logic sequence interrupted.'}</p>
              <button onClick={gameState === 'won' ? nextLevel : retry}>
                {gameState === 'won' ? 'Descend' : 'Reinitialize'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="controls-hint">
        <p>Left Click: Reveal / Attack | Right Click: Flag</p>
      </div>
    </div>
  );
}

export default App;
