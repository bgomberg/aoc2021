#!/usr/bin/env ./node_modules/.bin/ts-node-script

import { readFileLines } from './lib/FileReader';

function bitsToBigint(bits: number[]): bigint {
  return BigInt('0b' + bits.join(''));
}

class PacketHeader {
  public version: bigint;
  public type: bigint;

  constructor(bits: number[]) {
    this.version = bitsToBigint(bits.splice(0, 3));
    this.type = bitsToBigint(bits.splice(0, 3));
  }

  public parsePacket(bits: number[]): LiteralPacket | OperatorPacket {
    if (this.type == 4n) {
        return new LiteralPacket(this, bits);
    } else {
        return new OperatorPacket(this, bits);
    }
  }
}

class LiteralPacket {
  public value: bigint;

  constructor(public header: PacketHeader, bits: number[]) {
    let isEnd = false;
    let valueBits: number[] = [];
    while (!isEnd) {
      isEnd = bits.splice(0, 1)[0] == 0;
      valueBits = valueBits.concat(bits.splice(0, 4));
    }
    this.value = bitsToBigint(valueBits);
  }

  get versionSum(): bigint {
    return this.header.version;
  }
}

enum OperatorType {
  SUM = 0,
  PRODUCT = 1,
  MINIMUM = 2,
  MAXIMUM = 3,
  GREATER_THAN = 5,
  LESS_THAN = 6,
  EQUALS = 7,
}

class OperatorPacket {
  public type: OperatorType;
  public subPackets: (OperatorPacket | LiteralPacket)[] = [];

  constructor(public header: PacketHeader, bits: number[]) {
    this.type = Number(header.type) as OperatorType;
    switch (bits.shift()) {
      case 0:
        let subPacketBits = bits.splice(0, Number(bitsToBigint(bits.splice(0, 15))));
        while (subPacketBits.length > 0) {
          let header = new PacketHeader(subPacketBits);
          this.subPackets.push(header.parsePacket(subPacketBits));
        }
        break;
      case 1:
        let numSubPackets = Number(bitsToBigint(bits.splice(0, 11)));
        for (let i = 0; i < numSubPackets; i++) {
          let header = new PacketHeader(bits);
          this.subPackets.push(header.parsePacket(bits));
        }
        break;
      default:
        throw new Error();
    }
  }

  get versionSum(): bigint {
    return this.header.version + this.subPackets.map(packet => packet.versionSum).reduce((prevVal, val) => prevVal + val);
  }

  get value(): bigint {
    let values = this.subPackets.map(packet => packet.value);
    switch (this.type) {
      case OperatorType.SUM:
        return values.reduce((prevVal, val) => prevVal + val);
      case OperatorType.PRODUCT:
        return values.reduce((prevVal, val) => prevVal * val);
      case OperatorType.MINIMUM:
        return values.reduce((prevVal, val) => prevVal < val ? prevVal : val);
      case OperatorType.MAXIMUM:
        return values.reduce((prevVal, val) => prevVal > val ? prevVal : val);
      case OperatorType.GREATER_THAN:
        return values[0] > values[1] ? 1n : 0n;
      case OperatorType.LESS_THAN:
        return values[0] < values[1] ? 1n : 0n;
      case OperatorType.EQUALS:
        return values[0] == values[1] ? 1n : 0n;
    }
  }
}

function part1(packet: LiteralPacket | OperatorPacket) {
  console.log(`Part 1: ${packet.versionSum}`);
}

function part2(packet: LiteralPacket | OperatorPacket) {
  console.log(`Part 2: ${packet.value}`);
}

readFileLines("input/day16.txt", (lines: string[]) => {
  let bits = lines[0].split('').flatMap(c => parseInt(c, 16).toString(2).padStart(4, '0').split('').map(Number));
  let packet = new PacketHeader(bits).parsePacket(bits);
  part1(packet);
  part2(packet);
});
