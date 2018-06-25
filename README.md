元智大學宿舍網路流量監控與提醒 ( YzuDormFlowAlertor )
=========================================================

不需要安裝任何東西，

只需要一個 `Google GSuite`等級的帳號 和 `Line`的帳號(或是Telegram)，

操作一點簡單的設定，

就會每一分鐘檢查您宿網使用的流量，

當流量到達1G、2G、3G、4G時，

自動發出Line通知至您的裝置。

如果你不再住宿或者畢業之後，

也不需要做任何處理，

它會自動停止。

## 元智大學GSuite帳號免費申請方式

登入你的YZU Portal，

點選 `G Suite 帳號申請`，

並依說明申請，

這樣你就有無限的雲端空間和更好的服務。

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Gsuite.png)

• Line 提醒畫面
-----------------
![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/LINE_demo.jpg)

• Telegram 提醒畫面 & 利用指令/data即時查詢
---------------------------------------------
![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/TGDemo_photo_2018-06-24_23-06-01.jpg)

P.S. Telegram 目前沒有教學文，有興趣請參考[永格天的教學影片](https://youtu.be/On9yeMtG2Wg)

# 一. 設置作業

## 1.

到[Line Notify的官方網站](https://notify-bot.line.me/zh_TW/)取得`權杖token`
([教學](http://pythonorz.blogspot.com/2017/12/python-line-notify-line-notify-line.html))

## 2.

到你的Google雲端硬碟

在根目錄裡新增一個資料夾，並命名為 `GAS` 

進去GAS資料夾內

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/GAS_loc.png)

點`滑鼠右鍵` -> `更多` -> `連接更多應用程式`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/%E9%80%A3%E6%8E%A5%E6%9B%B4%E5%A4%9A%E6%87%89%E7%94%A8%E7%A8%8B%E5%BC%8F.png)

在`搜尋應用程式`的欄位貼上 `Google Apps Script` , 按下`Enter` -> `連接`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/search.png)

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/%E9%80%A3%E6%8E%A5.png)

再一次 `滑鼠右鍵` -> `更多` -> `Google Apps Script`

就會出現下面的畫面

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/GAS.png)

再把上面所有程式碼刪除

複製貼上[YzuDormFlowAlertor(Line)_V2.gs](/YzuDormFlowAlertor(Line)_V2.gs)的程式碼

### • 修改第5行~第7行

請更改引號`''`裡面的文字，`''`請不要刪除

  > <strong>第 5 行 : 你的元智Portal`帳號`

  > 第 6 行 : 你的元智Portal`密碼`

  > 第 7 行 : 第一步取得的 `LINE權杖token`<strong>
  
### • 更改檔案名稱

`檔案` -> ` 重新命名 `

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/rename.png)

隨便取個名字 -> 確定

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/name.png)

### • 匯入程式庫 ( author : [Ivan Kutil](https://www.kutil.org/2016/01/easy-data-scrapping-with-google-apps.html) )

點擊 `資源` -> `程式庫`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/2.png)

在新增程式庫貼上 `M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV` 後

按下`新增`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/3.png)

選擇`版本` 7 後 -> 按下`儲存`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/4.png)

### • 開啟Drive API

`資源` -> `進階Google服務` -> 開啟`Drive API` -> `確定`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/resouce_googleServie.png)

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/DriveAPI.png)

# 二. 執行

執行`Start`函式

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Start.png)

它這時會出現「需要授權」訊息，點選`核對權限`

接著點自己的GSuite帳號 -> 點選`允許`

再來讓它跑1~2分鐘

正在執行的小視窗不見後

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/%E6%AD%A3%E5%9C%A8%E5%9F%B7%E8%A1%8C.png)

點擊畫面上方的`小時鐘`

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/Scheduler.png)

查看是否有出現下面`4`個觸發器

![image](https://raw.githubusercontent.com/freelze/YzuDormFlowAlertor/master/Pictures/List_triggers.png)

如果有那就大功告成囉!

## 給進階使用者 

Google Apps Script 最短只能每一分鐘觸發一次

如果你有安裝 Python

可以使用這個 [非線上版](https://gist.github.com/freelze/8727a16f020baf98fd6ab02cc9c23731)

每兩秒顯示一次流量

另外，GSuite等級的帳號

觸發器(Triggers)的總執行時間每天限制6小時 ( [扣打 quotas](https://script.google.com/dashboard) )

這個程式一天大概會用到1小時12分鐘 `計算方式: 4(sec) x 60 x 18 = 4320(sec) = 72(min) = 1h,12min`

而免費版Google帳號只提供1小時

所以才會請你申請GSuite

