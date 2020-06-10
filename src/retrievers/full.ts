import { Retriever } from "./interface";
import { join } from "path";
import { promises } from "fs";

export class FullRetriever implements Retriever {
  public constructor(public logger: (msg: string) => void) {}

  async *walk(dir: string): AsyncGenerator<string> {
    for await (const d of await promises.opendir(dir)) {
      const entry = join(dir, d.name);
      if (d.isFile() && d.name === "config.ts") {
        yield entry;
      } else if (d.isDirectory()) {
        yield* await this.walk(entry);
      }
    }
  }

  async retrievePaths(rootPath: string): Promise<Array<string>> {
    let paths = [];
    for await (const p of this.walk(rootPath)) {
      paths.push(p);
    }
    return paths.sort((a: string, b: string): number => {
      const foldersInA = (a.match(/\//g) || []).length;
      const foldersInB = (b.match(/\//g) || []).length;
      if (foldersInA > foldersInB) {
        return 1;
      }
      if (foldersInB > foldersInA) {
        return -1;
      }
      return 0;
    });
  }
}