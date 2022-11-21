// https://nodejs.org/api/test.html
import test from 'node:test'
import assert from 'node:assert/strict'
import * as stat from './pkg/stat.mjs'

test('Test XXX', async (t) => {
    console.log("hello world")
    assert.strictEqual(stat.Version, "0.0.0")
})
