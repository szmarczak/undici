'use strict';
const Benchmark = require('benchmark');
const {Client} = require('.');

const suite = new Benchmark.Suite();

const client = new Client('https://localhost:8081', {
    tls: {
rejectUnauthorized: false
    },
//    connections: 100,
//    pipelining: 10
});

const options = {
    path: '/',
    method: 'GET'
};

// Benchmarking
suite.add('undici', {
    defer: true,
    fn: async deferred => {
/*
        const {body} = await client.request(options);
        body.resume();

        body.once('end', () => {
            deferred.resolve();
        });
*/
        client.stream(options, () => {
            let buffered = '';

            const obj = {
                on: () => obj,
                write: chunk => {
                    buffered += chunk;
                },
                end: () => deferred.resolve()
            };

            return obj;
        });
    }
}).on('cycle', event => {
    console.log(String(event.target));
}).on('complete', function () {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
}).run();
