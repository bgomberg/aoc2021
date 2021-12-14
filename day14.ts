#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function applySteps(polymer: string, rules: Map<string, string>, numSteps: number): string {
  for (let step = 1; step <= numSteps; step++) {
    let newPolymer = '';
    for (let i = 0; i < polymer.length - 1; i++) {
      let pair = polymer.slice(i, i + 2);
      newPolymer += pair[0] + rules.get(pair)!;
    }
    newPolymer += polymer[polymer.length - 1];
    polymer = newPolymer;
  }
  return polymer;
}

function getCounts(polymer: string): Map<string, number> {
  let counts = new Map<string, number>();
  for (let c of polymer) {
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return counts;
}

function part1(polymer: string, rules: Map<string,string>) {
  polymer = applySteps(polymer, rules, 10);
  let counts = getCounts(polymer);
  let minCount = Math.min(...counts.values());
  let maxCount = Math.max(...counts.values());
  console.log(`Part1: ${maxCount - minCount}`);
}

function part2(polymer: string, rules: Map<string,string>) {
  // Calculate the counts resulting from each pair after 20 steps
  let pairCounts = new Map<string, Map<string, number>>();
  for (let pair of rules.keys()) {
    let tempCounts = getCounts(applySteps(pair, rules, 20));
    tempCounts.set(pair[1], tempCounts.get(pair[1])! - 1);
    pairCounts.set(pair, tempCounts);
  }
  // Apply 20 steps to the polymer
  polymer = applySteps(polymer, rules, 20);
  // Add up the counts after 20 more steps of each pair in the polymer
  let counts = new Map<string, number>();
  for (let i = 0; i < polymer.length - 1; i++) {
    let pair = polymer.slice(i, i + 2);
    for (let [c, count] of pairCounts.get(pair)!) {
      counts.set(c, (counts.get(c) ?? 0) + count);
    }
  }
  // Need to add 1 to the count of the last character
  let lastChar = polymer[polymer.length - 1]
  counts.set(lastChar, counts.get(lastChar)! + 1);
  let minCount = Math.min(...counts.values());
  let maxCount = Math.max(...counts.values());
  console.log(`Part2: ${maxCount - minCount}`);
}

readFileLines("input/day14.txt", (lines: string[]) => {
  let polymer = lines[0];
  let rules = new Map(lines.slice(2).map(rule => rule.split(' -> ') as [string, string]));
  part1(polymer, rules);
  part2(polymer, rules);
});
