#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

class Point {
  public x: number;
  public y: number;

  constructor([x, y]: [number, number]) {
    this.x = x;
    this.y = y
  }
}

class Line {
  constructor(public p1: Point, public p2: Point) {}

  public isHorizontal(): boolean {
    return this.p1.y == this.p2.y;
  }

  public isVertical(): boolean {
    return this.p1.x == this.p2.x;
  }

  public isHorizontalOrVertical(): boolean {
    return this.p1.x == this.p2.x || this.p1.y == this.p2.y;
  }

  public getMaxX(): number {
    return Math.max(this.p1.x, this.p2.x);
  }

  public getMaxY(): number {
    return Math.max(this.p1.y, this.p2.y);
  }
}

function part1(lines: Line[]) {
  lines = lines.filter(line => line.isHorizontal() || line.isVertical());
  let numCols = Math.max(...lines.map(line => line.getMaxX())) + 1;
  let numRows = Math.max(...lines.map(line => line.getMaxY())) + 1;
  let map: number[][] = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    map[i] = new Array(numCols).fill(0);
  }
  for (let line of lines) {
    if (line.isHorizontal()) {
      for (let x = Math.min(line.p1.x, line.p2.x); x <= Math.max(line.p1.x, line.p2.x); x++) {
        map[line.p1.y][x] += 1;
      }
    } else if (line.isVertical()) {
      for (let y = Math.min(line.p1.y, line.p2.y); y <= Math.max(line.p1.y, line.p2.y); y++) {
        map[y][line.p1.x] += 1;
      }
    } else {
      throw new Error("Unexpected line");
    }
  }
  let numOverlap = map.map(row => row.filter(val => val >= 2).length).reduce((prev, val) => prev + val);
  console.log(`Part1: ${numOverlap}`);
}

function part2(lines: Line[]) {
  let numCols = Math.max(...lines.map(line => line.getMaxX())) + 1;
  let numRows = Math.max(...lines.map(line => line.getMaxY())) + 1;
  let map: number[][] = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    map[i] = new Array(numCols).fill(0);
  }
  for (let line of lines) {
    if (line.isHorizontal()) {
      for (let x = Math.min(line.p1.x, line.p2.x); x <= Math.max(line.p1.x, line.p2.x); x++) {
        map[line.p1.y][x] += 1;
      }
    } else if (line.isVertical()) {
      for (let y = Math.min(line.p1.y, line.p2.y); y <= Math.max(line.p1.y, line.p2.y); y++) {
        map[y][line.p1.x] += 1;
      }
    } else {
      // Go in the direction of increasing X
      let [startPoint, endPoint] = line.p1.x < line.p2.x ? [line.p1, line.p2] : [line.p2, line.p1];
      for (let i = 0; i <= endPoint.x - startPoint.x; i++) {
        if (startPoint.y < endPoint.y) {
          // Increasing X, increasing Y
          map[startPoint.y + i][startPoint.x + i] += 1;
        } else {
          // Increasing X, decreasing Y
            map[startPoint.y - i][startPoint.x + i] += 1;
        }
      }
    }
  }
  let numOverlap = map.map(row => row.filter(val => val >= 2).length).reduce((prev, val) => prev + val);
  console.log(`Part2: ${numOverlap}`);
}

readFileLines("input/day5.txt", (lines: string[]) => {
  let lineObjs = lines.map(line => line.split(" -> ")
      .map(point => point.split(",").map(Number) as [number, number]))
    .map(line => new Line(new Point(line[0]), new Point(line[1])));
  part1(lineObjs);
  part2(lineObjs);
});
