configify
=========

configify is a hierarchical code-first distributed contextual configuration service

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/configify.svg)](https://npmjs.org/package/configify)
[![Downloads/week](https://img.shields.io/npm/dw/configify.svg)](https://npmjs.org/package/configify)
[![License](https://img.shields.io/npm/l/configify.svg)](https://github.com/heynemann/configify/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g configify
$ configify COMMAND
running command...
$ configify (-v|--version|version)
configify/0.0.0 darwin-x64 node-v14.4.0
$ configify --help [COMMAND]
USAGE
  $ configify COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`configify hello [FILE]`](#configify-hello-file)
* [`configify help [COMMAND]`](#configify-help-command)

## `configify hello [FILE]`

describe the command here

```
USAGE
  $ configify hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ configify hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/heynemann/configify/blob/v0.0.0/src/commands/hello.ts)_

## `configify help [COMMAND]`

display help for configify

```
USAGE
  $ configify help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_
<!-- commandsstop -->
