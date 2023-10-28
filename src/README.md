## build&test

請在此資料夾執行以下指令來初始化
> npm install

build:
> npm run build

test:
> npm run test

## 如何debug

運行以下指令

> npm run debug-test

會執行

```yaml
node --inspect-brk ../out/test.mjs # --inspect-brk 會在一開始就進行中斷
# node --inspect-brk=127.0.0.1:8888 ../out/test.mjs # 指定ip和port
# node --inspect ../out/test.mjs # 啟動debugger，但不在第一行停止
```

接著會在console視窗看到以下訊息

```yaml
Debugger listenin]g on ws://127.0.0.1:8888/9789964e-716f-4ee2-9f2c-bc06aa95109d
# For help, see: https://nodejs.org/en/docs/inspector
```

用chrome瀏覽器，打開分頁，訪問

> chrome://inspect/#devices

在`Configure...`把您的ip還有port加上去: 例如:

```
127.0.0.1:8888
```

接著按下面的`Open dedicated DevTools for Node`

他會跳出一個新的分頁，再點選其中的Sources頁籤，就可以正常下中斷點和查看變數了
