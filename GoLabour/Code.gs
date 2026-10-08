/**
 * GoLabour NFC Timesheet — Google Apps Script backend
 * Deploy as a Web App from a Google Sheet, execute as YOU, access ANYONE.
 * This is a pilot. Clock-in is not authenticated: see README security notes.
 */
const CFG_ = {
  shifts: 'Shifts', approvals: 'Approvals', audit: 'Audit',
  timezone: 'Australia/Sydney',
  shiftHeaders: ['ID','Site','Worker name','Worker code','Shift date','Clock in (local)','Clock out (local)','Break (minutes)','Hours','Status','Approval ID','Clock in (epoch ms)','Clock out (epoch ms)','Notes','Recorded at (local)'],
  approvalHeaders: ['Approval ID','Site','Shift date','Supervisor name','Approved at (local)','Approved shift IDs','Total hours','Signature strokes JSON'],
  auditHeaders: ['Recorded at (local)','Event','Record ID','Site','Worker code','Notes']
};

function doGet(e) {
  const tpl=HtmlService.createTemplateFromFile('Index');
  tpl.siteHint=String((e&&e.parameter&&e.parameter.site)||'').slice(0,80);
  return tpl.evaluate()
    .setTitle('GoLabour Solutions | NFC Timesheet')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/** Run ONCE from the Apps Script editor, attached to your Google Sheet. */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open a Google Sheet first, then Extensions > Apps Script.');
  [[CFG_.shifts,CFG_.shiftHeaders],[CFG_.approvals,CFG_.approvalHeaders],[CFG_.audit,CFG_.auditHeaders]].forEach(([name, headers]) => {
    let tab = ss.getSheetByName(name);
    if (!tab) tab=ss.insertSheet(name);
    if (tab.getLastRow() === 0) tab.appendRow(headers);
    tab.setFrozenRows(1);
    // Keep dates, codes and display timestamps as text. Google Sheets would
    // otherwise coerce YYYY-MM-DD into a Date object and break day matching.
    const textColumns=name===CFG_.shifts?[1,2,3,4,5,6,7,10,11,14,15]:name===CFG_.approvals?[1,2,3,4,5,6,8]:[1,2,3,4,5,6];
    textColumns.forEach(c=>tab.getRange(2,c,Math.max(1,tab.getMaxRows()-1),1).setNumberFormat('@'));
    tab.getRange(1,1,1,headers.length).setBackground('#171a18').setFontColor('#ede5d6').setFontWeight('bold');
  });
  return 'Sheets ready. Set SUPERVISOR_PIN in Script Properties before using supervisor functions.';
}

function sheets_() {
  const s=SpreadsheetApp.getActiveSpreadsheet();
  if (!s) throw new Error('This script must be bound to the destination Google Sheet.');
  const shifts=s.getSheetByName(CFG_.shifts), approvals=s.getSheetByName(CFG_.approvals), audit=s.getSheetByName(CFG_.audit);
  if(!shifts || !approvals || !audit) throw new Error('Run setupSheets() from the editor first.');
  return {shifts,approvals,audit};
}
function local_(d, pattern) { return Utilities.formatDate(d, CFG_.timezone, pattern || 'yyyy-MM-dd HH:mm'); }
function text_(v,max,label) { const t=String(v??'').trim().replace(/[\x00-\x1f]/g,' '); if(!t || t.length>max) throw new Error(label+' is required (max '+max+' characters).'); return t; }
function site_(v) { return text_(v,80,'Site / project'); }
function code_(v) { const t=text_(v,24,'Worker code').toUpperCase(); if(!/^[A-Z0-9_-]{2,24}$/.test(t))throw new Error('Worker code must have 2–24 letters, numbers, _ or -.'); return t; }
function asDate_(v) { return v instanceof Date ? local_(v,'yyyy-MM-dd') : String(v); }
function asStamp_(v) { return v instanceof Date ? local_(v) : String(v||''); }
function date_(v) { const t=text_(v,10,'Shift date'); if(!/^\d{4}-\d{2}-\d{2}$/.test(t)) throw new Error('Use YYYY-MM-DD date format.'); return t; }
function audit_(tabs, action, id, site, code, detail) {tabs.audit.appendRow([local_(new Date()),action,id,site,code||'',detail||'']);}
function lock_(fn) {const l=LockService.getScriptLock(); if(!l.tryLock(12000))throw new Error('System is busy; please try again.');try{return fn();}finally{l.releaseLock();}}
function rows_(sheet) { const last=sheet.getLastRow(); return last>1?sheet.getRange(2,1,last-1,sheet.getLastColumn()).getValues():[]; }
function pin_ (pin) {
  const expected=PropertiesService.getScriptProperties().getProperty('SUPERVISOR_PIN');
  if (!expected || expected.length<6) throw new Error('Supervisor PIN is not configured. Ask the administrator to set SUPERVISOR_PIN (6+ characters) in Script Properties.');
  if(String(pin||'')!==expected) throw new Error('Invalid supervisor PIN.');
}
function newId_(prefix) { return prefix+'-'+Utilities.getUuid().slice(0,8).toUpperCase(); }

function clockIn(form) {
  const name=text_(form.workerName,90,'Worker name'), worker=code_(form.workerCode), site=site_(form.site);
  const note=String(form.note||'').trim().slice(0,180);
  return lock_(()=>{
    const tabs=sheets_();
    for(const row of rows_(tabs.shifts)) {
      if(String(row[1])===site && String(row[3])===worker && !row[12])
        throw new Error('This worker already has an open shift at this site. Clock out before starting another.');
    }
    const now=new Date(), id=newId_('SHIFT'), day=local_(now,'yyyy-MM-dd');
    tabs.shifts.appendRow([id,site,name,worker,day,local_(now),'',0,0,'CLOCKED IN','',now.getTime(),'',note,local_(now)]);
    audit_(tabs,'CLOCK IN',id,site,worker,'Worker-submitted');
    return {id,workerName:name,workerCode:worker,site,day,clockIn:local_(now),status:'CLOCKED IN'};
  });
}

function clockOut(form) {
  const worker=code_(form.workerCode),site=site_(form.site);
  const breakMin=Number(form.breakMinutes||0);
  if(!Number.isInteger(breakMin)||breakMin<0||breakMin>720)throw new Error('Break must be 0–720 whole minutes.');
  return lock_(()=>{
    const tabs=sheets_(), data=rows_(tabs.shifts);
    for(let i=data.length-1;i>=0;i--){
      const row=data[i];
      if(String(row[1])===site && String(row[3])===worker && !row[12]){
        const now=new Date(), elapsed=(now.getTime()-Number(row[11]))/3600000;
        if(elapsed>48)throw new Error('Shift exceeds 48 hours; ask the administrator to correct it.');
        const hours=+(elapsed-breakMin/60).toFixed(2);
        if(hours<0)throw new Error('Break cannot exceed time worked.');
        const rowNumber=i+2;
        tabs.shifts.getRange(rowNumber,7,1,4).setValues([[local_(now),breakMin,hours,'CLOCKED OUT']]);
        tabs.shifts.getRange(rowNumber,13).setValue(now.getTime());
        audit_(tabs,'CLOCK OUT',row[0],site,worker,'Break '+breakMin+' min');
        return {id:row[0],workerName:row[2],workerCode:worker,site,day:row[4],clockIn:row[5],clockOut:local_(now),breakMinutes:breakMin,hours,status:'CLOCKED OUT'};
      }
    }
    throw new Error('No open shift found for that worker code at this site.');
  });
}

function daily_(site, day, tabs) {
  const shifts=rows_(tabs.shifts).filter(r=>String(r[1])===site&&asDate_(r[4])===day).map(r=>({
    id:String(r[0]),site:String(r[1]),workerName:String(r[2]),workerCode:String(r[3]),day:asDate_(r[4]),
    clockIn:asStamp_(r[5]),clockOut:asStamp_(r[6]),breakMinutes:Number(r[7]||0),hours:Number(r[8]||0),
    status:String(r[9]),approvalId:String(r[10]||''),notes:String(r[13]||'')
  }));
  const approvals=rows_(tabs.approvals).filter(r=>String(r[1])===site&&asDate_(r[2])===day).map(r=>({
    id:String(r[0]),supervisor:String(r[3]),approvedAt:asStamp_(r[4]),shiftIds:String(r[5]).split(',').filter(Boolean),
    hours:Number(r[6]||0),signature:String(r[7]||'[]')
  }));
  return {site,day,timezone:CFG_.timezone,shifts,approvals};
}

function getDailyShifts(form) {
  pin_(form.supervisorPin);
  const site=site_(form.site),day=date_(form.day);
  return daily_(site,day,sheets_());
}

function approveDay(form) {
  pin_(form.supervisorPin);
  const site=site_(form.site),day=date_(form.day),supervisor=text_(form.supervisorName,90,'Supervisor name');
  if(typeof form.signature!=='string'||form.signature.length>35000)throw new Error('Signature data is too large.');
  let points;
  try {points=JSON.parse(form.signature);}catch(e){throw new Error('Invalid signature.');}
  if(!Array.isArray(points)||points.length<1||points.length>25)throw new Error('Draw your signature before approving.');
  let totalPoints=0;
  for(const stroke of points){
    if(!Array.isArray(stroke)||stroke.length<1)throw new Error('Invalid signature stroke.');
    totalPoints+=stroke.length;
    for(const p of stroke) if(!Array.isArray(p)||p.length!==2||p.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0||n>1000))throw new Error('Invalid signature coordinate.');
  }
  if(totalPoints<4||totalPoints>700)throw new Error('Please sign clearly (maximum 700 sampled points).');
  if(!Array.isArray(form.shiftIds)||form.shiftIds.some(v=>typeof v!=='string'))throw new Error('Invalid timesheet selection.');
  return lock_(()=>{
    const tabs=sheets_(),rows=rows_(tabs.shifts);
    const eligible=rows.map((r,i)=>({r,i})).filter(({r})=>String(r[1])===site&&asDate_(r[4])===day&&r[12]&&!r[10]);
    const ids=eligible.map(({r})=>String(r[0])).sort();
    const submitted=form.shiftIds.slice().sort();
    if(ids.length===0)throw new Error('No completed, unsigned shifts to approve.');
    if(ids.length!==submitted.length || ids.some((id,i)=>id!==submitted[i]))throw new Error('Timesheet changed. Reload and review it again before signing.');
    if(rows.some(r=>String(r[1])===site&&asDate_(r[4])===day&&!r[12]))throw new Error('There are open shifts. Clock everyone out before approving the day.');
    const id=newId_('SIGN'),now=new Date(),hours=+eligible.reduce((s,{r})=>s+Number(r[8]||0),0).toFixed(2);
    tabs.approvals.appendRow([id,site,day,supervisor,local_(now),ids.join(','),hours,JSON.stringify(points)]);
    for(const {i} of eligible){tabs.shifts.getRange(i+2,10,1,2).setValues([['APPROVED',id]]);}
    audit_(tabs,'SUPERVISOR APPROVAL',id,site,'',supervisor+' approved '+ids.length+' shift(s)');
    return daily_(site,day,tabs);
  });
}
