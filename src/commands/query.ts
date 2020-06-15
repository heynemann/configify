import { PerformanceObserver, performance } from 'perf_hooks'
import { accessSync, constants } from 'fs'
import { Command, flags } from '@oclif/command'
import { Configify } from '../core'
import { FullRetriever } from '../retrievers/full'
import { GraphConfigBuilder } from '../builders/graph'
import { Neo4JStorage } from '../storages/neo4j'
import { Builder, Storage } from '../interface'

export default class Query extends Command {
  static description = 'Queries a configuration and all parents'

  static examples = [
    `$ configify query
`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    config: flags.string({ char: 'c', description: 'config' }),
    // force: flags.boolean({ char: 'f' }),
  }

  static args = [
    { name: 'query', description: 'Path of the config you are looking for.' },
  ]

  async run(
    customBuilder: Builder | null = null,
    customStorage: Storage | null = null
  ): Promise<void> {
    const { args, flags } = this.parse(Query)
    const configPath = flags.config
    if (configPath === null || configPath === undefined) {
      this.error('The config path is required.', { exit: 100 })
    }
    try {
      accessSync(configPath, constants.F_OK)
    } catch {
      this.error('The config path could not be found.', { exit: 100 })
    }

    const retriever = new FullRetriever(this.log)
    const builder = customBuilder || new GraphConfigBuilder(this.log)
    const storageFactory = (settings: Record<string, any>): Storage => {
      return customStorage || new Neo4JStorage(settings, this.log)
    }
    let duration = 0.0
    const obs = new PerformanceObserver((items) => {
      duration = items.getEntries()[0].duration
      performance.clearMarks()
    })
    obs.observe({ entryTypes: ['measure'] })
    const configify = new Configify(
      this.log,
      retriever,
      builder,
      storageFactory
    )
    performance.mark('query-start')
    const result = await configify.query(configPath, args.query)
    performance.mark('query-end')
    performance.measure('query', 'query-start', 'query-end')
    this.log(
      JSON.stringify({
        performance: {
          queryTimeInMs: duration,
        },
        data: result,
      })
    )
  }
}
