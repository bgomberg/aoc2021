#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';
import { Hashable, HashMap, HashSet } from './lib/Collections';

class Point implements Hashable {
  public hashValue: string;

  constructor(public x: number, public y: number) {
    this.hashValue = x + ',' + y;
  }
}

class Matrix {
  private width: number;
  private height: number;

  constructor(private map: number[][]) {
    this.width = this.map[0].length;
    this.height = this.map.length;
  }

  public getAllPoints(): Point[] {
    let points = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        points.push(new Point(x, y));
      }
    }
    return points;
  }

  public getValue(point: Point): number | null {
    if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
      return null;
    }
    if (point.x == 0 && point.y == 0) {
      return 0;
    }
    return this.map[point.y][point.x];
  }

  public getEndPoint(): Point {
    return new Point(this.width - 1, this.height - 1);
  }

  public getNeighbors(point: Point): Point[] {
    let result = [];
    if (point.x > 0) {
      result.push(new Point(point.x - 1, point.y));
    }
    if (point.y > 0) {
      result.push(new Point(point.x, point.y - 1));
    }
    if (point.x < this.width - 1) {
      result.push(new Point(point.x + 1, point.y));
    }
    if (point.y < this.height - 1) {
      result.push(new Point(point.x, point.y + 1));
    }
    return result;
  }

  public getExtendedBy5(): Matrix {
    let newMap = new Array(this.height * 5);
    for (let y = 0; y < this.height * 5; y++) {
      newMap[y] = new Array(this.width * 5);
      for (let x = 0; x < this.width * 5; x++) {
        newMap[y][x] = this.map[y % this.height][x % this.width] + Math.floor(y / this.height) + Math.floor(x / this.width);
        if (newMap[y][x] > 9) {
          newMap[y][x] -= 9;
        }
      }
    }
    return new Matrix(newMap);
  }
}

class PointSet {
  private points: HashSet<Point>;
  constructor(points: Point[]) {
    this.points = new HashSet(points);
  }

  public iter(): IterableIterator<Point> {
    return this.points.iter();
  }

  get size(): number {
    return this.points.size;
  }

  public popLowest(lookup: HashMap<Point, number>): Point {
    let lowestValue = Infinity;
    let lowestPoint = undefined;
    for (let point of this.iter()) {
      const value = lookup.get(point);
      if (value < lowestValue || lowestPoint === undefined) {
        lowestValue = value;
        lowestPoint = point;
      }
    }
    this.points.delete(lowestPoint!);
    return lowestPoint!;
  }

  public has(point: Point): boolean {
    return this.points.has(point);
  }
}

function dijkstra(matrix: Matrix): {dist: HashMap<Point,number>, prev: HashMap<Point,Point>} {
  let points = new PointSet(matrix.getAllPoints());
  let dist = new HashMap<Point, number>();
  for (let point of points.iter()) {
    dist.set(point, Infinity);
  }
  let prev = new HashMap<Point, Point>();
  dist.set(new Point(0, 0), 0);

  const endPointHash = matrix.getEndPoint().hashValue;
  while (points.size > 0) {
    let u = points.popLowest(dist);
    if (u.hashValue == endPointHash) {
      break;
    }

    for (let v of matrix.getNeighbors(u).filter(p => points.has(p))) {
      let alt = dist.get(u) + matrix.getValue(v)!;
      if (alt < dist.get(v)) {
        dist.set(v, alt);
        prev.set(v, u);
      }
    }
  }
  return {dist, prev};
}

function part1(matrix: Matrix) {
  let {dist} = dijkstra(matrix);
  let result = dist.get(matrix.getEndPoint());
  console.log(`Part1: ${result}`);
}

function part2(matrix: Matrix) {
  let {dist} = dijkstra(matrix);
  let result = dist.get(matrix.getEndPoint());
  console.log(`Part2: ${result}`);
}

readFileLines("input/day15.txt", (lines: string[]) => {
  let data = lines.map(line => line.split('').map(Number));
  let matrix = new Matrix(data);
  part1(matrix);
  part2(matrix.getExtendedBy5());
});
