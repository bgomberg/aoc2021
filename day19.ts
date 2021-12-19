#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { Hashable, HashSet } from './lib/Collections';
import { readFileLines } from './lib/FileReader';

type IndexPair = [number, number];

// This gives us 42 total, not all of which are valid, but it doesn't seem to matter
enum AxisOrder {
  XYZ,
  YXZ,
  ZXY,
  ZYX,
  XZY,
  YZX,
  NUM_AXIS_ORDERS,
}

enum AxisInversion {
  PPP,
  PPN,
  PNP,
  PNN,
  NPP,
  NPN,
  NNP,
  NNN,
  NUM_AXIS_INVERSIONS,
}

class Point implements Hashable {
  public hashValue: string;
  constructor(public x: number, public y: number, public z: number) {
    this.hashValue = `${x},${y},${z}`;
  }

  public getDistance(p: Point): string {
    return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2 + (this.z - p.z) ** 2).toFixed(3);
  }

  public getOffset(p: Point, relP: Point): Point {
    return new Point(this.x - p.x + relP.x, this.y - p.y + relP.y, this.z - p.z + relP.z);
  }

  public add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y, this.z + p.z);
  }

  public equals(p: Point): boolean {
    return this.x == p.x && this.y == p.y && this.z == p.z;
  }

  public reorient(order: AxisOrder, inversion: AxisInversion): Point {
    let [x, y, z] = [this.x, this.y, this.z];
    switch (order) {
      case AxisOrder.XYZ:
        break;
      case AxisOrder.YXZ:
        [x, y, z] = [y, x, z];
        break;
      case AxisOrder.ZXY:
        [x, y, z] = [z, x, y];
        break;
      case AxisOrder.ZYX:
        [x, y, z] = [z, y, x];
        break;
      case AxisOrder.XZY:
        [x, y, z] = [x, z, y];
        break;
      case AxisOrder.YZX:
        [x, y, z] = [y, z, x];
        break;
    }
    switch (inversion) {
      case AxisInversion.PPP:
        [x, y, z] = [x, y, z];
        break;
      case AxisInversion.PPN:
        [x, y, z] = [x, y, -z];
        break;
      case AxisInversion.PNP:
        [x, y, z] = [x, -y, z];
        break;
      case AxisInversion.PNN:
        [x, y, z] = [x, -y, -z];
        break;
      case AxisInversion.NPP:
        [x, y, z] = [-x, y, z];
        break;
      case AxisInversion.NPN:
        [x, y, z] = [-x, y, -z];
        break;
      case AxisInversion.NNP:
        [x, y, z] = [-x, -y, z];
        break;
      case AxisInversion.NNN:
        [x, y, z] = [-x, -y, -z];
        break;
    }
    return new Point(x, y, z);
  }

  public getManhattanDistance(p: Point): number {
    return Math.abs(p.x - this.x) + Math.abs(p.y - this.y) + Math.abs(p.z - this.z);
  }
}

class Scanner {
  private originalPoints: Point[];
  public distances: Map<string, IndexPair>;
  public axisOrder: AxisOrder = AxisOrder.XYZ;
  public axisInversion: AxisInversion = AxisInversion.PPP;
  public relativePosition: Point | null;

  constructor(public num: number, public points: Point[]) {
    this.originalPoints = points.map(p => new Point(p.x, p.y, p.z));
    this.distances = new Map<string, IndexPair>();
    this.relativePosition = num == 0 ? new Point(0, 0, 0) : null;
    for (let i = 0; i < points.length - 1; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].getDistance(points[j]);
        this.distances.set(dist, [i, j]);
      }
    }
  }

  public reorient() {
    this.axisInversion += 1;
    if (this.axisInversion == AxisInversion.NUM_AXIS_INVERSIONS) {
      this.axisOrder += 1;
      if (this.axisOrder == AxisOrder.NUM_AXIS_ORDERS) {
        throw new Error();
      }
      this.axisInversion = 0;
    }
    this.points = this.originalPoints.map(p => p.reorient(this.axisOrder, this.axisInversion));
  }
}

function findAllScanners(scanners: Scanner[]) {
  while (scanners.filter(s => s.relativePosition == null).length > 0) {
    for (const s1 of scanners.filter(s => s.relativePosition != null)) {
      for (const s2 of scanners.filter(s => s.relativePosition == null)) {
        let matches: [IndexPair, IndexPair][] = [];
        for (const dist of s1.distances.keys()) {
          if (s2.distances.has(dist)) {
            matches.push([s1.distances.get(dist)!, s2.distances.get(dist)!]);
          }
        }
        // console.log(matches.length);
        let numValidMappings = new Map<number, Map<number, number>>();
        for (let [srcIndexes, dstIndexes] of matches) {
          for (const srcIndex of srcIndexes) {
            let map = numValidMappings.get(srcIndex) || new Map<number, number>();
            for (const dstIndex of dstIndexes) {
              map.set(dstIndex, (map.get(dstIndex) || 0) + 1);
            }
            numValidMappings.set(srcIndex, map);
          }
        }
        if (numValidMappings.size < 12) {
          continue;
        }
        let expectedValidMappings = numValidMappings.size - 1;
        let mappings = new Map<number, number>();
        for (const srcIndex of numValidMappings.keys()) {
          for (const [dstIndex, count] of numValidMappings.get(srcIndex)!.entries()) {
            if (count > expectedValidMappings || (count == expectedValidMappings && mappings.has(srcIndex))) {
              throw new Error();
            } else if (count == expectedValidMappings) {
              mappings.set(srcIndex, dstIndex);
            }
          }
          if (!mappings.has(srcIndex)) {
            throw new Error();
          }
        }
        if (mappings.size < 12) {
          throw new Error();
        }
        // Calculate the difference in the set of points, ensuring that it's the same for all mappings
        // If it's not, it means we need to reorient the second scanner and try again
        let diff: Point | null = null;
        while (true) {
          for (const [srcIndex, dstIndex] of mappings.entries()) {
            let mappingDiff = s1.points[srcIndex].getOffset(s2.points[dstIndex], s1.relativePosition!);
            if (diff === null) {
              diff = mappingDiff;
            } else if (!diff.equals(mappingDiff)) {
              diff = null;
              break;
            }
          }
          if (diff !== null) {
            break;
          }
          // Reorient S2 and try again
          s2.reorient();
        }
        s2.relativePosition = diff;
      }
    }
  }
}

function part1(scanners: Scanner[]) {
  let beacons = new HashSet<Point>();
  for (const s of scanners) {
    for (const p of s.points) {
      beacons.add(p.add(s.relativePosition!));
    }
  }
  console.log(`Part 1: ${beacons.size}`);
}

function part2(scanners: Scanner[]) {
  let maxManhattanDistance = 0;
  for (const s1 of scanners) {
    for (const s2 of scanners) {
      if (s1 == s2) {
        continue;
      }
      maxManhattanDistance = Math.max(maxManhattanDistance, s1.relativePosition!.getManhattanDistance(s2.relativePosition!));
    }
  }
  console.log(`Part 2: ${maxManhattanDistance}`);
}

readFileLines("input/day19.txt", (lines: string[]) => {
  let scanners: Scanner[] = [];
  let pendingPoints: Point[] = [];
  let scannerNum = 0;
  for (let line of lines) {
    if (line.startsWith('---')) {
      if (pendingPoints.length > 0) {
        scanners.push(new Scanner(scannerNum, pendingPoints));
        scannerNum++;
        pendingPoints = [];
      }
    } else if (line) {
      pendingPoints.push(new Point(...line.split(',').map(Number) as [number, number, number]));
    }
  }
  if (pendingPoints.length > 0) {
    scanners.push(new Scanner(scannerNum, pendingPoints));
  }
  findAllScanners(scanners);
  part1(scanners);
  part2(scanners);
});
