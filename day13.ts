#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

class Fold {
  public direction: string;
  public value: number;
  constructor(line: string) {
    let part = line.split(' ')[2].split('=');
    this.direction = part[0];
    this.value = Number(part[1]);
  }
}

function doFold(dots: Set<string>, fold: Fold): Set<string> {
  return new Set([...dots].map(dot => {
    let [x, y] = dot.split(',').map(Number) as [number, number];
    if (fold.direction == 'x') {
      let distance = Math.abs(x - fold.value);
      if (x > fold.value) {
        x = fold.value - distance;
      }
    } else if (fold.direction == 'y') {
      let distance = Math.abs(y - fold.value);
      if (y > fold.value) {
        y = fold.value - distance;
      }
    } else {
      throw new Error();
    }
    return `${x},${y}`;
  }));
}

function part1(dots: Set<string>, fold: Fold) {
  let newDots = doFold(dots, fold);
  console.log(`Part1: ${newDots.size}`);
}

function part2(dots: Set<string>, folds: Fold[]) {
  for (let fold of folds) {
    dots = doFold(dots, fold);
  }
  const maxX = Math.max(...[...dots].map(dot => Number(dot.split(',')[0])));
  const maxY = Math.max(...[...dots].map(dot => Number(dot.split(',')[1])));
  console.log(`Part2:`);
  for (let y = 0; y <= maxY; y++) {
    let row = '  ';
    for (let x = 0; x <= maxX; x++) {
      row += dots.has(`${x},${y}`) ? '#' : '.';
    }
    console.log(row);
  }
}

readFileLines("input/day13.txt", (lines: string[]) => {
  let dots = new Set(lines.filter(line => line.includes(',')));
  let folds = lines.filter(line => line.includes('=')).map(line => new Fold(line));
  part1(dots, folds[0]);
  part2(dots, folds);
});
