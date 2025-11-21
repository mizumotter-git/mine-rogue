import React from 'react';
import Cell from './Cell';

const GameBoard = ({ board, rowCounts, colCounts, onCellClick, onCellRightClick }) => {
    if (!board || board.length === 0) return null;

    const rows = board.length;
    const cols = board[0].length;

    return (
        <div className="game-board-container">
            {/* Top Header (Column Counts) */}
            <div className="col-headers" style={{
                gridTemplateColumns: `40px repeat(${cols}, 40px)`
            }}>
                <div className="header-cell empty"></div>
                {colCounts.map((count, i) => (
                    <div key={`col-${i}`} className="header-cell col-header">
                        {count}
                    </div>
                ))}
            </div>

            <div className="board-body">
                {/* Left Header (Row Counts) */}
                <div className="row-headers">
                    {rowCounts.map((count, i) => (
                        <div key={`row-${i}`} className="header-cell row-header">
                            {count}
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="game-grid" style={{
                    gridTemplateColumns: `repeat(${cols}, 40px)`
                }}>
                    {board.map((row, rIndex) => (
                        row.map((cell, cIndex) => (
                            <Cell
                                key={`${rIndex}-${cIndex}`}
                                cell={cell}
                                onClick={onCellClick}
                                onContextMenu={onCellRightClick}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
