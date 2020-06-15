import { Retriever, Builder, Environment, Storage } from './interface'
import { join, resolve } from 'path'

export class Result {
  public constructor(public paths: string[]) {}
}

export class Configify {
  public constructor(
    private logger: (msg: string) => void,
    private retriever: Retriever,
    private builder: Builder,
    private storageFactory: (settings: Record<string, any>) => Storage
  ) {}

  async run(path: string): Promise<Result> {
    const envPath = join(path, 'env.ts')
    const env = await this.getEnv(envPath)
    const settings = env.getEnv()
    const storage = this.storageFactory(settings)
    try {
      const paths = await this.retriever.retrievePaths(path)
      const node = await this.builder.build(path, paths)
      await storage.updateNodes(node)
      return new Result(paths)
    } finally {
      await storage.destructor()
    }
  }

  async query(
    configPath: string,
    query: string
  ): Promise<Record<string, any> | null> {
    const env = await this.getEnv(configPath)
    const settings = env.getEnv()
    const storage = this.storageFactory(settings)
    try {
      const result = await storage.query(query)
      return result
    } finally {
      await storage.destructor()
    }
  }

  async getEnv(envPath: string): Promise<Environment> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require(resolve(envPath))
    if (!module.default) {
      throw new Error('env class could not be found in env.ts')
    }
    // this.logger(`ⓘ environment successfully read from ${envPath}.`)
    const EnvClass = module.default
    return new EnvClass() as Environment
  }
}
