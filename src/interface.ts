import { Node } from './graph'

export interface ConfigDefinition {
  getConfig(): Record<string, any>
}

export interface Retriever {
  logger: (msg: string) => void
  retrievePaths(rootPath: string): Promise<Array<string>>
}

export interface Builder {
  logger: (msg: string) => void
  build(rootPath: string, paths: string[]): Promise<Node>
}

export interface Environment {
  getEnv(): Promise<Record<string, any>>
}

export interface Storage {
  updateNodes(node: Node): Promise<void>
  query(query: string): Promise<Record<string, any> | null>
  destructor(): Promise<void>
}
