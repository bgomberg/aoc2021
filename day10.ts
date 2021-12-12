#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

const CHUNK_CHAR_MAP = new Map(Object.entries({
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}));

function part1(lines: string[]) {
  const SCORE_LOOKUP = new Map(Object.entries({
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  }));
  let score = 0;
  for (let line of lines) {
    let stack: string[] = [];
    for (let c of line) {
      if ([...CHUNK_CHAR_MAP.keys()].includes(c)) {
        // Start of chunk - push end character onto the stack
        stack.push(CHUNK_CHAR_MAP.get(c)!);
      } else if (c != stack.pop()!) {
        // Unexpected chunk end character, so this line is corrupted
        score += SCORE_LOOKUP.get(c)!;
        break;
      }
    }
  }
  console.log(`Part1: ${score}`);
}

function part2(lines: string[]) {
  const SCORE_LOOKUP = new Map(Object.entries({
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  }));
  let scores = [];
  for (let line of lines) {
    let stack: string[] = [];
    let isCorrupted = false;
    for (let c of line) {
      if ([...CHUNK_CHAR_MAP.keys()].includes(c)) {
        // Start of chunk - push end character onto the stack
        stack.push(CHUNK_CHAR_MAP.get(c)!);
      } else if (c != stack.pop()!) {
        // Unexpected chunk end character, so this line is corrupted
        isCorrupted = true;
        break;
      }
    }
    if (isCorrupted) {
      continue;
    } else if (stack.length == 0) {
      // Not incomplete
      continue;
    }
    stack.reverse();
    let lineScore = 0;
    for (let c of stack) {
      lineScore = lineScore * 5 + SCORE_LOOKUP.get(c)!;
    }
    scores.push(lineScore);
  }
  scores.sort((a, b) => a - b);
  let result = scores[Math.floor(scores.length/2)];
  console.log(`Part2: ${result}`);
}

readFileLines("input/day10.txt", (lines: string[]) => {
  part1(lines);
  part2(lines);
});
