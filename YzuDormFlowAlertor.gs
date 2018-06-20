// reference:https://stackoverflow.com/questions/21621019/google-apps-script-login-to-website-with-http-request, https://gist.github.com/erajanraja24/02279e405e28311f220f557156363d7b
var student_id = '帳號'
var password = '密碼'
var LineNotifyToken = 你的LINE Token""
var sheetID = "Google試算表ID"

function DataflowReminder() {
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
  var regExp = /<font size=\"1\" color=\"red\"([\s\S]*?)<\/font>/gi;
  var DataflowHTML = html.getContentText().match(regExp);
  var regExp = /\d+M/;
  var Dataflow_M = DataflowHTML[1].match(regExp);
  var msg = "宿網流量達到" + Dataflow_M;
  var available = 4096-parseInt(Dataflow_M);
  
  var SpreadSheet = SpreadsheetApp.openById(sheetID);
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  var count_LineNotify = Sheet.getRange(1, 1).getValue();
  
  Logger.log(count_LineNotify);
  
  if( parseInt(Dataflow_M) >= 2048 && count_LineNotify == 0 ) // 2048 MB
  {
    lineNotify(LineNotifyToken, "\n宿舍網路:\n您已經使用超過2GB\n您還剩" + available + "MB可用");
    Sheet.getRange(1, 1).setValue(1);
    Logger.log(count_LineNotify);
  }
  else if( parseInt(Dataflow_M) >= 3072 && count_LineNotify == 1 ) // 3072 MB
  {
    lineNotify(LineNotifyToken, "\n宿舍網路:\n您已經使用超過3GB\n您還剩" + available + "MB可用");
    Sheet.getRange(1, 1).setValue(2);
  }
  else if( parseInt(Dataflow_M) >= 4096 && count_LineNotify == 2 )
  {
    lineNotify(LineNotifyToken, "\n宿舍網路:\n斷網囉! 本日使用量:" + Dataflow_M);
    Sheet.getRange(1, 1).setValue(3);
  }
}
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
// 定時:每天凌晨兩點
function resetCount_LineNotify()
{
  var SpreadSheet = SpreadsheetApp.openById(sheetID);
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  Sheet.getRange(1, 1).setValue(0);
}
