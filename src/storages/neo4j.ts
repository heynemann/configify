import { Node } from '../graph'
import { Storage as BaseStorage } from '../interface'
import { driver, Driver, auth } from 'neo4j-driver'

export class Neo4JStorage implements BaseStorage {
  private connection: Driver

  constructor(
    public settings: Record<string, any>,
    public logger: (msg: string) => void
  ) {
    const host: string = settings.neo4j.host
    const username: string = settings.neo4j.username
    const password: string = settings.neo4j.password
    this.connection = driver(host, auth.basic(username, password))
  }

  public async updateNodes(node: Node): Promise<void> {
    await this.mergeNodes(node)
  }

  public async destructor(): Promise<void> {
    this.connection.close()
  }

  private async mergeNodes(node: Node): Promise<void> {}
}
