
let pendingNote = null;
let pendingDeletePhone = null;
let USER_TYPE = sessionStorage.getItem('user_type') || ''; // ✅ Set early
// const createdBy = userType === 'admin' ? 'Admin' : sessionStorage.getItem('staff_name') || 'Staff';
const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';

function askNote(title, callback) {
  pendingNote = callback;
  document.getElementById('noteModalTitle').textContent = title;
  document.getElementById('noteModalTextarea').value = '';
  document.getElementById('noteModal').style.display = 'block';
}

document.getElementById("togglePassword").addEventListener("click", function () {
  const input = document.getElementById("otpInput");
  input.type = input.type === "password" ? "text" : "password";
});

function submitNote() {
  const val = document.getElementById('noteModalTextarea').value.trim();
  document.getElementById('noteModal').style.display = 'none';
  if (val && pendingNote) pendingNote(val);
  pendingNote = null;
}
function cancelNote() {
  document.getElementById('noteModal').style.display = 'none';
  pendingNote = null;
}
const profileToggle = document.getElementById('profileToggle');
const profileDropdown = document.getElementById('profileDropdown');

profileToggle.addEventListener('click', () => {
  profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
  if (!document.querySelector('.profile-wrapper').contains(e.target)) {
    profileDropdown.style.display = 'none';
  }
});

// window.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('confirmYesBtn').addEventListener('click', confirmDeleteYes);
//   document.getElementById('confirmNoBtn').addEventListener('click', confirmDeleteNo);
// });


document.getElementById('logoutBtn').addEventListener('click', () => {
sessionStorage.removeItem('verified');
  location.reload();
});


window.addEventListener('popstate', () => {
  if (sessionStorage.getItem('verified') !== 'yes') {
    location.reload();
  }
});

function parseDMY(dateStr) {
  if (!dateStr || !dateStr.includes('/')) return null;
  const [dd, mm, yyyy] = dateStr.trim().split('/');
  const d = parseInt(dd, 10);
  const m = parseInt(mm, 10) - 1;
  const y = parseInt(yyyy, 10);
  const date = new Date(y, m, d);
  return isNaN(date.getTime()) ? null : date;
}

function getActionBy() {
  const type = sessionStorage.getItem('user_type');
  if (type === 'admin') return 'Admin';
  const name = sessionStorage.getItem('staff_name');
  return name ? `Staff: ${name}` : 'Unknown';
}



function showApp() {
  USER_TYPE = sessionStorage.getItem('user_type');
  gate.style.display = 'none';
  document.getElementById('staffLogin').style.display = 'none';
  mainApp.style.display = 'block';

  

const headerTitle = document.getElementById('headerTitle');
const profileToggleBtn = document.getElementById('profileToggle');

if (USER_TYPE === 'admin') {
  createManageStaffButton();
  headerTitle.textContent = 'Ather Chikiti - Admin Portal';
  // profileToggleBtn.textContent = 'Admin';
} else {
  const staffName = sessionStorage.getItem('staff_name') || 'Staff';
  headerTitle.textContent = `${staffName} -Staff`;
  // profileToggleBtn.textContent = staffName; // ✅ no .charAt(0)
}


  history.pushState({}, '');
  initApp();
  renderTable(); 
}




  let currentPage = 1;
    let recordsPerPage = 10;
    let filteredLeads = [];

    function paginate(leads) {
      const start = (currentPage - 1) * recordsPerPage;
      const end = start + recordsPerPage;
      return leads.slice(start, end);
    }

    document.getElementById('recordsPerPage').addEventListener('change', e => {
      recordsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderTable();
    });

function renderPaginationControls(totalItems){
  const totalPages = Math.ceil(totalItems / recordsPerPage);
  const wrapper    = document.getElementById('paginationControls');
  wrapper.innerHTML = '';

  if (totalPages <= 1) return;       // no pager needed

  // --- Helper to create a button ---
  const makeBtn = (label, page, cls='pagination-btn') => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className   = cls;
    if (page === currentPage) b.classList.add('active');
    b.addEventListener('click', () => { 
      if (page === null || page === currentPage) return;
      currentPage = page;
      renderTable();
      wrapper.scrollIntoView({block:'nearest', behavior:'smooth'});
    });
    return b;
  };

  // --- Prev button ---
  const prev = makeBtn('«', currentPage - 1, 'pagination-nav');
  if (currentPage === 1) prev.setAttribute('disabled', 'disabled');
  wrapper.appendChild(prev);

  // --- Page number block (compressed) ---
  const maxNumbers = 3;                // how many numeric buttons to show
  let startPage = Math.max(1, currentPage - Math.floor(maxNumbers/2));
  let endPage   = startPage + maxNumbers - 1;
  if (endPage > totalPages){
    endPage   = totalPages;
    startPage = Math.max(1, endPage - maxNumbers + 1);
  }

  // Always show 1 ...
  if (startPage > 1){
    wrapper.appendChild(makeBtn('1', 1));
    if (startPage > 2){
      const ell = document.createElement('span');
      ell.textContent = '…';
      ell.style.padding = '.4rem .2rem';
      wrapper.appendChild(ell);
    }
  }

  // Middle numbers
  for (let p = startPage; p <= endPage; p++){
    wrapper.appendChild(makeBtn(String(p), p));
  }

  // ... last page
  if (endPage < totalPages){
    if (endPage < totalPages - 1){
      const ell = document.createElement('span');
      ell.textContent = '…';
      ell.style.padding = '.4rem .2rem';
      wrapper.appendChild(ell);
    }
    wrapper.appendChild(makeBtn(String(totalPages), totalPages));
  }

  // --- Next button ---
 const next = makeBtn('»', currentPage + 1, 'pagination-nav');
  if (currentPage === totalPages) next.setAttribute('disabled', 'disabled');
  wrapper.appendChild(next);
}


    flatpickr("#followDate", { dateFormat: "d/m/Y" });
    flatpickr("#startDate", { dateFormat: "d/m/Y" });
    flatpickr("#endDate", { dateFormat: "d/m/Y" });

  /* ---------- Staff pass‑code gate ---------- */
  let PASSCODE = '';
async function fetchPasscode() {
  if (isLocal) {
    console.log('🛑 Local mode: Skipping fetchPasscode()');
    PASSCODE = '1234'; // ✅ dummy passcode for testing
    return;
  }

  try {
    const response = await fetch('https://sheetdb.io/api/v1/jpzfmotebhmjp'); // Replace with your actual SheetDB API
    const data = await response.json();
    if (data && data.length > 0 && data[0].Password) {
      PASSCODE = data[0].Password;
    } else {
      console.error('⚠️ Password not found in the sheet');
    }
  } catch (error) {
    console.error('❌ Error fetching password:', error);
  }
}

const loader = document.getElementById('loader');
const gate = document.getElementById('otpGate');
const mainApp = document.getElementById('mainApp');
mainApp.style.display = 'none';
gate.style.display = 'none';

// ✅ Optimized function
async function initAppOnce() {
if (sessionStorage.getItem('verified') === 'yes') {
  USER_TYPE = sessionStorage.getItem('user_type'); // ✅ Restore USER_TYPE
  loader.style.display = 'none';
  showApp();
}
 else {
    await fetchPasscode(); // Only when needed
    loader.style.display = 'none';
    gate.style.display = 'flex';
  }
}
initAppOnce();




otpBtn.addEventListener('click', () => {
  if (otpInput.value.trim() === PASSCODE) {
    sessionStorage.setItem('verified', 'yes');
    sessionStorage.setItem('user_type', 'admin');
    USER_TYPE = 'admin';
    showApp();
  }
});


  /* ---------- Main application ---------- */
  function initApp(){
    /* === DOM shortcuts === */
    const qs          = (s,c=document)=>c.querySelector(s);
    const createBtn   = qs('#createBtn');
    const followBtn   = qs('#followBtn');
    const enquiryModal= qs('#enquiryModal');
    const closeModal  = qs('#closeModal');
    const enquiryForm = qs('#enquiryForm');
    const leadBody    = qs('#leadTable tbody');
    const emptyMsg    = qs('#emptyMsg');
    const searchInput = qs('#searchInput');
    const startDate   = qs('#startDate');
    const endDate     = qs('#endDate');
    const viewModal   = qs('#viewModal');
    const closeView   = qs('#closeView');
    const viewBody    = qs('#viewBody');

    /* === Config === */
    const API_URL = 'https://sheetdb.io/api/v1/p90wo6yvmv2hv';
    let leads     = [];
    let viewingToday = false;
document.querySelector('#enquiryModal h2').textContent = 'Edit Enquiry';
    /* === Bootstrap === */
    loadLeads();
    createBtn.addEventListener('click',()=>{ enquiryModal.classList.add('active'); });createBtn.addEventListener('click', () => {
  enquiryModal.classList.add('active');
  document.getElementById('enquiryForm').reset();
  document.querySelector('#enquiryModal h2').textContent = 'Create New Enquiry';
  document.getElementById('editMode').value = 'false';
  document.getElementById('mobile').disabled = false;
  document.getElementById('leadStatus').value = 'new';
});
closeModal.addEventListener('click',()=>{ enquiryModal.classList.remove('active'); });
    closeView.addEventListener('click',()=>{ viewModal.classList.remove('active'); });
    window.addEventListener('keydown',e=>{ if(e.key==='Escape'){ enquiryModal.classList.remove('active'); viewModal.classList.remove('active'); }});
    [searchInput, startDate, endDate].forEach(el => el.addEventListener('input', () => {
  currentPage = 1;
  renderTable();
}));
document.getElementById('statusFilter').addEventListener('change', () => {
  currentPage = 1;
  renderTable();
});

document.getElementById('modelFilter').addEventListener('change', () => {
  currentPage = 1;
  renderTable();
});

document.getElementById('typeFilter').addEventListener('change', () => {
  currentPage = 1;
  renderTable();
});


document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  searchInput.value = '';
  startDate.value = '';
  endDate.value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('modelFilter').value = '';
  document.getElementById('typeFilter').value = '';
  currentPage = 1;
  renderTable();
});


    document.getElementById('statusFilter').addEventListener('change', renderTable);

document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  searchInput.value = '';
  startDate.value = '';
  endDate.value = '';
  document.getElementById('statusFilter').value = '';
  renderTable();
});

followBtn.addEventListener('click', () => {
  viewingToday = !viewingToday;
  followBtn.textContent = viewingToday ? 'Show All' : "Today's Follow‑ups";
  currentPage = 1; // ✅ Add this line
  renderTable();
});


    /* === CRUD helpers === */
async function loadLeads() {
    document.getElementById('tableLoader').style.display = 'block';
  if (isLocal) {
    console.log('🛑 Local mode: Skipping loadLeads() API call');
    leads = [
      {
        date: '26/06/2025',
        name: 'Test User',
        phone: '9999929999',
        email: 'test1@example.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },
      {
        date: '25/06/2025',
        name: 'Jane Doe',
        phone: '8888848888',
        email: 'jane@example.com',
        model: 'Model Y',
        type: 'Online',
        followup: '',
        status: 'postponed',
        notes: 'Follow-up later'
      },      {
        date: '26/06/2025',
        name: 'Test1 User',
        phone: '9999949999',
        email: 'test@example.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '01/07/2025',
        name: 'Test Use 3',
        phone: '9399949999',
        email: 'tes3t@example.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '02/07/2025',
        name: 'Test Use 4',
        phone: '9397949999',
        email: 'tes32t@example.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '07/07/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '02/07/2025',
        name: 'Test Use 5',
        phone: '9399049999',
        email: 'tes3t@exeample.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '04/07/2025',
        name: 'Test Use 6',
        phone: '9399949r99',
        email: 'teds3t@example.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '15/07/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '29/06/2025',
        name: 'Test Use 7',
        phone: '9399949991',
        email: 'tes3t@efxample.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '03/07/2025',
        name: 'Test Use 8',
        phone: '93999496999',
        email: 'tes3t@examfple.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '08/07/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '08/07/2025',
        name: 'Test User 9',
        phone: '9399955999',
        email: 'tes3t@exdample.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      },      {
        date: '06/07/2025',
        name: 'Test Use10',
        phone: '9399922999',
        email: 'tes3t@examplde.com',
        model: 'Model X',
        type: 'Walk-in',
        followup: '28/06/2025',
        status: 'new',
        notes: 'This is a mock entry for local testing'
      }
  ];
  renderTable();
    renderTable();
    return;
  }

  try {
    const res = await fetch(API_URL);
    let allData = await res.json() || [];
    leads = allData
  .filter(l => l.date && l.date.includes('/'))
  .map(l => ({
    ...l,
    followup_history: l.followup_history || '[]'
  }));

    renderTable();
  } catch (err) {
    console.error('Load error', err);
  }
}


async function saveLead(data){
  if (isLocal) {
    console.log('🛑 Local mode: saveLead() call skipped', data);
    return;
  }
  return fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ data })
  });
}

    async function updateLead(phone,data){
        if (isLocal) {
    console.log('🛑 Local mode: saveLead() call skipped', data);
    return;
  }
      return fetch(`${API_URL}/phone/${phone}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data})});
    }

    /* === Form submit === */
const submitBtn = enquiryForm.querySelector('button[type="submit"]');
const submitMsg = document.getElementById('submitMessage');

enquiryForm.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  submitMsg.style.display = 'none';

const now = new Date();
const date = now.toLocaleDateString('en-GB');
const time = now.toLocaleTimeString('en-GB'); // Add this

const newLead = {
  date: date,
  time: time, // Save time too
  name: document.getElementById('fullName').value.trim(),
  phone: document.getElementById('mobile').value.trim(),
  email: document.getElementById('email').value.trim(),
  model: document.getElementById('model').value,
  type: document.getElementById('enquiryType').value,
  followup: document.getElementById('followDate').value,
  status: document.getElementById('leadStatus').value || 'new',
  notes: document.getElementById('notes').value.trim(),
};

  try {
 if (document.getElementById('editMode').value === 'true') {
  const phone = newLead.phone;
  const lead = leads.find(l => l.phone === phone);
  if (!lead) return;

  const updatedFields = {};
  const changes = [];

  if (lead.name !== newLead.name) {
    changes.push({ field: 'Full Name', from: lead.name || '', to: newLead.name });
    updatedFields.name = newLead.name;
  }

  if (lead.phone !== newLead.phone) {
    changes.push({ field: 'Mobile Number', from: lead.phone || '', to: newLead.phone });
    updatedFields.phone = newLead.phone;
  }

  if (lead.email !== newLead.email) {
    changes.push({ field: 'Email', from: lead.email || '', to: newLead.email });
    updatedFields.email = newLead.email;
  }

  if (lead.model !== newLead.model) {
    changes.push({ field: 'Model', from: lead.model || '', to: newLead.model });
    updatedFields.model = newLead.model;
  }

  if (lead.type !== newLead.type) {
    changes.push({ field: 'Enquiry Type', from: lead.type || '', to: newLead.type });
    updatedFields.type = newLead.type;
  }

  if (lead.followup !== newLead.followup) {
    changes.push({ field: 'Follow-up Date', from: lead.followup || '', to: newLead.followup });
    updatedFields.followup = newLead.followup;
  }

  if (lead.notes !== newLead.notes) {
    changes.push({ field: 'Notes', from: lead.notes || '', to: newLead.notes });
    updatedFields.notes = newLead.notes;
  }

  if (changes.length === 0) {
    // No actual changes
    document.getElementById('enquiryModal').classList.remove('active');
    return;
  }

  // 📜 Build history log
  const now = new Date().toLocaleDateString('en-GB');
  const prevHistory = lead.followup_history ? JSON.parse(lead.followup_history) : [];

  changes.forEach(change => {
prevHistory.push({
  date: now,
  status: `${change.field} Changed`,
  note: `${change.field} changed from "${change.from}" to "${change.to}"`,
  by: getActionBy()
});

  });

  updatedFields.followup_history = JSON.stringify(prevHistory);

  await updateLead(phone, updatedFields);
  Object.assign(lead, updatedFields); // update local copy
}
else {
         // Add creation history
            const historyEntry = {
  date: new Date().toLocaleDateString('en-GB'),
  status: 'Created',
  note: `New enquiry created with name "${newLead.name}"`,
  by: getActionBy()
};
            newLead.followup_history = JSON.stringify([historyEntry]);

            await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: newLead })
            });

        }

    enquiryForm.reset();
    document.getElementById('enquiryModal').classList.remove('active');
    submitMsg.style.display = 'block';
    setTimeout(() => { submitMsg.style.display = 'none'; }, 4000);
    loadLeads(); 
    document.getElementById('editMode').value = 'false';
    document.getElementById('mobile').disabled = false;
  } catch (err) {
    alert('❌ Failed to save enquiry. Please try again.');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enquiry';
    document.getElementById('editMode').value = 'false';
    document.getElementById('mobile').disabled = false;
  }
});

    /* === Render table === */
function td(label,value){return `<td data-label="${label}">${value}</td>`;}
function renderTable() {
  const selectedStatus = document.getElementById('statusFilter').value;
  const selectedModel = document.getElementById('modelFilter').value;
  const selectedType = document.getElementById('typeFilter').value;

  const term = searchInput.value.toLowerCase();
  const s = startDate.value ? new Date(startDate.value.split('/').reverse().join('-')) : null;
  const e = endDate.value ? new Date(endDate.value.split('/').reverse().join('-')) : null;
  const todayStr = new Date().toLocaleDateString('en-GB');


  const filtered = leads.filter(l => {
    if (l.status === 'deleted') return false; 
    const [d, m, y] = l.date.split('/');
    const lDate = new Date(`${y}-${m}-${d}`); 
    if (viewingToday && l.followup !== todayStr) return false;
    const statusOk = !selectedStatus || l.status === selectedStatus;
    const dateOk = (!s || lDate >= s) && (!e || lDate <= e);
    const termOk = [l.name, l.phone, l.email || '', l.notes || ''].some(x =>
      x.toLowerCase().includes(term)
    );
    const modelOk = !selectedModel || l.model === selectedModel;
    const typeOk = !selectedType || l.type === selectedType;

    return dateOk && termOk && statusOk && modelOk && typeOk;

  });
    // ✅ Add this sorting block here
// ✅ Sort by followup date (newest first), skip invalid
filtered.sort((a, b) => {
  const dtA = new Date(`${a.date} ${a.time || '00:00:00'}`);
  const dtB = new Date(`${b.date} ${b.time || '00:00:00'}`);
  return dtB - dtA; // Newest first
});





  const paginated = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  leadBody.innerHTML = '';

  if (!paginated.length) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

paginated.forEach(lead => {
  const tr = document.createElement('tr');
  
    // ✅ DESKTOP ROW: show full table
    tr.innerHTML = `
      ${td('Date', `<input type="text" class="editable-date" data-type="date" data-ph="${lead.phone}" value="${lead.date}" readonly />`)}
      ${td('Name', lead.name)}
      ${td('Phone', lead.phone)}
      ${td('Email', lead.email || '-')}
      ${td('Model', lead.model)}
      ${td('Enquiry Type', lead.type)}
      ${td('Next Follow-up', `<input type="text" class="editable-date" data-type="followup" data-ph="${lead.phone}" value="${lead.followup || ''}" readonly />`)}
      ${td('Notes', (lead.notes && lead.notes.length > 10) 
  ? `${lead.notes.substring(0, 10)}... <a href="#" class="view-note" data-ph="${lead.phone}">View</a>`
  : (lead.notes || '-'))}
     ${td('Status', `<span class="status ${lead.status}">${lead.status}</span>`)}
${td('Actions', `
  <div class="action-cell">
    <select class="action-select" data-ph="${lead.phone}">
      <option value="">--Action--</option>
      <option value="edit">✏️ Edit</option>
      ${USER_TYPE === 'admin' ? '<option value="delete">🗑️ Delete</option>' : ''}
      ${USER_TYPE === 'admin' ? '<option value="history">📜 Log History</option>' : ''}
      <option value="closed">Closed</option>
      <option value="postponed">Postponed</option>
      <option value="purchased">Purchased elsewhere</option>
    </select>
    <input type="date" class="postpone-date" style="display:none; margin-top:5px;" />
  </div>
`)}

    `;
  
    // row.classList.add('table-row-animate');
  leadBody.appendChild(tr);
});

flatpickr('.editable-date', {
  dateFormat: 'd/m/Y',
  allowInput: true,
  disableMobile: true,
  onChange: async function(selectedDates, dateStr, instance) {
    const phone = instance.input.dataset.ph;
    const type = instance.input.dataset.type;
    const lead = leads.find(l => l.phone === phone);
    const prevValue = type === 'date' ? lead.date : lead.followup;
const label = type === 'date' ? 'Date' : 'Follow-up';

const noteText = `${label} changed from ${prevValue || 'N/A'} to ${dateStr}`;
    if (!lead || !dateStr) return;

    // Update the local field
    if (type === 'date') {
      lead.date = dateStr;
    } else {
      lead.followup = dateStr;
    }

    // 🟢 Append to history
const historyEntry = {
  date: new Date().toLocaleDateString('en-GB'),
  status: `${label} Updated`,
  note: noteText,
  by: getActionBy()
};

    const prev = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const updatedHistory = [...prev, historyEntry];
    lead.followup_history = JSON.stringify(updatedHistory);

    // ✅ Update in Sheet
    await updateLead(phone, {
      [type]: dateStr,
      followup_history: JSON.stringify(updatedHistory)
    });
  }
});



   renderPaginationControls(filtered.length);
   document.getElementById('tableLoader').style.display = 'none';

  
}



leadBody.addEventListener('change', async e => {
  const sel = e.target.closest('select.action-select');
if (sel) {
  const action = sel.value;
  const row = sel.closest('tr');
  const dateInput = row.querySelector('.postpone-date');
  const phone = sel.dataset.ph;
  const lead = leads.find(l => l.phone === phone);
  if (!lead) return;

  const now = new Date().toLocaleDateString('en-GB');

if (action === 'edit') {
  // Find the lead data
  document.getElementById('fullName').value = lead.name;
  document.getElementById('mobile').value = lead.phone;
  document.getElementById('email').value = lead.email || '';
  document.getElementById('model').value = lead.model;
  document.getElementById('enquiryType').value = lead.type;
  document.getElementById('followDate').value = lead.followup || '';
  document.getElementById('notes').value = lead.notes || '';
  document.getElementById('editMode').value = 'true';
  document.getElementById('leadStatus').value = lead.status || 'new';
  document.getElementById('mobile').disabled = true;

  document.getElementById('enquiryModal').classList.add('active');
  sel.value = "";
  return;
}

  if (action === 'delete') {
    dpendingDeletePhone = phone;
document.getElementById('confirmDelete').style.display = 'block';


    // 🟢 Log Delete action
    const entry = { date: now, status: 'delete', note: 'Delete initiated', by: getActionBy() };
    const prev = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const updated = [...prev, entry];
    lead.followup_history = JSON.stringify(updated);
    await updateLead(phone, { followup_history: JSON.stringify(updated) });

    sel.value = "";
    return;
  }

  if (action === 'view') {
    document.querySelector(`button.view-btn[data-ph="${phone}"]`)?.click();

    // 🟢 Log View action (optional)
    const entry = { date: now, status: 'view', note: 'Viewed lead details' };
    const prev = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const updated = [...prev, entry];
    lead.followup_history = JSON.stringify(updated);
    await updateLead(phone, { followup_history: JSON.stringify(updated) });

    sel.value = "";
    return;
  }

  if (action === 'postponed') {
    dateInput.style.display = 'inline-block';
    dateInput.value = '';
    dateInput.focus();
    return;
  }

  if (action === 'history') {
    const historyData = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const html = historyData.length
      ? historyData.map(h => `
          <div style="margin-bottom: 0.75rem; padding: 0.6rem; border-bottom: 1px solid #444;">
            <strong>Date:</strong> ${h.date} <br/>
            <strong>Action:</strong> ${h.status} <br/>
            <strong>Note:</strong> ${h.note} <br/>
            <strong>By:</strong> ${h.by || 'Unknown'}

          </div>
        `).join('')
      : '<p style="color: gray;">No history found.</p>';

    document.getElementById('historyContent').innerHTML = html;
    document.getElementById('historyModal').classList.add('active');
    sel.value = "";
    return;
  }

  // ✅ For other status updates like closed, purchased, etc.
  askNote(`Add note for ${action}`, async note => {
    const entry = { date: now, status: action, note: note, by: getActionBy() };
    const prev = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const updated = [...prev, entry];

    await updateLead(phone, {
      status: action,
      notes: note,
      followup_history: JSON.stringify(updated)
    });

    lead.status = action;
    lead.notes = note;
    lead.followup_history = JSON.stringify(updated);
    renderTable();
  });

  return;
}
const input = e.target.closest('input.postpone-date');
if (input) {
  const iso = input.value;
  if (!iso) return;

  const formatted = new Date(iso).toLocaleDateString('en-GB');
  const row = input.closest('tr');
  const phone = row.querySelector('select.action-select').dataset.ph;
  const lead = leads.find(l => l.phone === phone);
  if (!lead) return;

  const oldDate = lead.followup || 'N/A';

  askNote('Add note for Postponed', async note => {
    const now = new Date().toLocaleDateString('en-GB');

const historyEntry = {
  date: now,
  status: `Postponed - Follow-up changed from ${oldDate} to ${formatted}`,
  note: note,
  by: getActionBy()
};



    const prev = lead.followup_history ? JSON.parse(lead.followup_history) : [];
    const updated = [...prev, historyEntry];

    await updateLead(phone, {
      status: 'postponed',
      followup: formatted,
      notes: note,
      followup_history: JSON.stringify(updated)
    });

    // Update local
    lead.status = 'postponed';
    lead.followup = formatted;
    lead.notes = note;
    lead.followup_history = JSON.stringify(updated);

    renderTable();
  });
}


});
 window.renderTable = renderTable;
    /* === View button === */
    leadBody.addEventListener('click',e=>{
      const btn=e.target.closest('button.view-btn');
      if(!btn) return;
      const phone=btn.dataset.ph;
      const lead = leads.find(l=>l.phone===phone);
      if(!lead) return;

      viewBody.innerHTML=`
        <dt>Name</dt><dd>${lead.name}</dd>
        <dt>Phone</dt><dd>${lead.phone}</dd>
        <dt>Email</dt><dd>${lead.email||'N/A'}</dd>
        <dt>Vehicle Model</dt><dd>${lead.model}</dd>
        <dt>Enquiry Type</dt><dd>${lead.type}</dd>
        <dt>Next Follow‑up</dt><dd>${lead.followup||'N/A'}</dd>
        <dt>Status</dt><dd><span class="status ${lead.status}">${lead.status}</span></dd>
        <dt>Notes</dt><dd>${lead.notes||'None'}</dd>`;

      viewModal.classList.add('active');
    });

    // 📌 Handle '... View' link in Notes column
leadBody.addEventListener('click', e => {
  const link = e.target.closest('.view-note');
  if (!link) return;

  e.preventDefault();
  const phone = link.dataset.ph;
  const lead = leads.find(l => l.phone === phone);
  if (!lead || !lead.notes) return;

  viewBody.innerHTML = `
    <dt>Full Note</dt>
    <dd style="white-space: pre-wrap;">${lead.notes}</dd>
  `;
  viewModal.classList.add('active');
});


    /* === Edit button === */
leadBody.addEventListener('click', e => {
  const btn = e.target.closest('button.edit-btn');
  if (!btn) return;
  const phone = btn.dataset.ph;
  const lead = leads.find(l => l.phone === phone);
  if (!lead) return;

  // Fill the modal form fields with current lead data
  document.getElementById('fullName').value = lead.name;
  document.getElementById('mobile').value = lead.phone;
  document.getElementById('email').value = lead.email || '';
  document.getElementById('model').value = lead.model;
  document.getElementById('enquiryType').value = lead.type;
  document.getElementById('followDate').value = lead.followup || '';
  document.getElementById('notes').value = lead.notes || '';

  // Make phone number read-only
  document.getElementById('mobile').disabled = true;

  // Set edit mode flag
  document.getElementById('editMode').value = 'true';
  document.getElementById('leadStatus').value = lead.status || 'new';

  // Open the modal
  enquiryModal.classList.add('active');
});

// Handle status badge dropdown
leadBody.addEventListener('click', e => {
  const badge = e.target.closest('.current-status');
  const option = e.target.closest('.status-option');

  if (badge) {
    const options = badge.nextElementSibling;
    options.style.display = options.style.display === 'flex' ? 'none' : 'flex';
    return;
  }

  if (option) {
    const wrapper = option.closest('.status-wrapper');
    const phone = wrapper.dataset.ph;
    const lead = leads.find(l => l.phone === phone);
    if (!lead) return;

    const status = option.dataset.status;
    wrapper.querySelector('.status-options').style.display = 'none';

    if (status === 'postponed') {
      const input = wrapper.querySelector('.inline-postpone-picker');
      input.style.display = 'inline-block';
      flatpickr(input, {
        dateFormat: 'd/m/Y',
        defaultDate: lead.followup || null,
        onChange: (dates, dateStr) => {
          if (!dateStr) return;
          askNote('Add reason for postponement', async note => {
            const now = new Date().toLocaleDateString('en-GB');
const historyEntry = {
  date: now,
  status: 'postponed',
  note: `${note} (Follow-up: ${dateStr})`,
  by: getActionBy()
};

            const updated = [...(JSON.parse(lead.followup_history || '[]')), historyEntry];

            await updateLead(phone, {
              status: 'postponed',
              followup: dateStr,
              notes: note,
              followup_history: JSON.stringify(updated)
            });

            Object.assign(lead, {
              status: 'postponed',
              followup: dateStr,
              notes: note,
              followup_history: JSON.stringify(updated)
            });

            renderTable();
          });
        }
      });
      return;
    }

    // Other statuses
    askNote(`Add note for ${status}`, async note => {
      const now = new Date().toLocaleDateString('en-GB');
      const historyEntry = { date: now, status, note, by: getActionBy() };

      const updated = [...(JSON.parse(lead.followup_history || '[]')), historyEntry];

      await updateLead(phone, {
        status,
        notes: note,
        followup_history: JSON.stringify(updated)
      });

      Object.assign(lead, {
        status,
        notes: note,
        followup_history: JSON.stringify(updated)
      });

      renderTable();
    });
  }
});



leadBody.addEventListener('click', e => {
  const btn = e.target.closest('button.delete-btn');
  if (!btn) return;
  pendingDeletePhone = btn.dataset.ph;
  document.getElementById('confirmDelete').style.display = 'block';
});

async function confirmDeleteYes() {
  document.getElementById('confirmDelete').style.display = 'none';
  if (!pendingDeletePhone) return;

  await updateLead(pendingDeletePhone, { status: 'deleted' });  // Soft delete
  leads = leads.map(lead => {
    if (lead.phone === pendingDeletePhone) {
      return {...lead, status: 'deleted'};
    }
    return lead;
  });


  renderTable();

  // ✅ Show confirmation message
  const deleteMsg = document.getElementById('deleteMessage');
  deleteMsg.style.display = 'block';
  setTimeout(() => {
    deleteMsg.style.display = 'none';
  }, 3000); // Hide after 3 seconds

  pendingDeletePhone = null;
}

  function confirmDeleteNo() {
  document.getElementById('confirmDelete').style.display = 'none';
  pendingDeletePhone = null;
}

  document.getElementById('confirmYesBtn').addEventListener('click', confirmDeleteYes);
  document.getElementById('confirmNoBtn').addEventListener('click', confirmDeleteNo);



  }

  function toggleMobileFilters() {
  const panel = document.getElementById("mobileFilterPanel");
  panel.classList.toggle("show");
}

function selectLogin(type) {
  const loginChoice = document.getElementById('loginChoice');
  const staffLogin = document.getElementById('staffLogin');
  const otpInput = document.getElementById('otpInput');
  const otpGate = document.getElementById('otpGate');

  loginChoice.style.display = 'none';

  if (type === 'admin') {
    otpGate.style.display = 'flex';
    staffLogin.style.display = 'none';
    otpInput.value = '';
  } else if (type === 'staff') {
    otpGate.style.display = 'flex';
    staffLogin.style.display = 'flex';
    otpInput.parentElement.style.display = 'none'; // 👈 Hide Admin OTP box
    document.getElementById('otpBtn').style.display = 'none'; // 👈 Hide Verify button
    document.getElementById('otpErr').style.display = 'none';
  }
}



window.selectLogin = selectLogin;

document.getElementById('adminOtpSection').style.display = 'none';

function createManageStaffButton() {
  const existing = document.getElementById('manageStaffBtn');
  if (existing) return;

  const btn = document.createElement('button');
  btn.className = 'btn-outline';
  btn.id = 'manageStaffBtn';
  btn.textContent = 'Manage Staffs';
btn.onclick = () => {
  showStaffSection(); // ✅ shows list and loads staff
  document.getElementById('staffManager').classList.add('active');
};

  const container = document.querySelector('.header-buttons');
  if (container) container.insertBefore(btn, container.firstChild);
}

window.createManageStaffButton = createManageStaffButton;

async function showStaffManager() {
  const res = await fetch('https://sheetdb.io/api/v1/adq20iuv1a4x7');
  const staffList = await res.json();

  const html = staffList.map(user => {
    const name = user["Full Name"]?.trim() || '(No Name)';
    const email = user.Email?.trim() || '(No Email)';
    const status = user.Status === 'Active';

    return `
      <div style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; background: #111; padding: 0.5rem 1rem; border-radius: 6px;">
        <div>
          <strong>${name}</strong><br />
          <small>${email}</small>
        </div>
        <div class="toggle-container">
          <label class="switch">
            <input type="checkbox" onchange="toggleStaffStatus('${email}', this.checked)" ${status ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span style="margin-left: 0.5rem; color: #fff;">${status ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('staffList').innerHTML = html;
  document.getElementById('staffManager').classList.add('active');
}

async function toggleStaffStatus(email, isActive) {
  const newStatus = isActive ? 'Active' : 'Inactive';

  try {
    const res = await fetch(`https://sheetdb.io/api/v1/adq20iuv1a4x7/Email/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { Status: newStatus }
      })
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Failed to update status:', errorData);
      alert('Failed to update status. Check SheetDB API or column name.');
    } else {
      showStaffManager();
    }
  } catch (err) {
    console.error('Error updating status:', err);
    alert('Error updating status. Check console for details.');
  }
}



async function createStaff(e) {
  e.preventDefault();

  const data = {
    "Full Name": document.getElementById('newStaffName').value,
    "Phone": document.getElementById('newStaffPhone').value,
    "Email": document.getElementById('newStaffEmail').value,
    "Password": document.getElementById('newStaffPass').value,
    "Status": "Active"
  };

  try {
    const res = await fetch('https://sheetdb.io/api/v1/adq20iuv1a4x7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    if (!res.ok) {
      const errData = await res.text();
      console.error('Error creating staff:', errData);
      alert('Failed to create staff. Please try again.');
    } else {
      alert('✅ Staff created successfully');
      document.getElementById('newStaffName').value = '';
      document.getElementById('newStaffPhone').value = '';
      document.getElementById('newStaffEmail').value = '';
      document.getElementById('newStaffPass').value = '';
      showStaffSection();
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong while creating staff.');
  }
}


function toggleStaffCreate() {
  const section = document.getElementById('staffCreateSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function showStaffSection() {
  document.getElementById('staffListSection').style.display = 'block';
  document.getElementById('staffCreateSection').style.display = 'none';
  showStaffManager(); // reload staff list
}

function showCreateSection() {
  document.getElementById('staffListSection').style.display = 'none';
  document.getElementById('staffCreateSection').style.display = 'block';
}





async function verifyStaff() {
  const mobile = document.getElementById('staffMobile').value.trim();
  const password = document.getElementById('staffPassword').value.trim();
  const errBox = document.getElementById('staffLoginErr');

  if (!mobile || !password) {
    errBox.textContent = 'Please enter both mobile and password';
    errBox.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('https://sheetdb.io/api/v1/adq20iuv1a4x7'); // replace this
    const staffList = await res.json();

    const staff = staffList.find(
  s => s.Phone === mobile && s.Password === password && s.Status === 'Active'
);

    if (staff) {
      sessionStorage.setItem('verified', 'yes');
      sessionStorage.setItem('user_type', 'staff');
      sessionStorage.setItem('staff_name', staff["Full Name"]);
      USER_TYPE = 'staff';
      showApp();
    } else {
      errBox.textContent = 'Invalid credentials or inactive staff';
      errBox.style.display = 'block';
    }
  } catch (err) {
    console.error('Login error', err);
    errBox.textContent = 'Something went wrong. Try again.';
    errBox.style.display = 'block';
  }
}

function closeStaffManager() {
  document.getElementById('staffManager').classList.remove('active');
}





