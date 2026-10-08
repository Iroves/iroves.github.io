/* GoLabour End-of-Shift Timesheet — static GitHub Pages application.
   Data stays on this device. It does not submit to a server or WhatsApp by itself. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ids = ['workerName', 'location', 'shiftDate', 'startTime', 'finishTime', 'breakMinutes', 'message', 'supervisorName'];
  const STORAGE_KEY = 'golabour_end_of_shift_draft_v1';
  const pad = $('signaturePad');
  let strokes = [];
  let currentStroke = null;

  function localDate() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  function formatDate(iso) {
    const [y, m, d] = String(iso).split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }
  function clean(value) { return String(value || '').trim(); }
  function mins(time) {
    if (!/^\d{2}:\d{2}$/.test(time)) return null;
    const [h, m] = time.split(':').map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }
  function pretty(minutes) { return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`; }
  function calc() {
    const start = mins($('startTime').value);
    const finish = mins($('finishTime').value);
    const rawBreak = $('breakMinutes').value;
    const breakTime = rawBreak === '' ? NaN : Number(rawBreak);
    if (start === null || finish === null) return { error: 'Enter both start and finish times.' };
    if (!Number.isInteger(breakTime) || breakTime < 0 || breakTime > 1439) return { error: 'Enter a valid unpaid break in whole minutes (0–1439).' };
    if (start === finish) return { error: 'Start and finish cannot be identical. Please check the times.' };
    const elapsed = (finish - start + 1440) % 1440;
    if (breakTime > elapsed) return { error: 'Your unpaid break cannot be longer than the shift.' };
    const paid = elapsed - breakTime;
    return { start: $('startTime').value, finish: $('finishTime').value, breakTime, paid, overnight: finish < start };
  }
  function recalc() {
    const c = calc();
    $('hoursPretty').textContent = c.error ? '—' : pretty(c.paid);
    $('hoursDecimal').textContent = c.error ? 'Please check your times' : `${(c.paid / 60).toFixed(2)} decimal hours`;
    $('calcHelp').classList.toggle('error', !!c.error);
    $('calcHelp').textContent = c.error || (c.overnight ? 'Overnight shift detected: finish time is treated as the following day. Unpaid break is subtracted.' : 'Calculated from start to finish, minus the unpaid break.');
  }
  function draft() { return Object.fromEntries(ids.map(id => [id, $(id).value])); }
  function storeDraft() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft())); } catch { /* disabled/private browsing */ }
  }
  function restoreDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') for (const id of ids) if (typeof saved[id] === 'string') $(id).value = saved[id];
    } catch { /* unavailable */ }
    if (!$('shiftDate').value) $('shiftDate').value = localDate();
  }
  function feedback(message, error = false) {
    const el = $('feedback');
    el.textContent = message;
    el.className = 'feedback show' + (error ? ' error' : '');
  }
  function clearFeedback() { $('feedback').className = 'feedback'; $('feedback').textContent = ''; }

  // Scaled, responsive, finger/stylus/mouse signature pad.
  // Strokes use 0..1 coordinates so orientation changes do not erase signatures.
  function drawSignature() {
    const rect = pad.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(3, window.devicePixelRatio || 1);
    pad.width = Math.round(rect.width * ratio);
    pad.height = Math.round(rect.height * ratio);
    const ctx = pad.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#22251f';
    for (const stroke of strokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
      for (const point of stroke.slice(1)) ctx.lineTo(point.x * rect.width, point.y * rect.height);
      ctx.stroke();
    }
    $('signatureHint').style.display = strokes.some(s => s.length > 1) ? 'none' : '';
  }
  function point(event) {
    const rect = pad.getBoundingClientRect();
    return { x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)), y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)) };
  }
  pad.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    pad.setPointerCapture(event.pointerId);
    currentStroke = [point(event)];
    strokes.push(currentStroke);
  });
  pad.addEventListener('pointermove', (event) => {
    if (!currentStroke) return;
    event.preventDefault();
    currentStroke.push(point(event)); drawSignature();
  });
  function finishDraw(event) {
    if (!currentStroke) return;
    event.preventDefault();
    currentStroke.push(point(event));
    currentStroke = null;
    drawSignature();
  }
  pad.addEventListener('pointerup', finishDraw);
  pad.addEventListener('pointercancel', finishDraw);
  pad.addEventListener('lostpointercapture', () => { currentStroke = null; drawSignature(); });
  $('clearSignature').addEventListener('click', () => { strokes = []; currentStroke = null; drawSignature(); clearFeedback(); });
  new ResizeObserver(() => drawSignature()).observe(pad);

  function getValidatedReport() {
    for (const field of ['workerName', 'location', 'shiftDate', 'startTime', 'finishTime', 'supervisorName']) {
      if (!clean($(field).value)) {
        feedback('Please complete all fields marked with *, including the supervisor name.', true);
        $(field).focus(); return null;
      }
    }
    const result = calc();
    if (result.error) { feedback(result.error, true); $('startTime').focus(); return null; }
    if (!strokes.some(s => s.length >= 2)) {
      feedback('The supervisor needs to sign in the signature box before sharing.', true);
      pad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return null;
    }
    return {
      name: clean($('workerName').value), location: clean($('location').value),
      date: formatDate($('shiftDate').value), isoDate: $('shiftDate').value,
      start: result.start, finish: result.finish, breakTime: result.breakTime,
      paid: result.paid, overnight: result.overnight,
      message: clean($('message').value), supervisor: clean($('supervisorName').value)
    };
  }
  function populatePrintable(r) {
    $('pWorker').textContent = r.name;
    $('pDate').textContent = r.date;
    $('pLocation').textContent = r.location;
    $('pStart').textContent = r.start;
    $('pFinish').textContent = r.finish + (r.overnight ? ' (+1 day)' : '');
    $('pBreak').textContent = `${r.breakTime} min`;
    $('pHours').textContent = `${pretty(r.paid)} (${(r.paid / 60).toFixed(2)}h)`;
    $('pMessage').textContent = r.message || 'No additional comments.';
    $('pSupervisor').textContent = r.supervisor;
    $('pSignature').src = pad.toDataURL('image/png');
  }

  // Shareable, high-resolution image, drawn locally, with no external dependencies.
  function makeImage(report) {
    const W = 1200, PAD = 76, cream = '#f6f4ef', dark = '#20231e', gold = '#bead96', grey = '#797b73';
    const canvas = document.createElement('canvas');
    const measureCtx = canvas.getContext('2d');
    const bodyWidth = W - PAD * 2;
    measureCtx.font = '27px Arial, sans-serif';
    function linesFor(str, maxWidth, ctx, maxLines = 30) {
      const out = [];
      for (const paragraph of (str || '').split('\n')) {
        if (!paragraph.trim()) { out.push(''); continue; }
        let row = '';
        for (const word of paragraph.split(/\s+/)) {
          const next = row ? row + ' ' + word : word;
          if (ctx.measureText(next).width <= maxWidth) { row = next; continue; }
          if (row) { out.push(row); row = ''; }
          let part = '';
          for (const ch of word) {
            if (ctx.measureText(part + ch).width > maxWidth && part) { out.push(part); part = ''; }
            part += ch;
          }
          row = part;
        }
        if (row) out.push(row);
        if (out.length >= maxLines) break;
      }
      return out.slice(0, maxLines);
    }
    const noteLines = linesFor(report.message || 'No additional comments.', bodyWidth - 52, measureCtx, 28);
    measureCtx.font = 'bold 35px Arial, sans-serif';
    const siteLines = linesFor(report.location, bodyWidth - 65, measureCtx, 4);
    const nameLines = linesFor(report.name, bodyWidth - 65, measureCtx, 3);
    const supervisorLines = linesFor(report.supervisor, bodyWidth - 65, measureCtx, 3);
    const locationHeight = Math.max(82, siteLines.length * 44 + 38);
    const workerHeight = Math.max(82, nameLines.length * 44 + 38);
    const noteHeight = Math.max(135, 90 + noteLines.length * 37);
    const supervisorHeight = Math.max(68, supervisorLines.length * 44);
    const H = 1225 + workerHeight + locationHeight + noteHeight + supervisorHeight + (report.overnight ? 37 : 0);
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;if(r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}else ctx.fillRect(x,y,w,h);}
    function txt(text,x,y,size=26,color=dark,bold=false){ctx.font=`${bold?'bold ':''}${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.fillText(text,x,y);}
    function wrapped(textLines,x,y,lh,size=28,color=dark,bold=false){for(const line of textLines){txt(line,x,y,size,color,bold);y+=lh;}return y;}
    rect(0,0,W,H,cream);
    rect(0,0,W,243,dark);
    rect(0,242,W,7,gold);
    txt('go',PAD,110,76,gold,true);txt('Labour',183,110,76,'#fff8ec',true);
    txt('S  O  L  U  T  I  O  N  S',PAD + 8,150,23,gold);
    txt('DAILY / END-OF-SHIFT REPORT',PAD,207,19,'#d7cebe',true);
    const rightLabel='SUPERVISOR SIGNED';ctx.font='bold 17px Arial,sans-serif';txt(rightLabel,W-PAD-ctx.measureText(rightLabel).width,205,17,'#d7cebe',true);
    txt('Daily timesheet',PAD,327,48,dark,true);
    let y = 366;
    function label(text, x, yy){txt(text,x,yy,17,'#8c7960',true);}
    function paperField(labelText, valueLines, height){
      rect(PAD,y,bodyWidth,height,'#fffefa',12);rect(PAD,y,6,height,gold,3);label(labelText,PAD+28,y+34);
      wrapped(valueLines,PAD+28,y+82,44,35,dark,true);
      y+=height+15;
    }
    paperField('WORKER NAME',nameLines,workerHeight+38);
    paperField('SITE / LOCATION',siteLines,locationHeight+38);
    rect(PAD,y,bodyWidth,88,'#ece5d9',10);label('SHIFT DATE',PAD+26,y+32);txt(report.date,PAD+26,y+72,32,dark,true);y+=110;
    const colWidth=bodyWidth/4;
    for (let i=0;i<4;i++) rect(PAD+i*colWidth,y,colWidth-2,168,i===3?dark:'#fffefa',i===0?10:0);
    const labels=['START','FINISH','BREAK','PAID HOURS'];
    const values=[report.start,report.finish,report.breakTime+' min',pretty(report.paid)];
    for(let i=0;i<4;i++){label(labels[i],PAD+19+i*colWidth,y+40);txt(values[i],PAD+19+i*colWidth,y+108,31,i===3?'#fff8e8':dark,true);}
    y+=183;
    if(report.overnight){txt('OVERNIGHT SHIFT · Finish time is the following day',PAD+10,y+17,21,'#8e7454');y+=37;}
    rect(PAD,y,bodyWidth,noteHeight,'#fffefa',12);label('MESSAGES / COMMENTS',PAD+25,y+39);wrapped(noteLines,PAD+25,y+87,37,27,dark,false);y+=noteHeight+22;
    rect(PAD,y,bodyWidth,300+supervisorHeight,'#e9e1d6',12);label('SUPERVISOR APPROVAL',PAD+26,y+37);
    txt('Signed by:',PAD+26,y+82,24,'#68685e');wrapped(supervisorLines,PAD+168,y+82,44,31,dark,true);
    const signBoxY=y+105+supervisorHeight;
    rect(PAD+25,signBoxY,bodyWidth-50,148,'#fffefa',11);
    ctx.drawImage(pad,PAD+55,signBoxY+4,bodyWidth-110,138);
    rect(PAD+42,signBoxY+151,bodyWidth-84,2,'#d1c6b9');txt('SUPERVISOR SIGNATURE',PAD+42,signBoxY+180,16,'#877a69',true);
    txt('SUPERVISOR-REVIEWED • DEVICE-GENERATED TIMESHEET',PAD,H-70,17,'#83837c',true);
    txt('golabour.com.au',PAD,H-39,19,'#8c7960');
    return canvas;
  }
  function fileName(r) {
    const safe = r.name.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,50) || 'worker';
    return `GoLabour-Timesheet-${r.isoDate}-${safe}.png`;
  }
  function canvasToFile(canvas, name) {
    const url = canvas.toDataURL('image/png');
    const binary = atob(url.slice(url.indexOf(',')+1));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; ++i) bytes[i] = binary.charCodeAt(i);
    return { file: new File([bytes], name, {type:'image/png'}), url };
  }
  function triggerDownload(url, name) {
    const link = document.createElement('a');
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
  }
  $('downloadButton').addEventListener('click', () => {
    const r = getValidatedReport(); if (!r) return;
    try {
      const {url} = canvasToFile(makeImage(r),fileName(r));
      triggerDownload(url,fileName(r));
      feedback('Signed timesheet image created. Open WhatsApp, choose your work group and attach the saved PNG.');
    } catch { feedback('Unable to create the image on this device. Try Print / Save as PDF instead.',true); }
  });
  $('shareButton').addEventListener('click', async () => {
    const r = getValidatedReport(); if (!r) return;
    let bundle;
    try { bundle = canvasToFile(makeImage(r),fileName(r)); }
    catch { feedback('Unable to generate the image. Try Print / Save as PDF.',true); return; }
    if (navigator.share && (!navigator.canShare || navigator.canShare({files:[bundle.file]}))) {
      try {
        await navigator.share({files:[bundle.file],title:`GoLabour timesheet — ${r.name}`,text:`GoLabour timesheet • ${r.name} • ${r.date} • ${pretty(r.paid)}`});
        feedback('The share sheet was opened. If you selected WhatsApp and a group, please confirm the message was sent there.');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') { feedback('Sharing cancelled. No file was submitted.'); return; }
      }
    }
    triggerDownload(bundle.url,fileName(r));
    feedback('Your browser cannot share image files directly. I downloaded the PNG instead — attach it in your WhatsApp work group.');
  });
  $('printButton').addEventListener('click', () => {
    const r = getValidatedReport(); if (!r) return;
    populatePrintable(r);
    window.print();
    feedback('Print dialog opened. Choose “Save as PDF” to make a PDF copy for WhatsApp.');
  });
  $('resetButton').addEventListener('click', () => {
    if (!window.confirm('Clear the form and signature to start a new timesheet?')) return;
    $('timesheetForm').reset();
    $('shiftDate').value = localDate();
    strokes = []; currentStroke = null; drawSignature();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    recalc(); $('charCount').textContent = '0 / 650'; clearFeedback();
    window.scrollTo({top:0,behavior:'smooth'});
  });
  for (const id of ids) $(id).addEventListener('input', () => {
    if (['startTime','finishTime','breakMinutes'].includes(id)) recalc();
    if (id === 'message') $('charCount').textContent = `${$('message').value.length} / 650`;
    storeDraft(); clearFeedback();
  });
  restoreDraft(); recalc();
  $('charCount').textContent = `${$('message').value.length} / 650`;
  drawSignature();
})();
