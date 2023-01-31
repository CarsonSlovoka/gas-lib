# [Google Cloud Console](https://console.cloud.google.com)

您可以至[Pricing頁面](https://mapsplatform.google.com/pricing/?hl=en)，查看您想使用的API其價格如何收費(可以看出每一個request要收多少錢)

此頁面可以看到有三個API分別如下:

- Maps
  - [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started?hl=en): 不收費且使用次數沒有限制。 [★API參數用法](https://developers.google.com/maps/documentation/embed/embedding-map?hl=zh-tw)

    > Note: All Maps Embed API requests are available at **no charge with unlimited usage**. For more information, see [Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing?hl=en).

    值得一提的是您還是要啟用此API，並取得[API KEY](https://developers.google.com/maps/documentation/embed/get-api-key?hl=en)才能使用

    API KEY的教學會提到要註冊信用卡，如果一定要填才能過就填吧，[移除信用卡](https://payments.google.com)的時候他會要求選擇另一個信用卡資訊，總之至少要有一個信用卡，

    如果您真的很在意，可以[寫信或線上對談](https://support.google.com/googlepay/gethelp?hl=en)給客服，他們可以幫你移掉(我有試過)

    > 注意線上對談有時間，有些平日是休息的、另外大多是8:00~10:00才有提供線上對談的服務


- Routes
- Places

上面所有內容除了Maps Embed API以外，其他的都是需要付費

至於這些API的使用方法，都是透過Get加上token即可使用，例如:

```yaml
https://maps.googleapis.com/maps/api/ # 前面差不多都是這個樣子
https://maps.googleapis.com/maps/api/<WhichAPI> # 僅接著看您使用的是哪一個API{Maps, Routes(它的識別名稱是directions), Places}
https://www.google.com/maps/embed/v1/ # 這個是Maps Embed API
https://www.google.com/maps/embed/v1/place?key=API_KEY&q=Space+Needle,Seattle+WA # Maps Embed API的範例
https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=YOUR_API_KEY
https://roads.googleapis.com/v1/snapToRoads?parameters&key=YOUR_API_KEY # 這個也是屬於Routes它的API網址略有不同
https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_API_KEY # 屬於Places
```


## API KEY申請

首先到[Google Cloud](https://console.cloud.google.com/)

- 建立專案
- 左側面板選擇: `APIs & Services` 在他的下拉選單點選 `Credentials`
- 接著上方有`Create credentials`就可以選擇新增API Keys

按下去之後他就會生成一個key給你，之後該key會有一個警告，告訴你這個key不安全

您可以對這個key的使用權新增規範:

- Set an application restriction:
  我建議用網站地址，要用IP也是可以。
  > 只能選一種使用，例如選擇網站就不能在用IP等等

- Restrict key: 例如: 限制這個key(選)只可以使用那些API(預設全部)
  > 建議勾選`Maps Embed API`，這個是全免費，爆量都不用收費。(名稱請確認好是Embed的那個)

弄完之後金鑰的圖示就會變成綠色，表示安全。

> 注意: 保存之後要生效可能需要等到5分鐘

如果您的API Key不幸流出，他好像沒有重新生成的選項可以選。建議直接重建一個即可。

## 付款資訊管理

點選此連結
> https://console.cloud.google.com/billing

可以新增付款帳戶，如果已經有了，這邊也會顯示帳戶資料，每個帳戶都有一個ID，以及當前的狀態

> 它旁邊有一個[My Projects](https://console.cloud.google.com/billing/projects)透過這個連結，您可以知道當前您的Google Cloud有哪些專案的Billing account是啟用的(如果不用建議把它disabled)
>
> 除了能看到狀態，其實也能管理(打開或關閉Billing account)

建議把帳戶名稱重新命名，避免以後看不懂

命名步驟
```
在左側面板: Billing management分類中
選擇: Account management
進入之後，畫面上方有個RENAME BILLING ACCOUNT(這邊會顯示Billing account ID，對之前看到的ID就知道當前是要替哪一個重新命名)
```

此外在重新命名的按鈕旁邊也有`CLOSE BILLING ACCOUNT`的按鈕可以按，如果您真的不想要牽扯任何有關付費的事項

就把他給關閉，關閉的時候他也會跟你清算當前你已使用了多少付費的項目，該金額會清算。


付款關閉之後在[Payments centre](https://payments.google.com)的`Subscriptions & services`原本的google cloud的項目也會被移掉，

> Subscriptions & services: 如果您有AdSense也會在這邊紀錄，AdSense是一個在自己網站投放廣告，來賺取收益的服務，可能當別人瀏覽您的網站、點擊廣告連結，都會有收益，累機收益至少達100美金的時候會撥款給您

就表示當前您的付款資料，不會有任何有關google cloud的內容在內。
