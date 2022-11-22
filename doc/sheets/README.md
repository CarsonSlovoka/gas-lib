## 常用的API

- [const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet)
  - 擁有getRange的方法
  - 可以使用getRangeByName
- [const sheet = SpreadsheetApp.getActiveSheet()](https://developers.google.com/apps-script/reference/spreadsheet/sheet)
  - 擁有getRange的方法
  - 不可使用getRangeByName
  - [setConditionalFormatRules](https://developers.google.com/apps-script/reference/spreadsheet/sheet#setConditionalFormatRules(ConditionalFormatRule))
- [sheet.newChart](https://developers.google.com/apps-script/reference/spreadsheet/sheet#newChart())

  ```js
  const myChart = SpreadsheetApp.getActiveSpreadsheet() // spreadsheet
    .getSheetByName("圖表") // Sheet
    .newChart() // EmbeddedChartBuilder
    .setChartType(Charts.ChartType.PIE) // https://developers.google.com/apps-script/reference/charts/chart-type.html
    .addRange(curRange)
    //.setOption('hAxis.title', `count of ${titleName}`) // https://developers.google.com/apps-script/chart-configuration-options
    .setOption('title', titleName) // https://developers.google.com/apps-script/reference/spreadsheet/embedded-chart-builder#setoptionoption,-value
    .setOption('applyAggregateData', true)

  sheetOutput.insertChart(myChart)
  ```

- [EmbeddedPieChartBuilder](https://developers.google.com/apps-script/reference/spreadsheet/embedded-pie-chart-builder)
- [SpreadsheetApp.newDataValidation()](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#newdatavalidation) : return [DataValidationBuilder]
- [SpreadsheetApp.newConditionalFormatRule()](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#newconditionalformatrule): return [ConditionalFormatRuleBuilder]
- Protect
  - [range.protect](https://developers.google.com/apps-script/reference/spreadsheet/sheet#protect)
  - [sheet.protect](https://developers.google.com/apps-script/reference/spreadsheet/sheet#protect)


## [Custom functions 自訂函數](https://developers.google.com/apps-script/guides/sheets/functions#using_a_custom_function)

優點:

- 便利: 像一般寫函數一樣，寫完在外面就能馬上用。
- 大家都可以用: 沒有權限的限制 (但也就表示**不能牽扯任何有關權限的函數**)


> ❗ 當您生成副本的時候，腳本也會複製，是複製該腳本，不是共用。
>
> 也就是複製完之後，如果您在原腳本再繼續加上函數，對複製的腳本是沒用的，
> 必須在複製的腳本也打開apps script編寫才有效。

- 寫函數註解，支持[JsDoc](https://jsdoc.app/)

  範例
  ```js
  /**
   * Multiplies the input value by 2.
   *
   * @param {number} input The value to multiply.
   * @return The input multiplied by 2.
   * @customfunction
   */
  function DOUBLE(input) {
    return input * 2;
  }
  ```

  > *Note*: 很多東西都不支持，基本上能用的就@param @return @customfunction 就這幾個，
  >
  > 其中@customfunction要加上去，不然看不到JsDoc

### 注意事項

- 名稱不可以和內建函數重複
- 函數定義只能用傳統的語法function開頭
- 函數結尾不可以使用`_`，這視為私有的函數
- 沒有硬性的大小寫規定。(google一般是用全大寫)


### Add-ons

您可以在spreadsheet面板上方

> Extensions -> Add-ons

去下載或者管理附加元件

例如下載別人寫好的函數之類的

[DataValidationBuilder]: https://developers.google.com/apps-script/reference/spreadsheet/data-validation-builder
[ConditionalFormatRuleBuilder]: https://developers.google.com/apps-script/reference/spreadsheet/conditional-format-rule-builder
