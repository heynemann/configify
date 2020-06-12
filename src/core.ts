import { Retriever, Builder } from './interface'

export class Result {
  public constructor(public paths: string[]) {}
}

export class Configify {
  public constructor(
    private logger: (msg: string) => void,
    private retriever: Retriever,
    private builder: Builder
  ) {}

  async run(path: string): Promise<Result> {
    const paths = await this.retriever.retrievePaths(path)
    await this.builder.build(paths)
    return new Result(paths)
  }
}
