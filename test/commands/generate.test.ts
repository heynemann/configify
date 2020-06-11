import { stdout } from 'stdout-stderr'
import Generate from '../../src/commands/generate'

test('generate command with force', async () => {
  stdout.start()
  const cmd = new Generate(['-f', './test/config'], null)
  await cmd.run()
  stdout.stop()
  expect(stdout.output).toMatchSnapshot()
})
