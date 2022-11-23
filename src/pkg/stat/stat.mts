// 統計相關所使用的腳本

export {
    CountRangeItems,
    CountColItems,
    CountColItemsByGroup
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

/**
 * 依照每欄分別統計該欄出現的項目各有多少
 * @param {Array} arr 輸入範圍
 * @param {boolean} expand True展開，False不展開(保存在單一儲存格JSON格式), default:true
 * @param {string|[string]} groupName 以某欄位(只能一格)當基礎當成群組依據
 * @param {string|Array|boolean} exclude 要排除的欄位
 * @param {"table"|""} outputFormat "table" 表示每列代表一個群組名稱。(這種方式可以把表壓縮得比較小，比較適合人讀)。
 * @return json string or Array
 * @customfunction
 */
function CountColItemsByGroup(arr: any[][], groupName: string | [string], exclude: string | boolean | any[] = [], expand = true, outputFormat = "table"): string | any[][] {
    const excludeArr = (exclude === "" || exclude === false ? [] :
        !Array.isArray(exclude) ? [exclude] :
            exclude.flat()) as any[]

    groupName = Array.isArray(groupName) ? groupName.flat()[0] : groupName // 在excel上通常會直接指派儲存格而非用字串，所以容許用[string]

    const excludeIndex: number[] = []
    excludeIndex.push(
        ...excludeArr.reduce((exArr, excludeItem) => {
                const idx = arr[0].findIndex(item => item === excludeItem)
                if (idx >= 0) {
                    exArr.push(idx)
                }
                return exArr
            },
            [])
    )

    // 原始資料排除exclude的項目
    arr = arr.map(row => {
        return row.filter((e, colIdx) => !excludeIndex.includes(colIdx))
    })

    const headers: string[] = []
    const colData: any[][] = []
    const colSet: Set<any>[] = []
    for (const [rowIndex, rowData] of Object.entries(arr)) {
        if (rowIndex === "0") {
            headers.push(...rowData)
            continue
        }
        for (const [colIndex, cell] of Object.entries(rowData)) {
            if (colData[+colIndex] === undefined) {
                colData[+colIndex] = []
                colSet[+colIndex] = new Set()
            }
            colData[+colIndex].push(cell)
            colSet[+colIndex].add(cell)
        }
    }

    if (!headers.includes(groupName)) {
        return "ERROR groupName not found"
    }

    const groupIdx = headers.indexOf(groupName) // 指定群組名稱位於header中的位置
    const groupSet = new Set(colData[groupIdx]) // 找到 桌號，知道桌號共有哪些
    const dataArr = arr.slice(1) // not include header

    const summary: Record<string, // GroupName (座位)
        Record<string, Record<string, number>> /* {飲料:{咖啡:3,奶茶:1}, 甜點:{巧克力:2, 冰淇淋:1}} */> = {}
    groupSet.forEach(groupName => {
        summary[groupName] = {} // "a1桌": {}, "a2桌":{},...

        // 過濾所有資料，從中挑選出目前所關心的桌次(groupName)
        const curData = dataArr.filter(row => {
            const curGroupName = row[groupIdx]
            return curGroupName === groupName
        })

        for (const [colIndex, curColSet] of Object.entries(colSet)) {
            if (colIndex === `${groupIdx}`) {
                // groupName所在的欄位，我們並不關心，所以跳過
                continue
            }

            const curTitle = headers[+colIndex] // 當前欄位的標題名稱 // 飲料
            summary[groupName][curTitle] = {}
            curColSet.forEach(setName => { // 黑咖啡、奶茶
                summary[groupName][curTitle][setName] = curData.filter(row => row[+colIndex] === setName).length
            })
        }
    })

    if (!expand) {
        return JSON.stringify(summary, null, 2)
    }

    // 輸出為一列一列式的排法, 標題列只有一維
    const notTableProcess = () => {
        const resultArr: [
            string[],
            string[],
            string[],
            number[]
        ] = [
            [], // groupName(群組依據) ex: 桌A, "", "", ""   ""          桌B  "" "" ""  ""
            [], // 大分類.             ex: 飲料,       主餐, ...          飲料       主餐
            [], // 細項　　            ex: 咖啡、奶茶,   牛排, 義大利麵,     咖啡、奶茶, 牛排, 義大利麵
            []  // 項目總計            ex: 4,    10,    5,   2           1    2     3    1
        ]
        for (const [groupName, groupData] of Object.entries(summary)) { // a桌, b桌
            let padIndexCount = 0
            for (const [titleName, subData] of Object.entries(groupData)) { // 飲品, 甜點
                padIndexCount += Object.keys(subData).length // 計算當前細項一共有幾個
                for (const [ItemName, count] of Object.entries(subData)) { // 咖啡, 奶茶
                    resultArr[2].push(ItemName) // 細項
                    resultArr[3].push(count) // 細項總計
                }

                // 讓大分類對齊(不足的全部用""補上)
                const curTitle = [titleName].concat([...Object.keys(subData).map(e => "")].slice(1)) // 去除一個元素，第一個元素是titleName
                // curTitle.splice(1, 0, ...Object.keys(subData).map(e=>"")) // splice(start, deleteCount, item1, item2, itemN)
                resultArr[1].push(...curTitle)
            }

            // 讓群組對齊(不足的全部用""補上)
            resultArr[0].push(...[groupName].concat(
                Array.from([...Array(padIndexCount).keys()], e => "")
                    .slice(1)
            ))
        }
        return resultArr
    }

    /* 輸出為2維格式
        X(用""表示)   大分類1,           飲品
    群組依據(桌次)     子項目1  子項目2    咖啡     奶茶
    A                  1      0        2       0
    B
     */
    const TableProcess = () => {
        const resultArr = [
            [""],        // ["",      大分類1, (pad)  飲品 (pad)]
            [groupName], // [群組名稱, 子項目1, 子項目2, 咖啡, 奶茶]
            // ↑ 以上需要init(能在第一輪就會知道所有項目，之後不需再調整)

            // 以下為: [(當前群組名)A, 1, 0, 2, 0]
            // [],
            // ...
        ]

        let needInit = true
        for (const [groupName, groupData] of Object.entries(summary)) { // a桌, b桌
            const curRowData = [groupName]
            for (const [titleName, subData/*黑咖啡、奶茶*/] of Object.entries(groupData)) { // 大分類 ex: 甜點, 飲品

                // 依照subData的個數去填充resultArr[0]的標題列(缺少的用""補齊)
                if (needInit) {
                    resultArr[0].push(...[titleName].concat(
                        Array.from([...Array(Object.keys(subData).length).keys()], e => "")
                            .slice(1)
                    ))
                }

                for (const [ItemName, count] of Object.entries(subData)) { // 黑咖啡、奶茶
                    needInit ? resultArr[1].push(ItemName) : ""
                    curRowData.push(`${count}`)
                }
            }
            resultArr.push(curRowData)
            needInit = false // do on the first only.
        }
        return resultArr
    }
    return outputFormat === "table" ? TableProcess() : notTableProcess()
}
