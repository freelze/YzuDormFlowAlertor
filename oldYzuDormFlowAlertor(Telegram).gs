// reference:https://stackoverflow.com/questions/21621019/google-apps-script-login-to-website-with-http-request, https://gist.github.com/erajanraja24/02279e405e28311f220f557156363d7b

// 記得setwebhook https://api.telegram.org/botKEY/setWebhook?url=https://...
var student_id = '帳號'
var password = '密碼'
var sheetID = "Google試算表ID"
var id = "你的Telegram ID"
var key = "機器人的token"

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
  if(Sheet.getRange(1, 1).isBlank())
    Sheet.getRange(1, 1).setValue(0);
  var count_LineNotify = Sheet.getRange(1, 1).getValue();
  
  Logger.log(count_LineNotify);
  
  if( parseInt(Dataflow_M) >= 2048 && count_LineNotify == 0 ) // 2048 MB
  {
    sendtext("\n宿舍網路:\n您已經使用超過2GB\n您還剩" + available + "MB可用");
    Sheet.getRange(1, 1).setValue(1);
    Logger.log(count_LineNotify);
  }
  else if( parseInt(Dataflow_M) >= 3072 && count_LineNotify == 1 ) // 3072 MB
  {
    sendtext("\n宿舍網路:\n您已經使用超過3GB\n您還剩" + available + "MB可用");
    Sheet.getRange(1, 1).setValue(2);
  }
  else if( parseInt(Dataflow_M) >= 4096 && count_LineNotify == 2 )
  {
    sendtext("\n宿舍網路:\n斷網囉! 本日使用量:" + Dataflow_M);
    Sheet.getRange(1, 1).setValue(3);
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
//===================================以下是標準發送跟記下Log==================================================
function start(payload) {
    var data = {
        "method": "post",
        "payload": payload
    }
    var returned = UrlFetchApp.fetch("https://api.telegram.org/bot" + key + "/", data);
}
// 定時:每天凌晨兩點
function resetCount_LineNotify()
{
  var SpreadSheet = SpreadsheetApp.openById(sheetID);
  var Sheet = SpreadSheet.getSheetByName("工作表1");
  Sheet.getRange(1, 1).setValue(0);
}
