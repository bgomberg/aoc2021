#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

// 0 is 6 segments
// 1 is 2 segments (unique)
// 2 is 5 segments
// 3 is 5 segments
// 4 is 4 segments (unique)
// 5 is 5 segments
// 6 is 6 segments
// 7 is 3 segments (unique)
// 8 is 7 segments (unique)
// 9 is 6 segments

class Entry {
  public input: string[];
  public output: string[];

  constructor([input, output]: [string[], string[]]) {
    this.input = input.map(val => val.split('').sort().join(''));
    this.output = output.map(val => val.split('').sort().join(''));
  }
}

function difference(a: string, b: string): string {
  return a.split('').filter(val => !b.includes(val)).join('');
}

function uniqueDifference(a: string, b: string): string {
  let diff = difference(a, b);
  if (diff.length != 1) {
    throw new Error("Difference does not have a single element");
  }
  return diff[0];
}

function add(a: string, b: string): string {
  return a.split('').concat(b.split('').filter(val => !a.includes(val))).join('');
}

function intersection(a: string, b: string): string {
  return a.split('').filter(val => b.includes(val)).join('');
}

function part1(entries: Entry[]) {
  let outputValues = entries.map(entry => entry.output).flat();
  let result = outputValues.filter(val => [2, 3, 4, 7].includes(val.length)).length;
  console.log(`Part1: ${result}`);
}

function part2(entries: Entry[]) {
  const ALL_SEGMENTS = 'abcdefg'.split('');
  let result = 0;
  for (let entry of entries) {
    let digit1 = entry.input.find(val => val.length == 2)!;
    let digit4 = entry.input.find(val => val.length == 4)!;
    let digit7 = entry.input.find(val => val.length == 3)!;
    let digit8 = entry.input.find(val => val.length == 7)!;
    // Segment A is in 7 but not 1
    let segmentA = uniqueDifference(digit7, digit1);
    // 3 is the only number containing the segments of 7 (and 1) with 5 segments total
    let digit3 = entry.input.filter(val => val.length == 5).find(val => digit7.split('').every(digit7Segment => val.includes(digit7Segment)))!;
    // Segment D is in 3 and 4, but not 1
    let segmentD = uniqueDifference(intersection(digit3, digit4), digit1);
    // Segment B is in 4 but not 3
    let segmentB = uniqueDifference(digit4, digit3);
    // Segment G is in 3 but not 7 and not 4
    let segmentG = uniqueDifference(digit3, add(digit7, digit4));
    // 9 is the only number with 6 segments total which contains all segments in a 3
    let digit9 = entry.input.find(val => val.length == 6 && difference(digit3, val).length == 0)!;
    // Segment E is the only segment not found in 9
    let segmentE = ALL_SEGMENTS.find(segment => !digit9.includes(segment));
    // 6 is the only number with 6 segments total which does not contain all the segments in a 1
    let digit6 = entry.input.find(val => val.length == 6 && difference(digit1, val).length != 0)!;
    // Segment C is the only segment not found in 6
    let segmentC = ALL_SEGMENTS.find(segment => !digit6.includes(segment))!;
    // Segment F is the remaining segment
    let segmentF = ALL_SEGMENTS.find(segment => ![segmentA, segmentB, segmentC, segmentD, segmentE, segmentG].includes(segment))!;
    // 0 is the only number with 6 segments which does not contain segment D
    let digit0 = entry.input.find(val => val.length == 6 && !val.includes(segmentD))!;
    // 5 is the only number with 5 segments which does not contain segment C
    let digit5 = entry.input.find(val => val.length == 5 && !val.includes(segmentC))!;
    // 2 is the only number with 5 segments which does not contain segment F
    let digit2 = entry.input.find(val => val.length == 5 && !val.includes(segmentF))!;

    const lookup = Object.assign({}, ...[digit0, digit1, digit2, digit3, digit4, digit5, digit6, digit7, digit8, digit9].map((val, index, _) => ({[[...val].sort().join('')]: index})));
    let entryOutput = 0;
    for (let val of entry.output) {
      entryOutput *= 10;
      entryOutput += lookup[[...val].sort().join('') as string];
    }
    result += entryOutput;
  }
  console.log(`Part2: ${result}`);
}

readFileLines("input/day8.txt", (lines: string[]) => {
  let entries = lines.map(line => line.split('|').map(part => part.trim().split(' ')) as [string[], string[]]).map(line => new Entry(line));
  part1(entries);
  part2(entries);
});
