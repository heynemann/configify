import { FullRetriever } from './retrievers/full'

export class Result {
  public constructor(public paths: string[]) {}
}

export class Configify {
  public constructor(private logger: (msg: string) => void) {}

  async run(path: string, force: boolean): Promise<Result> {
    if (!force) {
      return new Result([])
    }
    const retriever = new FullRetriever(this.logger)
    const paths = await retriever.retrievePaths(path)

    return new Result(paths)
  }
}
