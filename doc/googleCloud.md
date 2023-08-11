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

## [Credentials](https://console.cloud.google.com/apis/credentials)

在google console中有三類可以申請:

1. API Keys
2. OAuth 2.0 Client IDs
3. Service Accounts

### API KEY申請

首先到[Google Cloud](https://console.cloud.google.com/)

- 建立專案
- 左側面板選擇: `APIs & Services` 在他的下拉選單點選 `Credentials`
- 接著上方有`Create credentials`就可以選擇新增`API Keys`

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

> 有關於此Keys的應用可以參考: [google/map/generator.html](https://github.com/CarsonSlovoka/gas-lib/blob/4e680759e262ab143a6ccd59c9e6a9baa93e5d3a/src/pkg/google/map/generator.html#L68-L76)

### OAuth 2.0 Client IDs

也就是使用者要允許第三方程式有某些權利做某些事

例如:

- discord bot: 當您的機器人建置完畢之後，勾選相關需要的相關權限，他會幫您生成出對應的URI，當使用者訪問此網址，當您要把此機器人加入到Server就會被告知此機器人有哪些權限
- [google登入](https://developers.google.com/identity/gsi/web/reference/html-reference?hl=zh-tw#element_with_id_g_id_onload):
  - 簡單來說google會寫好一個腳本，讓使用者`<script>`的方式載入，例如:

    ```html
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <div
        id="g_id_onload"
        data-client_id="xxxx-xxxx.apps.googleusercontent.com"
        data-context="signin"
        data-auto_select="true"
        data-ux_mode="popup"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false">
    </div>
    ```

    點選之後可以進行登入，登入完之後google會使用私鑰來對(Header, Payload)由Header所告知的演算法產生出私鑰進行簽名，產生出signature資料，之後把這個完整的jwt token{Header,Payload,Signature}回傳

    使用者收到此token要驗證，可以由google的[openid-configuration](https://accounts.google.com/.well-known/openid-configuration)查詢它的jwks_uri即可得知[cert](https://www.googleapis.com/oauth2/v3/certs)的內容(它可能會有很多組，用kid來區分用哪一組)，每一組都能計算出一個public key，再經由此公鑰進行驗證，就能知道此token是不是google所產生,

    如果是您就可以從payload得知此使用者的一些公開訊息進而知道是哪一位使用者，之後再進行您自己server的判斷

#### google console cloud申請OAuth 2.0 Client IDs

在google申請此key的時候，首先要先申請OAuth consent screen，

一開始選擇`External`，因為`Internal`只有 Google Workspace才能申請

接著只要把必填欄位填完即可完成OAuth consent screen的申請

> 🧙 OAuth consent screen: 您可能需要考慮加入一些測試人員，該人員才能在OAuth 2.0 Client IDs的應用中被授權通過！

之後就可以開始建立`OAuth 2.0 Client IDs`，完成之後可以在`Client secrets`下載該檔案，檔名類似:`client_secret_123456789012-12345678901234567890123456789123.apps.googleusercontent.com.json`(這個檔案可以重複下載)

程式拿到此檔案就可以開始使用

```yaml
import "golang.org/x/oauth2/google"

func main() {
  bsData, _ := os.ReadFile("client_secret.json")
  config, _ := google.ConfigFromJSON(bsData,
    calendar.CalendarEventsScope, # 查看及編輯所有日曆上的活動
    # calendar.CalendarScope 查看、編輯、共用及永久刪除您可透過 Google 日曆存取的所有日曆
  )

  # 取得要授權同意的url網址，您必須在此網址同意授權您的google帳戶允許某應用程式來具備某種權限做某些事情
  # 注意如果您的應用程式還沒有發佈，想本機測試，那麼使用者必須在OAuth consent screen有被您加入到測試人員的列表之中才能通過
  authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)

  # 使用者要在網頁上取得 授權碼
  # 所謂的網頁，是您自己要依照: OAuth consent screen中指定的redirect URL，這個URL的頁面，是您自己要去實現的
  # 頁面連結，可以使用本機，例如: http://localhost:1234/MyOauth2-callback/
  # 其中當使用者同意之後，google會向您導向的url發送Get的方法，他會有一個code的參數，此內容就是授權代碼
  # 例如: http://localhost:1234/MyOauth2-callback/?code=xxxooo
  _, _ = fmt.Scan(&authCode) # 把授權碼丟給程式

  # 程式在取得授權碼後就能正式的產生token
  token, err := config.Exchange(context.Background(), authCode)

  # 此token為一個struct: https://github.com/golang/oauth2/blob/123456780192348u183471983749187340198742/token.go#L31-L60
  # 可以考慮把此token存成json檔案，之後就不需要再認證

  # 建立client
  ctx := context.Background()
  client := config.Client(ctx, token)

  # 接著就可以在引用相關的API去做事情，
  service, err := calendar.NewService(ctx, option.WithHTTPClient(client))
  # ...
```

以下舉calendar的使用範例
```
service, err := calendar.NewService(ctx, option.WithHTTPClient(client))
event := &calendar.Event{
  Summary: "標題",
  Description: "內容"
  Start: &calendar.EventDateTime{
    DateTime: "2023-08-09T10:00:00Z",
  },
  End: &calendar.EventDateTime{
    DateTime: "2023-08-09T11:00:00Z",
  },
}

newEvent, err := service.Events.Insert(calendarID, event).Do()
fmt.Println("訪問此連結可查看您新增的項目", newEvent.HtmlLink)
```

> 不過要注意，您要使用的API，必須在您的Google Cloud的該專案的library之中也啟用相關API才可以，不然最後Insert會失敗

### [Service Accounts](https://www.youtube.com/watch?v=tSnzoW4RlaQ)

您可以生成出一個新的身份，可以限制擁有那些權限，利用此身份來處理某些事情

以google為例，當您生成出一個Service Account的時候，他會配發一個private key給您(此key不能重新下載)

假下您下載的格式為json，你的程式拿到此檔案就能透過google在各個語言提供的相關API

```yaml
# 此段是以go與為例
"google.golang.org/api/option"
"google.golang.org/api/sheets/v4"
```

來訪問某些服務，接著您可能會想讓spreadsheet去做某些事情

那麼該spreadsheet怎麼確定能不能被訪問呢? 剛剛提到了service account其實就會產生出一個身份，所以生成出來，他其實有一個虛擬的email(`xxx@ooo-fff-123456.iam.gserviceaccount.com`)

此email可以在spreadsheet設定，讓該sheet擁有權限被此身份所訪問，因此最後就能達到完全用後端程式來修改內容。

### 小結

- API KEY: 當您有此Key就能代表該身份，就能做該身份的所有事情，通常API KEY都有一些使用限制或者按使用量來計費等等
- OAuth 2.0 Client IDs: 需要使用者同意是否允許這些權限, 開發者除了實際應用的程式以外，也需要準備一個server來回應redirectURL的內容，才能讓使用者得到授權碼
- Service Accounts: 可以生成一新的身份. client可以使用共用的方式與此身份共享某文件(例如spreadsheet)，程式認此身份透過privateKey來確認，之後就可以開始操作此身份執行哪些行為

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
