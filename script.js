const STORAGE_KEY = 'workoutLogs_v1';

function isoDate(d = new Date()){
  const dt = new Date(d);
  const tzOffset = dt.getTimezoneOffset() * 60000;
  return new Date(dt - tzOffset).toISOString().slice(0,10);
}

function loadAll(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }catch(e){ return {}; }
}

function saveAll(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }

function getEntriesFor(dateStr){
  const all = loadAll();
  return all[dateStr] || [];
}

function addEntry(dateStr, entry){
  const all = loadAll();
  all[dateStr] = all[dateStr]||[];
  all[dateStr].push(entry);
  saveAll(all);
}

function clearDay(dateStr){
  const all = loadAll();
  delete all[dateStr];
  saveAll(all);
}

// UI
const dateInput = document.getElementById('dateInput');
const prevBtn = document.getElementById('prevDay');
const nextBtn = document.getElementById('nextDay');
const todayBtn = document.getElementById('todayBtn');
const entriesList = document.getElementById('entriesList');
const entryForm = document.getElementById('entryForm');
const clearDayBtn = document.getElementById('clearDay');

function render(){
  const dateStr = dateInput.value;
  entriesList.innerHTML = '';
  const entries = getEntriesFor(dateStr);
  if(!entries.length){
    const li = document.createElement('li');
    li.innerHTML = '<p>No entries for this date.</p>';
    entriesList.appendChild(li);
    renderWeeklyComparison();
    return;
  }
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = e.exercise + (e.weight ? ` — ${e.weight}` : '');
    const p = document.createElement('p');
    p.textContent = `${e.sets ? e.sets + ' sets' : ''} ${e.reps ? '• ' + e.reps : ''} ${e.notes ? '• ' + e.notes : ''}`.trim();
    li.appendChild(h);
    li.appendChild(p);
    entriesList.appendChild(li);
  });
  renderWeeklyComparison();
}

function getWeekStart(dateStr){
  const d = new Date(dateStr);
  // make Monday the first day
  const day = (d.getDay() + 6) % 7; // 0=Mon,6=Sun
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0,0,0,0);
  return start;
}

function datePlusDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }

function summarize(dateStr){
  const entries = getEntriesFor(dateStr);
  const count = entries.length;
  let totalSets = 0;
  entries.forEach(e => {
    const s = parseInt(e.sets,10);
    if(!isNaN(s)) totalSets += s;
  });
  return {count, totalSets};
}

function weekdayName(index){
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index];
}

function renderWeeklyComparison(){
  const container = document.getElementById('weeklyCompare');
  container.innerHTML = '';
  const start = getWeekStart(dateInput.value);
  const prevStart = datePlusDays(start, -7);
  for(let i=0;i<7;i++){
    const dCurr = isoDate(datePlusDays(start,i));
    const dPrev = isoDate(datePlusDays(prevStart,i));
    const sCurr = summarize(dCurr);
    const sPrev = summarize(dPrev);
    const row = document.createElement('div'); row.className='compare-row';
    const left = document.createElement('div'); left.className='compare-left'; left.textContent = weekdayName(i);
    const mid = document.createElement('div'); mid.className='compare-mid'; mid.textContent = `Prev: ${sPrev.count} entries • ${sPrev.totalSets} sets`;
    const right = document.createElement('div'); right.className='delta';
    const deltaCount = sCurr.count - sPrev.count;
    const deltaSets = sCurr.totalSets - sPrev.totalSets;
    right.innerHTML = `Now: ${sCurr.count} • ${sCurr.totalSets} <br>Δ ${deltaCount>=0?'+':''}${deltaCount} / ${deltaSets>=0?'+':''}${deltaSets}`;
    if(deltaCount>0 || deltaSets>0) right.classList.add('positive');
    if(deltaCount<0 || deltaSets<0) right.classList.add('negative');
    row.appendChild(left); row.appendChild(mid); row.appendChild(right);
    container.appendChild(row);
  }
}

function changeDay(offset){
  const cur = new Date(dateInput.value);
  cur.setDate(cur.getDate() + offset);
  dateInput.value = isoDate(cur);
  render();
}

prevBtn.addEventListener('click', ()=> changeDay(-1));
nextBtn.addEventListener('click', ()=> changeDay(1));
todayBtn.addEventListener('click', ()=>{ dateInput.value = isoDate(); render(); });
dateInput.addEventListener('change', render);

entryForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const dateStr = dateInput.value;
  const exercise = document.getElementById('exercise').value.trim();
  const sets = document.getElementById('sets').value.trim();
  const reps = document.getElementById('reps').value.trim();
  const weight = document.getElementById('weight').value.trim();
  const notes = document.getElementById('notes').value.trim();
  if(!exercise) return;
  addEntry(dateStr, {exercise, sets, reps, weight, notes, createdAt: new Date().toISOString()});
  entryForm.reset();
  render();
});

clearDayBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all entries for this date?')) return;
  clearDay(dateInput.value);
  render();
});

// init
(function(){
  dateInput.value = isoDate();
  render();
})();
