#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

const IMAGE_PADDING = 60;

class Point {
  constructor(public x: number, public y: number) {}
}

class Image {
  private fillChar = '.';
  constructor(private data: string[], public algorithm: string) {}

  public getNext(point: Point): string {
    let index = 0;
    for (let y = point.y - 1; y <= point.y + 1; y++) {
      for (let x = point.x - 1; x <= point.x + 1; x++) {
        let c: string;
        if (x < 0 || x >= this.data[0].length || y < 0 || y >= this.data.length) {
          c = this.fillChar;
        } else {
          c = this.data[y].charAt(x);
        }
        index <<= 1;
        index += c == '#' ? 1 : 0;
      }
    }
    return this.algorithm.charAt(index);
  }

  public enhance() {
    let newData: string[] = [];
    for (let y = 0; y < this.data.length; y++) {
      let line = '';
      for (let x = 0; x < this.data[0].length; x++) {
        line += this.getNext(new Point(x, y));
      }
      newData.push(line);
    }
    this.fillChar = this.fillChar == '#' ? this.algorithm[511] : this.algorithm[0];
    this.data = newData;
  }

  public print() {
    for (let line of this.data) {
      console.log(line);
    }
  }

  public getNumPixels(): number {
    return this.data.map(line => line.split('').filter(c => c == '#').length).reduce((prevVal, val) => prevVal + val);
  }
}

function part1(image: Image) {
  for (let i = 0; i < 2; i++) {
    image.enhance();
  }
  const result = image.getNumPixels();
  console.log(`Part 1: ${result}`);
}

function part2(image: Image) {
  for (let i = 0; i < 50; i++) {
    image.enhance();
  }
  const result = image.getNumPixels();
  console.log(`Part 2: ${result}`);
}

readFileLines("input/day20.txt", (lines: string[]) => {
  let imageLines = lines.slice(2).map(line => '.'.repeat(IMAGE_PADDING) + line + '.'.repeat(IMAGE_PADDING));
  let paddingLines = Array(IMAGE_PADDING).fill('.'.repeat(imageLines[0].length)) as string[];
  part1(new Image(paddingLines.concat(imageLines).concat(paddingLines), lines[0]));
  part2(new Image(paddingLines.concat(imageLines).concat(paddingLines), lines[0]));
});
