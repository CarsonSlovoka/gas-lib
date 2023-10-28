# Share 共用篇

您寫完lib，到Project Settings

```
IDs are the unique identifiers of your Apps Script project.

Script ID 1234567_abcdefghiJKLMNOPQRSTUVWXY-Z9JeUVgHybZzO_C51kYeOXE

```

把以上ID Copy下來即可。

----

至此，您就可以有權在「自己」(僅自己)的任何腳本導入此lib，

但記得，導入 Lib. **不代表能直接調用裡面的函數**

假設您寫了`SummaryItems`函數

在其他的腳本也倒入了此library

接著必須在重寫一次該函數，如

```js
/**
 * 依照每欄分別統計該欄出現的項目各有多少
 * @param {Array} arr 輸入範圍
 * @param {boolean} expand 是否要展開，如果不展開，預設輸出JSON格是在儲存格中。
 * @return json string or Array
 * @customfunction
 */
function SummaryItems(arr, expand = false) {
  return CarsonLib.SummaryItems(arr, expand)
}
```

函數的實作可以直接呼叫導入的library，其中上述的CarsonLib就是您導入的library，

導入的時候可以修改名稱，預設是用原script專案的名稱

## 其他人怎麼用

其他人要用，必須把Script發佈到library之中

> ⭐權限: 至少要對此腳本開放 **檢視** 的權限
>
> 這邊的權限是指script不是sheets
>
> 如果你發現你的script權限沒有開放，但是sheets感覺是可以用的，這是一種假象，可能您之前有開過，後來把權限又拿掉了
>
> 在這種情況你把儲存格清空在重新打上公式，或者拿其他的儲存格來試，都會發現又不能用了。

> 這邊的script必須是**原代碼的script**，就是看的到完整實作的那個gas script
>
> (而非你開一個新的spreadsheet然後建立script接著引入原代碼的script的那個script)

```
Deploy -> New deployment

Select type:
  Library  (注意，中文會寫:「資料庫」我覺得翻得很爛，很容易誤解)
```

以上完成之後，您的腳本也開始會有版號出現，

換句話說，您可以改動腳本，然後發佈新的版號

別人在用您的腳本的時候，會需要選擇要使用哪一個版本，或者是用最新版(dev模式)

但不建議用dev，因為您不曉得人家改的相容性會如何，所以建議選一個版號，就不怕別人異動了(只要不砍腳本)

> Note: 如果沒有發佈，即便其他人用id找到了腳本，在執行的時候還是會失敗跑不出結果

接著您如果發現儲存格公式還是報錯，有可能您儲存格保存的項目是抓先前的腳本，

建議把數值清除，在重新打上去。

----

接著你會發現，雖然這樣大家都能用，可是未必大家都想自己再去新增函數一次，

因此我會建議您開一個新的spreadsheet，然後這個表新增script，

一樣在這個script加入您的library，之後把所有的東西都打好，

再來共用您的spreadsheet，其他人的權限設定View only即可，這樣已足夠讓他們有辦法copy過去，會連帶把script也複製過去

所以對他人而言，他們就能直接在儲存格用上您的公式，不用再牽扯apps script.

> 補充:
>
> 當您複製了別人的spreadsheet，它會複製spreadsheet以及相關的app script
>
> 這些全部都是clone，也就是會再生成副本到該複製人自己的硬碟空間中
>
> (該app script名稱也和原本該擁有者所定義的app script名稱相同)
>
> 如果你複製多次，在自己的app script就會有相同的名稱，但是它旁邊其實會標記這是來自於哪一個spreadsheet
>
> 總之，產生副本之後，spreadsheet和app script都是在clone一份，不管您怎麼改都不會異動到原始的檔案！
>
> 其實每一個app script都會有一個id，可以在[專案設定](https://script.google.com/u/0/home/projects/1b4cJ_IHldsoOynCgGM74Xpkb4csak5_uVjGleEUb37DMzk6YoucwJa_B/settings)之中看到。
>
> 因此可以利用該id就能知道目前(id也會在網址之中)到底是編輯到哪一個app script

----

如果您分享給所有人，開放他們有權利編輯(spreadsheet)，即便他們沒有腳本的權限，還是可以在該腳本使用那些函數，即

> `擁有者`具備此權限，就能使用該函數。

而這些沒有權限的使用者，如果複製了腳本，到他們自己身上，sheet的擁有者就會轉移

這時候由於他們沒有腳本的權限，自定義函數就會失效。
