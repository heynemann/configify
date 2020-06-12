import { Builder, ConfigDefinition } from '../interface'
import { Node } from '../graph'

export class GraphConfigBuilder implements Builder {
  public constructor(public logger: (msg: string) => void) {}

  async build(paths: string[]): Promise<void> {
    const rootNode = new Node({})
    paths.map(async (path: string) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const configModule = require(path.replace('.ts', ''))
      const ConfigClass = configModule.default as ConfigDefinition
      const config = new ConfigClass()
      const data = await config.getConfig()
      for (let key in data) {
        let value = data[key]
        this.logger(JSON.stringify(value))
      }
    })
  }
}
