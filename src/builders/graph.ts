import { dirname, relative } from 'path'
import { Builder, ConfigDefinition } from '../interface'
import { Node } from '../graph'
import { CONFIG_NODE, KEY_NODE, EXTENDS_EDGE, HAS_KEY_EDGE } from '../constants'

export class GraphConfigBuilder implements Builder {
  public constructor(public logger: (msg: string) => void) {}

  async build(rootPath: string, paths: string[]): Promise<Node> {
    const nodesByPath: { [key: string]: Node } = {}
    const rootNode = new Node(CONFIG_NODE, {})
    paths.map(async (path: string) => {
      const dir = dirname(path)
      const prevDir = dirname(dir)
      const prevNode = nodesByPath[prevDir] || rootNode

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const configModule = require(path.replace('.ts', ''))
      const ConfigClass = configModule.default as ConfigDefinition
      const config = new ConfigClass()

      const node = new Node(CONFIG_NODE, {
        path: relative(rootPath, dir),
      })
      prevNode.addEdge(node, EXTENDS_EDGE)

      const data = await config.getConfig()
      for (const key in Object.keys(data)) {
        if ({}.hasOwnProperty.call(data, key)) {
          const keyNode = new Node(KEY_NODE, { name: key, value: data[key] })
          node.addEdge(keyNode, HAS_KEY_EDGE)
        }
      }
    })

    return rootNode
  }
}
