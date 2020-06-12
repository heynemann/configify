import { Node } from '../src/graph'

test('create new node', async () => {
  const n1 = new Node({
    arbitrary: 'data',
  })

  expect(n1).not.toBeNull()
  expect(n1.data.arbitrary).toEqual('data')
})

test('add edge', async () => {
  const n1 = new Node({
    arbitrary: 'data',
  })
  const n2 = new Node({
    arbitrary: 'data',
  })

  n1.addEdge(n2)

  expect(n1.edges.length).toEqual(1)
  expect(n1.edges[0]).toBe(n2)
})
