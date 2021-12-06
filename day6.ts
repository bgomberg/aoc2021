#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function part1(fish: number[]) {
  for (let day = 0; day < 80; day++) {
    let numNew = fish.filter(state => state == 0).length;
    fish = fish.map(state => state == 0 ? 6 : state - 1);
    fish = fish.concat(new Array(numNew).fill(8));
  }
  console.log(`Part1: ${fish.length}`);
}

function part2(fish: number[]) {
  // Generate an ending population after 128 days for each starting state of a single fish
  let populations: number[][] = [];
  for (let startState = 0; startState <= 8; startState++) {
    let population = [startState];
    for (let day = 0; day < 128; day++) {
      let numNew = population.filter(state => state == 0).length;
      population = population.map(state => state == 0 ? 6 : state - 1);
      population = population.concat(new Array(numNew).fill(8));
    }
    populations[startState] = population;
  }
  // Calculate the population of a single fish in each possible starting state after 256 days
  let after256Days: number[] = [];
  for (let startState = 0; startState <= 8; startState++) {
    after256Days[startState] = populations[startState].map(val => populations[val].length).reduce((prevVal, val) => prevVal + val);
  }
  // Sum up the ending populations for each initial state in the input
  let total = fish.map(state => after256Days[state]).reduce((prevVal, val) => prevVal + val);
  console.log(`Part2: ${total}`);
}

readFileLines("input/day6.txt", (lines: string[]) => {
  let fish = lines[0].split(',').map(Number);
  part1(fish);
  part2(fish);
});
