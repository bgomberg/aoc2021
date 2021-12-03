#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function getTotals(values: number[][]): number[] {
  let totals: number[] = (new Array(values[0].length)).fill(0);
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      totals[j] += values[i][j];
    }
  }
  return totals;
}

function part1(values: number[][]) {
  let totals = getTotals(values);
  let gamma = 0, epsilon = 0;
  for (let i = 0; i < totals.length; i++) {
    if (totals[i] > values.length / 2) {
      gamma += 1 << (totals.length - i - 1);
    } else {
      epsilon += 1 << (totals.length - i - 1);
    }
  }
  console.log(`Part1: ${gamma * epsilon}`);
}

function part2(values: number[][]) {
  let oxygenValues = [...values];
  let co2Values = [...values];
  for (let pos = 0; pos < values[0].length; pos++) {
    if (oxygenValues.length > 1) {
      let totals = getTotals(oxygenValues);
      let filter = totals[pos] >= oxygenValues.length / 2 ? 1 : 0;
      oxygenValues = oxygenValues.filter((row) => row[pos] == filter);
    }
    if (co2Values.length > 1) {
      let totals = getTotals(co2Values);
      let filter = totals[pos] < co2Values.length / 2 ? 1 : 0;
      co2Values = co2Values.filter((row) => row[pos] == filter);
    }
  }
  let oxygenValue = 0;
  for (let i = 0; i < oxygenValues[0].length; i++) {
    oxygenValue |= oxygenValues[0][i] << (oxygenValues[0].length - i - 1);
  }
  let co2Value = 0;
  for (let i = 0; i < co2Values[0].length; i++) {
    co2Value |= co2Values[0][i] << (co2Values[0].length - i - 1);
  }
  console.log(`Part2: ${oxygenValue * co2Value}`);
}

readFileLines("input/day3.txt", (lines: string[]) => {
  const values = lines.map((line) => {
    return line.split('').map((c) => c == '1' ? 1 : 0);
  });
  part1(values);
  part2(values);
});
