#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

class OctopusMap {
  private width: number;
  private height: number;

  constructor(private map: number[][]) {
    this.width = this.map[0].length;
    this.height = this.map.length;
  }

  public size(): number {
    return this.width * this.height;
  }

  public step(): number {
    // Increase all by 1
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.map[y][x]++;
      }
    }
    // Look for flashes
    let hasFlashed: boolean[][] = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      hasFlashed[i] = new Array(this.width).fill(false);
    }
    while (true) {
      let hasNewFlash = false;
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (hasFlashed[y][x] || this.map[y][x] <= 9) {
            continue;
          }
          hasFlashed[y][x] = true;
          hasNewFlash = true;
          // Increase energy of neighbors
          if (x != 0 && y != 0) {
            // Up and to the left
            this.map[y-1][x-1]++;
          }
          if (x != 0) {
            // Left
            this.map[y][x-1]++;
          }
          if (x != 0 && y != this.height - 1) {
            // Down and to the left
            this.map[y+1][x-1]++;
          }
          if (y != 0) {
            // Up
            this.map[y-1][x]++;
          }
          if (y != this.height - 1) {
            // Down
            this.map[y+1][x]++;
          }
          if (x != this.width - 1 && y != 0) {
            // Up and to the right
            this.map[y-1][x+1]++;
          }
          if (x != this.width - 1) {
            // Right
            this.map[y][x+1]++;
          }
          if (x != this.width - 1 && y != this.height - 1) {
            // Down and to the right
            this.map[y+1][x+1]++;
          }
        }
      }
      if (!hasNewFlash) {
        break;
      }
    }
    // Reset any which flashed
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (hasFlashed[y][x]) {
          this.map[y][x] = 0;
        }
      }
    }
    return hasFlashed.map(row => row.filter(val => val).length).reduce((prevVal, val) => prevVal + val);
  }
}

function part1(map: OctopusMap) {
  let totalFlashes = 0;
  for (let step = 0; step < 100; step++) {
    totalFlashes += map.step();
  }
  console.log(`Part1: ${totalFlashes}`);
}

function part2(map: OctopusMap) {
  let step = 1;
  while (map.step() != map.size()) {
    step++;
  }
  console.log(`Part2: ${step}`);
}

readFileLines("input/day11.txt", (lines: string[]) => {
  let map1 = new OctopusMap(lines.map(line => line.split('').map(Number)));
  let map2 = new OctopusMap(lines.map(line => line.split('').map(Number)));
  part1(map1);
  part2(map2);
});
