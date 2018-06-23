# YzuDormFlowAlertor

元智大學宿舍網路流量監控與提醒

當流量到達1G,2G,3G時會發出Line通知

不需要安裝任何東西

只需要一個 Google帳號 和 Line的帳號(或是Telegram)

### 提醒畫面 ( Line )

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/LINE.jpg)

# 一. 設置作業

## 1.

到[Line Notify的官方網站](https://notify-bot.line.me/zh_TW/)取得token
([教學](http://pythonorz.blogspot.com/2017/12/python-line-notify-line-notify-line.html))

## 2.

到你的Google雲端硬碟

在根目錄裡新增一個資料夾，並命名為 GAS 

進去GAS資料夾內

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/GAS_loc.png)

點滑鼠右鍵 -> 更多 -> 連接更多應用程式

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/%E9%80%A3%E6%8E%A5%E6%9B%B4%E5%A4%9A%E6%87%89%E7%94%A8%E7%A8%8B%E5%BC%8F.png)

在"搜尋應用程式"的欄位貼上 Google Apps Script , 按下"enter"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/search.png)

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/%E9%80%A3%E6%8E%A5.png)

再一次 滑鼠右鍵 -> 更多 -> Google Apps Script

就會出現下面的畫面

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/GAS.png)

再把上面所有程式碼刪除

複製貼上[YzuDormFlowAlertor(Line)_ver2.gs](/YzuDormFlowAlertor(Line)_ver2.gs)的程式碼

### 修改第9行~第11行

> 第9行換成你的元智Portal帳號

> 第10行是元智Portal密碼

> 第11行是第一步時取得的LINE token

### 匯入程式庫 ( author : [Ivan Kutil](https://www.kutil.org/2016/01/easy-data-scrapping-with-google-apps.html) )

點擊 資源 -> 程式庫

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/2.png)

貼上 M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV 後

按下"新增"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/3.png)

選擇"版本"7後,按下"儲存"

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/4.png)

### 開啟Drive API

資源 -> 進階Google服務 -> 開啟Drive API

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/resouce_googleServie.png)

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/DriveAPI.png)

# 二. 執行

執行Start函式

它這時會要你授權，就是點自己的Google帳號 -> 允許

接著讓它跑1.5~2分鐘

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Start.png)

完成後點擊畫面上方的小時鐘

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Scheduler.png)

查看是否有出現下面4個觸發器

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/TriggersList.png)

如果有那就大功告成囉!

之後就可以不用管它

它每天都會幫你查看流量

等你畢業之後再把它刪掉

## 給進階使用者 

如果你有安裝Python

可以使用這個 [非線上的簡單版](https://gist.github.com/freelze/8727a16f020baf98fd6ab02cc9c23731)

每兩秒抓一次流量
