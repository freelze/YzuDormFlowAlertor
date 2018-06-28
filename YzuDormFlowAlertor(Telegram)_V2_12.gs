// Need to import parse library (資源 -> 程式庫 -> 新增 M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV -> 版本7 -> 儲存)
// Open Drive API (資源 -> 進階Google服務 -> 開啟Drive API)
// 需要跑1.5~2分鐘

var student_id = ''
var password = ''
var id = "telegramUserID"
var key = "telegramBOTkey"

// 記得 https://api.telegram.org/botKEY/setWebhook?url=

// reference:https://stackoverflow.com/questions/21621019/google-apps-script-login-to-website-with-http-request, https://gist.github.com/erajanraja24/02279e405e28311f220f557156363d7b
// GAS ref:https://developers.google.com/apps-script/reference/script/trigger-builder#forSpreadsheet(String)
// https://developers.google.com/apps-script/reference/script/clock-trigger-builder#everyDays(Integer)
// triggerID:https://stackoverflow.com/questions/39057177/google-app-script-trigger-id-format

/////////
// 主程式
/////////
function Start()
{ 
  if(create()){
    var time = new Date();
    switch(time.getHours())
    {
      case(0):
      case(1):
      case(2):
      case(3):
      case(4):
      case(5):
      case(6):
      case(7):
        //Logger.log("DormNetdisconnected");
        dailyDataflowReminderTriggers();
        triggerFordeleteCertainTimeDrivenTriggers();
        resetCount_LineNotifyTriggers();
        break;
      default:
        //Logger.log("DormNetconnected");
        DataflowReminderTriggers();
        triggerFordeleteCertainTimeDrivenTriggers();
        resetCount_LineNotifyTriggers();
        dailyDataflowReminderTriggers();
        break;
    }
  }
}
// 回傳使用量
function scrapeDataflow(){
  var content = UrlFetchApp.fetch("https://flowweb.yzu.edu.tw/register/activate.php").getContentText();
  var scraped = Parser
                    .data(content)
                    .from('<form')
                    .to('</form>')
                    .build()
  var value = Parser
                    .data(scraped)
                    .from('name="as_fid"')
                    .to('/>')
                    .build();
  var as_fid = Parser
                    .data(value)
                    .from('value="')
                    .to('"')
                    .build();
  var payload = 
  {
    'action':'register',
    'as_fid':as_fid,
    'mpwd':password, 
    'student_id':student_id, 
    'zh_tw':'1'
  }
  var options =
  {
     "method" : "post",
     "payload" : payload,
     "followRedirects" : false
  };
  var login = UrlFetchApp.fetch("https://flowweb.yzu.edu.tw/register/activate.php" , options);
  var sessionDetails = login.getAllHeaders()['Set-Cookie'];
  var html = UrlFetchApp.fetch("https://flowweb.yzu.edu.tw/register/activate.php", 
                                  {"headers" : {"Cookie" : sessionDetails},
                                   "method" : "post",
                                   "payload" : payload,
                                  });
  var exceptHandler = html.getContentText("BIG5");
  var title = Parser
                    .data(exceptHandler)
                    .from('<title>')
                    .to('</title>')
                    .build();

  try {
    if(title.length == 13) throw "帳號或密碼錯誤,還是您並沒有住在宿舍?";
    /*var regExp = /<font size=\"1\" color=\"red\"([\s\S]*?)<\/font>/gi;
    var DataflowHTML = html.getContentText().match(regExp);*/
    var regExp = /\d+M/;
    //var Dataflow_M = DataflowHTML[1].match(regExp);
   
    var regExp2 = /<font size=\"1\"([\s\S]*?)<\/font>/gi;
    var DataflowHTML2 = html.getContentText().match(regExp2);
    var download = DataflowHTML2[21].match(regExp);
    var upload = DataflowHTML2[22].match(regExp);
    var total = DataflowHTML2[24].match(regExp);
    var data= {
      download:download,
      upload:upload,
      total:total
    }
    //Logger.log(data);
    return data;
  }
  catch (err) {
  // 用於處理例外的陳述式
    Logger.log("Error: " + err);
    //killAllTriggers();
    return false;
  }
}
// 剩下多少上網時間 ( 兩點斷網的情況 )
function getRestTime(){
  var time = new Date();
  var restTime;
    //Logger.log(time.getHours());
    //Logger.log(time.getMinutes());
  switch(time.getHours()){
	  case(0):
	  case(1):
      case(2):
      case(3):
      case(4):
      case(5):
      case(6):
      case(7):
        restTime = "(早上八點流量會刷新歸零)";
        return restTime;
        //Logger.log("DormNetdisconnected");
        break;
      default:
        var min = 60-time.getMinutes();
        if(min == 60){
          var hour = 24-time.getHours();
          restTime = hour+"小時";
        }
        else{
          var hour = 23-time.getHours();
          restTime = hour + "小時" + min + "分鐘";
        }
        break;
    }
  return restTime;
}
//////////////
// 爬取宿網流量
//////////////
function DataflowReminder() {
  var Dataflow_dict = scrapeDataflow();

  if(Dataflow_dict){
  var Dataflow_M = Dataflow_dict.total;
  var upload = Dataflow_dict.upload;
  var download = Dataflow_dict.download;
  var available = 4096-parseInt(Dataflow_M);
  var SpreadSheet = SpreadsheetApp.openById(openSpreadsheetByName());
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  if(Sheet.getRange(1, 1).isBlank())
    Sheet.getRange(1, 1).setValue(0);
  var count_LineNotify = Sheet.getRange(1, 1).getValue();
  var restTime = getRestTime();
  if( parseInt(Dataflow_M) >= 1024 && count_LineNotify == 0 ) 
  {
    sendtext("\n宿舍網路:\n\n您已經使用超過1GB\n您還剩 " + available + " MB (" + parseInt(available/4096*100) + "%) 可用\n離凌晨12點還有: "+restTime+"\n\n以下是統計資料:\n上傳量: " + parseInt(upload) + " MB\n下載量: " + parseInt(download) + " MB\n總累計量: " + parseInt(Dataflow_M) + " MB");
    Sheet.getRange(1, 1).setValue(1);
  } 
  else if( parseInt(Dataflow_M) >= 2048 && count_LineNotify == 1 ) // 2048 MB
  {
     sendtext("\n宿舍網路:\n\n您已經使用超過2GB\n您還剩 " + available + " MB (" + parseInt(available/4096*100) + "%) 可用\n離凌晨12點還有: "+restTime+"\n\n以下是統計資料:\n上傳量: " + parseInt(upload) + " MB\n下載量: " + parseInt(download) + " MB\n總累計量: " + parseInt(Dataflow_M) + " MB");
    Sheet.getRange(1, 1).setValue(2);
  }
  else if( parseInt(Dataflow_M) >= 3072 && count_LineNotify == 2 ) // 3072 MB
  {
     sendtext("\n宿舍網路:\n\n您已經使用超過3GB\n您還剩 " + available + " MB (" + parseInt(available/4096*100) + "%) 可用\n離凌晨12點還有: "+restTime+"\n\n以下是統計資料:\n上傳量: " + parseInt(upload) + " MB\n下載量: " + parseInt(download) + " MB\n總累計量: " + parseInt(Dataflow_M) + " MB");
    Sheet.getRange(1, 1).setValue(3);
  }
  else if( parseInt(Dataflow_M) >= 4096 && count_LineNotify == 3 )
  {
    sendtext("\n宿舍網路:\n\n斷網囉!" + "\n以下是統計資料:\n上傳量: " + parseInt(upload) + " MB\n下載量: " + parseInt(download) + " MB\n總累計量: " + parseInt(Dataflow_M) + " MB");
    Sheet.getRange(1, 1).setValue(4);
  }
  }  
}
///////////////////
// 刪除所有Triggers
///////////////////
function killAllTriggers(){
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
/////////////////////////
// 爬流量的Trigger(每分鐘)
/////////////////////////
function DataflowReminderTriggers() {
  // Trigger when the users execute this code
  var cID = ScriptApp.newTrigger('DataflowReminder')
      .timeBased()
      .everyMinutes(1)
      .create();
  // store certain triggerID
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++) {
    var cID = allTriggers[i].getUniqueId();
  }
  var SpreadSheet = SpreadsheetApp.openById(openSpreadsheetByName());
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  Sheet.getRange(2, 1).setValue(cID);
}
//////////////////////////////////////
// 爬流量的Trigger的Trigger(定時:每天6AM)
//////////////////////////////////////
function dailyDataflowReminderTriggers() {
  // Trigger when the users execute this code
  var cID = ScriptApp.newTrigger('DataflowReminderTriggers')
      .timeBased()
      .inTimezone("Asia/Taipei") // http://joda-time.sourceforge.net/timezones.html
      .atHour(6)
      .everyDays(1)
      .create();
}
//////////////////
// 重置已發訊息量
//////////////////
function resetCount_LineNotify()
{
  var SpreadSheet = SpreadsheetApp.openById(openSpreadsheetByName());
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  Sheet.getRange(1, 1).setValue(0);
}
////////////////////////////////////////////////////////
// trigger for resetCount_LineNotify() (定時:每天8AM)
///////////////////////////////////////////////////////
function resetCount_LineNotifyTriggers() {
  // Trigger every Minute at 8 o'clock
  ScriptApp.newTrigger('resetCount_LineNotify')
      .timeBased()
      .inTimezone("Asia/Taipei") // http://joda-time.sourceforge.net/timezones.html
      .atHour(8)
      .everyDays(1)
      .create();
}
//////////////////////////
// delete certain trigger
//////////////////////////
function deleteCertainTimeDrivenTriggers() {
  var SpreadSheet = SpreadsheetApp.openById(openSpreadsheetByName());
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  var cID = Sheet.getRange(2,1).getValue();
  var cID2 = Sheet.getRange(3,1).getValue();
  // Loop over all triggers
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getUniqueId() == cID) {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
    if (allTriggers[i].getUniqueId() == cID2) {
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
  }
}
///////////////////////////////////////////////
// Trigger for deleteCertainTimeDrivenTriggers
///////////////////////////////////////////////
function triggerFordeleteCertainTimeDrivenTriggers() {
  // Trigger every Minute at 2 o'clock
  ScriptApp.newTrigger('deleteCertainTimeDrivenTriggers')
      .timeBased()
      .inTimezone("Asia/Taipei") // http://joda-time.sourceforge.net/timezones.html
      .atHour(0)
      .everyDays(1)
      .create();
}
///////////////////////////////////////////////////
// 找GAS資料夾ID,並call createSpreadsheets function
///////////////////////////////////////////////////
function create(){
  if( createSpreadsheets(getFolderID("GAS")) ){
    return true;
  }
}
//////////////////////////////////////////////////////////////////////////////
// https://productforums.google.com/forum/#!msg/docs/VQcnThJPuY0/0OTD_IqjCwAJ
//////////////////////////////////////////////////////////////////////////////
function createSpreadsheets(folderId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var df = DriveApp.getFolderById(folderId);
  var newSS = SpreadsheetApp.create('TG_DataAlertor_DB');
  var driveFile = DriveApp.getFileById(newSS.getId());
  df.addFile(driveFile);
  DriveApp.removeFile(driveFile);
  return true;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
// https://googleappsscriptdeveloper.wordpress.com/2017/03/04/how-to-find-your-google-drive-folder-id/
///////////////////////////////////////////////////////////////////////////////////////////////////////
function getFolderID(folderName)
{
  var folders = DriveApp.getFolders();
  while (folders.hasNext()) {
   var folder = folders.next();
   if(folder.getName() == folderName)
   {
    return folder.getId();
   }
 }
}
/////////////////////////////////////////////////////////////////////////////////////
// Open Google Docs Spreadsheet by name 
// https://stackoverflow.com/questions/14221264/open-google-docs-spreadsheet-by-name
/////////////////////////////////////////////////////////////////////////////////////
function openSpreadsheetByName(){
  var FileIterator = DriveApp.getFilesByName("TG_DataAlertor_DB");
  while (FileIterator.hasNext())
  {
    var file = FileIterator.next();
    if (file.getName() == "TG_DataAlertor_DB")
    {
      var fileID = file.getId();
      return fileID;
    }    
  }
}
///////////////////
// Telegram API
///////////////////
function doPost(e){
  var update = JSON.parse(e.postData.contents);
  // Make sure this is update is a type message
  if (update.hasOwnProperty('message')){
    var msg = update.message;
    if (msg.text == '/data'){
      var restTime = getRestTime();
      var Dataflow_M = scrapeDataflow();
      if(Dataflow_M){
        var total = Dataflow_M.total;
        var upload = Dataflow_M.upload;
        var download = Dataflow_M.download;
        var available = 4096-parseInt(total);
        var text = ("\n宿舍網路:\n\n您還剩 " + available + " MB (" + parseInt(available/4096*100) + "%) 可用\n離凌晨兩點還有: "+restTime+"\n\n以下是統計資料:\n上傳量: " + parseInt(upload) + " MB\n下載量: " + parseInt(download) + " MB\n總累計量: " + parseInt(total) + " MB");
        sendtext(text);
      }
    }
  }
}
// 
function sendtext(data){
        var H = '<b>bold</b>, <strong>bold</strong>\
<i>italic</i>, <em>italic</em>\
<a href="http://www.example.com/">inline URL</a>\
<code>inline fixed-width code</code>\
<pre>pre-formatted fixed-width code block</pre>'
        var payload = {
        "method": "sendMessage",
        'chat_id': id,
        'text': data
    }
    start(payload);
}
//===================================以下是標準發送==================================================
function start(payload) {
    var data = {
        "method": "post",
        "payload": payload
    }
    var returned = UrlFetchApp.fetch("https://api.telegram.org/bot" + key + "/", data);
}
