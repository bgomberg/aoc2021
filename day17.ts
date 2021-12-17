#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

class Target {
  constructor(public x1: number, public x2: number, public y1: number, public y2: number) {}
}

enum ProbeStatus {
  UNKNOWN = "UNKNOWN",
  IN_TARGET = "IN_TARGET",
  PAST_TARGET = "PAST_TARGET",
}

class Probe {
  public x = 0;
  public y = 0;
  public maxY = -Infinity;
  public status: ProbeStatus = ProbeStatus.UNKNOWN;
  constructor(private target: Target, private velocityX: number, private velocityY: number) {}

  public step(): boolean {
    if (this.status != ProbeStatus.UNKNOWN) {
      throw new Error();
    }
    this.x += this.velocityX;
    this.y += this.velocityY;
    // Drag
    this.velocityX = Math.max(this.velocityX - 1, 0);
    // Gravity
    this.velocityY -= 1;
    this.maxY = Math.max(this.maxY, this.y);

    if (this.velocityX == 0 && (this.x < this.target.x1 || this.x > this.target.x2)) {
      this.status = ProbeStatus.PAST_TARGET;
      return true;
    } else if (this.y < this.target.y1) {
      this.status = ProbeStatus.PAST_TARGET;
      return true;
    } else if (this.x >= this.target.x1 && this.x <= this.target.x2 && this.y >= this.target.y1 && this.y <= this.target.y2) {
      this.status = ProbeStatus.IN_TARGET;
      return true;
    } else {
      this.status = ProbeStatus.UNKNOWN;
      return false;
    }
  }
}

function getValidProbes(target: Target): Probe[] {
  // Can find the max X position for a given starting velocity X with using n(n+1)/2
  // Solving this for the minimum starting velocity gives the following equation
  const minX = Math.floor((Math.sqrt(1 + 4 * target.x1) - 1) / 2);
  // The starting velocity can't be more than x2 since we'd jump right over it on the first step
  // otherwise
  const maxX = target.x2;
  // y1 and y2 are both negative, so the Y velocity can't be less than y1 or else we'd jump
  // right over the target on the first step
  const minY = target.y1;
  // y1 and y2 are both negative, and if the starting Y velocity is positive, it'll always go
  // through y=0 on the way down at the inverse of the starting speed, which puts an upper
  // bound on it based on what it can be to not jump over the target on the way down
  const maxY = -target.y1;
  let result = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      let probe = new Probe(target, x, y);
      while (!probe.step());
      if (probe.status == ProbeStatus.IN_TARGET) {
        result.push(probe);
      }
    }
  }
  return result;
}

function part1(probes: Probe[]) {
  let maxY = Math.max(...probes.map(probe => probe.maxY));
  console.log(`Part 1: ${maxY}`);
}

function part2(probes: Probe[]) {
  console.log(`Part 2: ${probes.length}`);
}

readFileLines("input/day17.txt", (lines: string[]) => {
  let matches = [...lines[0].match(/target area: x=(\-?[0-9]+)..(\-?[0-9]+), y=(\-?[0-9]+)..(\-?[0-9]+)/)!];
  matches.shift();
  let target = new Target(...(matches.map(Number) as [number, number, number, number]));
  let probes = getValidProbes(target);
  part1(probes);
  part2(probes);
});
