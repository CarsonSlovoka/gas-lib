// https://nodejs.org/api/test.html
import test from 'node:test'
import assert from 'node:assert/strict'
import * as stat from './pkg/stat/stat.mjs'
import * as json from './pkg/encoding/json/index.mjs'

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

        await t1.test("TestCountColItems", () => {
            const testData = [
                ["飲料", "甜點"],
                ["奶茶", "蛋糕"],
                ["紅茶", "冰淇淋"],
                ["奶茶", "冰淇淋"],
            ]
            for (const [actual, expected] of [
                [stat.CountColItems(testData), [
                    ['飲料', '', '甜點', ''],
                    ['奶茶', '紅茶', '蛋糕', '冰淇淋'],
                    [2, 1, 1, 2]
                ]],
                [stat.CountColItems(testData, "飲料"), [
                    ['甜點', ''],
                    ['蛋糕', '冰淇淋'],
                    [1, 2]
                ]],
                [stat.CountColItems(testData, ["飲料", "甜點"]), [
                    [],
                    [],
                    []
                ]],
                [stat.CountColItems(testData, ["飲料", "甜點"], false), [
                    "{}"
                ]],
            ]) {
                assert.strictEqual(actual.toString(), expected.toString())
            }
        })
    })
})

test("encoding", async (t) => {
    await t.test('json', async (t1) => {
        await t1.test("TestCountRangeItems", () => {
            const testData = [
                ["Name", "desc"],
                [1, 2]
            ]
            for (const [actual, expected] of [
                [json.Array2Json(testData), `[["Name","desc"],[1,2]]`],
                [json.Array2Json(testData, "data"), `{"data":[["Name","desc"],[1,2]]}`],
                // [json.Array2Json(testData, "data", 2)]
                // [json.Array2Json(testData, "data", "  ")]
            ]) {
                assert.strictEqual(actual, expected)
            }
        })
    })
})
