import { assert } from 'https://deno.land/std/testing/asserts.ts'
import createServices from './mod.js'

const plugin1 = () => ({
  load: () => Promise.resolve({ hello: 'world' }),
  link: e => a => ({ ...a, hello: () => console.log('hello') })
})


const plugin2 = () => ({
  load: (e) => Promise.resolve({ goodbye: 'world', ...e }),
  link: e => a => ({ ...a, world: () => console.log(e) })
})

const config = {
  adapters: [
    { port: 'foo', plugins: [plugin1(), plugin2()] },
    { port: 'bar', plugins: [plugin1(), plugin2()] }
  ]
}

const test = Deno.test

test('ok', async () => {
  const svcs = await createServices(config)
  console.log(svcs)
  console.log(svcs.foo.hello())
  console.log(svcs.bar.world())
  assert(true)
})
