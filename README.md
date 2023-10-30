# gas-lib

gas相關腳本, 目前集中於寫spreadsheet的函數

## Demo & Usage

以下連結提供已經實作的相關函數使用方法

> https://docs.google.com/spreadsheets/d/1v7oqH6myGrI6yLpDxC3e7kkveZyEuQr4G8TdZQGQE-8/

如果您想直接使用，可以直接複製該sheet，一樣也能在自己的sheet上使用那些函數

其中背景顏色有用`黃色`標示的儲存格表示公式，觀看那些儲存格即可。

## [分享腳本的方法](doc/share.md)

## [Google Cloud](doc/googleCloud.md)

## [spreadsheet](doc/sheets/README.md)

## TS小技巧

- 善用`//@ts-ignore`: GAS中很多函數是來自於google所定義，這時候就可以用import的方式來載入該變數；另一種解法是將變數宣告成any，例如`const Utilities: any`
- 使用console.error來進行測試: 因為某些函數用到了google所定義的函數，所以一定要在gas才能測試，可以把要測試的函數都寫在一個函數之中，再呼叫該函數即可，其中把非預期的項目用console.error，如果有執行到該內容，在console視窗即可發現錯誤，就能知道測試不過。
