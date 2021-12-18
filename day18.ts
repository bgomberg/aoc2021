#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';
const util = require('util')

class Node {
  public left: Node | null = null;
  public right: Node | null = null;
  public value: number = -Infinity;
  constructor(public parent: Node | null) {}

  public addChild(node: Node): Node {
    if (this.value != -Infinity) {
      throw new Error();
    }
    if (!this.left) {
      this.left = node;
    } else if (!this.right) {
      this.right = node;
    } else {
      throw new Error();
    }
    return node;
  }

  public setValue(value: number) {
    if (this.value != -Infinity || this.left || this.right) {
      throw new Error();
    }
    this.value = value;
  }

  get depth(): number {
    let result = 0;
    let node = this.parent;
    while (node && node.parent) {
      result++;
      node = node.parent;
    }
    return result;
  }

  public toSnailNumber(): string {
    if (this.value != -Infinity) {
      return '' + this.value;
    } else {
      return '[' + this.left!.toSnailNumber() + ',' + this.right!.toSnailNumber() + ']';
    }
  }

  get magnitude(): number {
    if (this.value != -Infinity) {
      return this.value;
    } else {
      return this.left!.magnitude * 3 + this.right!.magnitude * 2;
    }
  }
}

function getTree(snailNumber: string): Node {
  let node = new Node(null);
  let root = node;
  for (let c of snailNumber) {
    if (c == "[") {
      node = node.addChild(new Node(node));
    } else if (c == "]") {
      node = node.parent!;
    } else if (c == ",") {
      node = node.addChild(new Node(node));
    } else {
      node.setValue(Number(c));
      node = node.parent!;
    }
  }
  return root;
}

function getValueNodes(root: Node): Node[] {
  let result = [];
  let stack = [root];
  while (stack.length > 0) {
    let node = stack.pop()!
    while (node.left) {
      stack.push(node.right!);
      node = node.left;
    }
    result.push(node);
  }
  return result;
}

function reduceSnailNumber(snailNumber: string): string {
  let root = getTree(snailNumber);
  while (true) {
    let valueNodes = getValueNodes(root);
    let explodeIndex = valueNodes.findIndex(node => node.depth >= 4);
    let splitIndex = valueNodes.findIndex(node => node.value >= 10);
    if (explodeIndex != -1) {
      // Explode
      let node = valueNodes[explodeIndex];
      let pair = node.parent!;
      let leftValue = pair.left!.value;
      let rightValue = pair.right!.value;
      if (leftValue == -Infinity || rightValue == -Infinity) {
        throw new Error();
      }
      if (explodeIndex > 0) {
        valueNodes[explodeIndex-1].value += leftValue;
      }
      if (explodeIndex < valueNodes.length - 2) {
        valueNodes[explodeIndex+2].value += rightValue;
      }
      pair.left = null;
      pair.right = null;
      pair.value = 0;
    } else if (splitIndex != -1) {
      // Split
      let node = valueNodes[splitIndex];
      let value = node.value;
      node.value = -Infinity;
      let leftNode = node.addChild(new Node(node));
      leftNode.value = Math.floor(value / 2);
      let rightNode = node.addChild(new Node(node));
      rightNode.value = Math.ceil(value / 2);
    } else {
      break;
    }
  }
  return root.toSnailNumber();
}

function part1(snailNumbers: string[]) {
  let result = snailNumbers[0];
  for (let i = 1; i < snailNumbers.length; i++) {
    result = reduceSnailNumber('[' + result + ',' + snailNumbers[i] + ']');
  }
  let magnitude = getTree(result).magnitude;
  console.log(`Part 1: ${magnitude}`);
}

function part2(snailNumbers: string[]) {
  let maxMagnitude = 0;
  for (let num1 of snailNumbers) {
    for (let num2 of snailNumbers) {
      if (num1 == num2) {
        continue;
      }
      let sum = reduceSnailNumber('[' + num1 + ',' + num2 + ']');
      maxMagnitude = Math.max(getTree(sum).magnitude, maxMagnitude);
    }
  }
  console.log(`Part 2: ${maxMagnitude}`);
}

readFileLines("input/day18.txt", (lines: string[]) => {
  part1(lines);
  part2(lines);
});
