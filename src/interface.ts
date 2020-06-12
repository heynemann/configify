export interface ConfigDefinition {
  new (): ConfigDefinition
  getConfig(): Record<string, any>
}

export interface Retriever {
  logger: (msg: string) => void
  retrievePaths(rootPath: string): Promise<Array<string>>
}

export interface Builder {
  logger: (msg: string) => void
  build(paths: string[]): Promise<void>
}
