/**
 * Generates all permutations of an array using Heap's Algorithm.
 * - Handles empty array, single element, duplicates.
 */
export function permutations<T>(list: readonly T[]): T[][] {
  if (!Array.isArray(list) || list.length === 0) return [];
  const result: T[][] = [];
  const arr = [...list];

  function generate(k: number) {
    if (k === 1) {
      result.push([...arr]);
      return;
    }

    generate(k - 1);

    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) {
        [arr[i], arr[k - 1]] = [arr[k - 1]!, arr[i]!];
      } else {
        [arr[0], arr[k - 1]] = [arr[k - 1]!, arr[0]!];
      }
      generate(k - 1);
    }
  }

  generate(arr.length);
  return result;
}

/**
 * Generates all combinations (subsets) of size k from a list.
 */
export function combinations<T>(list: readonly T[], k: number): T[][] {
  if (!Array.isArray(list) || k < 0 || k > list.length) return [];
  if (k === 0) return [[]];

  const results: T[][] = [];
  const current: T[] = [];

  function backtrack(start: number) {
    if (current.length === k) {
      results.push([...current]);
      return;
    }

    for (let i = start; i < list.length; i++) {
      current.push(list[i]!);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);
  return results;
}

/**
 * Solves the classic N-Queens puzzle using backtracking.
 * Returns all distinct board configurations where 'Q' is queen and '.' is empty space.
 */
export function solveNQueens(n: number): string[][] {
  if (n <= 0) return [];
  if (n === 1) return [['Q']];
  if (n === 2 || n === 3) return []; // No solution exists

  const solutions: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // r - c
  const diag2 = new Set<number>(); // r + c
  const board: number[] = new Array(n).fill(-1); // board[row] = col

  function place(row: number) {
    if (row === n) {
      solutions.push(
        board.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)),
      );
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col;
      const d2 = row + col;

      if (!cols.has(col) && !diag1.has(d1) && !diag2.has(d2)) {
        cols.add(col);
        diag1.add(d1);
        diag2.add(d2);
        board[row] = col;

        place(row + 1);

        cols.delete(col);
        diag1.delete(d1);
        diag2.delete(d2);
        board[row] = -1;
      }
    }
  }

  place(0);
  return solutions;
}

/**
 * Solves a 9x9 Sudoku puzzle in-place using backtracking.
 * Modifies board in-place and returns true if solvable, false otherwise.
 */
export function solveSudoku(board: number[][]): boolean {
  if (!board || board.length !== 9) return false;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidSudokuPlacement(board, r, c, num)) {
            board[r]![c] = num;
            if (solveSudoku(board)) return true;
            board[r]![c] = 0;
          }
        }
        return false;
      }
    }
  }

  return true;
}

function isValidSudokuPlacement(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row]![i] === num) return false;
    if (board[i]![col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow]![boxCol] === num) return false;
  }
  return true;
}

