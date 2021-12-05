#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

const BOARD_SIZE = 5;

class Board {
  private marked: boolean[][];

  constructor(private values: number[][]) {
    this.marked = Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.marked[i] = Array(BOARD_SIZE).fill(false);
    }
  }

  public numberDrawn(drawnNumber: number) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (this.values[i][j] == drawnNumber) {
          this.marked[i][j] = true;
        }
      }
    }
  }

  public didWin(): boolean {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.marked.every(row => row[i])) {
        return true;
      }
      if (this.marked[i].every(cell => cell)) {
        return true;
      }
    }
    return false;
  }

  public sumUnmarked(): number {
    let total = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!this.marked[i][j]) {
          total += this.values[i][j];
        }
      }
    }
    return total;
  }
}

function part1(boards: Board[], numbersDrawn: number[]) {
  while (numbersDrawn.length > 0) {
    let numberDrawn = numbersDrawn.shift()!;
    for (let i = 0; i < boards.length; i++) {
      let board = boards[i];
      board.numberDrawn(numberDrawn);
      if (board.didWin()) {
        let score = board.sumUnmarked() * numberDrawn;
        console.log(`Part1: Winning board had a score of ${score}`);
        return;
      }
    }
  }
}

function part2(boards: Board[], numbersDrawn: number[]) {
  var lastScore: number | undefined;
  while (numbersDrawn.length > 0) {
    let numberDrawn = numbersDrawn.shift()!;
    for (let i = 0; i < boards.length; i++) {
      let board = boards[i];
      if (board.didWin()) {
        // Already won
        continue;
      }
      board.numberDrawn(numberDrawn);
      if (board.didWin()) {
        lastScore = board.sumUnmarked() * numberDrawn;
      }
    }
  }
  console.log(`Part2: Last board had a score of ${lastScore}`);
  return;
}

readFileLines("input/day4.txt", (lines: string[]) => {
  // Remove the empty lines
  lines = lines.filter((line) => line.trim());
  // Get the numbers which will be drawn
  let numbersDrawn = lines.shift()!.split(',').map(Number);
  // Populate the boards
  let boards1: Board[] = []
  let boards2: Board[] = []
  while (lines.length > 0) {
    const boardValues = lines.splice(0, 5)
      .map((boardLine) => boardLine.trim().split(' ')
        .filter(val => val.trim())
        .map(val => Number(val.trim())));
    boards1.push(new Board(boardValues));
    boards2.push(new Board(boardValues));
  }
  part1(boards1, [...numbersDrawn]);
  part2(boards2, [...numbersDrawn]);
});
