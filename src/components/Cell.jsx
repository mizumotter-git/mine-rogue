import React from 'react';
import { Bomb, Flag, Skull } from 'lucide-react';

const Cell = ({ cell, onClick, onContextMenu }) => {
    const getCellContent = () => {
        if (cell.isFlagged) return <Flag size={16} color="#ffcc00" />;
        if (!cell.isRevealed) return null;
        if (cell.isMine) return <Skull size={20} color="#ff0055" />;
        if (cell.neighborMines > 0) return cell.neighborMines;
        return null;
    };

    const getClassName = () => {
        const base = "cell";
        if (!cell.isRevealed) return `${base} hidden`;
        if (cell.isMine) return `${base} mine`;
        return `${base} revealed n${cell.neighborMines}`;
    };

    return (
        <div
            className={getClassName()}
            onClick={() => onClick(cell.row, cell.col)}
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu(cell.row, cell.col);
            }}
        >
            {getCellContent()}
        </div>
    );
};

export default Cell;
