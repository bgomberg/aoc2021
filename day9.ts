#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

class Point {
  constructor(public x: number, public y: number) {}
}

function part1(map: number[][]) {
  const HEIGHT = map.length;
  const WIDTH = map[0].length;
  let risk = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let val = map[y][x];
      if (x != 0 && val >= map[y][x-1]) {
        // Left is lower
        continue;
      } else if (x != WIDTH - 1 && val >= map[y][x+1]) {
        // Right is lower
        continue;
      } else if (y != 0 && val >= map[y-1][x]) {
        // Up is lower
        continue;
      } else if (y != HEIGHT - 1 && val >= map[y+1][x]) {
        // Down is lower
        continue;
      }
      // This is a low point
      risk += val + 1;
    }
  }
  console.log(`Part1: ${risk}`);
}

function part2(map: number[][]) {
  const HEIGHT = map.length;
  const WIDTH = map[0].length;
  let basins = [];
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let val = map[y][x];
      if (val == 9) {
        continue;
      }
      // Push this point onto the stack
      let stack = [new Point(x, y)];
      // Explore outwards from this point
      let basinSize = 0;
      while (stack.length > 0) {
        let p = stack.pop()!;
        if (map[p.y][p.x] == 9) {
          // Already explored this point
          continue;
        }
        map[p.y][p.x] = 9;
        if (p.x != 0 && map[p.y][p.x-1] != 9) {
          // Push the point to the left onto the stack
          stack.push(new Point(p.x-1, p.y));
        }
        if (p.x != WIDTH - 1 && map[p.y][p.x+1] != 9) {
          // Push the point to the right onto the stack
          stack.push(new Point(p.x+1, p.y));
        }
        if (p.y != 0 && map[p.y-1][p.x] != 9) {
          // Push the point above onto the stack
          stack.push(new Point(p.x, p.y-1));
        }
        if (p.y != HEIGHT - 1 && map[p.y+1][p.x] != 9) {
          // Push the point below onto the stack
          stack.push(new Point(p.x, p.y+1));
        }
        basinSize++;
      }
      basins.push(basinSize);
    }
  }
  let result = basins.sort((a, b) => b - a).slice(0, 3).reduce((prevVal, curVal) => prevVal * curVal);
  console.log(`Part2: ${result}`);
}

readFileLines("input/day9.txt", (lines: string[]) => {
  let map = lines.map(line => line.split('').map(Number));
  part1(map);
  part2(map);
});
