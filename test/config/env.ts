import { Environment } from '../../src/interface'

export default class Env implements Environment {
  getEnv(): Promise<Record<string, any>> {
    return {
      neo4j: {
        host: 'neo4j://localhost',
        username: 'neo4j',
        password: '1234',
      },
    }
  }
}
