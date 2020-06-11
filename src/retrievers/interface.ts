export interface Retriever {
  logger: (msg: string) => void
  retrievePaths(rootPath: string): Promise<Array<string>>
}
