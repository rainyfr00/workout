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

function updateDynamicInputs(){
  const sets = parseInt(setsInput.value, 10) || 0;
  repsContainer.innerHTML = '';
  weightContainer.innerHTML = '';
  if(sets > 0){
    for(let i=1; i<=sets; i++){
      const repInput = document.createElement('input');
      repInput.type = 'text';
      repInput.inputMode = 'numeric';
      repInput.placeholder = `Reps set ${i}`;
      repInput.className = 'dynamic-input';
      repsContainer.appendChild(repInput);

      const weightInput = document.createElement('input');
      weightInput.type = 'text';
      weightInput.inputMode = 'decimal';
      weightInput.placeholder = `Weight set ${i}`;
      weightInput.className = 'dynamic-input';
      weightContainer.appendChild(weightInput);
    }
  }
}

// UI
const dateInput = document.getElementById('dateInput');
const prevBtn = document.getElementById('prevDay');
const nextBtn = document.getElementById('nextDay');
const todayBtn = document.getElementById('todayBtn');
const entriesList = document.getElementById('entriesList');
const entryForm = document.getElementById('entryForm');
const clearDayBtn = document.getElementById('clearDay');
const setsInput = document.getElementById('sets');
const repsContainer = document.getElementById('repsContainer');
const weightContainer = document.getElementById('weightContainer');

function render(){
  const dateStr = dateInput.value;
  entriesList.innerHTML = '';
  const entries = getEntriesFor(dateStr);
  if(!entries.length){
    const li = document.createElement('li');
    li.innerHTML = '<p>No entries for this date.</p>';
    entriesList.appendChild(li);
    renderWeeklyComparison();
    renderDayComparison();
    return;
  }
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = e.exercise + (e.weight && e.weight.length ? ` — ${e.weight.join(', ')}` : '');
    const p = document.createElement('p');
    const setsText = e.sets ? e.sets + ' sets' : '';
    const repsText = e.reps && e.reps.length ? '• ' + e.reps.join(', ') : '';
    const notesText = e.notes ? '• ' + e.notes : '';
    p.textContent = `${setsText} ${repsText} ${notesText}`.trim();
    li.appendChild(h);
    li.appendChild(p);
    entriesList.appendChild(li);
  });
  renderWeeklyComparison();
  renderDayComparison();
}

function getWeekStart(dateStr){
  const d = new Date(dateStr + 'T00:00:00');
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

    // Add details
    const details = document.createElement('div'); details.className='compare-details';
    const entries = getEntriesFor(dCurr);
    if(entries.length){
      const ul = document.createElement('ul');
      entries.forEach(e => {
        const li = document.createElement('li');
        const exerciseDiv = document.createElement('div'); exerciseDiv.className='exercise'; exerciseDiv.textContent = e.exercise;
        const detailsDiv = document.createElement('div'); detailsDiv.className='details';
        const setsText = e.sets ? e.sets + ' sets' : '';
        const repsText = e.reps && e.reps.length ? 'Reps: ' + e.reps.join(', ') : '';
        const weightText = e.weight && e.weight.length ? 'Weight: ' + e.weight.join(', ') : '';
        const notesText = e.notes ? 'Notes: ' + e.notes : '';
        detailsDiv.textContent = [setsText, repsText, weightText, notesText].filter(t => t).join(' • ');
        li.appendChild(exerciseDiv);
        li.appendChild(detailsDiv);
        ul.appendChild(li);
      });
      details.appendChild(ul);
    } else {
      details.textContent = 'No entries';
    }
    row.appendChild(details);

    row.addEventListener('click', () => row.classList.toggle('expanded'));
    container.appendChild(row);
  }
}

function computeHeaviestByExercise(){
  const all = loadAll();
  const maxes = {};
  Object.values(all).forEach(list => {
    (list||[]).forEach(e => {
      const weights = Array.isArray(e.weight) ? e.weight : [];
      const entryMax = weights.reduce((m,w)=>{
        const n = parseFloat(w);
        return Number.isFinite(n) ? Math.max(m,n) : m;
      }, 0);
      if(entryMax > 0){
        if(!maxes[e.exercise] || entryMax > maxes[e.exercise]) maxes[e.exercise] = entryMax;
      }
    });
  });
  return maxes;
}

function renderDayComparison(){
  const container = document.getElementById('dayCompare');
  const dateStr = dateInput.value;
  const lastWeekDate = isoDate(datePlusDays(new Date(dateStr + 'T00:00:00'), -7));
  
  const todayEntries = getEntriesFor(dateStr);
  const lastWeekEntries = getEntriesFor(lastWeekDate);
  const heaviest = computeHeaviestByExercise();

  const currentDate = new Date(dateStr + 'T00:00:00');
  const dayName = currentDate.toLocaleDateString(undefined, {weekday: 'long'});
  
  container.innerHTML = `<h3>This ${dayName} vs Last ${dayName}</h3>`;
  
  const grid = document.createElement('div');
  grid.className = 'day-compare-grid';
  
  // Last week column
  const lastWeekCol = document.createElement('div');
  lastWeekCol.className = 'day-compare-col';
  const lastWeekHeader = document.createElement('div');
  lastWeekHeader.className = 'day-compare-header';
  lastWeekHeader.textContent = `Last ${dayName} (${lastWeekDate})`;
  lastWeekCol.appendChild(lastWeekHeader);
  
  if(lastWeekEntries.length){
    const ul = document.createElement('ul');
    ul.className = 'day-compare-list';
    lastWeekEntries.forEach(e => {
      const pr = heaviest[e.exercise];
      const li = document.createElement('li');
      const prText = pr ? ` • PR: ${pr} lb` : '';
      li.innerHTML = `<strong>${e.exercise}</strong><br>${e.sets || 0} sets • Reps: ${e.reps && e.reps.length ? e.reps.join(', ') : 'N/A'} • Weight: ${e.weight && e.weight.length ? e.weight.join(', ') : 'N/A'}${prText}`;
      ul.appendChild(li);
    });
    lastWeekCol.appendChild(ul);
  } else {
    const empty = document.createElement('p');
    empty.className = 'day-compare-empty';
    empty.textContent = 'No data';
    lastWeekCol.appendChild(empty);
  }
  
  // This week column
  const thisWeekCol = document.createElement('div');
  thisWeekCol.className = 'day-compare-col';
  const thisWeekHeader = document.createElement('div');
  thisWeekHeader.className = 'day-compare-header current';
  thisWeekHeader.textContent = `This ${dayName} (${dateStr})`;
  thisWeekCol.appendChild(thisWeekHeader);
  
  if(todayEntries.length){
    const ul = document.createElement('ul');
    ul.className = 'day-compare-list';
    todayEntries.forEach(e => {
      const pr = heaviest[e.exercise];
      const li = document.createElement('li');
      const prText = pr ? ` • PR: ${pr} lb` : '';
      li.innerHTML = `<strong>${e.exercise}</strong><br>${e.sets || 0} sets • Reps: ${e.reps && e.reps.length ? e.reps.join(', ') : 'N/A'} • Weight: ${e.weight && e.weight.length ? e.weight.join(', ') : 'N/A'}${prText}`;
      ul.appendChild(li);
    });
    thisWeekCol.appendChild(ul);
  } else {
    const empty = document.createElement('p');
    empty.className = 'day-compare-empty';
    empty.textContent = 'No data yet';
    thisWeekCol.appendChild(empty);
  }
  
  grid.appendChild(lastWeekCol);
  grid.appendChild(thisWeekCol);
  container.appendChild(grid);
}

function seedDemoData(){
  const existing = loadAll();
  if(Object.keys(existing).length) return;

  const today = new Date();
  const dates = [0, -1, -2, -3, -7].map(n => isoDate(datePlusDays(new Date(today), n)));

  const sample = {
    [dates[0]]: [
      {exercise:'Lat Pulldown', sets:'3', reps:['12','10','8'], weight:['120','130','140'], notes:'Wide grip', createdAt:new Date().toISOString()},
      {exercise:'Bench Press', sets:'4', reps:['10','8','6','6'], weight:['155','175','185','185'], notes:'Paused reps', createdAt:new Date().toISOString()},
    ],
    [dates[1]]: [
      {exercise:'Squat', sets:'5', reps:['5','5','5','5','5'], weight:['225','245','255','255','255'], notes:'Low bar', createdAt:new Date().toISOString()},
      {exercise:'Leg Curl', sets:'3', reps:['12','12','12'], weight:['70','80','80'], notes:'', createdAt:new Date().toISOString()},
    ],
    [dates[2]]: [
      {exercise:'Overhead Press', sets:'4', reps:['8','8','6','6'], weight:['95','105','115','115'], notes:'', createdAt:new Date().toISOString()},
      {exercise:'Lateral Raise', sets:'3', reps:['15','15','15'], weight:['20','20','20'], notes:'Strict', createdAt:new Date().toISOString()},
    ],
    [dates[3]]: [
      {exercise:'Deadlift', sets:'3', reps:['5','5','5'], weight:['275','295','315'], notes:'Double overhand warmups', createdAt:new Date().toISOString()},
      {exercise:'Pull Up', sets:'4', reps:['10','10','8','8'], weight:['0','0','0','0'], notes:'Bodyweight', createdAt:new Date().toISOString()},
    ],
    [dates[4]]: [
      {exercise:'Lat Pulldown', sets:'3', reps:['12','12','10'], weight:['115','120','125'], notes:'Prior week', createdAt:new Date().toISOString()},
      {exercise:'Bench Press', sets:'3', reps:['10','8','6'], weight:['145','165','175'], notes:'Prior week', createdAt:new Date().toISOString()},
    ]
  };

  saveAll(sample);
}

function changeDay(offset){
  const cur = new Date(dateInput.value);
  cur.setDate(cur.getDate() + offset);
  dateInput.value = isoDate(cur);
  render();
}

prevBtn.addEventListener('click', (e)=> { e.preventDefault(); changeDay(-1); });
nextBtn.addEventListener('click', (e)=> { e.preventDefault(); changeDay(1); });
todayBtn.addEventListener('click', (e)=> { e.preventDefault(); dateInput.value = isoDate(); render(); });
dateInput.addEventListener('change', render);

entryForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const dateStr = dateInput.value;
  const exercise = document.getElementById('exercise').value.trim();
  const sets = document.getElementById('sets').value.trim();
  const reps = Array.from(repsContainer.querySelectorAll('input')).map(inp => inp.value.trim()).filter(v => v);
  const weight = Array.from(weightContainer.querySelectorAll('input')).map(inp => inp.value.trim()).filter(v => v);
  const notes = document.getElementById('notes').value.trim();
  if(!exercise) return;
  addEntry(dateStr, {exercise, sets, reps, weight, notes, createdAt: new Date().toISOString()});
  entryForm.reset();
  updateDynamicInputs();
  render();
});

setsInput.addEventListener('input', updateDynamicInputs);

clearDayBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all entries for this date?')) return;
  clearDay(dateInput.value);
  render();
});

// init
(function(){
  dateInput.value = isoDate();
  seedDemoData();
  updateDynamicInputs();
  render();
})();
