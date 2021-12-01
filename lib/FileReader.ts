import * as fs from 'fs';
import * as rd from 'readline'

export function readFileLines(path: string, handler: (lines: string[]) => void) {
  var result: string[] = [];
  rd.createInterface(fs.createReadStream("input/day1.txt"))
    .on("line", (line: string) => {
      result.push(line);
    })
    .on("close", () => {
      handler(result)
    });
}
