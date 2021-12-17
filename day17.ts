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
  public startingVelocity: number[];
  public x = 0;
  public y = 0;
  public maxY = -Infinity;
  public status: ProbeStatus = ProbeStatus.UNKNOWN;
  constructor(private target: Target, private velocityX: number, private velocityY: number) {
    this.startingVelocity = [velocityX, velocityY];
  }

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

function part1(target: Target) {
  let bestProbe = undefined;
  for (let x = 0; x < target.x2; x++) {
    for (let y = 0; y < 1000; y++) {
      let probe = new Probe(target, x, y);
      while (!probe.step());
      if (probe.status == ProbeStatus.IN_TARGET) {
        if (!bestProbe || bestProbe.maxY < probe.maxY) {
          bestProbe = probe;
        }
      }
    }
  }
  console.log(`Part 1: ${bestProbe!.maxY}`);
}

function part2(target: Target) {
  let numHit = 0;
  for (let x = 0; x <= target.x2; x++) {
    for (let y = target.y1; y < 10000; y++) {
      let probe = new Probe(target, x, y);
      while (!probe.step());
      if (probe.status == ProbeStatus.IN_TARGET) {
        numHit++;
      }
    }
  }
  console.log(`Part 2: ${numHit}`);
}

readFileLines("input/day17.txt", (lines: string[]) => {
  let matches = [...lines[0].match(/target area: x=(\-?[0-9]+)..(\-?[0-9]+), y=(\-?[0-9]+)..(\-?[0-9]+)/)!];
  matches.shift();
  let [x1, x2, y1, y2] = matches.map(Number);
  let target = new Target(x1, x2, y1, y2);
  part1(target);
  part2(target);
});
