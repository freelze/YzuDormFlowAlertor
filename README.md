# YzuDormFlowAlertor
元智大學宿舍網路流量監控與提醒
當流量到達2G,3G時會發出Line通知

# 設置作業
## 1.
到[Line Notify的官方網站](https://notify-bot.line.me/zh_TW/)取得token
([教學](http://pythonorz.blogspot.com/2017/12/python-line-notify-line-notify-line.html))
## 2.
到你的[Google雲端硬碟](https://drive.google.com/)裡,

右鍵新增 -> Google 試算表

將第一行第一列的值改成0

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

就會出現下面的畫面

再把上面所有程式碼刪除

複製貼上YzuDormFlowAlertor.gs的程式碼

### 第2行~第5行需要更改
---------------------------------------
##### 第2行換成你的元智Portal帳號

##### 第3行是元智Portal密碼

##### 第4行是第一步時取得的LINE token

##### 第5行是第二步時取得的試算表的ID
---------------------------------------

再來要匯入程式庫

點擊 資源 -> 程式庫

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/2.png)

貼上 M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV 後

按下"新增"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/3.png)

選擇"版本"7後,按下"儲存"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/4.png)

接著在點擊畫面上方的小時鐘

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Scheduler.png)
    
