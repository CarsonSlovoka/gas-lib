export {
    RangeLookup
}

/**
 * 在範圍內搜尋是否存某關鍵字，返回找到此項目的列(欄)的指定位子的資料
 * @param {Array} arr The range of input.
 * @param {string|Array|boolean} lookupList It will search until it finds the first item.
 * @param {"row"|"col"} offsetWay row: top to bottom, col: left to right
 * @param {Number} offset It's used for only found. To get the final value, the offset along the target's row (or column, depending on your settings. initial is 1.)
 * @return {"#N/A"|string} If not match anything, return the #N/A.
 * @customfunction
 */
function RangeLookup(arr: any[][], lookupList: string[]|string|boolean, offsetWay: "row"|"col", offset:number) {
    if (!["row", "col"].includes(offsetWay)) {
        return `❌ offsetWay must equal "row" or "col"`
    }

    lookupList = (lookupList === "" || lookupList === false ? [] :
        !Array.isArray(lookupList) ? [lookupList] :
            lookupList.flat()) as string[]

    for (const [rowIndex, row] of Object.entries(arr)) {
        for (const [colIndex, cellValue] of Object.entries(row)) {
            if (lookupList.includes(cellValue)) {
                return offsetWay === "row" ? arr[offset][+colIndex] : arr[+rowIndex][offset]
            }
        }
    }
    return "#N/A"
}
