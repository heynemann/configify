export class Node {
  edges: Node[]

  public constructor(public data: Record<string, any>) {
    this.edges = []
  }

  public addEdge(node: Node): void {
    this.edges.push(node)
  }
}
