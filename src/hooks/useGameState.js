import { useState, useEffect, useCallback } from 'react';
import { generateBoard, revealCell, ensureSafeStart } from '../utils/boardGenerator';

const INITIAL_STATS = {
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    gold: 0,
    nextLevelXp: 100
};

const DAMAGE_PER_MINE = 20;
const XP_PER_TILE = 10;
const XP_PER_ENEMY = 50; // Bonus for clearing? Or maybe just surviving hits?
// For now, let's say revealing a mine deals damage but also gives "Combat XP" because you survived/disarmed it.

export const useGameState = () => {
    const [board, setBoard] = useState([]);
    const [rowCounts, setRowCounts] = useState([]);
    const [colCounts, setColCounts] = useState([]);
    const [depth, setDepth] = useState(1);
    const [gameState, setGameState] = useState('loading'); // loading, playing, won, lost
    const [message, setMessage] = useState('');
    const [minesLeft, setMinesLeft] = useState(0);

    // Game Settings
    const ROWS = 10;
    const COLS = 10;
    // Difficulty scales with depth? For now, keep it simple or slight increase.
    const getMinesForDepth = (d) => Math.min(10 + Math.floor(d * 1.5), 30);

    const initGame = useCallback((currentDepth = 1) => {
        const numMines = getMinesForDepth(currentDepth);
        const { board: newBoard, rowCounts: newRowCounts, colCounts: newColCounts } = generateBoard(ROWS, COLS, numMines);
        setBoard(newBoard);
        setRowCounts(newRowCounts);
        setColCounts(newColCounts);
        setDepth(currentDepth);
        setMinesLeft(numMines);
        setGameState('playing');
        setMessage(`Depth ${currentDepth}: Logic is your only weapon.`);
    }, []);

    useEffect(() => {
        initGame(1);
    }, [initGame]);

    const checkWinCondition = (currentBoard) => {
        // Win if all non-mine cells are revealed
        let unrevealedSafe = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
                    unrevealedSafe++;
                }
            }
        }
        if (unrevealedSafe === 0) {
            setGameState('won');
            setMessage('Sector Cleared. Descending...');
            // Auto-descend after a short delay could be nice, but for now let UI handle it
        }
    };

    const handleReveal = (row, col) => {
        if (gameState !== 'playing') return;

        let currentBoard = board;

        // Check if this is the first move (no cells revealed yet)
        const isFirstMove = !board.some(r => r.some(c => c.isRevealed));

        if (isFirstMove) {
            const { board: safeBoard, rowCounts: newRowCounts, colCounts: newColCounts } = ensureSafeStart(board, row, col);
            currentBoard = safeBoard;
            setBoard(safeBoard);
            setRowCounts(newRowCounts);
            setColCounts(newColCounts);
        }

        const { newBoard, revealedCount, hitMine } = revealCell(currentBoard, row, col);
        setBoard(newBoard);

        if (hitMine) {
            setGameState('lost');
            setMessage('CRITICAL FAILURE. Sequence terminated.');
        } else {
            if (gameState === 'playing') {
                checkWinCondition(newBoard);
            }
        }
    };

    const handleFlag = (row, col) => {
        if (gameState !== 'playing') return;
        const cell = board[row][col];
        if (cell.isRevealed) return;

        const newBoard = [...board];
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setBoard(newBoard);

        setMinesLeft(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
    };

    const nextLevel = () => {
        initGame(depth + 1);
    };

    const retry = () => {
        initGame(1); // Reset to depth 1 on death
    };

    return {
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
    };
};
