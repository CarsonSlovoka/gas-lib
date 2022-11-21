// https://nodejs.org/api/test.html
import test from 'node:test'
import assert from 'node:assert/strict'
import * as stat from './pkg/stat/stat.mjs'

test("stat", async (t) => {
    await t.test('stat.js', async (t1) => {
        await t1.test("TestCountRangeItems", () => {
            /*
                name, 不可參加日1, 不可參加日2,...
                person1, 2022/11/21, 2022/11/22
                person2, ...
             */
            const result = stat.CountRangeItems([
                ["2022/11/21", "2022/11/22"],
                ["2022/11/21",],
                ["2022/11/22", "2022/11/23"]
            ])

            for (const [actual, expected] of [
                [result[0], ["2022/11/21", 2]],
                [result[1], ["2022/11/22", 2]],
                [result[2], ["2022/11/23", 1]]
            ]) {
                assert.strictEqual(actual.toString(), expected.toString())
            }
        })
    })
})
