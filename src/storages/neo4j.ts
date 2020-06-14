import { dirname } from 'path'
import {
  driver,
  auth,
  session,
  Driver,
  Session,
  Transaction,
} from 'neo4j-driver'
import { stringify } from 'javascript-stringify'
import { Node } from '../graph'
import {
  CONFIG_NODE,
  IS_PARENT_EDGE,
  EXTENDS_EDGE,
  HAS_KEY_EDGE,
  BELONGS_TO_EDGE,
} from '../constants'
import { Storage as BaseStorage } from '../interface'

export class Neo4JStorage implements BaseStorage {
  connection: Driver

  session: Session

  constructor(
    public settings: Record<string, any>,
    public logger: (msg: string) => void
  ) {
    const host: string = settings.neo4j.host
    const username: string = settings.neo4j.username
    const password: string = settings.neo4j.password
    this.connection = driver(host, auth.basic(username, password), {
      maxTransactionRetryTime: 30000,
    })
    this.session = this.connection.session({
      defaultAccessMode: session.WRITE,
    })
  }

  public async destructor(): Promise<void> {
    this.connection.close()
  }

  public async updateNodes(node: Node): Promise<void> {
    await this.session.writeTransaction(async (txc) => {
      await this.mergeNodes(txc, node, new Set<string>())
    })
  }

  private async mergeNodes(
    txc: Transaction,
    node: Node,
    visitedNodes: Set<string>
  ): Promise<void> {
    if (visitedNodes.has(node.data.path)) {
      return
    }
    visitedNodes.add(node.data.path)

    if (node.data.path === null || node.data.path === undefined) {
      await this.processChildren(txc, node, visitedNodes)
      return
    }

    await this.processNode(txc, node)
    await this.processChildren(txc, node, visitedNodes)
  }

  async processNode(txc: Transaction, node: Node): Promise<void> {
    const parentPath = dirname(node.data.path)
    let query = null
    if (parentPath === '.') {
      query = `MERGE (config: ${node.type} ${stringify(
        node.data
      )}) RETURN config.path AS path`
    } else {
      query = `MATCH (parent: ${node.type} { path: '${parentPath}' })
      MERGE (config: ${node.type} ${stringify(node.data)})
      MERGE (parent)-[:${IS_PARENT_EDGE}]->(config)
      MERGE (config)-[:${EXTENDS_EDGE}]->(parent)
      RETURN config.path AS path`
    }
    await txc.run(query)
  }

  async processChildren(
    txc: Transaction,
    node: Node,
    visitedNodes: Set<string>
  ): Promise<void> {
    // Process child nodes and keys
    await Promise.all(
      node.edges.map(async (edge) => {
        if (edge.type === IS_PARENT_EDGE) {
          await this.mergeNodes(txc, edge.toNode, visitedNodes)
        }
        if (edge.type === HAS_KEY_EDGE) {
          await this.storeKey(txc, node.data.path, edge.toNode)
        }
      })
    )
  }

  async storeKey(
    txc: Transaction,
    parentPath: string,
    node: Node
  ): Promise<void> {
    const query = `MATCH (config: ${CONFIG_NODE} { path: '${parentPath}' })
      MERGE (key: ${node.type} ${stringify(node.data)})
      MERGE (config)-[:${HAS_KEY_EDGE}]->(key)
      MERGE (key)-[:${BELONGS_TO_EDGE}]->(config)
      RETURN config.path AS path`
    await txc.run(query)
  }
}
