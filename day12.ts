#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function part1(edges: Map<string, Set<string>>) {
  let allPaths: string[][] = [];
  let findPaths = (path: string[]) => {
    let currentCave = path[path.length - 1];
    if (currentCave == 'end') {
      allPaths.push(path);
      return;
    }
    for (let nextCave of edges.get(currentCave)!.values()) {
      if (nextCave.toLowerCase() == nextCave && path.includes(nextCave)) {
        continue;
      }
      findPaths([...path, nextCave]);
    }
  }
  findPaths(['start']);
  console.log(`Part1: ${allPaths.length}`);
}

function part2(edges: Map<string, Set<string>>) {
  let allPaths: string[][] = [];
  let findPaths = (path: string[], visitedSmallTwice: boolean) => {
    let currentCave = path[path.length - 1];
    if (currentCave == 'end') {
      allPaths.push(path);
      return;
    }
    for (let nextCave of edges.get(currentCave)!.values()) {
      if (nextCave.toLowerCase() == nextCave && path.includes(nextCave)) {
        if (!visitedSmallTwice) {
          findPaths([...path, nextCave], true);
        }
      } else {
        findPaths([...path, nextCave], visitedSmallTwice);
      }
    }
  }
  findPaths(['start'], false);
  console.log(`Part2: ${allPaths.length}`);
}

readFileLines("input/day12.txt", (lines: string[]) => {
  let edges = new Map<string, Set<string>>();
  for (let [a, b] of lines.map(line => line.split('-'))) {
    if (a != 'end' && b != 'start') {
      if (!edges.has(a)) {
        edges.set(a, new Set<string>());
      }
      edges.get(a)!.add(b);
    }
    if (b != 'end' && a != 'start') {
      if (!edges.has(b)) {
        edges.set(b, new Set<string>());
      }
      edges.get(b)!.add(a);
    }
  }
  part1(edges);
  part2(edges);
});
