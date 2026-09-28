const KEY="deadlineBoard.data";
const seed=[
{id:crypto.randomUUID(),title:"Submit project proposal",date:"2026-09-29",time:"17:00",category:"Work",status:"urgent",note:"Final PDF and budget sheet."},
{id:crypto.randomUUID(),title:"Library books due",date:"2026-10-01",time:"18:00",category:"Study",status:"soon",note:"Return 3 books to the main desk."},
{id:crypto.randomUUID(),title:"Electricity bill",date:"2026-10-05",time:"20:00",category:"Finance",status:"soon",note:"Pay before the late fee kicks in."},
{id:crypto.randomUUID(),title:"Team off-site",date:"2026-10-10",time:"09:30",category:"Events",status:"plenty",note:"Bring notebook and travel card."},
{id:crypto.randomUUID(),title:"Passport renewal",date:"2026-10-23",time:"11:00",category:"Personal",status:"plenty",note:"Documents are already prepared."},
{id:crypto.randomUUID(),title:"Design review",date:"2026-09-30",time:"14:00",category:"Work",status:"soon",note:"Walk through the new dashboard."}
];
let items=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
let viewDate=new Date(), selectedDate=null, toastTimer;

const $=id=>document.getElementById(id);
const statusMeta={
urgent:{label:"Urgent",color:"#ef5350",bg:"#fff0ef"},
soon:{label:"Coming up",color:"#efad32",bg:"#fff7e5"},
plenty:{label:"Plenty of time",color:"#36a269",bg:"#eaf8f1"}
};

function save(){localStorage.setItem(KEY,JSON.stringify(items))}
function dateObj(s){return new Date(s+"T12:00:00")}
function fmt(s){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(dateObj(s))}
function daysAway(s){return Math.ceil((dateObj(s)-new Date(new Date().toDateString()))/86400000)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function statusFor(item){
  const d=daysAway(item.date);
  if(d<=3)return "urgent"; if(d<=7)return "soon"; return "plenty";
}
function activeStatus(item){ return item.status==="urgent"||item.status==="soon"||item.status==="plenty" ? item.status : statusFor(item)}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2100)}
function renderStats(){
  const counts={urgent:0,soon:0,plenty:0}; items.forEach(i=>counts[activeStatus(i)]++);
  $("totalStat").textContent=items.length;$("urgentStat").textContent=counts.urgent;$("safeStat").textContent=counts.plenty;
  $("urgentCount").textContent=counts.urgent;$("soonCount").textContent=counts.soon;$("plentyCount").textContent=counts.plenty;
  const sorted=[...items].sort((a,b)=>a.date.localeCompare(b.date));
  const next=sorted[0];$("nextStat").textContent=next?fmt(next.date):"—";$("nextSub").textContent=next?next.title:"nothing scheduled";
}
function card(item){
 const s=activeStatus(item),m=statusMeta[s];
 return `<article class="deadline-card" style="--status:${m.color};--status-bg:${m.bg}">
   <div class="card-top"><span class="category">${esc(item.category)}</span><span class="status-pill">${m.label}</span></div>
   <h4>${esc(item.title)}</h4><p>${esc(item.note||"No extra note.")}</p>
   <div class="date-line">◷ ${fmt(item.date)} · ${esc(item.time||"—")}</div>
   <div class="card-actions"><button class="mini-btn" onclick="editItem('${item.id}')">Edit</button><button class="mini-btn" onclick="deleteItem('${item.id}')">Delete</button></div>
 </article>`
}
function renderPriority(){
 const list=[...items].sort((a,b)=>dateObj(a.date)-dateObj(b.date)).slice(0,6);
 $("priorityList").innerHTML=list.length?list.map(card).join(""):`<div class="empty"><h3>Clear board</h3><p>Add your first reminder to get started.</p></div>`;
}
function renderBoard(){
 const cat=$("categoryFilter").value,stat=$("statusFilter").value;
 let list=items.filter(i=>(cat==="all"||i.category===cat)&&(stat==="all"||activeStatus(i)===stat)).sort((a,b)=>dateObj(a.date)-dateObj(b.date));
 $("boardList").innerHTML=list.length?list.map(i=>{let s=activeStatus(i),m=statusMeta[s];return `<div class="board-row" style="--status:${m.color}"><div class="marker"></div><div><div class="board-title">${esc(i.title)}</div><div class="board-note">${esc(i.note||"")}</div></div><div class="board-date"><strong>${fmt(i.date)}</strong>${esc(i.time||"")}</div><div class="board-category">${esc(i.category)}</div><span class="status-pill" style="background:${m.bg};color:${m.color}">${m.label}</span><div><button class="mini-btn" onclick="editItem('${i.id}')">Edit</button></div></div>`}).join(""):`<div class="empty"><h3>No reminders match</h3><p>Try another filter.</p></div>`;
}
function renderCalendar(){
 const y=viewDate.getFullYear(),m=viewDate.getMonth();
 $("monthTitle").textContent=new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}).format(viewDate);
 const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();
 let html="";
 for(let i=0;i<42;i++){
   const n=i-first+1, actual=n<=0?new Date(y,m-1,prevDays+n):n>days?new Date(y,m+1,n-days):new Date(y,m,n);
   const inMonth=actual.getMonth()===m, iso=actual.toISOString().slice(0,10);
   const dayItems=items.filter(x=>x.date===iso),today=iso===new Date().toISOString().slice(0,10),sel=iso===selectedDate;
   html+=`<button class="cal-day ${inMonth?"":"muted"} ${today?"today":""} ${sel?"selected":""}" data-date="${iso}"><span class="day-num">${actual.getDate()}</span><span class="cal-dots">${dayItems.slice(0,3).map(x=>`<i style="background:${statusMeta[activeStatus(x)].color}"></i>`).join("")}</span></button>`;
 }
 $("calendarGrid").innerHTML=html;
 document.querySelectorAll(".cal-day").forEach(b=>b.onclick=()=>{selectedDate=b.dataset.date;renderCalendar();renderDayDetails()});
 renderDayDetails();
}
function renderDayDetails(){
 const list=items.filter(i=>i.date===selectedDate);
 if(!selectedDate){$("dayDetails").innerHTML=`<div><strong>Select a date</strong><p>Deadlines for that day will appear here.</p></div>`;return}
 $("dayDetails").innerHTML=list.length?`<div><strong>${fmt(selectedDate)}</strong>${list.map(i=>`<div class="detail-entry"><i class="dot ${activeStatus(i)==="urgent"?"red":activeStatus(i)==="soon"?"amber":"green"}"></i><b>${esc(i.title)}</b><span>${esc(i.time||"")}</span></div>`).join("")}</div>`:`<div><strong>${fmt(selectedDate)}</strong><p>Nothing scheduled — enjoy the breathing room.</p></div>`;
}
function openModal(item=null){
 $("modal").classList.remove("hidden");$("editId").value=item?.id||"";$("modalTitle").textContent=item?"Edit deadline":"Add a deadline";
 $("titleInput").value=item?.title||"";$("dateInput").value=item?.date||new Date().toISOString().slice(0,10);$("timeInput").value=item?.time||"17:00";
 $("categoryInput").value=item?.category||"Study";$("importanceInput").value=item?.status||"soon";$("noteInput").value=item?.note||"";
 setTimeout(()=>$("titleInput").focus(),50)
}
function closeModal(){$("modal").classList.add("hidden")}
function editItem(id){const x=items.find(i=>i.id===id);if(x)openModal(x)}
function deleteItem(id){const x=items.find(i=>i.id===id);if(!x||!confirm(`Delete "${x.title}"?`))return;items=items.filter(i=>i.id!==id);save();refresh();toast("Reminder removed")}
function refresh(){renderStats();renderPriority();renderBoard();renderCalendar()}
function switchView(name){
 document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$(`${name}View`).classList.remove("hidden");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
}
$("addBtn").onclick=()=>openModal();$("closeModal").onclick=closeModal;$("cancelBtn").onclick=closeModal;
$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
$("deadlineForm").onsubmit=e=>{e.preventDefault();const id=$("editId").value;const data={id:id||crypto.randomUUID(),title:$("titleInput").value.trim(),date:$("dateInput").value,time:$("timeInput").value,category:$("categoryInput").value,status:$("importanceInput").value,note:$("noteInput").value.trim()};items=id?items.map(i=>i.id===id?data:i):[...items,data];save();refresh();closeModal();toast(id?"Reminder updated":"Deadline added")};
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
$("calendarHeroBtn").onclick=()=>switchView("calendar");$("boardBtn").onclick=()=>switchView("board");
$("prevMonth").onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);renderCalendar()};
$("nextMonth").onclick=()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar()};
$("todayBtn").onclick=()=>{viewDate=new Date();selectedDate=new Date().toISOString().slice(0,10);renderCalendar()};
$("categoryFilter").onchange=renderBoard;$("statusFilter").onchange=renderBoard;
document.querySelectorAll(".filter-btn").forEach(b=>b.onclick=()=>{switchView("board");$("statusFilter").value=b.dataset.filter;renderBoard()});
$("resetBtn").onclick=()=>{if(confirm("Reset the demo deadlines?")){items=seed.map(x=>({...x,id:crypto.randomUUID()}));save();refresh();toast("Demo board restored")}};
$("greeting").textContent=`${new Date().getHours()<12?"Good morning.":new Date().getHours()<18?"Good afternoon.":"Good evening."}`;
refresh();
