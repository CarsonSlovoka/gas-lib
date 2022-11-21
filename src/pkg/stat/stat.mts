// 統計相關所使用的腳本

export {
    CountRangeItems
}

/**
 * 統計範圍內各個項目有幾個
 * @param {Array} arr The range of input.
 * @return arr [any, number][] ex. [["a": 3], ["b":5], ...]
 * @customfunction
 */
function CountRangeItems(arr: any[][]): [any, number][] {
    const map: Record<any, { count: number }> = {}
    arr.forEach(row => {
        row.forEach(cell => {
            if (cell in map) {
                map[cell].count++
                return
            }
            map[cell] = {count: 1}
        })
    })
    const resultArr: [[any, number]] = [] as any
    for (const [key, details] of Object.entries(map)) {
        resultArr.push([key, details.count])
    }
    return resultArr
}
