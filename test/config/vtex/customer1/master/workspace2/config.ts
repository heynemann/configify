import { ConfigDefinition } from '../../../../../../src/interface'

export default class Config implements ConfigDefinition {
  public async getConfig(): Record<string, any> {
    return {
      conf: 'workspace2',
    }
  }
}
