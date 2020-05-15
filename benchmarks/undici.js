'use strict'

const { PassThrough } = require('stream')

const undici = require('..')
const total = 100000

const agent = undici('http://localhost:8081', {
  connections: 100,
  pipelining: 10
})

let responses = 0

console.time('requests')
for (let i = 0; i < total; i++) {
  agent.stream({
    method: 'GET',
    path: '/'
  }, () => {
    return new PassThrough().once('finish', () => {
      if (++responses === total) {
        console.timeEnd('requests')
      }
    })
  }, (err) => {
    // let's crash this, the benchmark harness is not
    // ready to capture failures
    if (err) {
      throw err
    }
  })
}
