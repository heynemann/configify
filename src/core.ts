import { FullRetriever } from "./retrievers/full";

export class Result {
  public constructor() {}
}

export class Configify {
  public constructor(private logger: (msg: string) => void) {}

  async run(path: string, force: boolean): Promise<Result | null> {
    const retriever = new FullRetriever(this.logger);
    const paths = await retriever.retrievePaths(path);
    this.logger(JSON.stringify(paths));

    return null;
  }
}
