// 統計相關所使用的腳本

export {
    CountRangeItems,
    CountColItems
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

/**
 * 依照每欄分別統計該欄出現的項目各有多少
 * @param {Array} arr 輸入範圍
 * @param {string|Array|boolean} exclude 要排除的欄位標題名稱, {空字串,false}視為忽略此欄位, 如果有多筆可以用陣列表示
 * @param {boolean} expand True展開，False不展開(保存在單一儲存格JSON格式), default:true
 * @return {string|Array} json string or Array
 * @customfunction
 */
function CountColItems(arr: any[][], exclude: string | boolean | string[] = [], expand = true) {

    const excludeArr = (exclude === "" || exclude === false ? [] :
        !Array.isArray(exclude) ? [exclude] :
            exclude.flat()) as any[]

    const headers = []
    const colData: any[][] = [] // 記錄每一欄(直向)所擁有的資料
    const excludeIndex: string[] = [] // 要被排除欄位的下標(用字串紀錄)
    for (const [rowIndex, rowData] of Object.entries(arr)) {
        if (rowIndex === "0") {
            excludeIndex.push(
                ...(excludeArr.reduce((exArr: string[], excludeItem) => {
                        const idx = rowData.findIndex(item => item === excludeItem)
                        if (idx >= 0) {
                            exArr.push(`${idx}`)
                        }
                        return exArr
                    },
                    []))
            )
            headers.push(...rowData.filter(title => !excludeArr.includes(title)))
            continue
        }
        let offsetIdx = 0 // header推入資料，從小推到大，但是colData的index是按照資料欄位是第幾欄，例如1~5欄，去除1,2欄位，這時候colData[3, 4, 5]而非colData[0, 1, 2]，所以加入此修正才能達到0, 1, 2
        for (const [colIndex, cell] of Object.entries(rowData)) {
            if (excludeIndex.includes(colIndex)) {
                offsetIdx += 1
                continue
            }

            const idx = +colIndex - offsetIdx
            if (colData[idx] === undefined) {
                colData[idx] = []
            }
            colData[idx].push(cell)
        }
    }

    const summary: Record<string, // 大分類
        Record<string, number> /* 細項: 總數 */> = {}
    headers.map((curTitle, colIndex) => {
        summary[curTitle] = {}
        const curCol = colData[colIndex] // 當前欄的所有項目
        const groups = new Set(curCol) // 區分出有多少項目(不重複)
        groups.forEach(groupName => {
            // 計算每一個項目的筆數
            summary[curTitle][groupName] = curCol.filter(item => item === groupName).length
        })
    })

    if (!expand) {
        return JSON.stringify(summary, null, 2)
    }


    const resultArr: [
        any[], // 大分類. ex:飲料, 主餐, ...
        any[], // 細項　　ex: {咖啡、奶茶, 牛排, 義大利麵, ...}
        number[] // 項目總計 ex: {4, 10, 5, 2}
    ] = [
        [],
        [],
        []
    ]
    for (const [titleName, data] of Object.entries(summary)) {
        for (const [subItemName, count] of Object.entries(data)) {
            resultArr[1].push(subItemName)
            resultArr[2].push(count)
        }
        const curTitle = [...Object.keys(data)] // copy
        curTitle[0] = titleName
        // 填入空白使得大分類可以與細項切齊
        curTitle.fill("", 1, data.length) // fill with "" from position 1 until position `data.length` // fill不能生成不存在的空間，只能在原來擁有的個數項目上做異動
        resultArr[0].push(...curTitle)
    }

    return resultArr
}
