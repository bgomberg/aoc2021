#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function part1(positions: number[]) {
  let minFuel = Infinity;
  for (let i = 0; i < Math.max(...positions); i++) {
    let fuel = positions.map(val => Math.abs(val - i)).reduce((prevVal, val) => prevVal + val);
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }
  console.log(`Part1: ${minFuel}`);
}

function part2(positions: number[]) {
  let minFuel = Infinity;
  for (let i = 0; i < Math.max(...positions); i++) {
    let fuel = positions.map(val => {
        let diff = Math.abs(val - i);
        return diff * (diff + 1) / 2;
      })
      .reduce((prevVal, val) => prevVal + val);
    if (fuel < minFuel) {
      minFuel = fuel;
    }
  }
  console.log(`Part2: ${minFuel}`);
}

readFileLines("input/day7.txt", (lines: string[]) => {
  let positions = lines[0].split(',').map(Number);
  part1(positions);
  part2(positions);
});
