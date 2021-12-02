#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

enum Direction {
  UP = "up",
  DOWN = "down",
  FORWARD = "forward"
};

class Command {
  direction: Direction;
  amount: number;

  constructor(line: string) {
    let [direction_str, amount_str] = line.split(" ");
    this.direction = direction_str as Direction;
    this.amount = parseInt(amount_str);
  }
}

function part1(commands: Command[]) {
  let x = 0;
  let z = 0;
  for (let cmd of commands) {
    switch (cmd.direction) {
      case Direction.UP:
        z -= cmd.amount;
        break;
      case Direction.DOWN:
        z += cmd.amount;
        break;
      case Direction.FORWARD:
        x += cmd.amount;
        break;
    }
  }
  console.log(`Part1: ${x * z}`);
}

function part2(commands: Command[]) {
  let x = 0;
  let z = 0;
  let aim = 0;
  for (let cmd of commands) {
    switch (cmd.direction) {
      case Direction.UP:
        aim -= cmd.amount;
        break;
      case Direction.DOWN:
        aim += cmd.amount;
        break;
      case Direction.FORWARD:
        x += cmd.amount;
        z += aim * cmd.amount;
        break;
    }
  }
  console.log(`Part2: ${x * z}`);
}

readFileLines("input/day2.txt", (lines: string[]) => {
  const commands = lines.map((line) => new Command(line));
  part1(commands);
  part2(commands);
});
