import * as R from 'https://cdn.skypack.dev/ramda'


const { always, mergeAll, assoc, pipeP, pipe, pluck, map } = R

export default async function (config) {
  const services = await adaptersToServices(config.adapters)
  return mergeAll(services)
}

async function adaptersToServices(adapters) {
  return Promise.all(
    map(
      async a => ({ [a.port]: await buildService(a.plugins) })
      , adapters
    )
  )
  
}

async function buildService(plugins) {
  const load = await pipeP(...pluck('load', plugins))({})
  const link = pipe(...map(f => f(load), pluck('link', plugins)))({})
  return link
}


