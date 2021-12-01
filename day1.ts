#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function part1(values: Number[]) {
  var count = 0;
  for (var i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) {
      count++;
    }
  }
  console.log(`Part1: ${count}`);
}

function part2(values: Number[]) {
  var count = 0;
  for (var i = 3; i < values.length; i++) {
    if (values[i] > values[i-3]) {
      count++;
    }
  }
  console.log(`Part2: ${count}`);
}

readFileLines("input/day1.txt", (lines: string[]) => {
  const values = lines.map(Number);
  part1(values);
  part2(values);
});
