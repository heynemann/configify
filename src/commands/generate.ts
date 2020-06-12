import { Command, flags } from '@oclif/command'
import { Configify } from '../core'
import { accessSync } from 'fs'
import { constants } from 'fs'
import { FullRetriever } from '../retrievers/full'
import { GraphConfigBuilder } from '../builders/graph'
import { Builder } from '../interface'

export default class Generate extends Command {
  static description = 'Updates the configuration with the specified parameters'

  static examples = [
    `$ configify generate
Configuration updated successfully for paths:
⟳ test/config/vtex/config.ts
⟳ test/config/vtex/customer1/config.ts
⟳ test/config/vtex/customer1/master/config.ts
⟳ test/config/vtex/customer1/master/workspace1/config.ts
⟳ test/config/vtex/customer1/master/workspace2/config.ts
`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'path' }]

  async run(customBuilder: Builder | null = null): Promise<void> {
    const { args, flags } = this.parse(Generate)
    if (args.path === null) {
      this.error('The source path is required.', { exit: 100 })
    }
    try {
      accessSync(args.path, constants.F_OK)
    } catch {
      this.error('The source path could not be found.', { exit: 100 })
    }

    if (!flags.force) {
      this.error('TODO: Retrieve without forcing full scan.', { exit: 999 })
    }

    const retriever = new FullRetriever(this.log)
    const builder = customBuilder || new GraphConfigBuilder(this.log)
    const configify = new Configify(this.log, retriever, builder)
    const result = await configify.run(args.path)

    if (result.paths.length === 0) {
      this.error('No configuration files were found to be updated.')
    }

    this.log(
      `Configuration updated successfully for paths:\n⟳ ${result.paths.join(
        '\n⟳ '
      )}`
    )
  }
}
