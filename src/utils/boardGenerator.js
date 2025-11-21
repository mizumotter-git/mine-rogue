/**
 * Generates a Minesweeper board with RPG elements.
 * @param {number} rows 
 * @param {number} cols 
 * @param {number} mines 
 * @returns {Array<Array<Object>>} 2D array of cell objects
 */
export const generateBoard = (rows, cols, mines) => {
    // Initialize empty board
    let board = Array(rows).fill().map((_, r) =>
        Array(cols).fill().map((_, c) => ({
            row: r,
            col: c,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
            id: `${r}-${c}`
        }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate Row and Column Mine Counts
    const rowCounts = Array(rows).fill(0);
    const colCounts = Array(cols).fill(0);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) {
                rowCounts[r]++;
                colCounts[c]++;
            }
        }
    }

    // Calculate neighbor numbers
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;

            let count = 0;
            directions.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                    count++;
                }
            });
            board[r][c].neighborMines = count;
        }
    }

    return { board, rowCounts, colCounts };
};

/**
 * Reveals a cell and cascades if it's empty (0 neighbors).
 * @param {Array<Array<Object>>} board 
 * @param {number} row 
 * @param {number} col 
 * @returns {Object} { newBoard, revealedCount, hitMine }
 */
export const revealCell = (board, row, col) => {
    // Deep copy board to avoid mutation issues
    const newBoard = JSON.parse(JSON.stringify(board));
    const cell = newBoard[row][col];

    if (cell.isRevealed || cell.isFlagged) {
        return { newBoard, revealedCount: 0, hitMine: false };
    }

    if (cell.isMine) {
        cell.isRevealed = true;
        return { newBoard, revealedCount: 0, hitMine: true };
    }

    // Flood fill
    let revealedCount = 0;
    const stack = [[row, col]];

    while (stack.length > 0) {
        const [r, c] = stack.pop();
        const current = newBoard[r][c];

        if (!current.isRevealed && !current.isFlagged) {
            current.isRevealed = true;
            revealedCount++;

            if (current.neighborMines === 0) {
                const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
                directions.forEach(([dr, dc]) => {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < newBoard.length && nc >= 0 && nc < newBoard[0].length) {
                        if (!newBoard[nr][nc].isRevealed) {
                            stack.push([nr, nc]);
                        }
                    }
                });
            }
        }
    }

    return { newBoard, revealedCount, hitMine: false };
};

/**
 * Ensures the starting cell is safe by moving the mine if necessary.
 * @param {Array<Array<Object>>} board 
 * @param {number} row 
 * @param {number} col 
 * @returns {Object} { board, rowCounts, colCounts }
 */
export const ensureSafeStart = (board, row, col) => {
    // Deep copy board
    const newBoard = JSON.parse(JSON.stringify(board));
    const rows = newBoard.length;
    const cols = newBoard[0].length;

    if (!newBoard[row][col].isMine) {
        // Already safe, but we need to return counts
        return recalculateCounts(newBoard);
    }

    // Move mine to the first available safe spot
    newBoard[row][col].isMine = false;
    let moved = false;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!newBoard[r][c].isMine && (r !== row || c !== col)) {
                newBoard[r][c].isMine = true;
                moved = true;
                break;
            }
        }
        if (moved) break;
    }

    return recalculateCounts(newBoard);
};

const recalculateCounts = (board) => {
    const rows = board.length;
    const cols = board[0].length;
    const rowCounts = Array(rows).fill(0);
    const colCounts = Array(cols).fill(0);

    // Recalculate row/col counts
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) {
                rowCounts[r]++;
                colCounts[c]++;
            }
        }
    }

    // Recalculate neighbor mines
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;

            let count = 0;
            directions.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                    count++;
                }
            });
            board[r][c].neighborMines = count;
        }
    }

    return { board, rowCounts, colCounts };
};
