# YzuDormFlowAlertor
元智大學宿舍網路流量監控與提醒

當流量到達2G,3G時會發出Line通知

不需要安裝任何東西

只需要一個Google帳號和Line的帳號

P.S.如果你覺得步驟太繁瑣，加上你有安裝Python

你可以使用這個[簡單版](https://gist.github.com/freelze/8727a16f020baf98fd6ab02cc9c23731)

# 設置作業
## 1.
到[Line Notify的官方網站](https://notify-bot.line.me/zh_TW/)取得token
([教學](http://pythonorz.blogspot.com/2017/12/python-line-notify-line-notify-line.html))
## 2.
到你的[Google雲端硬碟](https://drive.google.com/)裡,

右鍵新增 -> Google 試算表

將第一行第一列的值改成0

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/excel.png)

將這個試算表的網址複製

貼到你的記事本

看起來會像下面這樣

https://docs.google.com/spreadsheets/d/....................................../edit#gid=0

將除了......之外的東西都刪除掉

........是試算表的ID

待會會用到
## 3.
再回到Google雲端硬碟

滑鼠右鍵 -> 更多 -> 連接更多應用程式

搜尋Google Apps Script , 按下"新增"

再一次 滑鼠右鍵 -> 更多 -> Google Apps Script

就會出現下面的畫面

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/GAS.png)

再把上面所有程式碼刪除

複製貼上[YzuDormFlowAlertor.gs](/YzuDormFlowAlertor(Line).gs)的程式碼

### 修改第2行~第5行

> 第2行換成你的元智Portal帳號

> 第3行是元智Portal密碼

> 第4行是第一步時取得的LINE token

> 第5行是第二步時取得的試算表的ID


### 匯入程式庫

點擊 資源 -> 程式庫

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/2.png)

貼上 M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV 後

按下"新增"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/3.png)

選擇"版本"7後,按下"儲存"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/4.png)

### 部屬

發佈 -> 部屬為網路應用程式

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Deploy.png)

選擇 "任何人，甚至是匿名使用者"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/8.png)

可能會出現下面這個畫面

就先點 "進階" , 再點 "前往\[](不安全)"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/9.png)

之後就是一直點允許

### 設定定時觸發器

點擊畫面上方的小時鐘

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Scheduler.png)

加入兩個觸發器

並調整至下方的情況

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Scheduler_2.png)

這樣就大功告成了!
