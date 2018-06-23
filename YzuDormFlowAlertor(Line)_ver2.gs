/*
 *  在Google雲端的根目錄 , 建立一個資料夾命名為 GAS
 *  新建一個 Google Apps Script , 複製貼上這裡所有的程式碼
 *  Need to import "Parse" library (資源 -> 程式庫 -> 新增 M1lugvAXKKtUxn_vdAG9JZleS6DrsjUUV -> 選擇"版本"7 -> 儲存)
 *  Open Drive API (資源 -> 進階Google服務 -> 開啟Drive API)
 *  需要跑1.5~2分鐘
 */

var student_id = '你的帳號'
var password = '你的密碼'
var LineNotifyToken = "你的LINE Token"

/* reference:https://stackoverflow.com/questions/21621019/google-apps-script-login-to-website-with-http-request, https://gist.github.com/erajanraja24/02279e405e28311f220f557156363d7b
   GAS:https://developers.google.com/apps-script/reference/script/trigger-builder#forSpreadsheet(String)
   https://developers.google.com/apps-script/reference/script/clock-trigger-builder#everyDays(Integer)
   triggerID:https://stackoverflow.com/questions/39057177/google-app-script-trigger-id-format */

/////////
// 主程式
/////////
function Start()
{
  if(create()){
    var time = new Date();
    switch(time.getHours())
    {
      case(2):
      case(3):
      case(4):
      case(5):
      case(6):
      case(7):
        Logger.log("DormNetdisconnected");
        dailyDataflowReminderTriggers();
        triggerFordeleteCertainTimeDrivenTriggers();
        resetCount_LineNotifyTriggers();
        break;
      default:
        Logger.log("DormNetconnected");
        DataflowReminderTriggers();
        triggerFordeleteCertainTimeDrivenTriggers();
        resetCount_LineNotifyTriggers();
        dailyDataflowReminderTriggers();
        break;
    }
  }
}

///////////////////////////
// 爬流量的Trigger(每分鐘)
///////////////////////////
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
// 爬流量的Trigger的Trigger(每天8AM)
//////////////////////////////////////
function dailyDataflowReminderTriggers() {
  // Trigger when the users execute this code
  var cID = ScriptApp.newTrigger('DataflowReminderTriggers')
      .timeBased()
      .inTimezone("Asia/Taipei") // http://joda-time.sourceforge.net/timezones.html
      .atHour(8)
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
// 重置已發訊息量的trigger (定時:每天8AM)
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
  Logger.log(cID);
  // Loop over all triggers
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getUniqueId() == cID) {
      Logger.log("Delete");
      ScriptApp.deleteTrigger(allTriggers[i]);
    }
    if (allTriggers[i].getUniqueId() == cID2) {
      Logger.log("Delete");
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
      .atHour(2)
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
  var newSS = SpreadsheetApp.create('DataAlertor_DB_');
  var driveFile = DriveApp.getFileById(newSS.getId());
  //Logger.log(newSS.getId());
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
  var FileIterator = DriveApp.getFilesByName("DataAlertor_DB_");
  while (FileIterator.hasNext())
  {
    var file = FileIterator.next();
    if (file.getName() == "DataAlertor_DB_")
    {
      var fileID = file.getId();
      Logger.log(fileID);
      return fileID;
    }    
  }
}
///////////////////
// Line Notify API
///////////////////
function lineNotify(token, msg){
  url = "https://notify-api.line.me/api/notify"
  headers = {
    "Authorization": "Bearer " + token, 
    "Content-Type" : "application/x-www-form-urlencoded"
  }
  payload = {'message': msg}
  var options = {
    method:"post",
    payload:payload,
    headers:headers,
    //muteHttpExceptions:true
  }
  r = UrlFetchApp.fetch(url,options);
  return r.status_code
}
