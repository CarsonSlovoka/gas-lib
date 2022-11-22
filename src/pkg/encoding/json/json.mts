export {
    Array2Json
}

/**
 * 將儲除格陣列轉換為JSON格式，透過此函數很容易把資料下載下來
 * @param {Array} arr 輸入範圍
 * @param {string} rootName 根資料名稱
 * @param {Number|string} space Set the space is for readable by humans.
 * @return {string} 回傳統計結果
 * @customfunction
 */
function Array2Json(arr: any[][], rootName = "", space: number | string = ""): string {
    if (rootName != "") {
        return JSON.stringify({[rootName]: arr}, null, space)
    }
    return JSON.stringify(arr, null, space)
}

