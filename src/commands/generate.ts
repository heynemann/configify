import { Command, flags } from "@oclif/command";
import { Configify } from "../core";
import { accessSync } from "fs";
import { constants } from "fs";

export default class Generate extends Command {
  static description =
    "Updates the configuration with the specified parameters";

  static examples = [
    `$ configify generate
TODO
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "path" }];

  async run() {
    const { args, flags } = this.parse(Generate);
    if (args.path == null) {
      this.log(
        "The source path is required. Run 'configify generate --help' for more information."
      );
      process.exit(1);
      return;
    }
    try {
      accessSync(args.path, constants.F_OK);
    } catch {
      this.log(
        "The source path could not be found. Run 'configify generate --help' for more information."
      );
      process.exit(1);
      return;
    }

    const configify = new Configify(this.log);
    const result = await configify.run(args.path, flags.force);
  }
}
