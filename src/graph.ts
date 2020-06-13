export class Edge {
  public constructor(
    public toNode: Node,
    public type: string,
    public data: Record<string, any>
  ) {}
}

export class Node {
  edges: Edge[]

  public constructor(public type: string, public data: Record<string, any>) {
    this.edges = []
  }

  public addEdge(
    node: Node,
    type: string,
    data: Record<string, any> = {}
  ): void {
    this.edges.push(new Edge(node, type, data))
  }
}
