import { Command, flags } from '@oclif/command'
import { Configify } from '../core'
import { accessSync } from 'fs'
import { constants } from 'fs'

export default class Generate extends Command {
  static description = 'Updates the configuration with the specified parameters'

  static examples = [
    `$ configify generate
TODO
`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'path' }]

  async run(): Promise<void> {
    const { args, flags } = this.parse(Generate)
    if (args.path === null) {
      this.error('The source path is required.', { exit: 100 })
    }
    try {
      accessSync(args.path, constants.F_OK)
    } catch {
      this.error('The source path could not be found.', { exit: 100 })
    }

    const configify = new Configify(this.log)
    const result = await configify.run(args.path, flags.force)

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
